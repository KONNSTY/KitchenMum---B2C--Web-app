import Link from "next/link";
import type { LegalSection } from "@/lib/legal/content-types";

export function LegalSections({
  sections,
}: Readonly<{ sections: LegalSection[] }>) {
  return (
    <>
      {sections.map((section, index) => (
        <section className="legal-section" key={`${section.heading}-${index}`}>
          <h2>{section.heading}</h2>
          {section.blocks.map((block, blockIndex) => {
            const key = `${section.heading}-${blockIndex}`;
            if (block.type === "paragraph") return <p key={key}>{block.text}</p>;
            if (block.type === "list") {
              return (
                <ul key={key}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            if (block.type === "notice") {
              return (
                <aside
                  className={`legal-inline-note ${block.tone ?? "warm"}`}
                  key={key}
                >
                  {block.title && <strong>{block.title}</strong>}
                  <p>{block.text}</p>
                </aside>
              );
            }
            return (
              <p key={key}>
                {block.text ? `${block.text} ` : ""}
                {block.href.startsWith("/") ? (
                  <Link href={block.href}>{block.label}</Link>
                ) : (
                  <a href={block.href} target="_blank" rel="noreferrer">
                    {block.label}
                  </a>
                )}
              </p>
            );
          })}
        </section>
      ))}
    </>
  );
}
