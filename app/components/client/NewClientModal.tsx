"use client"

import { useRouter } from "next/navigation"
import React, { useRef, useState } from "react"

const fields = [
     { id: "nc-nom", name: "client_nom", label: "Nom *", type: "text", required: true },
     { id: "nc-pren", name: "client_pren", label: "Prénom *", type: "text", required: true },
     { id: "nc-bus", name: "client_bus", label: "Entreprise", type: "text" },
     {
          id: "nc-siret",
          name: "client_siret",
          label: "SIRET",
          type: "text",
          placeholder: "14 chiffres",
          pattern: "[0-9]{14}",
          inputMode: "numeric" as const,
          maxLength: 14,
     },
     { id: "nc-mail", name: "client_contact_mail", label: "E-mail de contact *", type: "text", required: true },
     { id: "nc-tel", name: "client_tel", label: "Téléphone", type: "tel" },
]

function formatErrorMessage(error: unknown): string {
     if (typeof error === "string") return error
     if (Array.isArray(error)) {
          return error
               .map((item) => formatErrorMessage(item))
               .filter(Boolean)
               .join(" ")
     }
     if (error && typeof error === "object") {
          if ("message" in error && typeof error.message === "string") return error.message
          return JSON.stringify(error)
     }
     return "Une erreur est survenue."
}

export default function NewClientModal() {
     const dialogRef = useRef<HTMLDialogElement>(null)
     const formRef = useRef<HTMLFormElement>(null)
     const router = useRouter()
     const [access, setAccess] = useState(false)
     const [error, setError] = useState<string[]>([])

     function open() {
          formRef.current?.reset()
          setAccess(false)
          dialogRef.current?.showModal()
     }

     function close() {
          dialogRef.current?.close()
     }

     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault()
          const data = Object.fromEntries(new FormData(e.currentTarget))
          const payload = {
               ...data,
               ...(data.client_siret ? { client_siret: data.client_siret } : { client_siret: null }),
               ...(data.client_tel ? { client_tel: Number(data.client_tel) } : { client_tel: null }),
          }
          const response = await fetch("/api/auth/client/create", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(payload),
          })
          if (response.ok) {
               close()
               router.push("/clients")
               return
          }

          const content = await response.json()
          setError([formatErrorMessage(content.error)])
     }

     return (
          <>
               <button type="button" onClick={open} className="btn btn-primary">
                    + Nouveau client
               </button>

               <dialog
                    ref={dialogRef}
                    aria-labelledby="h-nc"
                    className="m-auto max-h-dvh w-full max-w-xl overflow-y-auto border-3 border-ink bg-surface p-0 text-ink shadow-brutal-xl backdrop:bg-ink/55"
               >
                    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4.5 p-5 sm:p-7">
                         <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1">
                                   <h2 id="h-nc" className="section-title">
                                        Nouveau client
                                   </h2>
                                   <span className="muted text-body-sm">
                                        Seuls le nom et le prénom sont obligatoires.
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

                         <div className="grid gap-3.5 sm:grid-cols-2">
                              {fields.map(({ id, label, ...input }) => (
                                   <div key={id} className="flex flex-col gap-2">
                                        <label htmlFor={id} className="label">
                                             {label}
                                        </label>
                                        <input id={id} {...input} className="field" />
                                   </div>
                              ))}
                         </div>

                         <div className="flex flex-col gap-2">
                              <label htmlFor="nc-add" className="label">
                                   Adresse
                              </label>
                              <input
                                   id="nc-add"
                                   name="client_add"
                                   type="text"
                                   placeholder="Rue, code postal, ville"
                                   className="field"
                              />
                         </div>

                         <div className="flex flex-col gap-2">
                              <label htmlFor="nc-notes" className="label">
                                   Notes
                              </label>
                              <textarea
                                   id="nc-notes"
                                   name="client_notes"
                                   rows={3}
                                   placeholder="Préférences, contexte…"
                                   className="field"
                              />
                         </div>

                         <div className="item flex flex-col gap-3 px-4 py-3.5">
                              <label className="flex cursor-pointer items-center justify-between gap-3">
                                   <span className="flex flex-col gap-0.5">
                                        <strong>Créer un compte utilisateur</strong>
                                        <span className="muted text-sm">
                                             {access
                                                  ? "Le client recevra ses identifiants par e-mail."
                                                  : "Vous pourrez créer l'accès plus tard, depuis sa fiche."}
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

                              {access && (
                                   <div className="flex flex-col gap-2 border-t-2 border-dashed border-ink pt-3">
                                        <label htmlFor="nc-login" className="label">
                                             E-mail de connexion
                                        </label>
                                        <input
                                             id="nc-login"
                                             name="user_mail"
                                             type="email"
                                             placeholder="Par défaut, l'e-mail de contact"
                                             className="field"
                                        />
                                        <span className="muted text-caption">
                                             Un mot de passe provisoire est généré et envoyé à cette adresse ; le client
                                             le change à sa première connexion.
                                        </span>
                                   </div>
                              )}
                         </div>
                         <div className="flex flex-col gap-1">
                              {error.map((message) => (
                                   <p key={message} className="text-red-600">
                                        {message}
                                   </p>
                              ))}
                         </div>

                         <div className="flex flex-wrap justify-end gap-3">
                              <button type="button" onClick={close} className="btn">
                                   Annuler
                              </button>
                              <button type="submit" className="btn btn-primary shadow-accent">
                                   Créer le client
                              </button>
                         </div>
                    </form>
               </dialog>
          </>
     )
}
