"use client"
async function handleDelete(client_id: number) {
     const response = await fetch("/api/auth/client/delete", {
          method: "DELETE",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { client_id } }),
     })

     if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error ?? "Erreur avec le serveur")
     }
}

export default function DeleteButton({ client_id }: { client_id: number }) {
     return (
          <button onClick={() => handleDelete(client_id)} className="text-red-900 text-xl cursor-pointer">
               X
          </button>
     )
}
