import { formatTitle, TranslateAI } from "@/app/(panel)/projets/page"
import type { Avancee } from "@/app/lib/types"
import { DeleteAvancee } from "../../admin/projets/DeleteButton"

export default function Avancee({ entry }: { entry: Avancee }) {
     return (
          <li key={entry.avancee_id} className="item flex flex-col gap-2 p-4">
               <div className="flex flex-wrap items-center gap-2">
                    {entry.avancee_statut && (
                         <span className={`pill pill-${TranslateAI(entry.avancee_statut)}`}>
                              {formatTitle(entry.avancee_statut)}
                         </span>
                    )}
                    <span className="muted ml-auto text-caption">{entry.avancee_date.toLocaleDateString("fr-FR")}</span>
                    <DeleteAvancee avancee_id={entry.avancee_id} />
               </div>
               <strong>{entry.avancee_titre}</strong>
               {entry.avancee_message && <p className="m-0 text-body-sm">{entry.avancee_message}</p>}
          </li>
     )
}
