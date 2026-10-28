import { Avancee } from "@/app/lib/types"

function sortAvancees(avancees: Avancee[]) {
     const statusOrder = { termine: 0, en_cours: 1, planifie: 2 }

     return [...avancees].sort((a, b) => {
          const statusDifference =
               (statusOrder[a.avancee_statut as keyof typeof statusOrder] ?? 3) -
               (statusOrder[b.avancee_statut as keyof typeof statusOrder] ?? 3)

          return statusDifference || a.avancee_date.getTime() - b.avancee_date.getTime()
     })
}

function formatState(currentTitle: string) {
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

function findSegment(status: string) {
     switch (status) {
          case "termine":
               return "seg-done"
          case "en_cours":
               return "seg-you"
          case "attente_client":
               return "seg-client"
          default:
               return "seg-todo"
     }
}

export function AdminProgression({ avancee }: { avancee: Avancee[] }) {
     const sortedAvancees = sortAvancees(avancee)

     return (
          <ol className="m-0 grid list-none grid-cols-2 gap-x-2.5 gap-y-5 p-0 sm:grid-cols-4">
               {sortedAvancees.map((step) => (
                    <li key={step.avancee_id} className="flex flex-col gap-2">
                         <div className={`seg ${findSegment(step.avancee_statut)}`} />
                         <strong className="text-body-sm">{formatState(step.avancee_etape)}</strong>
                         <span className="muted text-caption">{step.avancee_titre}</span>
                    </li>
               ))}
          </ol>
     )
}
