"use client"

import { Client, Projet, Todo } from "@/app/lib/types"
import { useMemo, useState } from "react"
import { DeleteTodo } from "@/app/components/admin/projets/DeleteButton"
import { TodoParent } from "@/app/components/admin/todo/TodoBox"

export default function TodoBoard({
     todos: initialTodos,
     clients,
     projects,
}: {
     todos: Todo[]
     clients: Client[]
     projects: Projet[]
}) {
     const [todos, setTodos] = useState(initialTodos)
     const { startOfToday, startOfTomorrow, endOfWeek } = useMemo(() => {
          const today = new Date()
          const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
          const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
          const endOfWeek = new Date(startOfToday)
          endOfWeek.setDate(endOfWeek.getDate() + 7)

          return { startOfToday, startOfTomorrow, endOfWeek }
     }, [])

     const late = useMemo(
          () => todos.filter((t) => new Date(t.todo_due) < startOfToday && !t.todo_done),
          [todos, startOfToday],
     )
     const dueToday = useMemo(
          () =>
               todos.filter(
                    (t) =>
                         !t.todo_done &&
                         new Date(t.todo_due) >= startOfToday &&
                         new Date(t.todo_due) < startOfTomorrow,
               ),
          [todos, startOfToday, startOfTomorrow],
     )
     const dueWeek = useMemo(
          () =>
               todos.filter(
                    (t) =>
                         !t.todo_done &&
                         new Date(t.todo_due) >= startOfTomorrow &&
                         new Date(t.todo_due) <= endOfWeek,
               ),
          [todos, startOfTomorrow, endOfWeek],
     )
     const due = useMemo(
          () => todos.filter((t) => !t.todo_done && new Date(t.todo_due) >= endOfWeek),
          [todos, endOfWeek],
     )
     const completed = todos.filter((t) => t.todo_done)

     function handleTodoStatusChange(todoId: number, checked: boolean) {
          setTodos((current) =>
               current.map((todo) => (todo.todo_id === todoId ? { ...todo, todo_done: checked } : todo)),
          )
     }

     function handleTodoDeleted(todoId: number) {
          setTodos((current) => current.filter((todo) => todo.todo_id !== todoId))
     }

     return (
          <>
               <section className="card flex flex-col gap-2.5">
                    <h2 className="section-title mb-1">
                         Aujourd&apos;hui
                         {dueToday.length > 0 && (
                              <span className="font-sans text-base font-medium text-muted">{" " + dueToday.length} à faire</span>
                         )}
                         {late.length > 0 && (
                              <span className="font-sans text-base font-medium text-red-900">
                                   {" " + late.length} tâches urgentes
                              </span>
                         )}
                    </h2>
                    {late.length === 0 && dueToday.length === 0 && (
                         <div className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
                              <span className="pill pill-you">Rien à faire!</span>
                         </div>
                    )}
                    <TodoParent
                         todos={[...late, ...dueToday]}
                         lateTodoIds={late.map((t) => t.todo_id)}
                         clients={clients}
                         projects={projects}
                         onTodoStatusChange={handleTodoStatusChange}
                    />
               </section>

               <section className="card flex flex-col gap-2.5">
                    <h2 className="section-title mb-1">
                         Cette semaine
                         {dueWeek.length > 0 && (
                              <span className="font-sans text-base font-medium text-muted">{" " + dueWeek.length} à faire</span>
                         )}
                    </h2>
                    {dueWeek.length === 0 && (
                         <div className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
                              <span className="pill pill-you">Rien à faire!</span>
                         </div>
                    )}
                    <TodoParent
                         todos={dueWeek}
                         clients={clients}
                         projects={projects}
                         showDueDate
                         onTodoStatusChange={handleTodoStatusChange}
                    />
               </section>

               <section className="card flex flex-col gap-2.5">
                    <h2 className="section-title mb-1">
                         Plus tard
                         {due.length > 0 && (
                              <span className="font-sans text-base font-medium text-muted">{" " + due.length} à faire</span>
                         )}
                    </h2>
                    {due.length === 0 && (
                         <div className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
                              <span className="pill pill-you">Rien à faire!</span>
                         </div>
                    )}
                    <TodoParent
                         todos={due}
                         clients={clients}
                         projects={projects}
                         showDueDate
                         onTodoStatusChange={handleTodoStatusChange}
                    />
               </section>

               <section className="card flex flex-col gap-2.5">
                    <h2 className="section-title mb-1">Terminées</h2>
                    <div className="item flex flex-wrap items-center gap-x-2.5 py-2.5">
                         {completed.map((todo) => (
                              <div key={todo.todo_id} className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
                                   <label className="flex min-h-8 flex-fill items-center gap-3 text-muted line-through">
                                        {todo.todo_title}
                                   </label>
                                   <span className="pill pill-you line-through">
                                        {clients.find(
                                             (client) =>
                                                  client.client_id ===
                                                  projects.find((project) => project.proj_id === todo.proj_id)?.client_id,
                                        )?.client_bus || "Aucun!"}
                                   </span>
                                   <span className="text-caption font-bold muted line-through">
                                        {new Date(todo.todo_due).toLocaleDateString("fr-FR")}
                                   </span>
                                   <DeleteTodo todo_id={todo.todo_id} onDeleted={handleTodoDeleted} />
                              </div>
                         ))}
                    </div>
               </section>
          </>
     )
}
