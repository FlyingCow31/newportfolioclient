import { Suspense } from "react"
import Link from "next/link"
import { getClients, getProjects } from "@/app/lib/data"
import { CheckRedirect } from "@/app/lib/auth/auth"

const documents = [
     { name: "devis.pdf", date: "09/10" },
     { name: "onboarding.pdf", date: "09/10" },
]

export default function ClientsPage({ searchParams }: { searchParams: Promise<{ id?: string; q?: string }> }) {
     return (
          <>
               <header className="flex flex-wrap items-end justify-between gap-4">
                    <h1 className="page-title">Clients.</h1>
                    <button type="button" className="btn btn-primary">
                         + Nouveau client
                    </button>
               </header>

               <Suspense fallback={<p>Chargement...</p>}>
                    <SelectedClient searchParams={searchParams} />
               </Suspense>
          </>
     )
}

async function SelectedClient({ searchParams }: { searchParams: Promise<{ id?: string; q?: string }> }) {
     const { id, q = "" } = await searchParams
     return <ClientsView clientId={id} query={q} />
}

async function ClientsView({ clientId, query }: { clientId?: string; query: string }) {
     await CheckRedirect()
     const clients = await getClients()
     const projects = await getProjects()

     const filteredClients = clients.filter((c) => c.client_bus.toLowerCase().includes(query.toLowerCase()))
     const current = clients.find((c) => c.client_id === Number(clientId)) ?? filteredClients[0] ?? clients[0]

     const activeProjects = projects.filter((p) => p.client_id === current.client_id)

     const fields = [
          { label: "Contact", value: current.client_pren + " " + current.client_nom, strong: true },
          { label: "SIRET", value: `${current.client_siret ?? "Aucun SIRET."}` },
          { label: "E-mail", value: `${current.client_contact_mail}`, href: `mailto:${current.client_contact_mail}` },
          { label: "Téléphone", value: `${current.client_tel}`, href: `tel:${current.client_tel}` },
          { label: "Adresse", value: `${current.client_add}`, wide: true },
          { label: "Notes", value: `${current.client_notes ?? "Rien!"}`, wide: true },
     ]

     return (
          <div className="grid items-start gap-6 lg:gap-7 xl:grid-aside-main">
               <section aria-label="Liste des clients" className="card flex flex-col gap-3 p-4 md:p-4">
                    <label htmlFor="q" className="sr-only">
                         Rechercher un client
                    </label>
                    <form method="get">
                         <input
                              id="q"
                              name="q"
                              type="search"
                              placeholder="Rechercher…"
                              defaultValue={query}
                              className="field"
                         />
                    </form>
                    <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 pb-1 xl:flex-col xl:overflow-visible xl:pb-0">
                         {filteredClients.map((c) => {
                              const active = c.client_id === current.client_id

                              return (
                                   <li key={c.client_id} className="shrink-0">
                                        <Link
                                             href={`/clients?id=${c.client_id}`}
                                             aria-current={active ? "true" : undefined}
                                             className="item flex flex-col gap-0.5 text-ink no-underline current:bg-ink current:text-white"
                                        >
                                             <strong>{c.client_bus}</strong>
                                             <span className={`text-sm ${active ? "text-soft" : "muted"}`}>
                                                  {projects.find((p) => p.client_id === c.client_id)?.proj_nom}
                                             </span>
                                        </Link>
                                   </li>
                              )
                         })}
                    </ul>
               </section>

               <div className="flex flex-col gap-6">
                    <section aria-labelledby="h-fiche" className="card flex flex-col gap-5">
                         <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                   <div
                                        aria-hidden="true"
                                        className="flex size-15 flex-none items-center justify-center border-3 border-ink bg-main font-display text-2xl text-white"
                                   >
                                        {current.client_nom.slice(0, 1) + current.client_pren.slice(0, 1)}
                                   </div>
                                   <div className="flex flex-col gap-0.5">
                                        <h2 id="h-fiche" className="section-title">
                                             {current.client_bus}
                                        </h2>
                                        <span className="muted text-body-sm">
                                             Client n°{current.client_id} · depuis le
                                             {" " + current.client_created_at.toLocaleDateString("fr-FR")}
                                        </span>
                                   </div>
                              </div>
                              <div className="flex flex-wrap gap-2.5">
                                   <button type="button" className="btn btn-sm shadow-none">
                                        Modifier
                                   </button>
                              </div>
                         </div>
                         <dl className="m-0 grid gap-x-7 gap-y-4 sm:grid-cols-2">
                              {fields.map((f) => (
                                   <div
                                        key={f.label}
                                        className={`flex flex-col gap-1 ${f.wide ? "sm:col-span-2" : ""}`}
                                   >
                                        <dt className="eyebrow muted">{f.label}</dt>
                                        <dd className={`m-0 leading-relaxed ${f.strong ? "font-bold" : ""}`}>
                                             {f.href ? (
                                                  <a href={f.href} className="link font-normal">
                                                       {f.value}
                                                  </a>
                                             ) : (
                                                  f.value
                                             )}
                                        </dd>
                                   </div>
                              ))}
                         </dl>
                    </section>

                    <div className="grid gap-6 md:grid-cols-2">
                         <section aria-labelledby="h-cproj" className="card-sm flex flex-col gap-3">
                              <h3 id="h-cproj" className="card-title">
                                   Projets
                              </h3>
                              {activeProjects.map((p, i) => {
                                   return (
                                        <Link
                                             key={i}
                                             href={`/projets/${p.proj_id}`}
                                             className="item flex items-center justify-between gap-2.5 text-ink no-underline"
                                        >
                                             <strong>{p.proj_nom}</strong>
                                             <span className="pill pill-client">Accèder au projet</span>
                                        </Link>
                                   )
                              })}
                         </section>
                         {/* //TODO add document block */}
                         <section aria-labelledby="h-cdocs" className="card-sm flex flex-col gap-3">
                              <h3 id="h-cdocs" className="card-title">
                                   Documents partagés
                              </h3>
                              {documents.map((d) => (
                                   <div key={d.name} className="flex justify-between text-body-sm">
                                        <span>{d.name}</span>
                                        <span className="muted">{d.date}</span>
                                   </div>
                              ))}
                              {/* // TODO: add the add document logic */}
                              <button type="button" className="btn btn-sm btn-dashed">
                                   + Déposer un document
                              </button>
                         </section>
                    </div>
               </div>
          </div>
     )
}
