# Panel

Panel de gestion interne pour toute entreprise (plus axé micro-entreprise) de profession libérales. Style Neo-brutaliste lié à mon style graphique de prédilection.

Production : [panel.gaeltournier.dev](https://panel.gaeltournier.dev)
Utilisateur: Test
Mot de passe: Test123@

---

## Disclaimer: utilisation de l'IA;

Ce projet est un projet backend, absolument (presque) tout le front-end a été réalisé avec l'IA entrainée sur mes projets et sur mon style graphique.
Le backend a été réalisé à 95% à la main, à la documentation, ormis la partie TODO (gestion des states faite par IA, dans tous les cas ça se voit).

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack](#stack)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Scripts](#scripts)
- [Structure du projet](#structure-du-projet)
- [Rôles et accès](#rôles-et-accès)
- [Déploiement](#déploiement)
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
- Changement du mot de passe provisoire à la première connexion

---

## Stack

| Domaine          | Outil                          |
| ---------------- | ------------------------------ |
| Framework        | Next.js 16 (App Router)        |
| Langage          | TypeScript                     |
| Style            | Tailwind CSS v4                |
| Base de données  | PostgreSQL (Neon)              |
| Authentification | JWT en cookie httpOnly, bcrypt |
| Rate limiting    | Upstash Redis                  |
| E-mails          | Nodemailer (SMTP)              |
| Hébergement      | Vercel                         |

---

## Prérequis

- Node.js [version]
- npm
- Une base PostgreSQL (Neon)
- Une base Upstash Redis
- Un compte SMTP pour l'envoi des e-mails

---

## Installation

```bash
git clone [url-du-repo]
cd [nom-du-dossier]
npm install
cp .env.exemple .env
```

Remplir le fichier `.env` (voir ci-dessous), puis lancer le serveur de développement :

```bash
npm run dev
```

Le panel est accessible sur [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

Toutes les variables sont listées et expliquées dans [`.env.exemple`](./.env.exemple).

| Variable     | Rôle          |
| ------------ | ------------- |
| `[VARIABLE]` | [description] |
| `[VARIABLE]` | [description] |

> Ne jamais versionner le fichier `.env`.

---

## Base de données

Le schéma suit une conception MERISE (dictionnaire de données, MCD, MLD).

| Table         | Contenu                                      |
| ------------- | -------------------------------------------- |
| `client`      | Clients (personne ou entreprise)             |
| `utilisateur` | Comptes de connexion (admin ou client)       |
| `projet`      | Projets, prix, temps passé, infos techniques |
| `avancee`     | Avancées de chaque étape d'un projet         |
| `document`    | Documents liés à un projet                   |
| `facture`     | Factures émises et leur statut de paiement   |
| `depense`     | Dépenses, liées ou non à un projet           |
| `site`        | Sites surveillés (SSL, Lighthouse)           |
| `todo`        | Tâches                                       |
| `clause`      | Clauses réutilisables pour devis et factures |

Créer les tables puis, si besoin, insérer les données d'exemple :

```bash
psql "$DATABASE_URL" -f [chemin]/Panel-BDD.sql
psql "$DATABASE_URL" -f [chemin]/Panel-BDD-exemples.sql
```

> Les montants sont stockés en centimes et les durées en minutes.

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
├── (panel)/            Pages du panel admin
│   ├── projets/
│   ├── clients/
│   ├── finances/
│   ├── administration/
│   ├── monitoring/
│   └── todo/
├── client/             Espace client
├── api/                Routes API
├── lib/                Accès base de données, auth, e-mails, étapes
└── globals.css         Thème et classes partagées
components/             Composants client (modales, formulaires, navigation)
```

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
4. Le client choisit son propre mot de passe à la première connexion

---

## Déploiement

Déployé sur Vercel. Chaque push sur `/main` déclenche un déploiement de production.

Les variables d'environnement sont à renseigner dans les paramètres du projet Vercel.

## Comment le déployer ?

1. Fork le projet
2. Créer les DB avec le script du dessus dans Neon
   ...
3. Renseigner le .env
4. Modifier toutes les données raw
5. Déployer sur Vercel ou self-hoster sur un serveur !

---

## Contribution

Vous pouvez bien sur contribuer au projet, que ça soit en fixant du code généré par IA niveau du front-end, ou en modifiant certaines façons de faire, ou même en rajoutant des features.
Merci de bien documenter vos changements et de notifier un changement dans la base de données.
Merci également d'utiliser le moins d'IA possible: chaque PR vibe-codée entièrement sera refusée.

## Licence

MIT, Projet open-source, toute utilisation doit mentionner un crédit.
