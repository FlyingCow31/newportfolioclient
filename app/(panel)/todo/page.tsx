const groups = [
  {
    title: "Aujourd'hui",
    items: [
      { label: "Relancer pour les textes « À propos »", project: "Boulangerie Lafont", due: "Aujourd'hui", done: false, late: false },
      { label: "Exporter et compresser les photos", project: "Gîtes du Lac", due: "Aujourd'hui", done: false, late: false },
      { label: "Envoyer le devis", project: "Atelier Peinture", due: "Aujourd'hui", done: true, late: false },
    ],
  },
  {
    title: "Cette semaine",
    items: [
      { label: "Finir la maquette de l'accueil", project: "Cabinet Roux", due: "En retard · 08/10", done: false, late: true },
      { label: "Préparer la déclaration URSSAF", project: "", due: "31/10", done: false, late: false },
    ],
  },
  {
    title: "Plus tard",
    items: [{ label: "Mettre à jour le portfolio", project: "", due: "", done: false, late: false }],
  },
];

const projects = ["Aucun projet", "Boulangerie Lafont", "Cabinet Roux", "Gîtes du Lac"];

export default function TodoPage() {
  return (
    <>
      <h1 className="page-title">Todo.</h1>

      <div className="card-sm flex flex-wrap gap-3 p-4">
        <label htmlFor="new-todo" className="sr-only">
          Nouvelle tâche
        </label>
        <input id="new-todo" type="text" placeholder="Nouvelle tâche…" className="field min-w-0 flex-fill" />
        <select aria-label="Projet lié" className="field flex-side">
          {projects.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <button type="button" className="btn btn-primary flex-none shadow-none">
          Ajouter
        </button>
      </div>

      {groups.map((g) => (
        <section key={g.title} className="card flex flex-col gap-2.5">
          <h2 className="section-title mb-1">
            {g.title} <span className="font-sans text-base font-medium text-muted">{g.items.filter((i) => !i.done).length} à faire</span>
          </h2>
          {g.items.map((t) => (
            <div key={t.label} className="item flex flex-wrap items-center gap-x-3.5 gap-y-2.5 py-2.5">
              <label className="flex min-h-8 flex-fill cursor-pointer items-center gap-3 has-checked:text-muted has-checked:line-through">
                <input type="checkbox" defaultChecked={t.done} className="check" />
                {t.label}
              </label>
              {t.project && <span className="pill pill-you">{t.project}</span>}
              {t.due && <span className={`text-caption font-bold ${t.late ? "text-colerr-dark" : "muted"}`}>{t.due}</span>}
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
