"use client";

import { useRef, useState } from "react";

type Kind = "rem" | "nonrem";

type Props = {
  projId: number;
  projectLabel: string;
  projPrix: number;
  tpsRem: number;
  tpsNonRem: number;
};

const kinds: { id: Kind; label: string; pressed: string }[] = [
  { id: "rem", label: "Rémunéré", pressed: "aria-pressed:bg-ink aria-pressed:text-white" },
  { id: "nonrem", label: "Non rémunéré", pressed: "aria-pressed:bg-colerr" },
];

const chips = [
  { minutes: 15, label: "+15 min" },
  { minutes: 30, label: "+30 min" },
  { minutes: 60, label: "+1 h" },
  { minutes: 120, label: "+2 h" },
];

function formatDuration(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

function hourlyRate(prixCents: number, minutes: number) {
  if (!minutes) return "-";
  return `${Math.round(prixCents / 100 / (minutes / 60))} €/h`;
}

export default function TimeEntryModal({ projId, projectLabel, projPrix, tpsRem, tpsNonRem }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<Kind>("rem");
  const [total, setTotal] = useState(90);
  const [date, setDate] = useState("");

  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  const remAfter = tpsRem + (kind === "rem" ? total : 0);
  const nonRemAfter = tpsNonRem + (kind === "nonrem" ? total : 0);

  function open() {
    setKind("rem");
    setTotal(90);
    setDate(new Date().toISOString().slice(0, 10));
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function changeHours(value: string) {
    const h = Math.max(0, parseInt(value, 10) || 0);
    setTotal(h * 60 + minutes);
  }

  function changeMinutes(value: string) {
    const m = Math.min(59, Math.max(0, parseInt(value, 10) || 0));
    setTotal(hours * 60 + m);
  }

  return (
    <>
      <button type="button" onClick={open} className="btn">
        Saisir du temps
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="h-temps"
        className="m-auto max-h-dvh w-full max-w-xl overflow-y-auto border-3 border-ink bg-surface p-0 text-ink shadow-brutal-xl backdrop:bg-ink/55"
      >
        <form className="flex flex-col gap-5 p-5 sm:p-7">
          <input type="hidden" name="proj_id" value={projId} />
          <input type="hidden" name="tps_type" value={kind} />
          <input type="hidden" name="tps_minutes" value={total} />

          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 id="h-temps" className="section-title">Saisir du temps</h2>
              <span className="muted text-body-sm">{projectLabel}</span>
            </div>
            <button type="button" aria-label="Fermer" onClick={close} className="btn btn-icon btn-sm flex-none shadow-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
            <legend className="label mb-2 p-0">Type de temps</legend>
            <div role="group" aria-label="Type de temps" className="grid grid-cols-2 gap-2.5">
              {kinds.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  aria-pressed={kind === k.id}
                  onClick={() => setKind(k.id)}
                  className={`btn btn-sm min-h-12 shadow-none aria-pressed:shadow-brutal-sm ${k.pressed}`}
                >
                  {k.label}
                </button>
              ))}
            </div>
            <span className="muted text-sm">
              {kind === "rem" ? "Du temps compris dans le prix du projet." : "Du temps passé en plus, non facturé au client."}
            </span>
          </fieldset>

          <div className="flex flex-col gap-2">
            <span className="label">Durée</span>
            <div className="flex items-center gap-3">
              <label className="flex flex-1 items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={hours}
                  onChange={(e) => changeHours(e.target.value)}
                  aria-label="Heures"
                  className="field min-h-13 min-w-0 font-display text-2xl"
                />
                <span className="text-lg font-bold">h</span>
              </label>
              <label className="flex flex-1 items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={59}
                  step={5}
                  value={minutes}
                  onChange={(e) => changeMinutes(e.target.value)}
                  aria-label="Minutes"
                  className="field min-h-13 min-w-0 font-display text-2xl"
                />
                <span className="text-lg font-bold">min</span>
              </label>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button key={c.minutes} type="button" onClick={() => setTotal(total + c.minutes)} className="btn btn-sm min-h-10 shadow-none">
                  {c.label}
                </button>
              ))}
              <button type="button" onClick={() => setTotal(0)} className="btn btn-sm btn-dashed min-h-10 bg-transparent">
                Remettre à zéro
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="t-date" className="label">Date</label>
            <input id="t-date" name="tps_date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field" />
          </div>

          <div className="item flex flex-col gap-2.5 px-4 py-3.5">
            <span className="eyebrow muted">Après l&apos;ajout</span>
            <div className="flex justify-between gap-3 text-body-sm">
              <span>Temps rémunéré</span>
              <span>
                <span className="muted">{formatDuration(tpsRem)}</span> → <strong>{formatDuration(remAfter)}</strong>
              </span>
            </div>
            <div className="flex justify-between gap-3 text-body-sm">
              <span>Temps non rémunéré</span>
              <span>
                <span className="muted">{formatDuration(tpsNonRem)}</span> → <strong>{formatDuration(nonRemAfter)}</strong>
              </span>
            </div>
            <div className="flex justify-between gap-3 border-t-2 border-ink pt-2.5 text-body-sm">
              <span>Taux horaire réel</span>
              <span>
                <span className="muted">{hourlyRate(projPrix, tpsRem + tpsNonRem)}</span> →{" "}
                <strong>{hourlyRate(projPrix, remAfter + nonRemAfter)}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button type="button" onClick={close} className="btn">
              Annuler
            </button>
            <button type="button" disabled={!total} className="btn btn-primary shadow-accent disabled:opacity-50">
              Ajouter {total ? formatDuration(total) : ""}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
