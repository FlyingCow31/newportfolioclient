import { CheckRedirect } from "@/app/lib/auth/auth"
import { Suspense } from "react"

const sites = [
     {
          domain: "gitesdulac.fr",
          online: true,
          uptime: "99,9 %",
          scores: [72, 95, 100, 92],
          formOk: false,
          ssl: "Exp. 02/2027",
     },
     {
          domain: "boulangerie-lafont.fr",
          online: true,
          uptime: "100 %",
          scores: [98, 100, 100, 100],
          formOk: true,
          ssl: "Exp. 01/2027",
     },
     {
          domain: "cabinet-roux.fr",
          online: true,
          uptime: "99,7 %",
          scores: [91, 88, 96, 100],
          formOk: true,
          ssl: "Exp. 12/2026",
     },
     {
          domain: "garage-dupuis.fr",
          online: true,
          uptime: "100 %",
          scores: [45, 92, 100, 91],
          formOk: true,
          ssl: "Exp. 11/2026",
     },
]

const scoreLabels = ["Perf.", "Access.", "Bonnes prat.", "SEO"]

const legend = [
     { label: "90-100", className: "bg-colsol" },
     { label: "50-89", className: "bg-soft" },
     { label: "0-49", className: "bg-colerr" },
]
export default function MonitoringPage() {
     return (
          <Suspense fallback={<p>Chargement...</p>}>
               <MonitoringPageContent />
          </Suspense>
     )
}

export async function MonitoringPageContent() {
     await CheckRedirect()
     return (
          <>
               <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                         <h1 className="page-title">Monitoring.</h1>
                         <span className="font-medium">
                              3 sites sur 4 OK · <strong>1 alerte</strong> · dernière vérification il y a 5 min
                         </span>
                    </div>
                    <button type="button" className="btn btn-primary">
                         Relancer les tests
                    </button>
               </header>

               <section role="alert" className="card-sm flex flex-wrap items-center gap-x-5 gap-y-3 bg-colerr">
                    <strong>gitesdulac.fr · le formulaire de contact ne répond plus</strong>
                    <span className="text-body-sm">Erreur 500 depuis 08:42</span>
                    <a href="#" className="btn btn-sm shadow-none sm:ml-auto">
                         Voir les logs
                    </a>
               </section>

               <section aria-label="Sites surveillés" className="card overflow-x-auto p-0 md:p-0">
                    <table className="table min-w-225">
                         <thead>
                              <tr>
                                   <th scope="col">Site</th>
                                   <th scope="col">Statut</th>
                                   <th scope="col">Uptime 30 j</th>
                                   {scoreLabels.map((l) => (
                                        <th key={l} scope="col">
                                             {l}
                                        </th>
                                   ))}
                                   <th scope="col">Formulaires</th>
                                   <th scope="col">SSL</th>
                              </tr>
                         </thead>
                         <tbody>
                              {sites.map((s) => (
                                   <tr key={s.domain}>
                                        <td>
                                             <strong>{s.domain}</strong>
                                        </td>
                                        <td>
                                             <span className={`pill ${s.online ? "pill-done" : "pill-late"}`}>
                                                  {s.online ? "En ligne" : "Hors ligne"}
                                             </span>
                                        </td>
                                        <td className="font-bold">{s.uptime}</td>
                                        {s.scores.map((score, i) => (
                                             <td key={scoreLabels[i]}>
                                                  <span
                                                       className={`score ${score >= 90 ? "bg-colsol" : score >= 50 ? "bg-soft" : "bg-colerr"}`}
                                                  >
                                                       {score}
                                                  </span>
                                             </td>
                                        ))}
                                        <td>
                                             <span className={`pill ${s.formOk ? "pill-done" : "pill-late"}`}>
                                                  {s.formOk ? "OK" : "Erreur"}
                                             </span>
                                        </td>
                                        <td className="muted">{s.ssl}</td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </section>

               <p className="m-0 flex flex-wrap items-center gap-4 text-sm">
                    {legend.map((l) => (
                         <span key={l.label} className="inline-flex items-center gap-1.5">
                              <span className={`size-3.5 border-2 border-ink ${l.className}`} />
                              {l.label}
                         </span>
                    ))}
                    <span className="muted">Scores Lighthouse mobile</span>
               </p>
          </>
     )
}
