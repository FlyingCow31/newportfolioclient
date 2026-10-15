import Link from "next/link";

const steps = [
  { label: "1. Démarrage", meta: "Terminé · 01/10", seg: "seg-done" },
  { label: "2. Développement", meta: "En attente client", seg: "seg-client" },
  { label: "3. SEO", meta: "À venir", seg: "seg-todo" },
  { label: "4. Mise en ligne", meta: "30/10", seg: "seg-todo" },
];

const journal = [
  {
    date: "07/10/2026",
    status: { label: "En attente client", className: "pill-client" },
    visible: true,
    title: "Textes « À propos » demandés",
    text: "3 à 5 lignes sur l'histoire de la boulangerie et 2 photos de l'équipe.",
  },
  {
    date: "05/10/2026",
    status: null,
    visible: false,
    title: "Pages Accueil et Services intégrées",
    text: "Reste le formulaire de contact à brancher.",
  },
  {
    date: "01/10/2026",
    status: { label: "Terminé", className: "pill-ink" },
    visible: true,
    title: "Début de la commande",
    text: "",
  },
];

const tech = [
  { label: "Hébergement", value: "Vercel" },
  { label: "Domaine", value: "OVH · boulangerie-lafont.fr" },
  { label: "Dépôt", value: "GitHub", href: "#" },
  { label: "Accès et clés", value: "Gestionnaire de mots de passe", href: "#" },
];

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
}

export default async function ProjetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <header className="flex flex-col gap-3.5">
        <Link href="/projets" className="link self-start text-body-sm no-underline">
          ← Projets
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="page-title">Site vitrine</h1>
              <span className="pill pill-client">En attente client</span>
            </div>
            <Link href="/clients" className="text-lg font-medium text-ink">
              Boulangerie Lafont · Marie Lafont
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/client" className="btn">
              Voir comme le client
            </Link>
            <a href="#temps" className="btn">
              Saisir du temps
            </a>
            <Link href={`/projets/${id}/avancee`} className="btn btn-primary">
              + Nouvelle avancée
            </Link>
          </div>
        </div>
      </header>

      <section aria-label="Étapes" className="card">
        <ol className="m-0 grid list-none grid-cols-2 gap-x-2.5 gap-y-5 p-0 sm:grid-cols-4">
          {steps.map((s) => (
            <li key={s.label} className="flex flex-col gap-2">
              <div className={`seg ${s.seg}`} />
              <strong className="text-body-sm">{s.label}</strong>
              <span className="muted text-caption">{s.meta}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside">
        <section aria-labelledby="h-journal" className="card flex flex-col gap-4">
          <h2 id="h-journal" className="section-title">Journal des avancées</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {journal.map((entry) => (
              <li key={entry.title} className="item flex flex-col gap-2 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {entry.status && <span className={`pill ${entry.status.className}`}>{entry.status.label}</span>}
                  <span className={`pill ${entry.visible ? "pill-done" : ""}`}>{entry.visible ? "Visible client" : "Interne"}</span>
                  <span className="muted ml-auto text-caption">{entry.date}</span>
                </div>
                <strong>{entry.title}</strong>
                {entry.text && <p className="m-0 text-body-sm">{entry.text}</p>}
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
          <section aria-labelledby="h-delai" className="card flex flex-col gap-1.5">
            <h2 id="h-delai" className="card-title mb-1.5">Délais</h2>
            <span className="muted text-sm">Mise en ligne prévue</span>
            <span className="stat">30/10/2026</span>
            <span className="text-body-sm font-bold">dans 20 jours</span>
          </section>

          <section id="temps" aria-labelledby="h-renta" className="card flex flex-col gap-3.5">
            <h2 id="h-renta" className="card-title">Rentabilité</h2>
            <div className="flex flex-col gap-0.5">
              <span className="muted text-sm">Taux horaire réel</span>
              <span className="stat">42 €/h</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div role="img" aria-label="18 heures payées, 6 heures non payées" className="flex h-4.5 border-3 border-ink">
                <div className="w-3/4 bg-ink" />
                <div className="flex-1 bg-colerr" />
              </div>
              <div className="flex justify-between text-sm">
                <span>
                  <strong>18 h</strong> payées
                </span>
                <span>
                  <strong>6 h</strong> non payées
                </span>
              </div>
            </div>
            <div className="flex justify-between border-t-2 border-ink pt-3 text-body-sm">
              <span>Prix du projet</span>
              <strong>1 200 €</strong>
            </div>
          </section>

          <section aria-labelledby="h-tech" className="card flex flex-col gap-2.5 md:col-span-2 xl:col-span-1">
            <h2 id="h-tech" className="card-title mb-1">Infos techniques</h2>
            {tech.map((t) => (
              <div key={t.label} className="flex justify-between gap-3 text-body-sm">
                <span className="muted">{t.label}</span>
                {t.href ? (
                  <a href={t.href} className="link text-right">
                    {t.value}
                  </a>
                ) : (
                  <strong className="text-right">{t.value}</strong>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
