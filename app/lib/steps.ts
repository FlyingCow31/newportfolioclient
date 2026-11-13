export const STEP_TEMPLATES = {
     site: [
          { key: "demarrage", label: "1. Démarrage" },
          { key: "dev", label: "2. Développement" },
          { key: "seo", label: "3. Référencement (SEO)" },
          { key: "mel", label: "4. Mise en ligne" },
     ],
     maintenance: [
          { key: "diagnostic", label: "1. Diagnostic" },
          { key: "intervention", label: "2. Intervention" },
          { key: "recette", label: "3. Vérification" },
     ],
} as const

export type ProjectType = keyof typeof STEP_TEMPLATES
export type Step = (typeof STEP_TEMPLATES)[ProjectType][number]

export function stepLabel(type: string, key: string) {
     const steps = STEP_TEMPLATES[type as ProjectType] ?? STEP_TEMPLATES.site
     return steps.find((s) => s.key === key)?.label ?? key
}

export function stepNumber(type: string, key: string) {
     const steps = STEP_TEMPLATES[type as ProjectType] ?? STEP_TEMPLATES.site
     return steps.findIndex((s) => s.key === key) + 1
}
