import { stepLabel, stepNumber } from "@/app/lib/steps"
import { Avancee } from "@/app/lib/types"

export function sortAvancees(avancees: Avancee[], type: string) {
     return [...avancees].sort(
          (a, b) =>
               stepNumber(type, a.avancee_etape) - stepNumber(type, b.avancee_etape) ||
               a.avancee_date.getTime() - b.avancee_date.getTime(),
     )
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

export function AdminProgression({ avancee, type = "site" }: { avancee: Avancee[]; type: string }) {
     const sortedAvancees = sortAvancees(avancee, type)

     return (
          <ol className="m-0 grid list-none grid-cols-2 gap-x-2.5 gap-y-5 p-0 sm:grid-cols-4">
               {sortedAvancees.map((step) => (
                    <li key={step.avancee_id} className="flex flex-col gap-2">
                         <div className={`seg ${findSegment(step.avancee_statut)}`} />
                         <strong className="text-body-sm">{stepLabel(type, step.avancee_etape)}</strong>
                         <span className="muted text-caption">{step.avancee_titre}</span>
                    </li>
               ))}
          </ol>
     )
}
