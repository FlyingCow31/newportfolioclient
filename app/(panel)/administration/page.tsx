import Clauses, { Company, handleCopy, InfoEntreprise } from "@/app/components/administration/clause"
import ClauseModal from "@/app/components/administration/ClauseModal"
import { CheckRedirect } from "@/app/lib/auth/auth"
import { getClauses } from "@/app/lib/data"
import { Suspense } from "react"

const company = [
     { label: "Nom", value: "GAEL TOURNIER EI", strong: true },
     { label: "SIRET", value: "105 820 930 00011", copy: true },
     { label: "Création", value: "08/2026" },
     { label: "Code NAF", value: "6201Z · Programmation informatique" },
     { label: "Régime", value: "Micro-entreprise" },
     { label: "Adresse", value: "22 Allée du Loiret, 31770 Colomiers" },
]

export function createDeadlines() {
     const formatter = new Intl.DateTimeFormat("fr-FR", { month: "short" })
     const currentMonth = new Date()
     const firstMonthOffset = currentMonth.getDate() > 3 ? 1 : 0
     const firstDeadlineMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + firstMonthOffset, 1)
     const secondDeadlineMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + firstMonthOffset + 1, 1)

     return [
          {
               day: "03",
               month: formatter.format(firstDeadlineMonth).replace(".", "").toUpperCase(),
               title: "Déclaration URSAFF",
               sub: "Mensuelle",
               next: true,
          },
          {
               day: "03",
               month: formatter.format(secondDeadlineMonth).replace(".", "").toUpperCase(),
               title: "Déclaration URSAFF",
               sub: "Mensuelle",
               next: false,
          },
     ]
}

const deadlines = [
     ...createDeadlines(),
     ...(new Date().getMonth() === 10
          ? [{ day: "10", month: "DÉC", title: "CFE", sub: "Paiement annuel", next: true }]
          : []),
     ...(new Date().getMonth() === 8
          ? [{ day: "10", month: "SEP", title: "RC", sub: "Paiement annuel", next: true }]
          : []),
]
export default function AdminPage() {
     return (
          <Suspense fallback={<p>Chargement...</p>}>
               <AdministrationPage />
          </Suspense>
     )
}

export async function AdministrationPage() {
     await CheckRedirect()
     const clauses = await getClauses()

     return (
          <>
               <h1 className="page-title">Administration.</h1>

               <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside">
                    <section aria-labelledby="h-ent" className="card flex flex-col gap-4">
                         <div className="flex items-center justify-between gap-3">
                              <h2 id="h-ent" className="section-title">
                                   Mon entreprise
                              </h2>
                         </div>
                         <InfoEntreprise company={company} />
                    </section>

                    <section aria-labelledby="h-cal" className="card flex flex-col gap-3.5">
                         <h2 id="h-cal" className="section-title">
                              Échéances
                         </h2>
                         <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                              {deadlines.slice(0, 3).map((d) => (
                                   <li
                                        key={`${d.day}-${d.month}`}
                                        className={`item flex items-center gap-3.5 ${d.next ? "bg-main text-white" : ""}`}
                                   >
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

               <div>
                    <section aria-labelledby="h-clauses" className="card flex flex-col gap-3">
                         <div className="flex items-center justify-between gap-3">
                              <h2 id="h-clauses" className="section-title">
                                   Bibliothèque de clauses
                              </h2>
                              <ClauseModal />
                         </div>
                         {clauses.map((c) => (
                              <Clauses {...c} key={c.clause_id} />
                         ))}
                    </section>
               </div>
          </>
     )
}
