import { Suspense } from "react";
import Link from "next/link";

const clients = [
  { id: "lafont", name: "Boulangerie Lafont", initials: "BL", contact: "Marie Lafont", sub: "1 projet en cours" },
  { id: "roux", name: "Cabinet Roux", initials: "CR", contact: "Paul Roux", sub: "1 projet en cours" },
  { id: "lac", name: "Gîtes du Lac", initials: "GL", contact: "Claire Martin", sub: "1 projet en cours" },
  { id: "dupuis", name: "Garage Dupuis", initials: "GD", contact: "Luc Dupuis", sub: "Maintenance" },
  { id: "peinture", name: "Atelier Peinture", initials: "AP", contact: "Inès Faure", sub: "Aucun projet actif" },
];

const documents = [
  { name: "devis.pdf", date: "09/10" },
  { name: "onboarding.pdf", date: "09/10" },
];

export default function ClientsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="page-title">Clients.</h1>
        <button type="button" className="btn btn-primary">
          + Nouveau client
        </button>
      </header>

      <Suspense fallback={<ClientsView clientId={clients[0].id} />}>
        <SelectedClient searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function SelectedClient({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id = clients[0].id } = await searchParams;
  return <ClientsView clientId={id} />;
}

function ClientsView({ clientId }: { clientId: string }) {
  const current = clients.find((c) => c.id === clientId) ?? clients[0];

  const fields = [
    { label: "Contact", value: current.contact, strong: true },
    { label: "SIRET", value: "123 456 789 00012" },
    { label: "E-mail", value: "contact@boulangerie-lafont.fr", href: "mailto:contact@boulangerie-lafont.fr" },
    { label: "Téléphone", value: "06 00 00 00 00", href: "tel:+33600000000" },
    { label: "Adresse", value: "12 rue de la République, 31770 Colomiers", wide: true },
    { label: "Notes", value: "Préfère être contactée le matin. Accès client envoyé le 01/10.", wide: true },
  ];

  return (
    <div className="grid items-start gap-6 lg:gap-7 xl:grid-aside-main">
      <section aria-label="Liste des clients" className="card flex flex-col gap-3 p-4 md:p-4">
        <label htmlFor="q" className="sr-only">
          Rechercher un client
        </label>
        <input id="q" type="search" placeholder="Rechercher…" className="field" />
        <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 pb-1 xl:flex-col xl:overflow-visible xl:pb-0">
          {clients.map((c) => {
            const active = c.id === current.id;
            return (
              <li key={c.id} className="shrink-0">
                <Link
                  href={`/clients?id=${c.id}`}
                  aria-current={active ? "true" : undefined}
                  className="item flex flex-col gap-0.5 text-ink no-underline current:bg-ink current:text-white"
                >
                  <strong>{c.name}</strong>
                  <span className={`text-sm ${active ? "text-soft" : "muted"}`}>{c.sub}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex flex-col gap-6">
        <section aria-labelledby="h-fiche" className="card flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div aria-hidden="true" className="flex size-15 flex-none items-center justify-center border-3 border-ink bg-main font-display text-2xl text-white">
                {current.initials}
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 id="h-fiche" className="section-title">
                  {current.name}
                </h2>
                <span className="muted text-body-sm">Client n° C-0012 · depuis le 01/10/2026</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button type="button" className="btn btn-sm shadow-none">
                Modifier
              </button>
              <Link href="/client" className="btn btn-sm btn-primary shadow-none">
                Voir comme le client
              </Link>
            </div>
          </div>
          <dl className="m-0 grid gap-x-7 gap-y-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.label} className={`flex flex-col gap-1 ${f.wide ? "sm:col-span-2" : ""}`}>
                <dt className="eyebrow muted">{f.label}</dt>
                <dd className={`m-0 leading-relaxed ${f.strong ? "font-bold" : ""}`}>
                  {f.href ? (
                    <a href={f.href} className="link font-normal">
                      {f.value}
                    </a>
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section aria-labelledby="h-cproj" className="card-sm flex flex-col gap-3">
            <h3 id="h-cproj" className="card-title">Projets</h3>
            <Link href="/projets/3" className="item flex items-center justify-between gap-2.5 text-ink no-underline">
              <strong>Site vitrine</strong>
              <span className="pill pill-client">En attente client</span>
            </Link>
          </section>
          <section aria-labelledby="h-cdocs" className="card-sm flex flex-col gap-3">
            <h3 id="h-cdocs" className="card-title">Documents partagés</h3>
            {documents.map((d) => (
              <div key={d.name} className="flex justify-between text-body-sm">
                <span>{d.name}</span>
                <span className="muted">{d.date}</span>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-dashed">
              + Déposer un document
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
