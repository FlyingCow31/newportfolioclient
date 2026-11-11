"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

export type ProjectOption = {
     proj_id: number
     proj_nom: string
}

type Props = {
     projects: ProjectOption[]
     spent: number
     profit: number
}

const categories = ["Outils", "Matériel", "Client refacturé", "Formation", "Autre"]

const euro = (cents: number) =>
     new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(
          cents / 100,
     )

export default function ExpenseModal({ projects, spent, profit }: Props) {
     const router = useRouter()
     const dialogRef = useRef<HTMLDialogElement>(null)
     const formRef = useRef<HTMLFormElement>(null)
     const [category, setCategory] = useState(categories[0])
     const [amount, setAmount] = useState("")
     const [date, setDate] = useState("")

     const cents = Math.max(0, Math.round((parseFloat(amount.replace(",", ".")) || 0) * 100))
     const billed = category === "Client refacturé"

     function open() {
          formRef.current?.reset()
          setCategory(categories[0])
          setAmount("")
          setDate(new Date().toISOString().slice(0, 10))
          dialogRef.current?.showModal()
     }

     function close() {
          dialogRef.current?.close()
     }

     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault()
          const data = Object.fromEntries(new FormData(e.currentTarget))

          const res = await fetch("/api/finances/create", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(data),
          })

          if (res.ok) {
               close()
               router.refresh()
          }
     }

     return (
          <>
               <button type="button" onClick={open} className="btn btn-primary">
                    + Ajouter une dépense
               </button>

               <dialog
                    ref={dialogRef}
                    aria-labelledby="h-dep"
                    className="m-auto max-h-dvh w-full max-w-xl overflow-y-auto border-3 border-ink bg-surface p-0 text-ink shadow-brutal-xl backdrop:bg-ink/55"
               >
                    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 sm:p-7">
                         <input type="hidden" name="depense_categorie" value={category} />
                         <input type="hidden" name="depense_mont" value={cents} />

                         <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1">
                                   <h2 id="h-dep" className="section-title">
                                        Ajouter une dépense
                                   </h2>
                                   <span className="muted text-body-sm">Abonnements, matériel, frais refacturés…</span>
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
                              <label htmlFor="d-label" className="label">
                                   Libellé *
                              </label>
                              <input
                                   id="d-label"
                                   name="depense_label"
                                   type="text"
                                   required
                                   maxLength={110}
                                   placeholder="Abonnement Vercel Pro"
                                   className="field"
                              />
                         </div>

                         <div className="grid gap-3.5 sm:grid-cols-2">
                              <div className="flex flex-col gap-2">
                                   <label htmlFor="d-mont" className="label">
                                        Montant *
                                   </label>
                                   <div className="flex items-center border-2 border-ink bg-white">
                                        <input
                                             id="d-mont"
                                             type="number"
                                             min={0.01}
                                             step={0.01}
                                             required
                                             value={amount}
                                             onChange={(e) => setAmount(e.target.value)}
                                             placeholder="0"
                                             className="min-h-13 min-w-0 flex-1 bg-transparent px-3 font-display text-2xl"
                                        />
                                        <span className="px-3.5 text-lg font-bold">€</span>
                                   </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                   <label htmlFor="d-date" className="label">
                                        Date *
                                   </label>
                                   <input
                                        id="d-date"
                                        name="depense_date"
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="field min-h-14"
                                   />
                              </div>
                         </div>

                         <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                              <legend className="label mb-2 p-0">Catégorie *</legend>
                              <div role="group" aria-label="Catégorie" className="flex flex-wrap gap-2">
                                   {categories.map((c) => (
                                        <button
                                             key={c}
                                             type="button"
                                             aria-pressed={category === c}
                                             onClick={() => setCategory(c)}
                                             className={`btn btn-sm shadow-none aria-pressed:text-white aria-pressed:shadow-brutal-xs ${
                                                  c === "Client refacturé"
                                                       ? "aria-pressed:bg-main"
                                                       : "aria-pressed:bg-ink"
                                             }`}
                                        >
                                             {c}
                                        </button>
                                   ))}
                              </div>
                         </fieldset>

                         <div className="flex flex-col gap-2">
                              <label htmlFor="d-proj" className="label">
                                   Projet lié{" "}
                                   <span className="muted font-medium">
                                        {billed ? "(obligatoire pour une refacturation)" : "(facultatif)"}
                                   </span>
                              </label>
                              <select
                                   id="d-proj"
                                   name="proj_id"
                                   required={billed}
                                   defaultValue=""
                                   className={`field ${billed ? "outline-3 outline-offset-2 outline-main" : ""}`}
                              >
                                   <option value="">Aucun projet</option>
                                   {projects.map((p) => (
                                        <option key={p.proj_id} value={p.proj_id}>
                                             {p.proj_nom}
                                        </option>
                                   ))}
                              </select>
                         </div>

                         <div className="item flex flex-col gap-2.5 px-4 py-3.5">
                              <span className="eyebrow muted">Après l&apos;ajout</span>
                              <div className="flex justify-between gap-3 text-body-sm">
                                   <span>Dépenses de l&apos;année</span>
                                   <span>
                                        <span className="muted">{euro(spent)}</span> →{" "}
                                        <strong>{euro(spent + cents)}</strong>
                                   </span>
                              </div>
                              <div className="flex justify-between gap-3 border-t-2 border-ink pt-2.5 text-body-sm">
                                   <span>Bénéfice estimé</span>
                                   <span>
                                        <span className="muted">{euro(profit)}</span> →{" "}
                                        <strong>{euro(profit - cents)}</strong>
                                   </span>
                              </div>
                         </div>

                         <div className="flex flex-wrap justify-end gap-3">
                              <button type="button" onClick={close} className="btn">
                                   Annuler
                              </button>
                              <button type="submit" className="btn btn-primary shadow-accent">
                                   Ajouter la dépense
                              </button>
                         </div>
                    </form>
               </dialog>
          </>
     )
}
