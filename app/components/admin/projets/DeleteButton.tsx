"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteButton({ proj_id }: { proj_id: number }) {
     const router = useRouter()

     async function handleDeletion(proj_id: number) {
          const response = await fetch("/api/projects/delete", {
               method: "DELETE",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ data: { proj_id: proj_id } }),
          })
          if (!response.ok) {
               setConfirm("Erreur")
               console.log("Erreur avec la suppression du projet.")
          }
          router.push("/projets")
     }
     const [confirm, setConfirm] = useState("X")

     return (
          <button
               className="text-bold text-red-600 cursor-pointer"
               onClick={confirm === "confirmer" ? () => handleDeletion(proj_id) : () => setConfirm("confirmer")}
          >
               {confirm}
          </button>
     )
}
