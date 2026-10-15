import { Suspense } from "react";
import Link from "next/link";

type Status = "late" | "you" | "client" | "planned";

const projects: {
  id: string;
  name: string;
  client: string;
  step: number;
  stepLabel: string;
  status: Status;
  statusLabel: string;
  due: string;
  activity: string;
}[] = [
  { id: "1", name: "Site vitrine", client: "Cabinet Roux", step: 1, stepLabel: "Maquettes", status: "late", statusLabel: "En retard", due: "08/10", activity: "il y a 4 jours" },
  { id: "2", name: "Refonte", client: "Gîtes du Lac", step: 3, stepLabel: "Contenus", status: "you", statusLabel: "À toi", due: "14/10", activity: "hier" },
  { id: "3", name: "Site vitrine", client: "Boulangerie Lafont", step: 2, stepLabel: "Développement", status: "client", statusLabel: "En attente client", due: "30/10", activity: "il y a 3 jours" },
  { id: "4", name: "Maintenance", client: "Garage Dupuis", step: 1, stepLabel: "Planifié", status: "planned", statusLabel: "Planifié", due: "15/11", activity: "il y a 2 sem." },
];

const filters: { id: "all" | Status; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "late", label: "En retard" },
  { id: "you", label: "À toi" },
  { id: "client", label: "En attente client" },
  { id: "planned", label: "Planifiés" },
];

const finished = ["Site vitrine - Atelier Peinture · livré le 12/09", "Landing - Garage Dupuis · livré le 28/08"];

export default function ProjetsPage({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="page-title">Projets.</h1>
        <button type="button" className="btn btn-primary">
          + Nouveau projet
        </button>
      </header>

      <Suspense fallback={<ProjectsView statut="all" />}>
        <FilteredProjects searchParams={searchParams} />
      </Suspense>

      <details className="border-3 border-ink bg-surface">
        <summary className="flex min-h-13 cursor-pointer items-center px-4 font-bold">Terminés · 6 projets</summary>
        <ul className="muted m-0 flex list-none flex-col gap-2 px-4 pb-4">
          {finished.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </details>
    </>
  );
}

async function FilteredProjects({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const { statut = "all" } = await searchParams;
  return <ProjectsView statut={statut} />;
}

function ProjectsView({ statut }: { statut: string }) {
  const rows = statut === "all" ? projects : projects.filter((p) => p.status === statut);

  return (
    <>
      <nav aria-label="Filtrer par statut" className="flex flex-wrap gap-2.5">
        {filters.map((f) => (
          <Link
            key={f.id}
            href={f.id === "all" ? "/projets" : `/projets?statut=${f.id}`}
            aria-current={statut === f.id ? "true" : undefined}
            className="btn btn-sm current:bg-ink current:text-white current:shadow-inverse-xs"
          >
            {f.label}
            <span className="font-medium">{f.id === "all" ? projects.length : projects.filter((p) => p.status === f.id).length}</span>
          </Link>
        ))}
      </nav>

      <section aria-label="Projets en cours" className="card overflow-x-auto p-0 md:p-0">
        <table className="table min-w-190">
          <thead>
            <tr>
              <th scope="col">Projet</th>
              <th scope="col">Étape</th>
              <th scope="col">Statut</th>
              <th scope="col">Échéance</th>
              <th scope="col">Dernière activité</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/projets/${p.id}`} className="flex flex-col gap-0.5 text-ink no-underline">
                    <strong>{p.name}</strong>
                    <span className="muted text-sm">{p.client}</span>
                  </Link>
                </td>
                <td>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-medium">{p.stepLabel}</span>
                    <div className="grid w-30 grid-cols-4 gap-0.75">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`seg seg-sm ${i < p.step ? "seg-done" : i === p.step && p.status !== "planned" ? `seg-${p.status}` : "seg-todo"}`}
                        />
                      ))}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`pill pill-${p.status}`}>{p.statusLabel}</span>
                </td>
                <td className={`font-bold ${p.status === "late" ? "text-colerr-dark" : ""}`}>{p.due}</td>
                <td className="muted">{p.activity}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="muted text-center">
                  Aucun projet avec ce statut.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}
