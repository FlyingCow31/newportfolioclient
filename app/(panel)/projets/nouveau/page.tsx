import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthUser } from "@/app/lib/auth/auth"
import { getClients } from "@/app/lib/data"
import NewProjectForm from "@/app/components/admin/projets/NewProjectForm"
import { Client } from "@/app/lib/types"

export default function NouveauProjetPage() {
     return (
          <>
               <header className="flex flex-col gap-3.5">
                    <Link href="/projets" className="link self-start text-body-sm no-underline">
                         ← Projets
                    </Link>
                    <h1 className="page-title">Nouveau projet.</h1>
               </header>

               <Suspense fallback={<p className="muted m-0">Chargement…</p>}>
                    <FormWithClients />
               </Suspense>
          </>
     )
}

async function FormWithClients() {
     const session = await AuthUser()
     if (session?.role !== "admin") redirect("/login")

     const clients = (await getClients()) as Client[]

     return <NewProjectForm clients={clients} />
}
