import Link from "next/link";

const stats = [
  { label: "À toi de jouer", value: "2", sub: "projets attendent une action", tone: "bg-colerr" },
  { label: "En attente client", value: "1", sub: "depuis 3 jours", tone: "bg-main text-white" },
  { label: "Échéances cette semaine", value: "1", sub: "mise en ligne le 14/10", tone: "" },
  { label: "Déclaration URSSAF", value: "31/10", sub: "dans 21 jours", tone: "" },
];

const tasks = [
  {
    status: "late",
    statusLabel: "En retard",
    title: "Site vitrine - Cabinet Roux",
    detail: "Maquette de l'accueil · prévue le 08/10",
    cta: "Ajouter une avancée",
    href: "/projets/1/avancee",
  },
  {
    status: "you",
    statusLabel: "À toi",
    title: "Refonte - Gîtes du Lac",
    detail: "Intégrer les photos reçues hier",
    cta: "Ouvrir",
    href: "/projets/2",
  },
  {
    status: "client",
    statusLabel: "En attente client",
    title: "Site vitrine - Boulangerie Lafont",
    detail: "Textes « À propos » demandés le 07/10",
    cta: "Relancer",
  },
];

const week = [
  { day: "MAR 14", title: "Mise en ligne", client: "Gîtes du Lac" },
  { day: "VEN 17", title: "Point client", client: "Cabinet Roux" },
];

const todos = [
  { label: "Relancer Boulangerie Lafont", done: false },
  { label: "Exporter les photos - Gîtes du Lac", done: false },
  { label: "Envoyer le devis - Atelier Peinture", done: true },
];

export default function HomePage() {
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="eyebrow">Samedi 10 octobre</span>
          <h1 className="page-title">Bonjour Gaël.</h1>
        </div>
        <div className="flex flex-wrap gap-3.5">
          <Link href="/projets" className="btn">
            Nouveau projet
          </Link>
          <Link href="/projets/1/avancee" className="btn btn-primary">
            + Nouvelle avancée
          </Link>
        </div>
      </header>

      <section aria-label="Résumé" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`card-sm flex flex-col gap-1.5 ${s.tone}`}>
            <span className="text-sm font-bold">{s.label}</span>
            <span className="stat">{s.value}</span>
            <span className="text-sm">{s.sub}</span>
          </div>
        ))}
      </section>

      <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside">
        <section aria-labelledby="h-atraiter" className="card flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="h-atraiter" className="section-title">À traiter</h2>
            <Link href="/projets" className="link text-body-sm">
              Tous les projets
            </Link>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {tasks.map((t) => (
              <li key={t.title} className="item flex flex-wrap items-center gap-x-4 gap-y-3">
                <span className={`pill pill-${t.status}`}>{t.statusLabel}</span>
                <div className="flex min-w-0 flex-fill flex-col gap-0.5">
                  <Link href="/projets/1" className="text-lg font-bold text-ink no-underline">
                    {t.title}
                  </Link>
                  <span className="muted text-sm">{t.detail}</span>
                </div>
                {t.href ? (
                  <Link href={t.href} className={`btn btn-sm shadow-none ${t.status === "late" ? "btn-primary" : ""}`}>
                    {t.cta}
                  </Link>
                ) : (
                  <button type="button" className="btn btn-sm shadow-none">
                    {t.cta}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-7 xl:grid-cols-1">
          <section aria-labelledby="h-semaine" className="card flex flex-col gap-3.5">
            <h2 id="h-semaine" className="card-title">Cette semaine</h2>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {week.map((w) => (
                <li key={w.day} className="flex items-center gap-3.5">
                  <span className="date-chip">{w.day}</span>
                  <span className="text-body-sm">
                    <strong>{w.title}</strong> · {w.client}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="h-todo" className="card flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="h-todo" className="card-title">Todo du jour</h2>
              <Link href="/todo" className="link text-body-sm">
                Tout voir
              </Link>
            </div>
            {todos.map((todo) => (
              <label key={todo.label} className="flex min-h-10 cursor-pointer items-center gap-3 text-body-sm has-checked:text-muted has-checked:line-through">
                <input type="checkbox" defaultChecked={todo.done} className="check" />
                {todo.label}
              </label>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
