import { NextRequest } from "next/server"
import { GetClient } from "../lib/client"
import { redirect } from "next/navigation"
import { Avancee, Progression } from "../components/client/project"
import { Suspense } from "react"
import { sql } from "../lib/db"

const steps = [
     { title: "Début de la commande", meta: "Terminé · 09/10/2026", state: "done" },
     {
          title: "Développement des pages",
          meta: "Accueil et Services en place; page « À propos » à compléter.",
          state: "current",
          pill: "En cours · en attente de votre part",
     },
     { title: "Référencement (SEO)", meta: "À venir · prévu vers le 20/10", state: "todo" },
     { title: "Mise en ligne", meta: "À venir · 30/10/2026", state: "todo" },
] as const

const documents = [
     { name: "devis.pdf", type: "Devis", date: "09/10/2026", tag: "bg-bg" },
     { name: "onboarding.pdf", type: "Onboarding", date: "09/10/2026", tag: "bg-colsol" },
]

export default function ClientPage() {
     return (
          <Suspense fallback={<p className="p-6">Chargement…</p>}>
               <ClientContent />
          </Suspense>
     )
}

async function ClientContent() {
     const data = await GetClient()
     if (!data) redirect("/login")

     const { client, projet } = data
     if (!projet) return <p className="p-6">Aucun projet en cours.</p>

     const avancees = (await sql`SELECT avancee_id,
          avancee_etape,
          avancee_statut,
          avancee_titre,
          avancee_message,
          avancee_date,
          avancee_visible_client FROM avancee WHERE proj_id = ${projet.proj_id} `) as Avancee[]
     console.log(client)

     // TODO : Integrate a loading skeletton

     return (
          <div className="mx-auto flex max-w-300 flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-7 lg:py-8">
               <header className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                         <span className="eyebrow">Gaël Tournier · Espace client</span>
                         <h1 className="page-title">
                              Bonjour {client?.client_pren} {client?.client_nom}
                         </h1>
                    </div>
                    <a href="mailto:contact@gaeltournier.dev" className="btn btn-icon shrink-0 sm:w-auto sm:px-5">
                         <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                         >
                              <rect x="3" y="5" width="18" height="14" />
                              <path d="M3 7l9 6 9-6" />
                         </svg>
                         <span className="sr-only sm:not-sr-only">Me contacter</span>
                    </a>
               </header>

               <section aria-label="Statut du projet" className="card flex flex-col gap-5">
                    {projet && (
                         <Progression
                              projet={projet as Parameters<typeof Progression>[0]["projet"]}
                              avancee={avancees}
                         />
                    )}
               </section>

               <div className="grid items-start gap-6 lg:grid-main-aside lg:gap-7">
                    <section aria-labelledby="t-avancee" className="card flex flex-col gap-6">
                         <h2 id="t-avancee" className="section-title">
                              Avancée
                         </h2>
                         <ol className="m-0 flex list-none flex-col p-0">
                              {steps.map((step, i) => (
                                   <li key={step.title} className="flex gap-4 sm:gap-5">
                                        <div className="flex w-9 flex-none flex-col items-center">
                                             {step.state === "done" && (
                                                  <div className="flex size-8 items-center justify-center border-3 border-ink bg-ink text-white">
                                                       <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            aria-hidden="true"
                                                       >
                                                            <path d="M5 12l5 5 9-10" />
                                                       </svg>
                                                  </div>
                                             )}
                                             {step.state === "current" && (
                                                  <div className="size-9 border-3 border-ink bg-main shadow-brutal-xs" />
                                             )}
                                             {step.state === "todo" && (
                                                  <div className="size-8 border-3 border-dashed border-ink bg-white" />
                                             )}
                                             {i < steps.length - 1 && (
                                                  <div
                                                       className={`min-h-7 flex-1 ${step.state === "done" ? "w-0.75 bg-ink" : "border-l-3 border-dashed border-ink"}`}
                                                  />
                                             )}
                                        </div>
                                        <div
                                             className={`flex flex-col gap-2 pt-1 ${i < steps.length - 1 ? "pb-7" : ""}`}
                                        >
                                             <span className="text-lg font-bold">{step.title}</span>
                                             {"pill" in step && (
                                                  <span className="pill pill-client self-start whitespace-normal">
                                                       {step.pill}
                                                  </span>
                                             )}
                                             <span className="muted text-body-sm">{step.meta}</span>
                                        </div>
                                   </li>
                              ))}
                         </ol>
                    </section>

                    <div className="flex flex-col gap-6 lg:gap-7">
                         <section aria-labelledby="t-docs" className="card flex flex-col gap-4">
                              <h2 id="t-docs" className="section-title">
                                   Vos documents
                              </h2>
                              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                                   {documents.map((doc) => (
                                        <li key={doc.name} className="item flex items-center gap-3.5">
                                             <span className={`pill eyebrow flex-none ${doc.tag}`}>{doc.type}</span>
                                             <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                                  <span className="truncate font-bold">{doc.name}</span>
                                                  <span className="muted text-sm">{doc.date} · PDF</span>
                                             </div>
                                             <a
                                                  href="#"
                                                  aria-label={`Télécharger ${doc.name}`}
                                                  className="btn btn-icon btn-primary btn-sm flex-none shadow-none"
                                             >
                                                  <svg
                                                       width="20"
                                                       height="20"
                                                       viewBox="0 0 24 24"
                                                       fill="none"
                                                       stroke="currentColor"
                                                       strokeWidth="2.4"
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       aria-hidden="true"
                                                  >
                                                       <path d="M12 4v12" />
                                                       <path d="M6 10l6 6 6-6" />
                                                       <path d="M4 20h16" />
                                                  </svg>
                                             </a>
                                        </li>
                                   ))}
                              </ul>
                              <p className="muted m-0 text-sm">
                                   Les nouveaux documents apparaissent ici dès que je les dépose.
                              </p>
                         </section>

                         <section
                              aria-labelledby="t-contact"
                              className="flex flex-col gap-3.5 border-3 border-ink bg-ink p-5 text-white shadow-inverse-lg md:p-6"
                         >
                              <h2 id="t-contact" className="card-title">
                                   Une question ?
                              </h2>
                              <p className="m-0">Je réponds sous 24 h ouvrées.</p>
                              <a
                                   href="mailto:contact@gaeltournier.dev"
                                   className="text-lg font-bold text-bg underline hover:text-white"
                              >
                                   contact@gaeltournier.dev
                              </a>
                              <a
                                   href="tel:+33600000000"
                                   className="text-lg font-bold text-bg underline hover:text-white"
                              >
                                   06 00 00 00 00
                              </a>
                         </section>
                    </div>
               </div>
          </div>
     )
}
