export type Projet = {
     proj_id: number
     client_id: number
     proj_nom: string
     proj_type: string
     proj_deadline?: Date
     proj_prix: number
     proj_tps_rem: number
     proj_tps_non_rem: number
     proj_info?: {
          cle: string
          valeur: string
     }[]
     proj_created_at: number
     proj_done_at?: number
}
export type Avancee = {
     avancee_id: number
     proj_id?: number
     avancee_etape: string
     avancee_statut: string
     avancee_titre: string
     avancee_message?: string
     avancee_date: Date
     avancee_visible_client: boolean
}

export type Document = {
     document_id: number
     proj_id: number
     document_nom: string
     document_type: string
     document_link: string
     document_visible_client: boolean
     document_created_at: Date
}

export type Client = {
     client_id: number
     client_nom: string
     client_pren: string
     client_bus: string
     client_siret: number
     client_tel: number
     client_contact_mail: string
     client_add: string
     client_created_at: Date
     client_notes: string
}
export type Todo = {
     todo_id: number
     proj_id: number
     todo_title: string
     todo_done: boolean
     todo_due: number
}

export type ProjectProps = {
     projet?: Projet
     avancee?: Avancee[]
     documents?: Document[]
}
export type NextSummary = {
     nbNext: number
     titleNext: string
}
