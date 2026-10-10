import { Sheet } from "@/components/section";
import { resume } from "@/lib/resume-data";

/**
 * Certifications, degrees, and the one commendation on record. No badge
 * artwork is invented here — each credential is stated as issued, with the
 * issuer named beside it.
 */
export function Credentials() {
  return (
    <Sheet
      id="credentials"
      title="Credentials"
      intro="Certifications held, degrees earned, and one letter on file."
    >
      <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 className="font-annot text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            Certifications
          </h3>
          <ol className="mt-5 border-t border-rule">
            {resume.certifications.map((cert) => (
              <li
                key={cert.name}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-rule py-4"
              >
                <p className="max-w-[46ch] text-[15px] font-medium leading-snug">{cert.name}</p>
                <p className="font-annot text-[11px] uppercase tracking-widest text-ink-3">
                  {cert.issuer}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5">
          <h3 className="font-annot text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            Education
          </h3>
          <ol className="mt-5 border-t border-rule">
            {resume.education.map((entry) => (
              <li key={entry.degree} className="border-b border-rule py-4">
                <p className="text-[15px] font-medium leading-snug">{entry.degree}</p>
                <p className="mt-1.5 text-[15px] leading-snug text-ink-2">{entry.institution}</p>
                <p className="mt-2 flex gap-4 font-annot text-[11px] text-ink-3">
                  <span>{entry.years}</span>
                  <span>{entry.score}</span>
                </p>
              </li>
            ))}
          </ol>

          {resume.achievements.map((achievement) => (
            <div key={achievement.title} className="mt-10 border-t-2 border-signal pt-4">
              <h3 className="font-annot text-[11px] font-semibold uppercase tracking-[0.16em] text-signal">
                {achievement.title}
              </h3>
              <p className="mt-2.5 max-w-[44ch] text-[15px] leading-relaxed text-ink-2">
                {achievement.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
