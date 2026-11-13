import AvForm from "@/app/components/projet/avancee/Form"
import { getProject } from "@/app/lib/data"
import { type ProjectType, STEP_TEMPLATES } from "@/app/lib/steps"
import { Projet } from "@/app/lib/types"

import { Suspense } from "react"

async function GetEtapes(id: number): Promise<(typeof STEP_TEMPLATES)[ProjectType]> {
     const projet = await getProject(Number(id))
     const type = (projet?.proj_type ?? "site") as ProjectType
     return STEP_TEMPLATES[type] ?? STEP_TEMPLATES.site
}

export default function AvanceePage({ params }: { params: Promise<{ id: number }> }) {
     return (
          <Suspense fallback={<p>Chargement...</p>}>
               <AvanceePageContent params={params} />
          </Suspense>
     )
}

export async function AvanceePageContent({ params }: { params: Promise<{ id: number }> }) {
     const { id } = await params

     const etapes = await GetEtapes(id)

     return (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/55 p-4 sm:p-8">
               <AvForm id={id} etapes={etapes} />
          </div>
     )
}
