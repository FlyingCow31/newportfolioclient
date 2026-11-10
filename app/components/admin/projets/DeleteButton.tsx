"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteButton({ proj_id }: { proj_id: number }) {
     const router = useRouter()
     const [confirm, setConfirm] = useState("X")
     const [isDeleting, setIsDeleting] = useState(false)

     async function handleDeletion(proj_id: number) {
          setIsDeleting(true)
          try {
               const response = await fetch("/api/projects/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: { proj_id: proj_id } }),
               })
               if (!response.ok) {
                    setConfirm("Erreur")
                    return
               }
               router.push("/projets")
          } catch (error) {
               console.error("Erreur avec la suppression du projet.", error)
               setConfirm("Erreur")
          } finally {
               setIsDeleting(false)
          }
     }

     return (
          <button
               type="button"
               disabled={isDeleting}
               className="text-bold text-red-600 cursor-pointer"
               onClick={confirm === "confirmer" ? () => handleDeletion(proj_id) : () => setConfirm("confirmer")}
          >
               {isDeleting ? "Suppression..." : confirm}
          </button>
     )
}

export function DeleteAvancee({ avancee_id }: { avancee_id: number }) {
     const router = useRouter()
     const [confirm, setConfirm] = useState("X")
     const [isDeleting, setIsDeleting] = useState(false)

     async function handleDeletion(avancee_id: number) {
          setIsDeleting(true)
          try {
               const response = await fetch("/api/projects/avancee/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ data: { avancee_id: avancee_id } }),
               })
               if (!response.ok) {
                    setConfirm("Erreur")
                    return
               }
               router.refresh()
          } catch (error) {
               console.error("Erreur avec la suppression de l'avancee.", error)
               setConfirm("Erreur")
          } finally {
               setIsDeleting(false)
          }
     }

     return (
          <button
               type="button"
               disabled={isDeleting}
               className="text-bold text-red-600 cursor-pointer"
               onClick={confirm === "confirmer" ? () => handleDeletion(avancee_id) : () => setConfirm("confirmer")}
          >
               {isDeleting ? "Suppression..." : confirm}
          </button>
     )
}
