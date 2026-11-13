"use client"

import { Check, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DeleteAvancee } from "../../admin/projets/DeleteButton"

const STATUSES = [
     { value: "en_cours", label: "En cours", pill: "pill-you" },
     { value: "attente_client", label: "En attente", pill: "pill-client" },
     { value: "planifie", label: "Planifiée", pill: "pill-planned" },
     { value: "termine", label: "Terminée", pill: "pill-done" },
]

type Props = {
     avancee_id: number
     statut: string
     titre: string
     message: string
     date: string
}

function displayDate(date: string) {
     return date.split("-").reverse().join("/")
}

export default function AvanceeCard({ avancee_id, statut, titre, message, date }: Props) {
     const router = useRouter()
     const [editing, setEditing] = useState(false)
     const [saving, setSaving] = useState(false)
     const [error, setError] = useState("")
     const [form, setForm] = useState({ statut, titre, message, date })

     const status = STATUSES.find((s) => s.value === statut) ?? STATUSES[2]

     function startEditing() {
          setForm({ statut, titre, message, date })
          setError("")
          setEditing(true)
     }

     async function save() {
          if (!form.titre.trim()) {
               setError("Le titre est obligatoire.")
               return
          }
          setSaving(true)
          setError("")
          try {
               const response = await fetch("/api/projects/avancee/modify", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ avancee_id, ...form }),
               })
               if (!response.ok) {
                    const data = await response.json().catch(() => null)
                    setError(data?.error ?? "Impossible d'enregistrer les modifications.")
                    return
               }
               setEditing(false)
               router.refresh()
          } catch {
               setError("Impossible d'enregistrer les modifications.")
          } finally {
               setSaving(false)
          }
     }

     return (
          <li className="item flex flex-col gap-2 p-4">
               <div className="flex flex-wrap items-center gap-2">
                    {editing ? (
                         <select
                              aria-label="Statut"
                              value={form.statut}
                              onChange={(e) => setForm({ ...form, statut: e.target.value })}
                              className="field min-h-10 py-0"
                         >
                              {STATUSES.map((s) => (
                                   <option key={s.value} value={s.value}>
                                        {s.label}
                                   </option>
                              ))}
                         </select>
                    ) : (
                         <span className={`pill ${status.pill}`}>{status.label}</span>
                    )}

                    {editing ? (
                         <input
                              type="date"
                              aria-label="Date"
                              value={form.date}
                              onChange={(e) => setForm({ ...form, date: e.target.value })}
                              className="field ml-auto min-h-10 py-0"
                         />
                    ) : (
                         <span className="muted ml-auto text-caption">{displayDate(date)}</span>
                    )}

                    <button
                         type="button"
                         onClick={editing ? save : startEditing}
                         disabled={saving}
                         aria-label={editing ? "Valider les modifications" : "Modifier l'avancée"}
                         className={`btn btn-icon btn-sm flex-none ${editing ? "bg-colsol" : ""} disabled:opacity-50`}
                    >
                         {editing ? <Check size={18} strokeWidth={3} /> : <Pencil size={18} strokeWidth={2.5} />}
                    </button>

                    {editing && <DeleteAvancee avancee_id={avancee_id} />}
               </div>

               {editing ? (
                    <>
                         <input
                              type="text"
                              aria-label="Titre"
                              required
                              maxLength={110}
                              value={form.titre}
                              onChange={(e) => setForm({ ...form, titre: e.target.value })}
                              className="field font-bold"
                         />
                         <textarea
                              aria-label="Message"
                              rows={3}
                              value={form.message}
                              onChange={(e) => setForm({ ...form, message: e.target.value })}
                              className="field text-body-sm"
                         />
                    </>
               ) : (
                    <>
                         <strong>{titre}</strong>
                         {message && <p className="m-0 text-body-sm">{message}</p>}
                    </>
               )}

               {error && (
                    <span role="alert" className="text-caption font-bold text-colerr-dark">
                         {error}
                    </span>
               )}
          </li>
     )
}
