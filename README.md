# Panel

Panel de gestion interne pour toute entreprise (plutôt axé micro-entreprise) de professions libérales, avec un espace client pour suivre l'avancée des projets. Style néo-brutaliste, lié à mon style graphique de prédilection.

Production : [panel.gaeltournier.dev](https://panel.gaeltournier.dev)
Dépôt : [github.com/FlyingCow31/newportfolioclient](https://github.com/FlyingCow31/newportfolioclient)

Compte de démonstration :

- Utilisateur : `Test`
- Mot de passe : `Test123@`

---

## Disclaimer : utilisation de l'IA

Ce projet est avant tout un projet backend. La quasi-totalité du front-end a été réalisée avec l'IA, entraînée sur mes projets et sur mon style graphique.
Le backend a été réalisé à 95 % à la main, à l'aide de la documentation, hormis la partie Todo (la gestion des states a été faite par IA ; dans tous les cas, ça se voit).

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack](#stack)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Scripts](#scripts)
- [Structure du projet](#structure-du-projet)
- [Routes API](#routes-api)
- [Rôles et accès](#rôles-et-accès)
- [Déploiement](#déploiement)
- [Contribution](#contribution)
- [Licence](#licence)

---

## Fonctionnalités

### Panel admin

- **Accueil** : vue d'ensemble des projets en cours, échéances et alertes
- **Projets** : suivi des projets, étapes, avancées, temps passé (rémunéré et non rémunéré)
- **Clients** : fiches clients et création des accès à l'espace client
- **Finances** : chiffre d'affaires, factures, dépenses, plafond micro-entreprise
- **Administration** : informations de l'entreprise, échéances, justificatifs, bibliothèque de clauses
- **Monitoring** : certificats SSL et scores Lighthouse des sites livrés
- **Todo** : tâches liées ou non à un projet

### Espace client (`/client`)

- Avancée du projet étape par étape
- Documents et factures
- Changement du mot de passe provisoire à la première connexion (`/reset`)

### Étapes des projets

Les étapes sont définies en dur dans `app/lib/steps.ts` :

| Type          | Étapes                                                      |
| ------------- | ----------------------------------------------------------- |
| `site`        | Démarrage, Développement, Référencement (SEO), Mise en ligne |
| `maintenance` | Diagnostic, Intervention, Vérification                      |

---

## Stack

| Domaine          | Outil                                   |
| ---------------- | --------------------------------------- |
| Framework        | Next.js 16 (App Router, Cache Components) |
| Langage          | TypeScript                              |
| UI               | React 19                                |
| Style            | Tailwind CSS v4                         |
| Base de données  | PostgreSQL (Neon, `@neondatabase/serverless`) |
| Authentification | JWT en cookie httpOnly (`jsonwebtoken`, `jose`), `bcryptjs` |
| Validation       | Zod                                     |
| Rate limiting    | Upstash Redis                           |
| E-mails          | Nodemailer (SMTP)                       |
| Hébergement      | Vercel                                  |

---

## Prérequis

- Node.js 20 ou plus récent
- npm
- Une base PostgreSQL (Neon)
- Une base Upstash Redis
- Un compte SMTP pour l'envoi des e-mails

---

## Installation

```bash
git clone https://github.com/FlyingCow31/newportfolioclient.git
cd newportfolioclient
npm install
cp .env.exemple .env
```

Remplir le fichier `.env` (voir ci-dessous), créer les tables (voir [Base de données](#base-de-données)), puis lancer le serveur de développement :

```bash
npm run dev
```

Le panel est accessible sur [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

Toutes les variables sont listées dans [`.env.exemple`](./.env.exemple).

| Variable                      | Rôle                                                    |
| ----------------------------- | ------------------------------------------------------- |
| `DATABASE_URL`                | URL de connexion à la base Neon                         |
| `DATABASE_URL_POOLED`         | URL poolée de la base Neon (facultative)                |
| `JWT_SECRET`                  | Clé secrète de signature des JWT (chaîne longue et aléatoire) |
| `JWT_EXPIRES_IN`              | Durée de validité du JWT, en secondes                   |
| `KV_REST_API_URL`             | URL de l'API REST Upstash                               |
| `KV_REST_API_TOKEN`           | Token de l'API REST Upstash                             |
| `KV_REST_API_READ_ONLY_TOKEN` | Token Upstash en lecture seule                          |
| `KV_URL`                      | URL Upstash (fournie par l'intégration Vercel)          |
| `REDIS_URL`                   | URL Redis pour le rate limiting                         |
| `SMTP_HOST`                   | Serveur SMTP                                            |
| `SMTP_PORT`                   | Port SMTP (465 en général)                              |
| `SMTP_USER`                   | Utilisateur SMTP (souvent l'adresse e-mail)             |
| `SMTP_PASS`                   | Mot de passe SMTP                                       |
| `PRIV_EMAIL`                  | Adresse d'expédition des e-mails                        |
| `NEXT_PUBLIC_APP_URL`         | URL de l'application (dépréciée)                        |

> Ne jamais versionner le fichier `.env`.

---

## Base de données

Le schéma suit une conception MERISE (dictionnaire de données, MCD, MLD). Les montants sont stockés en centimes et les durées en minutes.

| Table         | Contenu                                                  |
| ------------- | -------------------------------------------------------- |
| `client`      | Clients (personne ou entreprise)                         |
| `utilisateur` | Comptes de connexion (admin ou client)                   |
| `projet`      | Projets, prix, temps passé, infos techniques (JSONB)     |
| `avancee`     | Avancées de chaque étape d'un projet                     |
| `document`    | Documents liés à un projet (devis, onboarding, facture…) |
| `facture`     | Factures émises et leur statut de paiement               |
| `depense`     | Dépenses, liées ou non à un projet                       |
| `site`        | Sites surveillés (SSL, Lighthouse)                       |
| `todo`        | Tâches, liées ou non à un projet                         |
| `clause`      | Clauses réutilisables pour devis et factures             |

### Suppressions en cascade

| Lien                      | Règle      | Effet                                              |
| ------------------------- | ---------- | -------------------------------------------------- |
| `client` → `utilisateur`  | `CASCADE`  | Supprimer un client supprime son compte            |
| `client` → `projet`       | `RESTRICT` | Impossible de supprimer un client qui a des projets |
| `projet` → `document`     | `CASCADE`  | Les documents sont supprimés avec le projet        |
| `projet` → `avancee`      | `CASCADE`  | Les avancées sont supprimées avec le projet        |
| `projet` → `site`         | `CASCADE`  | Le site surveillé est supprimé avec le projet      |
| `projet` → `facture`      | `RESTRICT` | Impossible de supprimer un projet qui a des factures |
| `projet` → `todo`         | `SET NULL` | La tâche reste, sans projet                        |
| `projet` → `depense`      | `SET NULL` | La dépense reste, sans projet                      |
| `document` → `avancee`    | `SET NULL` | L'avancée reste, sans document                     |

### Script de création

À exécuter dans l'éditeur SQL de Neon :

```sql
CREATE TABLE client (
  client_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_nom VARCHAR(110) NOT NULL,
  client_pren VARCHAR(110) NOT NULL,
  client_bus VARCHAR(110),
  client_siret CHAR(14) CHECK (client_siret ~ '^[0-9]{14}$'),
  client_tel VARCHAR(20),
  client_contact_mail VARCHAR(255),
  client_add VARCHAR(255),
  client_notes TEXT,
  client_created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE utilisateur (
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_id INT UNIQUE REFERENCES client(client_id) ON DELETE CASCADE,
  user_mail VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  user_role VARCHAR(10) NOT NULL CHECK (user_role IN ('admin', 'client')),
  user_last_login_at TIMESTAMPTZ,
  user_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (user_role = 'client' AND client_id IS NOT NULL)
    OR (user_role = 'admin' AND client_id IS NULL)
  )
);

CREATE TABLE projet (
  proj_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_id INT NOT NULL REFERENCES client(client_id) ON DELETE RESTRICT,
  proj_nom VARCHAR(110) NOT NULL,
  proj_type VARCHAR(30) NOT NULL DEFAULT 'site',
  proj_deadline DATE,
  proj_prix INT NOT NULL DEFAULT 0 CHECK (proj_prix >= 0),
  proj_tps_rem INT NOT NULL DEFAULT 0 CHECK (proj_tps_rem >= 0),
  proj_tps_non_rem INT NOT NULL DEFAULT 0 CHECK (proj_tps_non_rem >= 0),
  proj_info JSONB NOT NULL DEFAULT '[]',
  proj_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  proj_done_at TIMESTAMPTZ
);

CREATE TABLE document (
  document_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proj_id INT NOT NULL REFERENCES projet(proj_id) ON DELETE CASCADE,
  document_nom VARCHAR(255) NOT NULL,
  document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('devis', 'onboarding', 'facture', 'autre')),
  document_link VARCHAR(1000) NOT NULL,
  document_visible_client BOOLEAN NOT NULL DEFAULT true,
  document_created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE avancee (
  avancee_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proj_id INT NOT NULL REFERENCES projet(proj_id) ON DELETE CASCADE,
  document_id INT REFERENCES document(document_id) ON DELETE SET NULL,
  avancee_etape VARCHAR(30) NOT NULL,
  avancee_statut VARCHAR(20) NOT NULL CHECK (avancee_statut IN ('termine', 'en_cours', 'attente_client', 'planifie')),
  avancee_titre VARCHAR(110) NOT NULL,
  avancee_message TEXT,
  avancee_date DATE NOT NULL DEFAULT CURRENT_DATE,
  avancee_visible_client BOOLEAN NOT NULL DEFAULT true,
  avancee_mail_sent_at TIMESTAMPTZ,
  avancee_created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE facture (
  facture_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proj_id INT NOT NULL REFERENCES projet(proj_id) ON DELETE RESTRICT,
  facture_num VARCHAR(20) NOT NULL UNIQUE,
  facture_mont INT NOT NULL CHECK (facture_mont >= 0),
  facture_lien VARCHAR(1000),
  facture_date DATE NOT NULL,
  facture_pay_deadline DATE NOT NULL,
  facture_paid_at DATE,
  facture_temps INT CHECK (facture_temps >= 0)
);

CREATE TABLE depense (
  depense_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proj_id INT REFERENCES projet(proj_id) ON DELETE SET NULL,
  depense_label VARCHAR(110) NOT NULL,
  depense_categorie VARCHAR(50) NOT NULL,
  depense_mont INT NOT NULL CHECK (depense_mont >= 0),
  depense_date DATE NOT NULL
);

CREATE TABLE site (
  site_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proj_id INT NOT NULL REFERENCES projet(proj_id) ON DELETE CASCADE,
  site_domain VARCHAR(255) NOT NULL UNIQUE,
  site_ssl_expires_at DATE,
  site_lighthouse JSONB,
  site_checked_at TIMESTAMPTZ
);

CREATE TABLE todo (
  todo_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  proj_id INT REFERENCES projet(proj_id) ON DELETE SET NULL,
  todo_title VARCHAR(110) NOT NULL,
  todo_done BOOLEAN NOT NULL DEFAULT false,
  todo_due TIMESTAMPTZ,
  todo_reminder_sent_at TIMESTAMPTZ,
  todo_created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE clause (
  clause_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clause_key VARCHAR(110) NOT NULL UNIQUE,
  clause_text VARCHAR(1024) NOT NULL
);

CREATE INDEX projet_client_idx ON projet (client_id);
CREATE INDEX document_proj_idx ON document (proj_id);
CREATE INDEX avancee_proj_created_idx ON avancee (proj_id, avancee_created_at);
CREATE INDEX facture_proj_idx ON facture (proj_id);
CREATE INDEX site_proj_idx ON site (proj_id);
CREATE INDEX todo_due_open_idx ON todo (todo_due);
```

Le premier compte admin se crée directement en base, avec un mot de passe haché avec bcrypt et `client_id` à `NULL`.

---

## Scripts

| Commande        | Action                           |
| --------------- | -------------------------------- |
| `npm run dev`   | Serveur de développement         |
| `npm run build` | Build de production              |
| `npm run start` | Lance le build de production     |
| `npm run lint`  | Vérification du code avec ESLint |

---

## Structure du projet

```
app/
├── (panel)/                  Pages du panel admin
│   ├── page.tsx              Accueil
│   ├── projets/              Liste, détail, avancée, nouveau projet
│   ├── clients/
│   ├── finances/
│   ├── administration/
│   ├── monitoring/
│   ├── todo/
│   └── layout.tsx            Navigation du panel
├── client/                   Espace client
├── login/                    Connexion
├── reset/                    Changement du mot de passe provisoire
├── api/                      Routes API
├── components/               Composants client (modales, formulaires, navigation)
│   ├── admin/
│   ├── administration/
│   ├── client/
│   ├── finances/
│   └── projet/
├── lib/
│   ├── auth/                 Vérification du JWT, génération de mot de passe
│   ├── mails/                Modèles d'e-mails
│   ├── db.ts                 Connexion Neon
│   ├── redis.ts              Connexion Upstash
│   ├── data.ts               Requêtes de lecture
│   ├── steps.ts              Étapes des projets
│   └── types.ts              Types partagés
├── globals.css               Thème et classes partagées
└── layout.tsx
```

---

## Routes API

| Domaine        | Routes                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| Authentification | `auth/login`, `auth/logout`                                          |
| Utilisateurs   | `auth/client/create`, `auth/client/delete`, `auth/user/modify`, `auth/user/delete` |
| Projets        | `projects/create`, `projects/delete`, `projects/modify/finish`         |
| Avancées       | `projects/avancee/create`, `projects/avancee/delete`                   |
| Finances       | `finances/facture/create`, `finances/facture/pay`, `finances/depense/create` |
| Clauses        | `clauses/create`                                                       |
| Todo           | `todo/create`, `todo/modify`, `todo/delete`                            |

Toutes les routes sont préfixées par `/api/`.

---

## Rôles et accès

| Rôle     | Accès                                  |
| -------- | -------------------------------------- |
| `admin`  | Tout le panel                          |
| `client` | Uniquement `/client`, pour ses projets |

Création d'un accès client :

1. Créer le client depuis la page Clients (ou depuis Nouveau projet)
2. Activer « Créer un compte utilisateur »
3. Un mot de passe provisoire est généré et envoyé par e-mail
4. Le client choisit son propre mot de passe à la première connexion, sur `/reset`

---

## Déploiement

L'instance de production est déployée sur Vercel ; chaque push sur `main` déclenche un déploiement.

### Déployer sa propre instance

1. Forker le projet
2. Créer une base sur Neon et y exécuter le [script de création](#script-de-création)
3. Créer le premier compte admin en base
4. Renseigner le `.env` à partir de `.env.exemple`
5. Remplacer les données en dur (informations de l'entreprise, adresse d'expédition des e-mails, URL de production)
6. Déployer sur Vercel (en renseignant les variables d'environnement dans les paramètres du projet), ou héberger sur son propre serveur

---

## Contribution

Les contributions sont les bienvenues : corriger le code front-end généré par IA, améliorer certaines façons de faire, ou ajouter des fonctionnalités.

- Documenter clairement les changements
- Signaler toute modification de la base de données
- Utiliser l'IA le moins possible : toute PR entièrement vibe-codée sera refusée

---

## Licence

MIT. Projet open-source ; toute utilisation doit mentionner un crédit.
