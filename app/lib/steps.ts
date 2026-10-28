export const STEP_TEMPLATES = {
  site: [
    { key: "demarrage", label: "Démarrage" },
    { key: "dev", label: "Développement" },
    { key: "seo", label: "Référencement (SEO)" },
    { key: "mel", label: "Mise en ligne" },
  ],
  maintenance: [
    { key: "diagnostic", label: "Diagnostic" },
    { key: "intervention", label: "Intervention" },
    { key: "recette", label: "Vérification" },
  ],
} as const;

export type ProjectType = keyof typeof STEP_TEMPLATES;
