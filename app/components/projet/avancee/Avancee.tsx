import type { Avancee } from "@/app/lib/types"
import AvanceeCard from "./AvanceeCard"

function toInputDate(date: Date) {
     const y = date.getFullYear()
     const m = String(date.getMonth() + 1).padStart(2, "0")
     const d = String(date.getDate()).padStart(2, "0")
     return `${y}-${m}-${d}`
}

export default function Avancee({ entry }: { entry: Avancee }) {
     return (
          <AvanceeCard
               avancee_id={entry.avancee_id}
               statut={entry.avancee_statut}
               titre={entry.avancee_titre}
               message={entry.avancee_message ?? ""}
               date={toInputDate(entry.avancee_date)}
          />
     )
}
