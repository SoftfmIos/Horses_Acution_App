import React from "react";
import { ProfilePhoto } from "./ProfilePhoto";
export function InstructorBadge({
  session,
  instructors = [],
  request,
  ar = false,
}) {
  const profile = instructors.find((i) =>
    [i.name, i.nameEn, i.nameAr]
      .filter(Boolean)
      .some((name) =>
        [
          session.instructor,
          session.instructorEn,
          session.instructorAr,
        ].includes(name),
      ),
  );
  const id = session.instructorId || profile?.id;
  return (
    <div className="instructor-badge">
      {id && (
        <ProfilePhoto
          compact
          kind="instructors"
          id={id}
          name={session.instructor}
          request={request}
          ar={ar}
        />
      )}
      <span>{session.instructor}</span>
    </div>
  );
}
