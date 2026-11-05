"use client"

import { useState } from "react"
import Link from "next/link"
import { STEP_TEMPLATES, type ProjectType } from "@/app/lib/steps"
import { Client } from "@/app/lib/types"

// TODO: if existing, switch the mail sending off
type ClientMode = "existing" | "new"
type Info = { id: number; cle: string; valeur: string }

const clientModes: { id: ClientMode; label: string }[] = [
     { id: "existing", label: "Client existant" },
     { id: "new", label: "Nouveau client" },
]

const projectTypes: { id: ProjectType; label: string }[] = [
     { id: "site", label: "Site" },
     { id: "maintenance", label: "Maintenance" },
]

const choiceClass = "btn btn-sm min-h-12 shadow-none aria-pressed:shadow-brutal-sm"

export default function NewProjectForm({ clients }: { clients: Client[] }) {
     const [clientMode, setClientMode] = useState<ClientMode>("existing")
     const [type, setType] = useState<ProjectType>("site")
     const [access, setAccess] = useState(true)

     // Add informations within the Info Technique section.
     const [infos, setInfos] = useState<Info[]>([
          { id: 1, cle: "Hébergeur", valeur: "Vercel" },
          { id: 2, cle: "Domaine", valeur: "" },
     ])
     const [nextId, setNextId] = useState(3)

     const steps = STEP_TEMPLATES[type]

     function pickClientMode(mode: ClientMode) {
          setClientMode(mode)
          if (mode === "new") setAccess(true)
     }

     // Function that sets the infos.
     function addInfo() {
          setInfos([...infos, { id: nextId, cle: "", valeur: "" }])
          setNextId(nextId + 1)
     }

     function removeInfo(id: number) {
          setInfos(infos.filter((info) => info.id !== id))
     }

     // all values (except infos and Types (Site/Maintenance))
     const [name, setName] = useState("")
     const [surname, setSurname] = useState("")
     const [business, setBusiness] = useState("")
     const [contact, setContact] = useState("")
     const [projectName, setProjectName] = useState("")
     const [deadline, setDeadline] = useState<Date | null>(null)
     const [price, setPrice] = useState<number>(0)

     return (
          <form aria-label="Nouveau projet" className="grid items-start gap-6 lg:gap-7 xl:grid-main-aside">
               <input type="hidden" name="client_mode" value={clientMode} />
               <input type="hidden" name="proj_type" value={type} />

               <div className="flex flex-col gap-6">
                    <section aria-labelledby="h-client" className="card flex flex-col gap-3.5">
                         <h2 id="h-client" className="section-title">
                              Client
                         </h2>
                         <div role="group" aria-label="Type de client" className="grid grid-cols-2 gap-2.5">
                              {clientModes.map((mode) => (
                                   <button
                                        key={mode.id}
                                        type="button"
                                        aria-pressed={clientMode === mode.id}
                                        onClick={() => pickClientMode(mode.id)}
                                        className={`${choiceClass} aria-pressed:bg-main aria-pressed:text-white`}
                                   >
                                        {mode.label}
                                   </button>
                              ))}
                         </div>

                         {clientMode === "existing" ? (
                              <div className="flex flex-col gap-2">
                                   <label htmlFor="np-client" className="label">
                                        Choisir un client
                                   </label>
                                   <select id="np-client" name="client_id" className="field">
                                        {clients.map((c) => (
                                             <option key={c.client_id} value={c.client_id}>
                                                  {c.client_bus ? `${c.client_bus} · ` : ""}
                                                  {c.client_pren} {c.client_nom}
                                             </option>
                                        ))}
                                   </select>
                              </div>
                         ) : (
                              <div className="grid gap-3.5 sm:grid-cols-2">
                                   <div className="flex flex-col gap-2">
                                        <label htmlFor="np-nom" className="label">
                                             Nom
                                        </label>
                                        <input
                                             id="np-nom"
                                             name="client_nom"
                                             type="text"
                                             required
                                             className="field"
                                             value={surname}
                                             onChange={(e) => {
                                                  setSurname(e.target.value)
                                             }}
                                        />
                                   </div>
                                   <div className="flex flex-col gap-2">
                                        <label htmlFor="np-pren" className="label">
                                             Prénom
                                        </label>
                                        <input
                                             id="np-pren"
                                             name="client_pren"
                                             type="text"
                                             required
                                             className="field"
                                             value={name}
                                             onChange={(e) => {
                                                  setName(e.target.value)
                                             }}
                                        />
                                   </div>
                                   <div className="flex flex-col gap-2">
                                        <label htmlFor="np-bus" className="label">
                                             Entreprise
                                        </label>
                                        <input
                                             id="np-bus"
                                             name="client_bus"
                                             type="text"
                                             className="field"
                                             value={business}
                                             onChange={(e) => {
                                                  setBusiness(e.target.value)
                                             }}
                                        />
                                   </div>
                                   <div className="flex flex-col gap-2">
                                        <label htmlFor="np-mail" className="label">
                                             E-mail de contact
                                        </label>
                                        <input
                                             id="np-mail"
                                             name="client_contact_mail"
                                             type="email"
                                             className="field"
                                             value={contact}
                                             onChange={(e) => {
                                                  setContact(e.target.value)
                                             }}
                                        />
                                   </div>
                              </div>
                         )}
                    </section>

                    <section aria-labelledby="h-projet" className="card flex flex-col gap-4.5">
                         <h2 id="h-projet" className="section-title">
                              Projet
                         </h2>
                         <div className="flex flex-col gap-2">
                              <label htmlFor="np-titre" className="label">
                                   Nom du projet
                              </label>
                              <input
                                   id="np-titre"
                                   name="proj_nom"
                                   type="text"
                                   required
                                   placeholder="Site vitrine, Refonte…"
                                   className="field"
                                   value={projectName}
                                   onChange={(e) => {
                                        setProjectName(e.target.value)
                                   }}
                              />
                         </div>
                         <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                              <legend className="label mb-2 p-0">Type de projet</legend>
                              <div role="group" aria-label="Type de projet" className="grid grid-cols-2 gap-2.5">
                                   {projectTypes.map((t) => (
                                        <button
                                             key={t.id}
                                             type="button"
                                             aria-pressed={type === t.id}
                                             value={type}
                                             onClick={() => setType(t.id)}
                                             className={`${choiceClass} aria-pressed:bg-soft`}
                                        >
                                             {t.label}
                                        </button>
                                   ))}
                              </div>
                         </fieldset>
                         <div className="grid gap-3.5 sm:grid-cols-2">
                              <div className="flex flex-col gap-2">
                                   <label htmlFor="np-deadline" className="label">
                                        Livraison prévue
                                   </label>
                                   <input
                                        id="np-deadline"
                                        name="proj_deadline"
                                        type="date"
                                        className="field"
                                        value={deadline ? deadline.toISOString().slice(0, 10) : ""}
                                        onChange={(e) => {
                                             setDeadline(e.target.value ? new Date(`${e.target.value}T00:00:00`) : null)
                                        }}
                                   />
                              </div>
                              <div className="flex flex-col gap-2">
                                   <label htmlFor="np-prix" className="label">
                                        Prix (€)
                                   </label>
                                   <input
                                        id="np-prix"
                                        name="proj_prix"
                                        type="number"
                                        min={0}
                                        step={10}
                                        placeholder="1200"
                                        className="field"
                                        value={price}
                                        onChange={(e) => {
                                             setPrice(Number(e.target.value))
                                        }}
                                   />
                              </div>
                         </div>
                    </section>

                    <section aria-labelledby="h-infos" className="card flex flex-col gap-3">
                         <div className="flex flex-col gap-1">
                              <h2 id="h-infos" className="section-title">
                                   Infos techniques
                                   <span className="muted font-sans text-base font-medium">(facultatif)</span>
                              </h2>
                              <span className="muted text-sm">
                                   Pas de mots de passe ni de clés ici : indiquez plutôt « voir le gestionnaire de mots
                                   de passe ».
                              </span>
                         </div>
                         {infos.map((info) => (
                              <div key={info.id} className="flex items-center gap-2.5">
                                   <input
                                        type="text"
                                        name="info_cle"
                                        aria-label="Clé"
                                        defaultValue={info.cle}
                                        placeholder="Hébergeur"
                                        className="field min-w-0 flex-1"
                                   />
                                   <input
                                        type="text"
                                        name="info_valeur"
                                        aria-label="Valeur"
                                        defaultValue={info.valeur}
                                        placeholder="Vercel"
                                        className="field min-w-0 flex-2"
                                   />
                                   <button
                                        type="button"
                                        aria-label="Supprimer cette info"
                                        onClick={() => removeInfo(info.id)}
                                        className="btn btn-icon btn-sm size-12 flex-none shadow-none"
                                   >
                                        <svg
                                             width="16"
                                             height="16"
                                             viewBox="0 0 24 24"
                                             fill="none"
                                             stroke="currentColor"
                                             strokeWidth="3"
                                             strokeLinecap="round"
                                             aria-hidden="true"
                                        >
                                             <path d="M6 6l12 12M18 6L6 18" />
                                        </svg>
                                   </button>
                              </div>
                         ))}
                         <button type="button" onClick={addInfo} className="btn btn-sm btn-dashed min-h-12">
                              + Ajouter une info
                         </button>
                    </section>
               </div>

               <aside className="flex flex-col gap-6">
                    <section aria-labelledby="h-etapes" className="card flex flex-col gap-3.5">
                         <div className="flex flex-col gap-1">
                              <h2 id="h-etapes" className="card-title">
                                   Étapes
                              </h2>
                              <span className="muted text-sm">Ce que le client verra sur son espace.</span>
                         </div>
                         <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
                              {steps.map((step, i) => (
                                   <li key={step.key} className="flex items-center gap-3">
                                        <span className="flex size-8 flex-none items-center justify-center border-3 border-dashed border-ink bg-white text-sm font-bold">
                                             {i + 1}
                                        </span>
                                        <span className="font-bold">{step.label}</span>
                                   </li>
                              ))}
                         </ol>
                    </section>

                    <section className="border-3 border-ink bg-white p-5 shadow-brutal-lg">
                         <label className="flex cursor-pointer items-center justify-between gap-3">
                              <span className="flex flex-col gap-0.5">
                                   <strong>Créer l&apos;accès client</strong>
                                   <span className="muted text-sm">
                                        {access
                                             ? "Un e-mail d'invitation sera envoyé au client pour choisir son mot de passe."
                                             : "Le client n'aura pas encore accès à son espace."}
                                   </span>
                              </span>
                              <input
                                   type="checkbox"
                                   role="switch"
                                   name="create_access"
                                   checked={access}
                                   onChange={(e) => setAccess(e.target.checked)}
                                   className="switch-input sr-only"
                              />
                              <span aria-hidden="true" className="switch" />
                         </label>
                    </section>

                    <div className="flex flex-col gap-3">
                         <button type="button" className="btn btn-primary min-h-13 w-full shadow-accent">
                              Créer le projet
                         </button>
                         <Link href="/projets" className="btn w-full">
                              Annuler
                         </Link>
                    </div>
               </aside>
          </form>
     )
}
