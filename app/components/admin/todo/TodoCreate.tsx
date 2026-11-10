"use client"

import { useRouter } from "next/navigation"
import type { FormEvent } from "react"

type Project = {
     proj_id: number
     client_id: string | number
}

type Client = {
     client_id: string | number
     client_bus: string
}

type CreateTodoButtonProps = {
     projects: Project[]
     clients: Client[]
}

export default function CreateTodoButton({ projects, clients }: CreateTodoButtonProps) {
     const router = useRouter()

     async function handleSubmit(event: FormEvent<HTMLFormElement>) {
          event.preventDefault()
          const form = event.currentTarget

          const formData = new FormData(form)
          const response = await fetch("/api/todo/create", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                    proj_id: formData.get("proj_id"),
                    todo_title: formData.get("todo_title"),
                    todo_due: formData.get("todo_due"),
                    todo_done: false,
               }),
          })

          if (!response.ok) {
               console.error("Erreur avec la création de la tâche.")
               return
          }

          form.reset()
          router.refresh()
     }

     return (
          <form onSubmit={handleSubmit} className="card-sm flex flex-wrap gap-3 p-4">
               <label htmlFor="new-todo" className="sr-only">
                    Nouvelle tâche
               </label>
               <input
                    id="new-todo"
                    name="todo_title"
                    type="text"
                    placeholder="Nouvelle tâche…"
                    required
                    className="field min-w-0 flex-fill"
               />
               <select name="proj_id" aria-label="Projet lié" className="field flex-side" required>
                    {projects.map((p) => (
                         <option key={p.proj_id} value={p.proj_id}>
                              {clients.find((c) => c.client_id === p.client_id)?.client_bus || "Aucun!"}
                         </option>
                    ))}
               </select>
               <label htmlFor="new-todo-date" className="sr-only">
                    Date d&apos;échéance
               </label>
               <input
                    id="new-todo-date"
                    name="todo_due"
                    type="date"
                    aria-label="Date d'échéance"
                    required
                    className="field flex-side"
               />
               <button type="submit" className="btn btn-primary flex-none shadow-none">
                    Ajouter
               </button>
          </form>
     )
}
