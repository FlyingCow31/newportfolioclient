"use client"

import React from "react"
import { useState } from "react"

type Projet = {
     proj_id: number
     client_id: number
     proj_nom: string
     proj_type: string
     proj_deadline?: Date
     proj_prix: number
     proj_tps_rem: number
     proj_tps_non_rem: number
     proj_info?: {
          clé: string
          valeur: string
     }
     proj_created_at: number
     proj_done_at?: number
}
export type Avancee = {
     avancee_id: number
     avancee_etape: string
     avancee_statut: string
     avancee_titre: string
     avancee_message?: string
     avancee_date: Date
     avancee_visible_client: boolean
}

type ProjectProps = {
     projet: Projet
     avancee?: Avancee[]
}

export function Progression({ projet, avancee }: ProjectProps) {
     console.log(projet)
     console.log(avancee)

     // Header calculations
     const proj_date = projet.proj_deadline?.toLocaleDateString("fr-FR").toString()
     const stepIndex = avancee?.length ?? 0
     const currentItem = avancee?.find((item) => item.avancee_statut == "en_cours")
     const currentTitle = currentItem?.avancee_etape as string

     console.log(currentTitle)
     // I just discovered the use of switch statement which I had never found use for, so I just use it everywhere
     function findIndex(title: string) {
          switch (title) {
               case "demarrage":
                    return 1
               case "dev":
                    return 2
               case "seo":
                    return 3
               case "mel":
                    return 4
               default:
                    return 0
          }
     }
     function formatTitle(currentTitle: string) {
          switch (currentTitle) {
               case "demarrage":
                    return "Démarrage"
               case "dev":
                    return "En Développement"
               case "seo":
                    return "Optimisation SEO"
               case "mel":
                    return "Mise en Ligne"
               default:
                    return "Diagnostic"
          }
     }
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
     const sortedAvancee = function (avancee: Avancee[]) {
          return avancee.sort((a, b) => a.avancee_date.getDate() - b.avancee_date.getDate())
     }
     console.log(sortedAvancee(avancee!))

     return (
          <>
               <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                         <span className="muted text-body-sm font-medium">{projet.proj_nom.toUpperCase()}</span>
                         <h2 className="section-title">
                              Étape {findIndex(currentTitle)} sur {stepIndex} - {formatTitle(currentTitle)}
                         </h2>
                    </div>
                    <div className="flex flex-col gap-1 sm:items-end">
                         <span className="muted text-sm font-medium">Livraison prévue</span>
                         <span className="card-title">{proj_date}</span>
                    </div>
               </div>
               <div
                    role="img"
                    aria-label={`Avancement: Etape ${findIndex(currentTitle)} sur ${stepIndex}`}
                    className="grid grid-cols-4 gap-2"
               >
                    {sortedAvancee(avancee ?? []).map((av, index) => {
                         return <React.Fragment key={index}>{timeLineCreation(av)}</React.Fragment>
                    })}
               </div>
          </>
     )
}
