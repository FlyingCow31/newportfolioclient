"use client"
import { useRouter } from "next/navigation"

export default function FinishButton({ proj_id }: { proj_id: number }) {
     const router = useRouter()

     async function handleFinish(proj_id: number) {
          const date = new Date()
          const result = await fetch("/api/projects/modify/finish", {
               method: "PATCH",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ data: { proj_id: proj_id, date: date } }),
          })
          if (result.ok) {
               router.refresh()
               router.push("/projets")
          }
     }
     return (
          <button className="btn btn-primary" onClick={() => handleFinish(proj_id)}>
               Terminer
          </button>
     )
}
