import Link from "next/link"
import { CheckRedirect } from "../lib/auth"
import { Suspense } from "react"
import { getAvancees, getProjects } from "../lib/data"
import { Avancee, Projet, NextSummary } from "../lib/types"

export default function HomePage() {
     // TODO : Integrate a loading skeletton
     return (
          <Suspense fallback={<p className="p-6">Chargement…</p>}>
               <HomePageContent />
          </Suspense>
     )
}

// TODO: delete when the calendar has been integrated
const stats = [{ label: "Déclaration URSSAF", value: "31/10", sub: "dans 21 jours", tone: "" }]

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
]

const week = [
     { day: "MAR 14", title: "Mise en ligne", client: "Gîtes du Lac" },
     { day: "VEN 17", title: "Point client", client: "Cabinet Roux" },
]

const todos = [
     { label: "Relancer Boulangerie Lafont", done: false },
     { label: "Exporter les photos - Gîtes du Lac", done: false },
     { label: "Envoyer le devis - Atelier Peinture", done: true },
]

export async function HomePageContent() {
     await CheckRedirect()

     const projects = await getProjects()
     const avancees = await getAvancees()

     // used for down there
     const date = Date.now()

     // Find all the projects that needs attention
     async function FindProjects(avancees: Avancee[]) {
          const lateAvancees = avancees.filter(
               (avancee) =>
                    (avancee.avancee_date.getTime() < date && avancee.avancee_statut == "en_cours") ||
                    avancee.avancee_statut == "planifie",
          )

          // Set deletes duplicates entry, and then we count the size of the new array
          const numberOfLateProject = new Set(lateAvancees.map((avancees) => avancees.proj_id)).size

          return numberOfLateProject as number
     }

     // Find all projects that are waiting for the client
     function FindWaiting(avancees: Avancee[]) {
          const waitingAvancees = new Set(
               avancees
                    .filter((avancee) => avancee.avancee_statut == "attente_client")
                    .map((avancee) => avancee.proj_id),
          ).size

          const oldestWaitingTitle = avancees
               .filter((avancees) => avancees.avancee_statut == "attente_client")
               .filter((a) => a.avancee_date.getTime() < date)
          const oldestTitle = oldestWaitingTitle[0]?.avancee_titre ?? "Tout est bon!"

          return { NbWaiting: waitingAvancees, TitleWaiting: oldestTitle }
     }

     // Find the next step to make (and the number of things to do this week)
     function FindNext(avancee: Avancee[], planning: true): Avancee[]
     function FindNext(avancee: Avancee[], planning?: false): NextSummary
     function FindNext(avancees: Avancee[], planning = false): Avancee[] | NextSummary {
          const nextAvancees = avancees.filter(
               (avancee) =>
                    avancee.avancee_date.getTime() >= date &&
                    avancee.avancee_date.getTime() <= date + 7 * 24 * 60 * 60 * 1000,
          )
          console.log("Next Avancees: " + nextAvancees)

          const sortedNext = nextAvancees.sort((a, b) => a.avancee_date.getTime() - b.avancee_date.getTime())
          const nextTitle = sortedNext[0].avancee_titre || "Rien!"
          const nbNextAvancees = nextAvancees.map((a) => a.proj_id).length || 0

          if (planning) {
               console.log("Next:" + sortedNext)
               return sortedNext
          }
          console.log("Nombre Next Avancee: " + nbNextAvancees)
          return { nbNext: nbNextAvancees, titleNext: nextTitle }
     }

     const { nbNext, titleNext } = FindNext(avancees)
     const { NbWaiting, TitleWaiting } = FindWaiting(avancees)

     const listNextAvancees = FindNext(avancees, true).slice(0, 3)
     console.log({
          total: listNextAvancees.length,
          displayed: listNextAvancees.length,
          ids: listNextAvancees.map((avancee) => avancee.avancee_id),
     })

     // Main "A traiter" Block
     async function HandleBoxCreation({ avancees, projet }: { avancees: Avancee[]; projet: Projet }) {
          const sortLatestAvancee = avancees
               .filter((av) => av.proj_id == projet.proj_id)
               .filter((a) => a.avancee_statut != "termine")
               .sort((a, b) => a.avancee_date.getTime() - b.avancee_date.getTime())
          const latestAvancee = sortLatestAvancee[0]

          if (!latestAvancee) {
               return null
          }

          // TODO: Implémenter une fonctionnalité d'auto-late si ça passe en late ?
          // Front end was created with AI as this project is aimed at backend / TS learning, i need to translate things because i'm too lazy to modify front, and I really wanna get my hands on switch and functions.
          function TranslateAI(statut: string) {
               switch (statut) {
                    case "en_cours":
                         return "you"
                         break
                    case "attente_client":
                         return "client"
                         break
                    case "planifie":
                         return "planned"
                         break

                    default:
                         return "done"
                         break
               }
          }
          function formatTitle(currentTitle: string) {
               switch (currentTitle) {
                    case "en_cours":
                         return "En cours"
                    case "attente_client":
                         return "En attente"
                    case "termine":
                         return "Terminée"
                    default:
                         return "Planifiée"
               }
          }
          return (
               <li className="item flex flex-wrap items-center gap-x-4 gap-y-3">
                    {latestAvancee.avancee_date.getTime() < date ? (
                         <span className={`pill pill-late`}>En retard</span>
                    ) : (
                         <span className={`pill pill-${TranslateAI(latestAvancee.avancee_statut)}`}>
                              {formatTitle(latestAvancee.avancee_statut)}
                         </span>
                    )}

                    <div className="flex min-w-0 flex-fill flex-col gap-0.5">
                         <Link
                              href={`/projet/${latestAvancee.proj_id}`}
                              className="text-lg font-bold text-ink no-underline"
                         >
                              {projet.proj_nom + "" + projet.proj_type}
                         </Link>
                         <span className="muted text-sm">
                              {latestAvancee.avancee_titre +
                                   " - " +
                                   latestAvancee.avancee_date.getDay().toLocaleString("fr-FR") +
                                   "/" +
                                   latestAvancee.avancee_date.getMonth().toLocaleString("fr-FR")}
                         </span>
                    </div>
                    {latestAvancee.avancee_date.getTime() < date ? (
                         <Link
                              href={`/projets/${latestAvancee.proj_id}/avancee`}
                              className={`btn btn-sm shadow-none btn-primary`}
                         >
                              Voir le projet
                         </Link>
                    ) : (
                         <Link href={`/projets/${latestAvancee.proj_id}`} className={`btn btn-sm shadow-none`}>
                              Voir le projet
                         </Link>
                    )}
               </li>
          )
     }
     const now = new Date()
     const dateString =
          now.toLocaleDateString("fr-FR", { weekday: "long" }) +
          " " +
          now.getDay() +
          " " +
          now.toLocaleDateString("fr-FR", { month: "long" })

     // Main body
     return (
          <>
               <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                         <span className="eyebrow">{dateString}</span>
                         <h1 className="page-title">Bonjour Gaël.</h1>
                    </div>
                    <div className="flex flex-wrap gap-3.5">
                         <Link href="/projets" className="btn">
                              Nouveau projet
                         </Link>
                    </div>
               </header>
               <section aria-label="Résumé" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div className={`card-sm flex flex-col gap-1.5 bg-colerr `}>
                         <span className="text-sm font-bold">Attention</span>
                         <span className="stat">{FindProjects(avancees)}</span>
                         <span className="text-sm">Projets en retards</span>
                    </div>
                    <div className={`card-sm flex flex-col gap-1.5 bg-main text-white`}>
                         <span className="text-sm font-bold">Projets En Attente</span>
                         <span className="stat">{NbWaiting}</span>
                         <span className="text-sm truncate">{TitleWaiting}</span>
                    </div>
                    <div className={`card-sm flex flex-col gap-1.5 `}>
                         <span className="text-sm font-bold">A venir</span>
                         <span className="stat">{nbNext}</span>
                         <span className="text-sm">{titleNext}</span>
                    </div>
                    {/* // TODO: link to calendar (see const stats up there) */}
                    <div className={`card-sm flex flex-col gap-1.5 `}>
                         <span className="text-sm font-bold"></span>
                         <span className="stat">{FindProjects(avancees)}</span>
                         <span className="text-sm"></span>
                    </div>
               </section>

               <div className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside">
                    <section aria-labelledby="h-atraiter" className="card flex flex-col gap-4">
                         <div className="flex items-baseline justify-between gap-3">
                              <h2 id="h-atraiter" className="section-title">
                                   À traiter
                              </h2>
                              <Link href="/projets" className="link text-body-sm">
                                   Tous les projets
                              </Link>
                         </div>
                         <ul className="m-0 flex list-none flex-col gap-3 p-0">
                              {projects.map((proj) => (
                                   <HandleBoxCreation
                                        key={proj.proj_id}
                                        projet={proj as Projet}
                                        avancees={avancees as Avancee[]}
                                   />
                              ))}
                         </ul>
                    </section>

                    <div className="grid gap-6 md:grid-cols-2 lg:gap-7 xl:grid-cols-1">
                         <section aria-labelledby="h-semaine" className="card flex flex-col gap-3.5">
                              <h2 id="h-semaine" className="card-title">
                                   Cette semaine
                              </h2>
                              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                                   {listNextAvancees.map((w) => (
                                        <li key={w.avancee_id} className="flex items-center gap-3.5">
                                             <span className="date-chip">
                                                  {w.avancee_date
                                                       .toLocaleDateString("fr-FR", { weekday: "long" })
                                                       .slice(0, 3)
                                                       .toUpperCase() +
                                                       " " +
                                                       w.avancee_date.toLocaleDateString("fr-FR", { day: "2-digit" })}
                                             </span>
                                             <span className="text-body-sm truncate">
                                                  <strong>{w.avancee_titre}</strong> · {w.avancee_statut}
                                             </span>
                                        </li>
                                   ))}
                              </ul>
                         </section>

                         {/* // TODO: put real data in there when TODO has been created. */}
                         <section aria-labelledby="h-todo" className="card flex flex-col gap-3">
                              <div className="flex items-baseline justify-between gap-3">
                                   <h2 id="h-todo" className="card-title">
                                        Todo du jour
                                   </h2>
                                   <Link href="/todo" className="link text-body-sm">
                                        Tout voir
                                   </Link>
                              </div>
                              {todos.map((todo) => (
                                   <label
                                        key={todo.label}
                                        className="flex min-h-10 cursor-pointer items-center gap-3 text-body-sm has-checked:text-muted has-checked:line-through"
                                   >
                                        <input type="checkbox" defaultChecked={todo.done} className="check" />
                                        {todo.label}
                                   </label>
                              ))}
                         </section>
                    </div>
               </div>
          </>
     )
}
