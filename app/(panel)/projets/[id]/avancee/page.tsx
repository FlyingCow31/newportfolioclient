import Link from "next/link";

const statuses = [
  { value: "done", label: "Terminé", checked: "has-checked:bg-ink has-checked:text-white" },
  { value: "doing", label: "En cours", checked: "has-checked:bg-soft" },
  { value: "client", label: "En attente client", checked: "has-checked:bg-main has-checked:text-white" },
  { value: "planned", label: "Planifié", checked: "has-checked:bg-white" },
];

const etapes = ["1. Démarrage", "2. Développement", "3. SEO", "4. Mise en ligne"];

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
}

export default async function AvanceePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/55 p-4 sm:p-8">
      <div role="dialog" aria-modal="true" aria-labelledby="h-modal" className="card flex w-full max-w-150 flex-col gap-5 shadow-brutal-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="h-modal" className="section-title">Nouvelle avancée</h2>
            <span className="muted text-body-sm">Site vitrine · Boulangerie Lafont</span>
          </div>
          <Link href={`/projets/${id}`} aria-label="Fermer" className="btn btn-icon btn-sm flex-none shadow-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="f-etape" className="label">
            Étape
          </label>
          <select id="f-etape" defaultValue={etapes[1]} className="field">
            {etapes.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>

        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className="label mb-2 p-0">Statut</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {statuses.map((s) => (
              <label
                key={s.value}
                className={`btn btn-sm cursor-pointer shadow-none has-checked:shadow-brutal-sm has-focus-visible:outline-3 has-focus-visible:outline-main ${s.checked}`}
              >
                <input type="radio" name="statut" value={s.value} defaultChecked={s.value === "client"} className="sr-only" />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="f-titre" className="label">
            Titre
          </label>
          <input id="f-titre" type="text" defaultValue="Textes « À propos » à envoyer" className="field" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="f-msg" className="label">
            Message
          </label>
          <textarea
            id="f-msg"
            rows={3}
            defaultValue="J'ai besoin de 3 à 5 lignes sur votre histoire et 2 photos de l'équipe."
            className="field"
          />
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="f-date" className="label">
              Date
            </label>
            <input id="f-date" type="date" defaultValue="2026-10-10" className="field" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="label">Pièce jointe</span>
            <button type="button" className="btn btn-sm btn-dashed min-h-12">
              + Ajouter un document
            </button>
          </div>
        </div>

        <div className="group item flex flex-col gap-2.5">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span className="flex flex-col gap-0.5">
              <strong>Visible par le client</strong>
              <span className="muted text-sm">Le titre et le message apparaîtront sur son espace.</span>
            </span>
            <input type="checkbox" role="switch" defaultChecked className="switch-input sr-only" />
            <span aria-hidden="true" className="switch" />
          </label>
          <div className="hidden flex-col gap-1.5 border-t-2 border-dashed border-ink pt-2.5 group-has-checked:flex">
            <span className="eyebrow muted">Aperçu côté client</span>
            <span className="text-body-sm">
              <strong>J&apos;ai besoin de vous</strong> · Textes « À propos » à envoyer
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Link href={`/projets/${id}`} className="btn">
            Annuler
          </Link>
          <button type="button" className="btn btn-primary shadow-accent">
            Publier l&apos;avancée
          </button>
        </div>
      </div>
    </div>
  );
}
