import { CheckRedirect } from "@/app/lib/auth"
import { getClients, getProjects, getTodos } from "@/app/lib/data"
import { Todo } from "@/app/lib/types"
import { connection } from "next/server"
import { Suspense } from "react"

export default function TodoPage() {
     return (
          <Suspense fallback={<p>Chargement...</p>}>
               <TodoPageContent />
          </Suspense>
     )
}

export async function TodoPageContent() {
     await CheckRedirect()
     const todos = await getTodos()
     const clients = await getClients()
     const projects = await getProjects()

     await connection()
     const today = new Date()
     const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
     const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

     const late: Todo[] = todos.filter((t) => {
          const dueDate = new Date(t.todo_due)
          return dueDate <= startOfToday
     })
     const dueToday: Todo[] = todos.filter((t) => {
          const dueDate = new Date(t.todo_due)
          return dueDate >= startOfToday && dueDate < startOfTomorrow
     })
     const dueWeek: Todo[] = todos.filter((t) => {
          const dueDate = new Date(t.todo_due)
          const endOfWeek = new Date(startOfToday)
          endOfWeek.setDate(endOfWeek.getDate() + 7)
          return dueDate >= startOfTomorrow && dueDate <= endOfWeek
     })
     const due: Todo[] = todos.filter((t) => {
          const dueDate = new Date(t.todo_due)
          const endOfWeek = new Date(startOfToday)
          endOfWeek.setDate(endOfWeek.getDate() + 7)
          return dueDate >= endOfWeek
     })

     //  TODO: transfer this to client component once backend logic is implemented
     return (
          <>
               <h1 className="page-title">Todo.</h1>

               {/* // TODO Implement Todo creation/deletion */}
               <div className="card-sm flex flex-wrap gap-3 p-4">
                    <label htmlFor="new-todo" className="sr-only">
                         Nouvelle tâche
                    </label>
                    <input
                         id="new-todo"
                         type="text"
                         placeholder="Nouvelle tâche…"
                         className="field min-w-0 flex-fill"
                    />
                    <select aria-label="Projet lié" className="field flex-side">
                         {projects.map((p, i) => (
                              <option key={i}>
                                   {clients.find((c) => c.client_id === p.client_id)?.client_bus || "Aucun!"}
                              </option>
                         ))}
                    </select>
                    <label htmlFor="new-todo-date" className="sr-only">
                         Date d'échéance
                    </label>
                    <input id="new-todo-date" type="date" aria-label="Date d'échéance" className="field flex-side" />
                    <button type="button" className="btn btn-primary flex-none shadow-none">
                         Ajouter
                    </button>
               </div>

               <section className="card flex flex-col gap-2.5">
                    <h2 className="section-title mb-1">
                         Aujourd'hui
                         {dueToday[0] !== undefined && (
                              <span className="font-sans text-base font-medium text-muted">
                                   {" " + dueToday.length} à faire
                              </span>
                         )}
                         {late[0] !== undefined && (
                              <span className="font-sans text-base font-medium text-red-900">
                                   {" " + late.length} tâches urgentes
                              </span>
                         )}
                    </h2>
                    {dueToday[0] === undefined && late[0] === undefined && (
                         <div className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
                              <span className="pill pill-you"> Rien à faire!</span>
                         </div>
                    )}
                    {[...late, ...dueToday].map((t) => {
                         const isLate = late.some((lateTodo) => lateTodo.todo_id === t.todo_id)

                         return (
                              <div
                                   key={t.todo_id}
                                   className={`item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5 ${isLate ? "bg-red-100" : ""}`}
                              >
                                   <label className="flex min-h-8 flex-fill cursor-pointer items-center gap-3 has-checked:text-muted has-checked:line-through">
                                        <input type="checkbox" className="check" />
                                        {t.todo_title}
                                   </label>
                                   <span className="pill pill-you">
                                        {clients.find(
                                             (c) =>
                                                  c.client_id ===
                                                  projects.find((p) => p.proj_id === t.proj_id)?.client_id,
                                        )?.client_bus || "Aucun!"}
                                   </span>
                                   <span className={`text-caption font-bold  ${isLate ? "text-red-900" : "muted"}`}>
                                        {isLate ? "En retard" : ""}
                                   </span>
                              </div>
                         )
                    })}
               </section>

               <section className="card flex flex-col gap-2.5">
                    <h2 className="section-title mb-1">
                         Cette semaine
                         {dueWeek[0] !== undefined && (
                              <span className="font-sans text-base font-medium text-muted">
                                   {" " + dueWeek.length} à faire
                              </span>
                         )}
                    </h2>
                    {dueWeek[0] === undefined && (
                         <div className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
                              <span className="pill pill-you">Rien à faire!</span>
                         </div>
                    )}
                    {dueWeek.map((t) => (
                         <div key={t.todo_id} className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
                              <label className="flex min-h-8 flex-fill cursor-pointer items-center gap-3 has-checked:text-muted has-checked:line-through">
                                   <input type="checkbox" className="check" />
                                   {t.todo_title}
                              </label>
                              <span className="pill pill-you">
                                   {clients.find(
                                        (c) => c.client_id === projects.find((p) => p.proj_id === t.proj_id)?.client_id,
                                   )?.client_bus || "Aucun!"}
                              </span>
                              <span className="text-caption font-bold muted">
                                   {new Date(t.todo_due).toLocaleDateString("fr-FR")}
                              </span>
                         </div>
                    ))}
               </section>

               <section className="card flex flex-col gap-2.5">
                    <h2 className="section-title mb-1">
                         Plus tard
                         {due[0] !== undefined && (
                              <span className="font-sans text-base font-medium text-muted">
                                   {" " + due.length} à faire
                              </span>
                         )}
                    </h2>
                    {due[0] === undefined && (
                         <div className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
                              <span className="pill pill-you">Rien à faire!</span>
                         </div>
                    )}
                    {due.map((t) => (
                         <div key={t.todo_id} className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
                              <label className="flex min-h-8 flex-fill cursor-pointer items-center gap-3 has-checked:text-muted has-checked:line-through">
                                   <input type="checkbox" className="check" />
                                   {t.todo_title}
                              </label>
                              <span className="pill pill-you">
                                   {clients.find(
                                        (c) => c.client_id === projects.find((p) => p.proj_id === t.proj_id)?.client_id,
                                   )?.client_bus || "Aucun!"}
                              </span>
                              <span className="text-caption font-bold muted">
                                   {new Date(t.todo_due).toLocaleDateString("fr-FR")}
                              </span>
                         </div>
                    ))}
               </section>

               <section className="card flex flex-col gap-2.5">
                    <h2 className="section-title mb-1">Terminées</h2>
                    <div className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
                         {todos
                              .filter((t) => t.todo_done == true)
                              .map((t) => (
                                   <div
                                        key={t.todo_id}
                                        className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5"
                                   >
                                        <label className="flex min-h-8 flex-fill cursor-pointer items-center gap-3 text-muted line-through">
                                             {t.todo_title}
                                        </label>
                                        <span className="pill pill-you line-through">
                                             {clients.find(
                                                  (c) =>
                                                       c.client_id ===
                                                       projects.find((p) => p.proj_id === t.proj_id)?.client_id,
                                             )?.client_bus || "Aucun!"}
                                        </span>
                                        <span className="text-caption font-bold muted line-through">
                                             {new Date(t.todo_due).toLocaleDateString("fr-FR")}
                                        </span>
                                   </div>
                              ))}
                    </div>
               </section>
          </>
     )
}
