import { getAvancee, getClient, getProject } from "@/app/lib/data"
import { Projet } from "@/app/lib/types"
import { AdminProgression } from "@/app/components/admin/project"
import Link from "next/link"
import { Suspense } from "react"

import { formatTitle, TranslateAI } from "../page"
import { cacheLife } from "next/cache"
import { timeStamp } from "console"
import { CheckRedirect } from "@/app/lib/auth/auth"
import TimeEntryModal from "@/app/components/projet/TimeEntryModal"
import Avancee from "@/app/components/projet/avancee/Avancee"
import FinishButton from "@/app/components/projet/FinishButton"

const tech = [
     { label: "Hébergement", value: "Vercel" },
     { label: "Domaine", value: "OVH · boulangerie-lafont.fr" },
     { label: "Dépôt", value: "GitHub", href: "#" },
     { label: "Accès et clés", value: "Gestionnaire de mots de passe", href: "#" },
]

export default async function ProjetPage({ params }: { params: Promise<{ id: number }> }) {
     return (
          <Suspense fallback={<p>Chargement du projet en cours...</p>}>
               <ProjetPageContent params={params} />
          </Suspense>
     )
}

function PriceCalculation(projet: Projet) {
     // price in ctms and tps in minutes

     const price = projet.proj_prix
     const tpsnnrem = projet.proj_tps_non_rem
     const tpsrem = projet.proj_tps_rem
     const tps = tpsnnrem + tpsrem

     if (tps === 0) {
          return 0
     }

     const tauxh = Math.ceil(price / (tps / 60) / 100)

     return tauxh
}
async function Timestamp(deadlineDate: Date) {
     "use cache"
     cacheLife("days")
     const today = new Date().setHours(0, 0, 0, 0)
     const deadlineDay = new Date(deadlineDate).setHours(0, 0, 0, 0)

     // Convert the difference from milliseconds to days (24 × 60 × 60 × 1,000).
     const jours = Math.ceil((deadlineDay - today) / 86_400_000)
     return jours
}

export async function ProjetPageContent({ params }: { params: Promise<{ id: number }> }) {
     await CheckRedirect()
     const { id } = await params

     const projet = (await getProject(id)) as Projet
     const avancees = await getAvancee(id)
     const client = await getClient(projet.client_id)

     console.log(projet.proj_info)

     const latestAv = [...avancees].sort((a, b) => b.avancee_date.getTime() - a.avancee_date.getTime())[0]

     const deadlineDate = projet.proj_deadline ?? new Date(latestAv.avancee_date.getTime() + 7 * 24 * 60 * 60 * 1000)

     const deadline = deadlineDate.toLocaleDateString("fr-FR")
     const jours = await Timestamp(deadlineDate)
     return (
          <>
               <header className="flex flex-col gap-3.5">
                    <Link href="/projets" className="link self-start text-body-sm no-underline">
                         ← Projets
                    </Link>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                         <div className="flex flex-col gap-2">
                              <div className="flex flex-wrap items-center gap-3">
                                   <h1 className="page-title">{projet.proj_nom}</h1>
                                   <span className="pill pill-client">
                                        {formatTitle(latestAv?.avancee_statut) || "Rien"}
                                   </span>
                              </div>
                              <Link href="/clients" className="text-lg font-medium text-ink">
                                   {client.client_nom + " " + client.client_pren} · {client.client_bus}
                              </Link>
                         </div>
                         <div className="flex flex-wrap gap-3">
                              <FinishButton proj_id={projet.proj_id} />
                              <TimeEntryModal
                                   projId={projet.proj_id}
                                   projectLabel={`${projet.proj_nom} · ${client.client_bus ?? client.client_nom}`}
                                   projPrix={projet.proj_prix}
                                   tpsRem={projet.proj_tps_rem}
                                   tpsNonRem={projet.proj_tps_non_rem}
                              />
                              <Link href={`/projets/${id}/avancee`} className="btn btn-primary">
                                   + Nouvelle avancée
                              </Link>
                         </div>
                    </div>
               </header>

               {/* // TODO: Implement deletion of avancee */}
               {avancees[0] && (
                    <section aria-label="Étapes" className="card">
                         <AdminProgression avancee={avancees} />
                    </section>
               )}

               <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside">
                    <section aria-labelledby="h-journal" className="card flex flex-col gap-4">
                         <h2 id="h-journal" className="section-title">
                              Journal des avancées
                         </h2>
                         {avancees[0] ? (
                              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                                   {[...avancees]
                                        .sort((a, b) => b.avancee_date.getTime() - a.avancee_date.getTime())
                                        .map((entry) => (
                                             <Avancee entry={entry} key={entry.avancee_id} />
                                        ))}
                              </ul>
                         ) : (
                              <p>Le projet n'a pas encore débuté.</p>
                         )}
                    </section>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                         <section aria-labelledby="h-delai" className="card flex flex-col gap-1.5">
                              <h2 id="h-delai" className="card-title mb-1.5">
                                   Délais
                              </h2>
                              <span className="muted text-sm">Mise en ligne prévue</span>
                              <span className="stat">{deadline}</span>
                              <span className="text-body-sm font-bold">dans {jours} jours</span>
                         </section>

                         <section id="temps" aria-labelledby="h-renta" className="card flex flex-col gap-3.5">
                              <h2 id="h-renta" className="card-title">
                                   Rentabilité
                              </h2>
                              <div className="flex flex-col gap-0.5">
                                   <span className="muted text-sm">Taux horaire réel</span>
                                   <span className="stat">{PriceCalculation(projet)} €/h</span>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                   <div
                                        role="img"
                                        aria-label={`${projet.proj_tps_rem / 60 || 0} payées, ${projet.proj_tps_non_rem / 60 || 0} non payées`}
                                        className="flex h-4.5 border-3 border-ink"
                                   >
                                        <div
                                             className="bg-ink"
                                             style={{
                                                  width: `${
                                                       (projet.proj_tps_rem /
                                                            (projet.proj_tps_rem + projet.proj_tps_non_rem)) *
                                                       100
                                                  }%`,
                                             }}
                                        />
                                        <div className="flex-1 bg-colerr" />
                                   </div>
                                   <div className="flex justify-between text-sm">
                                        <span>
                                             <strong>{projet.proj_tps_rem / 60 || 0} h</strong> payées
                                        </span>
                                        <span>
                                             <strong>{projet.proj_tps_non_rem / 60 || 0} h</strong> non payées
                                        </span>
                                   </div>
                              </div>
                              <div className="flex justify-between border-t-2 border-ink pt-3 text-body-sm">
                                   <span>Prix du projet</span>
                                   <strong>{projet.proj_prix / 100} €</strong>
                              </div>
                         </section>

                         <section
                              aria-labelledby="h-tech"
                              className="card flex flex-col gap-2.5 md:col-span-2 xl:col-span-1"
                         >
                              <h2 id="h-tech" className="card-title mb-1">
                                   Infos techniques
                              </h2>
                              {projet.proj_info?.map((info, index) => (
                                   <div key={index} className="flex justify-between gap-3 text-body-sm">
                                        <span className="muted">{info.cle}</span>

                                        <strong className="text-right">{info.valeur}</strong>
                                   </div>
                              ))}
                         </section>
                    </div>
               </div>
          </>
     )
}
