"use client"

import Link from "next/link"
import { useState } from "react"
import { Todo } from "@/app/lib/types"

export default function DashboardTodos({ todos: initialTodos }: { todos: Todo[] }) {
     const [todos, setTodos] = useState(() => [...initialTodos].sort((a, b) => a.todo_due - b.todo_due).slice(0, 3))
     const [savingIds, setSavingIds] = useState<number[]>([])
     const [failedIds, setFailedIds] = useState<number[]>([])

     async function handleTodoChange(todoId: number, todoDone: boolean) {
          const previousTodo = todos.find((todo) => todo.todo_id === todoId)
          if (!previousTodo) return

          setTodos((currentTodos) =>
               currentTodos.map((todo) => (todo.todo_id === todoId ? { ...todo, todo_done: todoDone } : todo)),
          )
          setSavingIds((currentIds) => [...currentIds, todoId])
          setFailedIds((currentIds) => currentIds.filter((id) => id !== todoId))

          try {
               const response = await fetch("/api/todo/modify", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ updates: [{ todo_id: todoId, todo_done: todoDone }] }),
               })

               if (!response.ok) {
                    throw new Error(`Todo update failed with status ${response.status}`)
               }
          } catch (error) {
               console.error("Erreur lors de la mise à jour de la tâche.", error)
               setTodos((currentTodos) =>
                    currentTodos.map((todo) =>
                         todo.todo_id === todoId ? { ...todo, todo_done: previousTodo.todo_done } : todo,
                    ),
               )
               setFailedIds((currentIds) => [...currentIds, todoId])
          } finally {
               setSavingIds((currentIds) => currentIds.filter((id) => id !== todoId))
          }
     }

     return (
          <section aria-labelledby="h-todo" className="card flex flex-col gap-3">
               <div className="flex items-baseline justify-between gap-3">
                    <h2 id="h-todo" className="card-title">
                         Prochaines Todos
                    </h2>
                    <Link href="/todo" className="link text-body-sm">
                         Tout voir
                    </Link>
               </div>
               {todos.length > 1 ? (
                    todos.map((todo) => (
                         <label
                              key={todo.todo_id}
                              className="flex min-h-10 cursor-pointer items-center gap-3 text-body-sm has-checked:text-muted has-checked:line-through"
                         >
                              <input
                                   type="checkbox"
                                   checked={todo.todo_done}
                                   disabled={savingIds.includes(todo.todo_id)}
                                   onChange={(event) => handleTodoChange(todo.todo_id, event.currentTarget.checked)}
                                   className="check"
                              />
                              {todo.todo_title}
                         </label>
                    ))
               ) : (
                    <p>Aucune todo à gérer!</p>
               )}
               {failedIds.length > 0 && (
                    <p role="alert" className="text-sm text-red-900">
                         Impossible d&apos;enregistrer la tâche. Réessayez.
                    </p>
               )}
          </section>
     )
}
