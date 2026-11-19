import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Camera,
  ChefHat,
  Check,
  Clock3,
  Heart,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <ChefHat size={21} />
          </span>
          <span>KitchenMum</span>
        </Link>
        <div className="landing-links">
          <a href="#so-gehts">So funktioniert’s</a>
          <a href="#lieblingsrezepte">Deine Rezeptsammlung</a>
        </div>
        <div className="landing-actions">
          <Link href="/login" className="btn-quiet">
            Anmelden
          </Link>
          <Link href="/signup" className="btn-primary">
            Kostenlos starten <ArrowRight size={16} />
          </Link>
        </div>
      </nav>
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="eyebrow">
            <Sparkles size={14} /> Deine Rezepte. Endlich wiederfinden.
          </span>
          <h1>
            Vom Insta-Scroll direkt in deine <em>Küche.</em>
          </h1>
          <p>
            Speichere Rezepte aus Reels und Screenshots an einem schönen Ort.
            KitchenMum sortiert sie für dich und macht aus Inspiration deinen
            nächsten Lieblingsmoment.
          </p>
          <div className="landing-cta">
            <Link href="/app" className="btn-primary">
              Demo ausprobieren <ArrowRight size={17} />
            </Link>
            <Link href="/signup" className="btn-secondary">
              Kostenloses Konto
            </Link>
          </div>
          <div className="landing-proof">
            <span>
              <Check size={15} /> Schnell gespeichert
            </span>
            <span>
              <Check size={15} /> Immer übersichtlich
            </span>
            <span>
              <Check size={15} /> Deine Sammlung
            </span>
          </div>
        </div>
        <div className="landing-image">
          <Image
            src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1400&q=90"
            alt="Frisch gebackenes Brot und Zutaten auf einer warmen Küchenarbeitsfläche"
            fill
            priority
            sizes="(max-width:800px) 100vw, 55vw"
          />
        </div>
        <div className="floating-note">
          <span className="floating-note-icon">
            <Camera size={18} />
          </span>
          <span>
            <strong>Rezept erkannt</strong>
            <small>Schoko-Kirsch-Kuchen · 4 Zutaten</small>
          </span>
          <Check size={18} color="#738b68" />
        </div>
      </section>
      <section className="landing-benefits" id="so-gehts">
        <div>
          <span className="eyebrow">Einfach anfangen</span>
          <h2>
            Dein Rezeptbuch wächst
            <br />
            mit jedem Screenshot.
          </h2>
        </div>
        <div className="benefit-grid">
          <article>
            <span className="benefit-icon">
              <Camera />
            </span>
            <h3>Einfach festhalten</h3>
            <p>
              Text kopieren oder einen Screenshot auswählen – deine
              Kücheninspiration geht nicht mehr verloren.
            </p>
          </article>
          <article>
            <span className="benefit-icon">
              <Bookmark />
            </span>
            <h3>Alles sortiert</h3>
            <p>
              Brot, Kuchen, Onepot, vom Blech und Sonstiges. Finden statt endlos
              scrollen.
            </p>
          </article>
          <article>
            <span className="benefit-icon">
              <Heart />
            </span>
            <h3>Mach es zu deinem</h3>
            <p>
              Ergänze Zutaten, ändere Schritte und bewahre deine persönliche
              Lieblingsversion auf.
            </p>
          </article>
        </div>
      </section>
      <section className="landing-preview" id="lieblingsrezepte">
        <div className="preview-copy">
          <span className="eyebrow">Dein digitaler Rezeptordner</span>
          <h2>
            Mehr Zeit zum Kochen.
            <br />
            Weniger Zeit zum Suchen.
          </h2>
          <p>
            Eine ruhige, übersichtliche Sammlung mit Fotos, Zubereitung,
            Backzeit und Temperatur – damit du beim Kochen den Kopf frei hast.
          </p>
          <div className="preview-points">
            <span>
              <Clock3 size={17} /> Zeiten und Temperaturen sofort im Blick
            </span>
            <span>
              <Heart size={17} /> Lieblingsrezepte immer griffbereit
            </span>
            <span>
              <Sparkles size={17} /> KI hilft beim Erfassen
            </span>
          </div>
          <Link href="/app" className="btn-primary">
            KitchenMum ansehen <ArrowRight size={16} />
          </Link>
        </div>
        <div className="preview-window">
          <div className="preview-window-top">
            <span></span>
            <span></span>
            <span></span>
            <small>Meine Küche / Übersicht</small>
          </div>
          <div className="preview-content">
            <small>DEINE KÜCHE</small>
            <h3>Was kochen wir heute?</h3>
            <div className="preview-cards">
              <div>
                <Image
                  src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&q=80"
                  alt="Sauerteigbrot"
                  fill
                  sizes="30vw"
                />
                <strong>Sauerteigbrot</strong>
              </div>
              <div>
                <Image
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"
                  alt="Schokoladenkuchen"
                  fill
                  sizes="30vw"
                />
                <strong>Schoko-Kirsch-Kuchen</strong>
              </div>
            </div>
            <div className="preview-chips">
              <span>Brot</span>
              <span>Kuchen</span>
              <span>Onepot</span>
              <span>Vom Blech</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
