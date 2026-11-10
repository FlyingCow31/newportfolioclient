import AvForm from "@/app/components/projet/avancee/Form"
import { sql } from "@/app/lib/db"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

async function GetEtapes(id: number): Promise<string[]> {
     const projet = await sql`SELECT proj_type FROM projet WHERE proj_id = ${id}`

     if (projet[0]?.proj_type === "maintenance") {
          return ["1. Prise en charge", "2. Diagnostic", "3. Intervention", "4. Vérification"]
     }

     return ["1. Démarrage", "2. Développement", "3. SEO", "4. Mise en ligne"]
}

export async function generateStaticParams() {
     return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }]
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
