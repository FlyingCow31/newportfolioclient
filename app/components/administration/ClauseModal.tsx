"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

const MAX_TEXT = 1024

export default function ClauseModal() {
     const router = useRouter()
     const dialogRef = useRef<HTMLDialogElement>(null)
     const [title, setTitle] = useState("")
     const [text, setText] = useState("")
     const [error, setError] = useState("")

     function open() {
          setTitle("")
          setText("")
          setError("")
          dialogRef.current?.showModal()
     }

     function close() {
          dialogRef.current?.close()
     }

     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault()
          setError("")
          const data = Object.fromEntries(new FormData(e.currentTarget))

          const res = await fetch("/api/clauses/create", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(data),
          })

          if (res.ok) {
               close()
               router.refresh()
          }
          else if (res.status === 409) setError("Une clause porte déjà ce titre.")
          else setError("Impossible d'enregistrer la clause.")
     }

     return (
          <>
               <button
                    type="button"
                    onClick={open}
                    className="link cursor-pointer border-0 bg-transparent p-0 text-body-sm"
               >
                    + Ajouter
               </button>

               <dialog
                    ref={dialogRef}
                    aria-labelledby="h-cl"
                    className="m-auto max-h-dvh w-full max-w-xl overflow-y-auto border-3 border-ink bg-surface p-0 text-ink shadow-brutal-xl backdrop:bg-ink/55"
               >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 sm:p-7">
                         <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1">
                                   <h2 id="h-cl" className="section-title">
                                        Nouvelle clause
                                   </h2>
                                   <span className="muted text-body-sm">
                                        Un texte réutilisable à copier dans vos devis et factures.
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
                              <label htmlFor="cl-key" className="label">
                                   Titre *
                              </label>
                              <input
                                   id="cl-key"
                                   name="clause_key"
                                   type="text"
                                   required
                                   maxLength={110}
                                   value={title}
                                   onChange={(e) => setTitle(e.target.value)}
                                   placeholder="Conditions de paiement"
                                   aria-invalid={error !== ""}
                                   aria-describedby="cl-key-hint"
                                   className={`field ${error ? "border-colerr-dark" : ""}`}
                              />
                              <span
                                   id="cl-key-hint"
                                   className={error ? "text-caption font-bold text-colerr-dark" : "muted text-caption"}
                              >
                                   {error || "Doit être unique : deux clauses ne peuvent pas porter le même titre."}
                              </span>
                         </div>

                         <div className="flex flex-col gap-2">
                              <div className="flex items-baseline justify-between gap-3">
                                   <label htmlFor="cl-text" className="label">
                                        Texte *
                                   </label>
                                   <span
                                        className={`text-caption font-bold ${text.length > MAX_TEXT - 74 ? "text-colerr-dark" : "text-muted"}`}
                                   >
                                        {text.length} / {MAX_TEXT}
                                   </span>
                              </div>
                              <textarea
                                   id="cl-text"
                                   name="clause_text"
                                   required
                                   maxLength={MAX_TEXT}
                                   rows={7}
                                   value={text}
                                   onChange={(e) => setText(e.target.value)}
                                   placeholder="Le paiement est dû à 30 jours à compter de la date de facture…"
                                   className="field leading-normal"
                              />
                         </div>

                         <div className="flex flex-col gap-2">
                              <span className="eyebrow muted">Aperçu dans la bibliothèque</span>
                              <div className="item flex items-center gap-3">
                                   <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                        <strong className="truncate">{title || "Titre de la clause"}</strong>
                                        <span className="muted truncate text-caption">
                                             {text || "Texte de la clause"}
                                        </span>
                                   </div>
                                   <span aria-hidden="true" className="pill pill-ink flex-none">
                                        Copier
                                   </span>
                              </div>
                         </div>

                         <div className="flex flex-wrap justify-end gap-3">
                              <button type="button" onClick={close} className="btn">
                                   Annuler
                              </button>
                              <button type="submit" className="btn btn-primary shadow-accent">
                                   Enregistrer la clause
                              </button>
                         </div>
                    </form>
               </dialog>
          </>
     )
}
