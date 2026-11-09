import { Suspense } from "react"
import Link from "next/link"
import { CheckRedirect } from "@/app/lib/auth/auth"
import { getProjects, getAvancees, getClients } from "@/app/lib/data"
import { Avancee, Client, Projet } from "@/app/lib/types"
import DeleteButton from "@/app/components/admin/projets/DeleteButton"

type Status = "late" | "en_cours" | "attente_client" | "planifie"

const filters: { id: "all" | Status; label: string }[] = [
     { id: "all", label: "Tous" },
     { id: "late", label: "En retard" },
     { id: "en_cours", label: "En cours" },
     { id: "attente_client", label: "En attente client" },
     { id: "planifie", label: "Planifiés" },
]

export default function ProjetsPage({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
     return (
          <Suspense fallback={<p className="p-6">Chargement…</p>}>
               <ProjetsPageContent searchParams={searchParams} />
          </Suspense>
     )
}

// Takes the search parameter and gives it to FilteredProject
export async function ProjetsPageContent({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
     await CheckRedirect()

     const projects = await getProjects()
     const avancees = await getAvancees()
     const clients = await getClients()

     const finished = projects.filter((p) => p.proj_done_at)

     return (
          <>
               <header className="flex flex-wrap items-end justify-between gap-4">
                    <h1 className="page-title">Projets.</h1>
                    <Link href={"/projets/nouveau"} className="btn btn-primary">
                         + Nouveau projet
                    </Link>
               </header>

               <Suspense fallback={<p>Loading...</p>}>
                    <FilteredProjects
                         searchParams={searchParams}
                         projects={projects}
                         avancees={avancees}
                         clients={clients}
                    />
               </Suspense>

               <details className="border-3 border-ink bg-surface">
                    <summary className="flex min-h-13 cursor-pointer items-center px-4 font-bold">
                         Terminés · {finished.length} projets
                    </summary>
                    <ul className="muted m-0 flex list-none flex-col gap-2 px-4 pb-4">
                         {finished.map((f) => (
                              <li key={f.proj_id} className="flex gap-5">
                                   {f.proj_type +
                                        " " +
                                        f.proj_nom +
                                        " " +
                                        "Terminé le: " +
                                        f.proj_done_at?.toLocaleString("fr-FR")}
                                   <DeleteButton proj_id={f.proj_id} />
                              </li>
                         ))}
                    </ul>
               </details>
          </>
     )
}

async function FilteredProjects({
     searchParams,
     projects,
     avancees,
     clients,
}: {
     searchParams: Promise<{ statut?: string }>
     projects: Projet[]
     avancees: Avancee[]
     clients: Client[]
}) {
     const { statut = "all" } = await searchParams
     return <ProjectsView statut={statut} projects={projects} avancees={avancees} clients={clients} />
}

// Gives you a list of projects that have the statut provided.
function AvanceeProject({ avancees, statut }: { avancees: Avancee[]; statut: string }) {
     const sortedProjects = new Set(
          avancees.filter((avancee) => avancee.avancee_statut == statut).map((avancee) => avancee.proj_id),
     )
     console.log(sortedProjects)
     return sortedProjects
}
export function TranslateAI(statut: string) {
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
export function formatTitle(currentTitle: string) {
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

async function ProjectsView({
     statut,
     projects,
     avancees,
     clients,
}: {
     statut: string
     projects: Projet[]
     avancees: Avancee[]
     clients: Client[]
}) {
     const date = Date.now()
     const projectsWithStatus = AvanceeProject({ avancees, statut })
     const topOfThePage = ({ avancees, statut }: { avancees: Avancee[]; statut: string }) =>
          AvanceeProject({ avancees, statut })

     // Determines all the avancees that are late (thos who aren't done or waiting for client)
     const lateAvancees = avancees.filter(
          (avancee) =>
               (avancee.avancee_date.getTime() < date && avancee.avancee_statut == "en_cours") ||
               avancee.avancee_statut == "planifie",
     )
     const lateProjects = new Set(lateAvancees.map((avancees) => avancees.proj_id)).size
     const rows =
          statut === "all"
               ? projects.filter((p) => !p.proj_done_at)
               : projects.filter((p) => projectsWithStatus.has(p.proj_id) && !p.proj_done_at)

     return (
          <>
               <nav aria-label="Filtrer par statut" className="flex flex-wrap gap-2.5">
                    {/* // TODO: When the late state is created (and the auto-late script as well), this will work  */}
                    {filters.map((f) => (
                         <Link
                              key={f.id}
                              href={f.id === "all" ? "/projets" : `/projets?statut=${f.id}`}
                              aria-current={statut === f.id ? "true" : undefined}
                              className="btn btn-sm current:bg-ink current:text-white current:shadow-inverse-xs"
                         >
                              {f.label}
                              <span className="font-medium">
                                   {f.id === "all"
                                        ? projects.length
                                        : f.id === "late"
                                          ? lateProjects
                                          : topOfThePage({ avancees, statut: f.id }).size}
                              </span>
                         </Link>
                    ))}
               </nav>

               <section aria-label="Projets en cours" className="card overflow-x-auto p-0 md:p-0">
                    <table className="table min-w-190">
                         <thead>
                              <tr>
                                   <th scope="col">Projet</th>
                                   <th scope="col">Étape</th>
                                   <th scope="col">Statut</th>
                                   <th scope="col">Échéance</th>
                              </tr>
                         </thead>
                         <tbody>
                              {rows.map((p) => {
                                   const projectAvancees = avancees.filter((av) => av.proj_id === p.proj_id)
                                   const latestAvancee = [...projectAvancees].sort(
                                        (a, b) => b.avancee_date.getTime() - a.avancee_date.getTime(),
                                   )[0]
                                   const currentStep = projectAvancees.length
                                   const currentStatus = latestAvancee?.avancee_statut

                                   return (
                                        <tr key={p.proj_id}>
                                             <td>
                                                  <Link
                                                       href={`/projets/${p.proj_id}`}
                                                       className="flex flex-col gap-0.5 text-ink no-underline"
                                                  >
                                                       <strong>{p.proj_nom}</strong>
                                                       <span className="muted text-sm">
                                                            {
                                                                 clients.find((c) => c.client_id == p.client_id)
                                                                      ?.client_bus
                                                            }
                                                       </span>
                                                  </Link>
                                             </td>
                                             <td>
                                                  <div className="flex flex-col gap-1.5">
                                                       <span className="font-medium">
                                                            {latestAvancee?.avancee_titre ?? "Aucune donnée"}
                                                       </span>
                                                       <div className="grid w-30 grid-cols-4 gap-0.75">
                                                            {[1, 2, 3, 4].map((i) => (
                                                                 <div
                                                                      key={i}
                                                                      className={`seg seg-sm ${
                                                                           i < currentStep
                                                                                ? "seg-done"
                                                                                : i === currentStep && currentStatus
                                                                                  ? `seg-${currentStatus}`
                                                                                  : "seg-todo"
                                                                      }`}
                                                                 />
                                                            ))}
                                                       </div>
                                                  </div>
                                             </td>
                                             <td>
                                                  <span className={`pill pill-${TranslateAI(currentStatus)}`}>
                                                       {formatTitle(currentStatus)}
                                                  </span>
                                             </td>
                                             <td
                                                  className={`font-bold ${latestAvancee?.avancee_date.getTime() < date ? "text-colerr-dark" : ""}`}
                                             >
                                                  {latestAvancee?.avancee_date.toLocaleDateString("fr-FR") ?? "----"}
                                             </td>
                                        </tr>
                                   )
                              })}
                              {rows.length === 0 && (
                                   <tr>
                                        <td colSpan={5} className="muted text-center">
                                             Aucun projet avec ce statut.
                                        </td>
                                   </tr>
                              )}
                         </tbody>
                    </table>
               </section>
          </>
     )
}
