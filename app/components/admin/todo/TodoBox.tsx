"use client"

import { Client, Projet, Todo } from "@/app/lib/types"
import { useEffect, useRef, useState } from "react"

// workflow of this file: when you press a button, it starts a timer of a few seconds, when it's done it fetches with the array of ID so it updates with the status of the TODO. This is made so that it doesn't make 10 000 calls everytime a TODO is checked/unchecked.
export default function TodoBox({
     t,
     clients,
     projects,
     isLate,
     showDueDate = false,
     onCheckedChange,
}: {
     t: Todo
     clients: Client[]
     projects: Projet[]
     isLate: boolean
     showDueDate?: boolean
     onCheckedChange?: (todoId: number, checked: boolean) => void
}) {
     const [checked, setChecked] = useState(t.todo_done)

     function handleChange(nextChecked: boolean) {
          setChecked(nextChecked)
          onCheckedChange?.(t.todo_id, nextChecked)
     }

     return (
          <div
               key={t.todo_id}
               className={`item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5 ${isLate ? "bg-red-100" : ""}`}
          >
               <label className="flex min-h-8 flex-fill cursor-pointer items-center gap-3 has-checked:text-muted has-checked:line-through">
                    <input
                         type="checkbox"
                         className="check"
                         checked={checked}
                         onChange={(event) => handleChange(event.currentTarget.checked)}
                    />
                    {t.todo_title}
               </label>
               <span className="pill pill-you">
                    {clients.find((c) => c.client_id === projects.find((p) => p.proj_id === t.proj_id)?.client_id)
                         ?.client_bus || "Aucun!"}
               </span>
               <span className={`text-caption font-bold  ${isLate ? "text-red-900" : "muted"}`}>
                    {isLate ? "En retard" : showDueDate ? new Date(t.todo_due).toLocaleDateString("fr-FR") : ""}
               </span>
          </div>
     )
}

export function TodoParent({
     todos,
     lateTodoIds = [],
     clients,
     projects,
     showDueDate = false,
     onCheckListChange,
     onTodoStatusChange,
}: {
     todos: Todo[]
     lateTodoIds?: number[]
     clients: Client[]
     projects: Projet[]
     showDueDate?: boolean
     onCheckListChange?: (checkList: Record<number, boolean>) => void
     onTodoStatusChange?: (todoId: number, checked: boolean) => void
}) {
     const [, setCheckList] = useState<Record<number, boolean>>({})
     const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

     useEffect(() => {
          return () => {
               if (timerRef.current !== null) {
                    clearTimeout(timerRef.current)
               }
          }
     }, [])

     async function saveCheckList(checkList: Record<number, boolean>) {
          const updates = Object.entries(checkList).map(([todoId, checked]) => ({
               todo_id: Number(todoId),
               todo_done: checked,
          }))

          try {
               const response = await fetch("/api/todo/modify", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ updates }),
               })

               if (!response.ok) {
                    throw new Error(`Todo update failed with status ${response.status}`)
               }

               return updates
          } catch (error) {
               console.error("Erreur lors de la mise à jour des tâches.", error)
               return []
          }
     }

     function handleCheckedChange(todoId: number, checked: boolean) {
          setCheckList((current) => {
               const nextCheckList = { ...current, [todoId]: checked }

               if (timerRef.current !== null) {
                    clearTimeout(timerRef.current)
               }

               timerRef.current = setTimeout(async () => {
                    const savedUpdates = await saveCheckList(nextCheckList)
                    savedUpdates.forEach(({ todo_id, todo_done }) => {
                         onTodoStatusChange?.(todo_id, todo_done)
                    })
               }, 2000)

               onCheckListChange?.(nextCheckList)
               return nextCheckList
          })
     }

     return (
          <>
               {todos.map((t) => {
                         const isLate = lateTodoIds.includes(t.todo_id)

                         return (
                              <TodoBox
                                   key={t.todo_id}
                                   t={t}
                                   clients={clients}
                                   projects={projects}
                                   isLate={isLate}
                                   showDueDate={showDueDate}
                                   onCheckedChange={handleCheckedChange}
                              />
                    )
               })}
          </>
     )
}
