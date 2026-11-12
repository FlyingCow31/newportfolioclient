import InvoiceModal from "@/app/components/finances/InvoiceModal"
import MarkPaidButton from "@/app/components/finances/MarkPaidButton"
import ExpenseModal from "@/app/components/admin/finances/ExpenseModal"
import { CheckRedirect } from "@/app/lib/auth/auth"
import { getDepenses, getInvoices, getProjects } from "@/app/lib/data"
import Link from "next/link"
import { connection } from "next/server"
import { Suspense } from "react"

const expenses = [
     { label: "Abonnement Vercel Pro", category: "Outils", date: "01/10", amount: "20 €" },
     { label: "Nom de domaine", category: "Client refacturé", date: "28/09", amount: "12 €" },
]

export default function FinancesPage() {
     return (
          <Suspense fallback={<p>Chargement...</p>}>
               <FinancesPageContent />
          </Suspense>
     )
}

export async function FinancesPageContent() {
     await CheckRedirect()
     const projets = await getProjects()
     const depenses = await getDepenses()
     const factures = await getInvoices()

     await connection()
     const today = new Date()

     let ca = 0
     let dep = 0
     const newproj = [...projets].map((p) => p.proj_prix).forEach((p) => (ca = ca + p))
     const allDep = [...depenses].map((d) => d.depense_mont).forEach((d) => (dep = dep + d))

     const txh = [...projets].map((p) => p.proj_tps_non_rem + p.proj_tps_rem).reduce((sum, total) => sum + total, 0)
     const pourcentageca = Math.ceil((ca / 100 / 77700) * 100)

     const kpis = [
          { label: "Dépenses 2026", value: `${dep} €`, tone: "" },
          { label: "Bénéfice estimé", value: `${(ca - (ca * 20) / 100) / 100} €`, tone: "" },
          {
               label: "Taux horaire moyen",
               value: `${((ca - (ca * 20) / 100) / 100 / (txh / 60)).toFixed(1)}€ / h`,
               tone: "bg-main text-white",
          },
     ]

     // Transforms a number in a height from the money gaigned the month the order was complete.
     function getMonthPrice(month: string) {
          const monthPrice = projets
               .filter(
                    (p) =>
                         p.proj_done_at &&
                         new Date(p.proj_done_at).getMonth() + 1 === Number(month) &&
                         // To change when 2027
                         new Date(p.proj_done_at).getFullYear() === 2026,
               )
               .map((p) => p.proj_prix)[0]

          const height = `${(monthPrice / 100 / (ca / 100)) * 100}%`
          console.log(height)
          return height
     }

     const months = [
          { label: "J", height: getMonthPrice("01") },
          { label: "F", height: getMonthPrice("02") },
          { label: "M", height: getMonthPrice("03") },
          { label: "A", height: getMonthPrice("04") },
          { label: "M", height: getMonthPrice("05") },
          { label: "J", height: getMonthPrice("06") },
          { label: "J", height: getMonthPrice("07") },
          { label: "A", height: getMonthPrice("08") },
          { label: "S", height: getMonthPrice("09") },
          { label: "O", height: getMonthPrice("10") },
          { label: "N", height: getMonthPrice("11") },
          { label: "D", height: getMonthPrice("12") },
     ]

     return (
          <>
               <header className="flex flex-wrap items-end justify-between gap-4">
                    <h1 className="page-title">Finances.</h1>
                    <div className="flex flex-wrap gap-3">
                         <Link href="https://app.indy.fr/facturation/factures" className="btn">
                              Outil de facturation ↗
                         </Link>
                         <ExpenseModal projects={projets} spent={315000} profit={2525000} />
                    </div>
               </header>

               <section aria-labelledby="h-ca" className="card flex flex-col gap-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                         <div className="flex flex-col gap-1">
                              <h2 id="h-ca" className="text-body-sm font-bold">
                                   Chiffre d&apos;affaires encaissé 2026
                              </h2>
                              <span className="stat">{ca / 100} €</span>
                         </div>
                         <span className="text-body-sm font-bold">{pourcentageca} % du plafond micro-entreprise</span>
                    </div>
                    <div
                         role="img"
                         aria-label={`${pourcentageca} % du plafond atteint`}
                         className="flex h-6.5 border-3 border-ink bg-white"
                    >
                         <div
                              className={`bg-ink`}
                              style={{
                                   width: `${(ca / 100 / 77_700) * 100}%`,
                              }}
                         />
                    </div>
                    <div className="muted flex justify-between text-sm">
                         <span>0 €</span>
                         <span>TVA: 33 000€</span>
                         <span>Plafond : 77 700 €</span>
                    </div>
               </section>

               <section aria-label="Indicateurs" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {kpis.map((k) => (
                         <div key={k.label} className={`card-sm flex flex-col gap-1.5 ${k.tone}`}>
                              <span className="text-sm font-bold">{k.label}</span>
                              <span className="stat">{k.value}</span>
                         </div>
                    ))}
               </section>

               <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside">
                    <section aria-labelledby="h-mois" className="card flex flex-col gap-4">
                         <h2 id="h-mois" className="section-title">
                              Encaissé par mois
                         </h2>
                         <div
                              role="img"
                              aria-label="Chiffre d'affaires encaissé par mois, de janvier à octobre"
                              className="grid h-50 grid-cols-12 items-end gap-1.5 border-b-3 border-ink sm:gap-2"
                         >
                              {months.map((m, i) => (
                                   <div
                                        key={i}
                                        className={`bg-ink`}
                                        style={{
                                             height: m.height,
                                        }}
                                   />
                              ))}
                         </div>
                         <div className="grid grid-cols-12 gap-1.5 text-center text-xs font-bold sm:gap-2">
                              {months.map((m, i) => (
                                   <span key={i}>{m.label}</span>
                              ))}
                         </div>
                    </section>

                    <section aria-labelledby="h-fact" className="card flex flex-col gap-3">
                         <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-0.5">
                                   <h2 id="h-fact" className="section-title">
                                        Dernières factures
                                   </h2>
                                   <span className="muted text-caption">Émises depuis l&apos;outil de facturation</span>
                              </div>
                              <InvoiceModal projects={projets} />
                         </div>

                         {factures.map((inv) => {
                              const isLate =
                                   inv.facture_pay_deadline.getTime() < today.getTime() && !inv.facture_paid_at

                              return (
                                   <div
                                        key={inv.facture_num}
                                        className={`${isLate ? "bg-red-200" : ""} item flex items-center gap-2.5`}
                                   >
                                        <div className="flex min-w-0 flex-1 flex-col">
                                             <strong className={`text-body-sm`}>{inv.facture_num}</strong>
                                             <span className="muted truncate text-caption">
                                                  {inv.facture_date.toLocaleDateString("fr-FR")} · {inv.facture_mont}
                                             </span>
                                        </div>

                                        {isLate && <MarkPaidButton factureId={inv.facture_id} />}
                                   </div>
                              )
                         })}
                    </section>
               </div>

               <section aria-labelledby="h-dep" className="card flex flex-col gap-3">
                    <h2 id="h-dep" className="section-title">
                         Dernières dépenses
                    </h2>
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
                                   {depenses.map((e) => (
                                        <tr key={e.depense_id}>
                                             <td>{e.depense_label}</td>
                                             <td>{e.depense_categorie}</td>
                                             <td>{e.depense_date.toLocaleDateString("fr-FR")}</td>
                                             <td className="text-right font-bold">{e.depense_mont / 100}€</td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    </div>
               </section>
          </>
     )
}
