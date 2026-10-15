const company = [
  { label: "Nom", value: "Gaël Tournier · EI", strong: true },
  { label: "SIRET", value: "123 456 789 00012", copy: true },
  { label: "Création", value: "01/01/2025" },
  { label: "Code NAF", value: "6201Z · Programmation informatique" },
  { label: "Régime", value: "Micro-entreprise" },
  { label: "Adresse", value: "Colomiers" },
];

const deadlines = [
  { day: "31", month: "OCT", title: "Déclaration URSSAF", sub: "Mensuelle · dans 21 jours", next: true },
  { day: "30", month: "NOV", title: "Déclaration URSSAF", sub: "Mensuelle", next: false },
  { day: "15", month: "DÉC", title: "CFE", sub: "Paiement annuel", next: false },
];

const proofs = [
  { title: "Attestation de vigilance URSSAF", status: "Expire le 31/10", className: "pill-late" },
  { title: "Avis de situation SIRENE", status: "À jour", className: "pill-done" },
  { title: "Assurance RC Pro", status: "Jusqu'au 31/12", className: "pill-done" },
];

const clauses = [
  { title: "Propriété intellectuelle", excerpt: "Le transfert des droits intervient au paiement intégral…" },
  { title: "Pénalités de retard", excerpt: "Tout retard de paiement entraîne des pénalités…" },
  { title: "Mention TVA non applicable", excerpt: "TVA non applicable, art. 293 B du CGI" },
];

export default function AdministrationPage() {
  return (
    <>
      <h1 className="page-title">Administration.</h1>

      <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside">
        <section aria-labelledby="h-ent" className="card flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 id="h-ent" className="section-title">Mon entreprise</h2>
            <button type="button" className="link text-body-sm">
              Modifier
            </button>
          </div>
          <dl className="m-0 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
            {company.map((c) => (
              <div key={c.label} className="flex flex-col gap-1">
                <dt className="eyebrow muted">{c.label}</dt>
                <dd className={`m-0 flex items-center gap-2 ${c.strong ? "font-bold" : ""}`}>
                  {c.value}
                  {c.copy && (
                    <button type="button" aria-label={`Copier le ${c.label}`} className="btn btn-sm size-8 min-h-0 p-0 shadow-none">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                        <rect x="8" y="8" width="13" height="13" />
                        <path d="M4 16V4h12" />
                      </svg>
                    </button>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="h-cal" className="card flex flex-col gap-3.5">
          <h2 id="h-cal" className="section-title">Échéances</h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {deadlines.map((d) => (
              <li key={`${d.day}-${d.month}`} className={`item flex items-center gap-3.5 ${d.next ? "bg-main text-white" : ""}`}>
                <span className="w-14 flex-none text-center font-display text-body-sm leading-tight">
                  {d.day}
                  <br />
                  {d.month}
                </span>
                <div className="flex flex-col">
                  <strong className="text-body-sm">{d.title}</strong>
                  <span className={`text-caption ${d.next ? "" : "muted"}`}>{d.sub}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid items-start gap-6 lg:gap-7 xl:grid-aside-main">
        <section aria-labelledby="h-docs" className="card flex flex-col gap-3">
          <h2 id="h-docs" className="section-title">Justificatifs</h2>
          {proofs.map((p) => (
            <div key={p.title} className="item flex flex-wrap items-center gap-2.5">
              <strong className="flex-1 text-body-sm">{p.title}</strong>
              <span className={`pill ${p.className}`}>{p.status}</span>
            </div>
          ))}
        </section>

        <section aria-labelledby="h-clauses" className="card flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 id="h-clauses" className="section-title">Bibliothèque de clauses</h2>
            <button type="button" className="link text-body-sm">
              + Ajouter
            </button>
          </div>
          {clauses.map((c) => (
            <div key={c.title} className="item flex items-center gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <strong className="text-body-sm">{c.title}</strong>
                <span className="muted truncate text-caption">{c.excerpt}</span>
              </div>
              <button type="button" className="btn btn-sm btn-primary flex-none shadow-none">
                Copier
              </button>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
