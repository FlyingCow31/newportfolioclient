"use client"

import { stepLabel, stepNumber } from "@/app/lib/steps"
import { Avancee, ProjectProps } from "@/app/lib/types"
import React from "react"
import { sortAvancees } from "../admin/project"

// Sort by their date attribute (user's input in admin panel)

export function Progression({ projet, avancee }: ProjectProps) {
     // Header calculations
     const proj_date = projet?.proj_deadline?.toLocaleDateString("fr-FR").toString()
     const visibleSteps = avancee?.filter((item) => item.avancee_visible_client)

     const stepIndex = visibleSteps?.length ?? 0
     const currentItem =
          visibleSteps?.find((item) => item.avancee_statut == "en_cours") ||
          visibleSteps?.find((item) => item.avancee_statut == "attente_client")
     const currentTitle = currentItem?.avancee_etape as string

     // TODO: make the dashed line move
     function timeLineCreation(avancee: Avancee) {
          switch (avancee.avancee_statut) {
               case "termine":
                    return <div className="seg seg-done" />
               case "en_cours":
                    return <div className="seg seg-client" />
               case "planifie":
                    return <div className="seg seg-todo" />
               default:
                    return <div className="seg seg-late" />
          }
     }

     // Sorting the array to make it chronological ()
     const sortedAvancee = sortAvancees(visibleSteps ?? [], projet?.proj_type ?? "site")

     console.log(stepIndex)

     return (
          <>
               <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                         <span className="muted text-body-sm font-medium">{projet?.proj_nom.toUpperCase()}</span>
                         <h2 className="section-title">
                              Étape {stepNumber(projet?.proj_type ?? "site", currentTitle)} sur {stepIndex} -{" "}
                              {stepLabel(projet?.proj_type ?? "site", currentTitle)}
                         </h2>
                    </div>
                    <div className="flex flex-col gap-1 sm:items-end">
                         <span className="muted text-sm font-medium">Livraison prévue</span>
                         <span className="card-title">{proj_date}</span>
                    </div>
               </div>
               <div
                    role="img"
                    aria-label={`Avancement: Etape ${stepNumber(projet?.proj_type ?? "site", currentTitle)} sur ${stepIndex}`}
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${stepIndex}, minmax(0, 1fr))` }}
               >
                    {sortedAvancee.map((av, index) => {
                         return <React.Fragment key={index}>{timeLineCreation(av)}</React.Fragment>
                    })}
               </div>
          </>
     )
}

export function StepTable({ avancee, projet }: ProjectProps) {
     function getStepBox(avancee: Avancee) {
          switch (avancee.avancee_statut) {
               case "termine":
                    return (
                         <div className="flex size-8 items-center justify-center border-3 border-ink bg-ink text-white">
                              <svg
                                   width="18"
                                   height="18"
                                   viewBox="0 0 24 24"
                                   fill="none"
                                   stroke="currentColor"
                                   strokeWidth="3"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   aria-hidden="true"
                              >
                                   <path d="M5 12l5 5 9-10" />
                              </svg>
                         </div>
                    )
               case "en_cours":
                    return <div className="size-9 border-3 border-ink bg-main shadow-brutal-xs" />
               case "planifie":
                    return <div className="size-8 border-3 border-dashed border-ink bg-white" />
               default:
                    return <div className="size-8 border-3 border-dashed border-ink bg-colerr" />
          }
     }

     const sortedAvancee = sortAvancees(
          (avancee ?? []).filter((a) => a.avancee_visible_client),
          projet?.proj_type ?? "site",
     )
     return (
          <>
               <ol className="m-0 flex list-none flex-col p-0">
                    {sortedAvancee.map((step, i) => (
                         <li key={i} className="flex gap-4 sm:gap-5">
                              <div className="flex w-9 flex-none flex-col items-center">
                                   {getStepBox(step)}
                                   {i < sortedAvancee.length - 1 && (
                                        <div
                                             className={`min-h-7 flex-1 ${step.avancee_statut === "termine" ? "w-0.75 bg-ink" : "border-l-3 border-dashed border-ink"}`}
                                        />
                                   )}
                              </div>
                              <div className={`flex flex-col gap-2 pt-1 ${i < sortedAvancee.length - 1 ? "pb-7" : ""}`}>
                                   <span className="text-lg font-bold">{step.avancee_titre}</span>
                                   {step.avancee_statut === "attente_client" && (
                                        <span className="pill pill-client self-start whitespace-normal">
                                             Besoin de vous!
                                        </span>
                                   )}
                                   <span className="muted text-body-sm">{step.avancee_message}</span>
                              </div>
                         </li>
                    ))}
               </ol>
          </>
     )
}

// TODO: add download logic
export function DocumentSection({ documents }: ProjectProps) {
     return (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
               {documents?.map((doc) => (
                    <li key={doc.document_nom} className="item flex items-center gap-3.5">
                         <span
                              className={`pill eyebrow flex-none ${doc.document_type === "onboarding" ? "bg-main" : doc.document_type === "devis" ? "bg-sec" : "bg-bg"}`}
                         >
                              {doc.document_type}
                         </span>
                         <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                              <span className="truncate font-bold">{doc.document_nom}</span>
                              <span className="muted text-sm">
                                   {doc.document_created_at.toLocaleDateString("fr-FR").toString()} · PDF
                              </span>
                         </div>
                         <a
                              href="#"
                              aria-label={`Télécharger ${doc.document_nom}`}
                              className="btn btn-icon btn-primary btn-sm flex-none shadow-none"
                         >
                              <svg
                                   width="20"
                                   height="20"
                                   viewBox="0 0 24 24"
                                   fill="none"
                                   stroke="currentColor"
                                   strokeWidth="2.4"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   aria-hidden="true"
                              >
                                   <path d="M12 4v12" />
                                   <path d="M6 10l6 6 6-6" />
                                   <path d="M4 20h16" />
                              </svg>
                         </a>
                    </li>
               ))}
          </ul>
     )
}
