import { cacheLife, cacheTag } from "next/cache"
import { sql } from "./db"
import { Avancee, Clause, Client, Depense, Invoice, Projet, Todo } from "./types"

function isProjectInfo(value: unknown): value is NonNullable<Projet["proj_info"]> {
     return (
          Array.isArray(value) &&
          value.every(
               (info) =>
                    typeof info === "object" &&
                    info !== null &&
                    "cle" in info &&
                    "valeur" in info &&
                    typeof info.cle === "string" &&
                    typeof info.valeur === "string",
          )
     )
}

function normalizeProjectInfo(value: unknown): Projet["proj_info"] | undefined {
     if (value === null || value === undefined) return undefined

     const parsed = typeof value === "string" ? JSON.parse(value) : value
     if (!isProjectInfo(parsed)) {
          throw new Error("Invalid project information format")
     }

     return parsed
}

// * Get all ([])
// For the two of them, it returns arrays because we need all of them, so they're gonna be in a .map anyway
export async function getProjects(): Promise<Projet[]> {
     "use cache"
     cacheLife("days")
     cacheTag("projets")

     // explaining: p. is an alias defined in the FROM. COALESCE(x, y) returns x or Y, here only X is defined as we only need to check if it's true
     return (await sql`
               SELECT p.*,
               COALESCE((
                    SELECT a.avancee_statut <> 'termine' AND a.avancee_date < CURRENT_DATE
                    FROM avancee a
                    WHERE a.proj_id = p.proj_id
                    ORDER BY a.avancee_date DESC, a.avancee_created_at DESC
                    LIMIT 1
                    ), false) AND p.proj_done_at IS NULL AS proj_late
               FROM projet p
               ORDER BY p.proj_deadline ASC
          `) as Projet[]
}

export async function getClients(): Promise<Client[]> {
     "use cache"
     cacheLife("days")
     cacheTag("clients")

     return (await sql`SELECT * FROM client ORDER BY client_created_at ASC`) as Client[]
}

export async function getAvancees(): Promise<Avancee[]> {
     "use cache"
     cacheLife("hours")
     cacheTag("avancees")

     return (await sql`SELECT * FROM avancee ORDER BY proj_id ASC`) as Avancee[]
}

export async function getTodos(): Promise<Todo[]> {
     "use cache"
     cacheLife("days")
     cacheTag("todos")

     return (await sql`SELECT * FROM todo ORDER BY proj_id ASC`) as Todo[]
}

export async function getInvoices(): Promise<Invoice[]> {
     "use cache"
     cacheLife("max")
     cacheTag("invoices")
     return (await sql`SELECT * FROM facture ORDER BY facture_date DESC`) as Invoice[]
}

export async function getDepenses(): Promise<Depense[]> {
     "use cache"
     cacheLife("max")
     cacheTag("invoices")
     return (await sql`SELECT * FROM depense ORDER BY depense_date DESC`) as Depense[]
}

export async function getClauses(): Promise<Clause[]> {
     "use cache"
     cacheLife("max")
     cacheTag("clauses")
     return (await sql`SELECT * FROM clause ORDER BY clause_id DESC`) as Clause[]
}

// * Get only one
// but for this one, we need only one project (because it's in a /page/[id] format) so I need to return only the first element (SQL returns array)
export async function getProject(proj_id: number): Promise<Projet | undefined> {
     "use cache"
     cacheLife("days")
     cacheTag(`project-n${proj_id}`)

     const projects = (await sql`
                         SELECT *, COALESCE(proj_deadline < CURRENT_DATE AND proj_done_at IS NULL, false) AS proj_late
                         FROM projet
                         WHERE proj_id = ${proj_id}
                         `) as (Projet & { proj_info?: unknown })[]

     const project = projects[0]
     if (!project) return undefined

     return {
          ...project,
          proj_info: normalizeProjectInfo(project.proj_info),
     }
}
// Get Avancees for a particular project
export async function getAvancee(proj_id: number): Promise<Avancee[]> {
     "use cache"
     cacheLife("days")
     cacheTag(`avancee-n${proj_id}`)
     const avancees = await sql`SELECT * FROM avancee WHERE proj_id = ${proj_id}`

     return avancees as Avancee[]
}
export async function getClient(client_id: number): Promise<Client> {
     "use cache"
     cacheLife("days")
     cacheTag(`client-n${client_id}`)

     const client = (await sql`SELECT * FROM client WHERE client_id = ${client_id}`) as Client[]

     return client[0] as Client
}
