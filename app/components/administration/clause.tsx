"use client"
import type { Clause } from "@/app/lib/types"
import { useRouter } from "next/navigation"
import { useState } from "react"

export type Company = {
     label: string
     value: string
     strong?: boolean
     copy?: boolean
}
export const handleCopy = async (text: string) => {
     try {
          await navigator.clipboard.writeText(text)
     } catch (err) {
          console.error("failed to copy text:", err)
     }
}

export default function Clauses(c: Clause) {
     const [copied, setCopied] = useState(false)

     return (
          <div className="item flex items-center gap-3">
               <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <strong className="text-body-sm">{c.clause_key}</strong>
                    <span className="muted truncate text-caption">{c.clause_text}</span>
               </div>
               <button
                    type="button"
                    className={`btn btn-sm btn-primary flex-none shadow-none ${copied ? "bg-green-700" : ""}`}
                    onClick={() => (
                         void handleCopy(c.clause_text),
                         setCopied(true),
                         setTimeout(() => setCopied(false), 2000)
                    )}
               >
                    {!copied ? "Copier" : "Copié!"}
               </button>
               <DeleteClauseButton clause_id={c.clause_id} />
          </div>
     )
}

export function DeleteClauseButton({ clause_id }: { clause_id: number }) {
     const router = useRouter()
     const [confirm, setConfirm] = useState("X")
     const [isDeleting, setIsDeleting] = useState(false)

     async function handleDeletion() {
          setIsDeleting(true)
          try {
               const response = await fetch("/api/clauses/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: { clause_id } }),
               })

               if (!response.ok) {
                    setConfirm("Erreur")
                    return
               }

               router.refresh()
          } catch (error) {
               console.error("Erreur avec la suppression de la clause.", error)
               setConfirm("Erreur")
          } finally {
               setIsDeleting(false)
          }
     }

     return (
          <button
               type="button"
               disabled={isDeleting}
               aria-label={confirm === "confirmer" ? "Confirmer la suppression de la clause" : "Supprimer la clause"}
               className="btn btn-sm btn-danger flex-none"
               onClick={confirm === "confirmer" ? handleDeletion : () => setConfirm("confirmer")}
          >
               {isDeleting
                    ? "Suppression..."
                    : confirm === "confirmer"
                      ? "Confirmer ?"
                      : confirm === "Erreur"
                        ? "Erreur"
                        : "Supprimer"}
          </button>
     )
}

type InfoEntrepriseProps = {
     company: Company[]
}

export function InfoEntreprise({ company }: InfoEntrepriseProps) {
     const [copied, setCopied] = useState(false)
     return (
          <dl className="m-0 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
               {company.map((c) => (
                    <div key={c.label} className="flex flex-col gap-1">
                         <dt className="eyebrow muted">{c.label}</dt>
                         <dd className={`m-0 flex items-center gap-2 ${c.strong ? "font-bold" : ""}`}>
                              {c.value}
                              {c.copy && (
                                   <button
                                        type="button"
                                        aria-label={`Copier le ${c.label}`}
                                        className={`btn btn-sm size-8 min-h-0 p-0 shadow-none ${copied ? "bg-green-700" : ""}`}
                                        onClick={() => (
                                             void handleCopy(c.value),
                                             setCopied(true),
                                             setTimeout(() => setCopied(false), 2000)
                                        )}
                                   >
                                        <svg
                                             width="14"
                                             height="14"
                                             viewBox="0 0 24 24"
                                             fill="none"
                                             stroke="currentColor"
                                             strokeWidth="2.4"
                                             aria-hidden="true"
                                        >
                                             <rect x="8" y="8" width="13" height="13" />
                                             <path d="M4 16V4h12" />
                                        </svg>
                                   </button>
                              )}
                         </dd>
                    </div>
               ))}
          </dl>
     )
}
