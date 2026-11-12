import Foundation
import Security

enum SessionVault {
    static func query(_ server: String) -> [String: Any] {
        [kSecClass as String: kSecClassGenericPassword,
         kSecAttrService as String: "com.riyadhpolohills.session",
         kSecAttrAccount as String: server]
    }
    static func load(server: String) -> String? {
        var request = query(server)
        request[kSecReturnData as String] = true
        request[kSecMatchLimit as String] = kSecMatchLimitOne
        var result: CFTypeRef?
        guard SecItemCopyMatching(request as CFDictionary, &result) == errSecSuccess,
              let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }
    static func save(_ value: String, server: String) throws {
        let data = Data(value.utf8)
        let status = SecItemUpdate(query(server) as CFDictionary, [kSecValueData as String: data] as CFDictionary)
        if status == errSecItemNotFound {
            var request = query(server)
            request[kSecValueData as String] = data
            request[kSecAttrAccessible as String] = kSecAttrAccessibleWhenUnlockedThisDeviceOnly
            let added = SecItemAdd(request as CFDictionary, nil)
            guard added == errSecSuccess else { throw VaultError.failed }
        } else if status != errSecSuccess { throw VaultError.failed }
    }
    static func clear(server: String) { SecItemDelete(query(server) as CFDictionary) }
    enum VaultError: LocalizedError {
        case failed
        var errorDescription: String? { "Unable to save the secure session. / تعذر حفظ جلسة الدخول بأمان." }
    }
}
