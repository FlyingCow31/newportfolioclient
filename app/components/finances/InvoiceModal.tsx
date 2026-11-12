"use client"

import { Projet } from "@/app/lib/types"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

const terms = [15, 30, 45]

function addDays(date: string, days: number) {
     if (!date) return ""
     const d = new Date(`${date}T12:00:00`)
     d.setDate(d.getDate() + days)
     return d.toISOString().slice(0, 10)
}

export default function InvoiceModal({ projects }: { projects: Projet[] }) {
     const router = useRouter()
     const dialogRef = useRef<HTMLDialogElement>(null)
     const formRef = useRef<HTMLFormElement>(null)
     const [projId, setProjId] = useState("")
     const [amount, setAmount] = useState("")
     const [hours, setHours] = useState("")
     const [issued, setIssued] = useState("")
     const [term, setTerm] = useState<number | null>(30)
     const [due, setDue] = useState("")
     const [error, setError] = useState("")

     const cents = Math.max(0, Math.round((parseFloat(amount.replace(",", ".")) || 0) * 100))
     const minutes =
          hours === "" ? "" : String(Math.max(0, Math.round((parseFloat(hours.replace(",", ".")) || 0) * 60)))

     function pickProject(id: string) {
          setProjId(id)
          const p = projects.find((proj) => String(proj.proj_id) === id)
          if (!p) return
          setAmount(String(p.proj_prix / 100))
          setHours(p.proj_tps_rem ? String(p.proj_tps_rem / 60) : "")
     }

     function changeIssued(value: string) {
          setIssued(value)
          if (term) setDue(addDays(value, term))
     }

     function pickTerm(days: number) {
          setTerm(days)
          setDue(addDays(issued, days))
     }

     function open() {
          formRef.current?.reset()
          const today = new Date().toISOString().slice(0, 10)
          setError("")
          setTerm(30)
          setIssued(today)
          setDue(addDays(today, 30))
          pickProject(projects[0] ? String(projects[0].proj_id) : "")
          dialogRef.current?.showModal()
     }

     function close() {
          dialogRef.current?.close()
     }

     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault()
          setError("")
          const data = Object.fromEntries(new FormData(e.currentTarget))

          const res = await fetch("/api/finances/facture/create", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(data),
          })

          if (res.ok) {
               close()
               router.refresh()
          } else if (res.status === 409) setError("Ce numéro de facture existe déjà.")
          else setError("Impossible d'enregistrer la facture.")
     }

     return (
          <>
               <button
                    type="button"
                    onClick={open}
                    className="link flex-none cursor-pointer border-0 bg-transparent p-0 text-body-sm"
               >
                    + Ajouter
               </button>

               <dialog
                    ref={dialogRef}
                    aria-labelledby="h-fa"
                    className="m-auto max-h-dvh w-full max-w-xl overflow-y-auto border-3 border-ink bg-surface p-0 text-ink shadow-brutal-xl backdrop:bg-ink/55"
               >
                    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4.5 p-5 sm:p-7">
                         <input type="hidden" name="facture_mont" value={cents} />
                         <input type="hidden" name="facture_temps" value={minutes} />

                         <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1">
                                   <h2 id="h-fa" className="section-title">
                                        Nouvelle facture
                                   </h2>
                                   <span className="muted text-body-sm">
                                        Reportez ici une facture émise depuis votre outil de facturation.
                                   </span>
                              </div>
                              <button
                                   type="button"
                                   aria-label="Fermer"
                                   onClick={close}
                                   className="btn btn-icon btn-sm flex-none shadow-none"
                              >
                                   <svg
                                        width="18"
                                        height="18"
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

                         <div className="flex flex-col gap-2">
                              <label htmlFor="fa-proj" className="label">
                                   Projet *
                              </label>
                              <select
                                   id="fa-proj"
                                   name="proj_id"
                                   required
                                   value={projId}
                                   onChange={(e) => pickProject(e.target.value)}
                                   className="field"
                              >
                                   {projects.map((p) => (
                                        <option key={p.proj_id} value={p.proj_id}>
                                             {p.proj_nom}
                                        </option>
                                   ))}
                              </select>
                         </div>

                         <div className="grid gap-3.5 sm:grid-cols-2">
                              <div className="flex flex-col gap-2">
                                   <label htmlFor="fa-num" className="label">
                                        Numéro *
                                   </label>
                                   <input
                                        id="fa-num"
                                        name="facture_num"
                                        type="text"
                                        required
                                        maxLength={20}
                                        placeholder="FA20261112-1"
                                        aria-describedby="fa-num-error"
                                        className={`field min-h-13 font-bold ${error ? "border-colerr-dark" : ""}`}
                                   />
                              </div>
                              <div className="flex flex-col gap-2">
                                   <label htmlFor="fa-mont" className="label">
                                        Montant *
                                   </label>
                                   <div className="flex items-center border-2 border-ink bg-white">
                                        <input
                                             id="fa-mont"
                                             type="number"
                                             min={0}
                                             step={0.01}
                                             required
                                             value={amount}
                                             onChange={(e) => setAmount(e.target.value)}
                                             className="min-h-12 min-w-0 flex-1 bg-transparent px-3 font-display text-2xl"
                                        />
                                        <span className="px-3.5 text-lg font-bold">€</span>
                                   </div>
                              </div>
                         </div>
                         {error && (
                              <span
                                   id="fa-num-error"
                                   role="alert"
                                   className="-mt-2 text-caption font-bold text-colerr-dark"
                              >
                                   {error}
                              </span>
                         )}

                         <div className="flex flex-col gap-2">
                              <div className="grid gap-3.5 sm:grid-cols-2">
                                   <div className="flex flex-col gap-2">
                                        <label htmlFor="fa-date" className="label">
                                             Date d&apos;émission *
                                        </label>
                                        <input
                                             id="fa-date"
                                             name="facture_date"
                                             type="date"
                                             required
                                             value={issued}
                                             onChange={(e) => changeIssued(e.target.value)}
                                             className="field"
                                        />
                                   </div>
                                   <div className="flex flex-col gap-2">
                                        <label htmlFor="fa-due" className="label">
                                             Échéance *
                                        </label>
                                        <input
                                             id="fa-due"
                                             name="facture_pay_deadline"
                                             type="date"
                                             required
                                             min={issued}
                                             value={due}
                                             onChange={(e) => {
                                                  setDue(e.target.value)
                                                  setTerm(null)
                                             }}
                                             className="field"
                                        />
                                   </div>
                              </div>
                              <div
                                   role="group"
                                   aria-label="Délai de paiement"
                                   className="flex flex-wrap items-center gap-2"
                              >
                                   <span className="muted mr-1 text-caption">Échéance à</span>
                                   {terms.map((t) => (
                                        <button
                                             key={t}
                                             type="button"
                                             aria-pressed={term === t}
                                             onClick={() => pickTerm(t)}
                                             className="btn btn-sm min-h-9 shadow-none aria-pressed:bg-ink aria-pressed:text-white"
                                        >
                                             {t} jours
                                        </button>
                                   ))}
                              </div>
                         </div>

                         <div className="flex flex-col gap-2">
                              <label htmlFor="fa-lien" className="label">
                                   Lien vers la facture
                              </label>
                              <input
                                   id="fa-lien"
                                   name="facture_lien"
                                   type="url"
                                   maxLength={1000}
                                   placeholder="https://app.indy.fr/factures/…"
                                   className="field"
                              />
                         </div>

                         <div className="flex flex-col gap-2">
                              <label htmlFor="fa-tps" className="label">
                                   Temps facturé <span className="muted font-medium">(facultatif)</span>
                              </label>
                              <div className="flex flex-wrap items-center gap-2.5">
                                   <input
                                        id="fa-tps"
                                        type="number"
                                        min={0}
                                        step={0.25}
                                        value={hours}
                                        onChange={(e) => setHours(e.target.value)}
                                        className="field w-30 font-bold"
                                   />
                                   <span className="font-bold">h</span>
                                   <span className="muted text-caption">
                                        Pré-rempli avec le temps rémunéré du projet.
                                   </span>
                              </div>
                         </div>

                         <div className="mt-1 flex flex-wrap justify-end gap-3">
                              <button type="button" onClick={close} className="btn">
                                   Annuler
                              </button>
                              <button type="submit" className="btn btn-primary shadow-accent">
                                   Enregistrer la facture
                              </button>
                         </div>
                    </form>
               </dialog>
          </>
     )
}
