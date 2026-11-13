import Foundation

enum RequestCancellation {
    static func matches(_ error: Error) -> Bool {
        if error is CancellationError { return true }
        let networkError = error as NSError
        return networkError.domain == NSURLErrorDomain && networkError.code == NSURLErrorCancelled
    }
}

enum APIError: LocalizedError {
    case unauthorized, message(String), invalidResponse
    var errorDescription: String? {
        switch self {
        case .unauthorized: return "Please sign in again. / يرجى تسجيل الدخول مجدداً."
        case .message(let value): return value
        case .invalidResponse: return "The server returned an unexpected response. / استجابة غير متوقعة من الخادم."
        }
    }
}
@MainActor final class APIClient: NSObject, URLSessionTaskDelegate {
    let configuration: AppConfiguration
    private let sessionConfiguration: URLSessionConfiguration
    private var token: String?
    private(set) var sessionRevision = UUID()
    private lazy var session: URLSession = {
        let config = sessionConfiguration
        config.httpCookieStorage = nil
        config.httpShouldSetCookies = false
        config.urlCache = nil
        config.timeoutIntervalForRequest = 30
        return URLSession(configuration: config, delegate: self, delegateQueue: nil)
    }()
    init(configuration: AppConfiguration = .current, sessionConfiguration: URLSessionConfiguration = .ephemeral) {
        self.configuration = configuration
        self.sessionConfiguration = sessionConfiguration
        self.token = SessionVault.load(server: configuration.apiOrigin.absoluteString)
        super.init()
    }
    var hasSession: Bool { token != nil }
    func clearSession() {
        sessionRevision = UUID()
        token = nil
        SessionVault.clear(server: configuration.apiOrigin.absoluteString)
    }
    func endSession() -> Task<Void, Never> {
        // Revoke only the old token; its response must never affect a subsequent login.
        let revoker = APIClient(configuration: configuration, sessionConfiguration: sessionConfiguration)
        revoker.token = token
        let hadSession = hasSession
        clearSession()
        return Task { @MainActor in
            guard hadSession else { return }
            defer { revoker.session.finishTasksAndInvalidate() }
            let _: APIResult? = try? await revoker.send("auth/logout", method: "POST")
        }
    }
    nonisolated func urlSession(_ session: URLSession, task: URLSessionTask,
        willPerformHTTPRedirection response: HTTPURLResponse, newRequest request: URLRequest,
        completionHandler: @escaping (URLRequest?) -> Void) { completionHandler(nil) }

    func send<T: Decodable>(_ path: String, method: String = "GET", body: [String: Any]? = nil, stableID: String? = nil) async throws -> T {
        let url = configuration.apiOrigin.appendingPathComponent("api").appendingPathComponent(path)
        guard url.scheme == "https" else { throw APIError.message("Use a secure HTTPS API address.") }
        var request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("RiyadhAcademy", forHTTPHeaderField: "X-Requested-With")
        request.setValue(configuration.websiteOrigin.absoluteString, forHTTPHeaderField: "Origin")
        if path != "auth/login", let token { request.setValue("rp_session=\(token)", forHTTPHeaderField: "Cookie") }
        if let stableID { request.setValue(stableID, forHTTPHeaderField: "X-Stable-Id") }
        if let body { request.httpBody = try JSONSerialization.data(withJSONObject: body) }
        let revision = sessionRevision
        let (data, response) = try await session.data(for: request)
        guard revision == sessionRevision else { throw CancellationError() }
        guard let response = response as? HTTPURLResponse else { throw APIError.invalidResponse }
        if response.statusCode == 401 { throw APIError.unauthorized }
        guard (200..<300).contains(response.statusCode) else {
            let error = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any]
            throw APIError.message(error?["error"] as? String ?? "Request failed (\(response.statusCode)). / تعذر إكمال الطلب.")
        }
        let decoded = try JSONDecoder().decode(T.self, from: data)
        if path == "auth/login" {
            let headers = response.allHeaderFields.reduce(into: [String: String]()) { result, pair in
                if let key = pair.key as? String, let value = pair.value as? String { result[key] = value }
            }
            guard let cookie = HTTPCookie.cookies(withResponseHeaderFields: headers, for: url).first(where: { $0.name == "rp_session" }) else { throw APIError.invalidResponse }
            try SessionVault.save(cookie.value, server: configuration.apiOrigin.absoluteString)
            token = cookie.value
            sessionRevision = UUID()
        }
        return decoded
    }
}
