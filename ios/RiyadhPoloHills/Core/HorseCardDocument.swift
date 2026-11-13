import UIKit

@MainActor enum HorseCardDocument {
    static func create(profile: HorseProfileData, arabic: Bool) throws -> URL {
        let l: (String, String) -> String = { arabic ? $1 : $0 }
        let horse = profile.horse
        var lines = [horse.display(arabic), l("Horse card & history", "بطاقة الخيل والسجل"),
            l("Owner: ", "المالك: ") + (profile.ownerName ?? "—"),
            l("Breed: ", "السلالة: ") + (horse.breed ?? "—"),
            l("Microchip: ", "الشريحة: ") + (horse.microchip ?? "—"),
            l("Date of birth: ", "تاريخ الميلاد: ") + AcademyDates.dayDisplay(horse.birthDate, arabic: arabic)]
        if let instructor = profile.instructor { lines.append(l("Instructor: ", "المدرب: ") + instructor.display(arabic)) }
        if let notes = horse.notes?.nonempty { lines.append(notes) }
        lines.append(l("Medical & care", "الطب والرعاية"))
        for record in profile.medical { lines.append([record.display(arabic), record.medication ?? "", record.dose ?? "", record.frequency ?? "", record.notes ?? ""].filter { !$0.isEmpty }.joined(separator: " · ")) }
        lines.append(l("Feeding", "التغذية"))
        for feed in profile.feeding { lines.append(feed.feed + " · " + feed.quantity + " · " + feed.time + " · " + (feed.notes ?? "")) }
        lines.append(l("Boarding", "الإيواء"))
        for stay in profile.boarding { lines.append((stay.stall ?? "") + " · " + stay.startDate + " — " + stay.endDate + " · " + stay.status) }
        lines.append(l("Documents", "الوثائق"))
        for document in profile.documents { lines.append(document.title + " · " + document.filename) }
        var previousMonth = ""
        for event in profile.events.sorted(by: { $0.date > $1.date }) {
            let month = AcademyDates.month(event.date)
            if month != previousMonth { lines.append(AcademyDates.monthTitle(month, arabic: arabic)); previousMonth = month }
            lines.append(AcademyDates.display(event.date, arabic: arabic) + " · " + event.title + " · " + (event.details ?? ""))
        }
        return try AcademyTextDocument.create(title: l("Horse card & history", "بطاقة الخيل والسجل"), lines: lines, arabic: arabic)
    }
}
