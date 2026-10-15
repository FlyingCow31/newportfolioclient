const kpis = [
  { label: "Dépenses 2026", value: "3 150 €", tone: "" },
  { label: "Bénéfice estimé", value: "25 250 €", tone: "" },
  { label: "Taux horaire moyen", value: "41 €/h", tone: "" },
  { label: "À déclarer le 31/10", value: "2 900 €", tone: "bg-main text-white" },
];

const months = [
  { label: "J", height: "h-3/10" },
  { label: "F", height: "h-9/20" },
  { label: "M", height: "h-1/4" },
  { label: "A", height: "h-3/5" },
  { label: "M", height: "h-1/2" },
  { label: "J", height: "h-7/10" },
  { label: "J", height: "h-2/5" },
  { label: "A", height: "h-1/5" },
  { label: "S", height: "h-4/5" },
  { label: "O", height: "h-11/20" },
];

const invoices = [
  { number: "FA-2026-08", client: "Gîtes du Lac", amount: "850 €", status: "En retard", className: "pill-late" },
  { number: "FA-2026-07", client: "Boulangerie Lafont", amount: "1 200 €", status: "En attente", className: "pill-client" },
  { number: "FA-2026-06", client: "Atelier Peinture", amount: "640 €", status: "Payée", className: "pill-done" },
];

const expenses = [
  { label: "Abonnement Vercel Pro", category: "Outils", date: "01/10", amount: "20 €" },
  { label: "Nom de domaine", category: "Client refacturé", date: "28/09", amount: "12 €" },
];

export default function FinancesPage() {
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="page-title">Finances.</h1>
        <div className="flex flex-wrap gap-3">
          <a href="#" className="btn">
            Outil de facturation ↗
          </a>
          <button type="button" className="btn btn-primary">
            + Ajouter une dépense
          </button>
        </div>
      </header>

      <section aria-labelledby="h-ca" className="card flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="h-ca" className="text-body-sm font-bold">
              Chiffre d&apos;affaires encaissé 2026
            </h2>
            <span className="stat">28 400 €</span>
          </div>
          <span className="text-body-sm font-bold">37 % du plafond micro-entreprise</span>
        </div>
        <div role="img" aria-label="37 % du plafond atteint" className="flex h-6.5 border-3 border-ink bg-white">
          <div className="w-2/5 bg-ink" />
        </div>
        <div className="muted flex justify-between text-sm">
          <span>0 €</span>
          <span>Plafond : 77 700 €</span>
        </div>
      </section>

      <section aria-label="Indicateurs" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className={`card-sm flex flex-col gap-1.5 ${k.tone}`}>
            <span className="text-sm font-bold">{k.label}</span>
            <span className="stat">{k.value}</span>
          </div>
        ))}
      </section>

      <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside">
        <section aria-labelledby="h-mois" className="card flex flex-col gap-4">
          <h2 id="h-mois" className="section-title">Encaissé par mois</h2>
          <div role="img" aria-label="Chiffre d'affaires encaissé par mois, de janvier à octobre" className="grid h-50 grid-cols-10 items-end gap-1.5 border-b-3 border-ink sm:gap-2">
            {months.map((m, i) => (
              <div key={i} className={`bg-ink ${m.height}`} />
            ))}
          </div>
          <div className="grid grid-cols-10 gap-1.5 text-center text-xs font-bold sm:gap-2">
            {months.map((m, i) => (
              <span key={i}>{m.label}</span>
            ))}
          </div>
        </section>

        <section aria-labelledby="h-fact" className="card flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 id="h-fact" className="section-title">Dernières factures</h2>
            <span className="muted text-caption">Émises depuis l&apos;outil de facturation</span>
          </div>
          {invoices.map((inv) => (
            <div key={inv.number} className="item flex items-center gap-2.5">
              <div className="flex min-w-0 flex-1 flex-col">
                <strong className="text-body-sm">{inv.number}</strong>
                <span className="muted truncate text-caption">
                  {inv.client} · {inv.amount}
                </span>
              </div>
              <span className={`pill ${inv.className}`}>{inv.status}</span>
            </div>
          ))}
        </section>
      </div>

      <section aria-labelledby="h-dep" className="card flex flex-col gap-3">
        <h2 id="h-dep" className="section-title">Dernières dépenses</h2>
        <div className="overflow-x-auto">
          <table className="table min-w-130">
            <thead>
              <tr>
                <th scope="col">Libellé</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Date</th>
                <th scope="col" className="text-right">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.label}>
                  <td>{e.label}</td>
                  <td>{e.category}</td>
                  <td>{e.date}</td>
                  <td className="text-right font-bold">{e.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
