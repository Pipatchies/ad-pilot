<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

update -->

# 🚀 ad-pilot

**ad-pilot** est une plateforme interne développée pour faciliter la communication entre notre agence et les partenaires médias. Elle centralise le suivi des campagnes de communication, la gestion des factures, des documents, et d'autres éléments liés à la relation client-média.

---

## 🔧 Stack technique

- **Next.js** (App Router)
- **TypeScript**
- **Clerk** : gestion de l'authentification (connexion uniquement à ce stade)
- **Convex** : backend en place (setup réalisé, pas encore utilisé)
- **Tailwind CSS**
- **React Hook Form + Zod** : gestion de formulaires

---

## ✨ Fonctionnalités actuelles

- Authentification sécurisée avec Clerk
- Interface client prête côté frontend
- Backend Convex configuré (intégration prochaine)

---

## 🚀 Lancer le projet en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/Verywell-Digital/ad-pilot.app.git
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configurer l’environnement

Créez un fichier `.env.local` à la racine du projet et ajoutez les variables d’environnement suivantes :

```bash
CONVEX_DEPLOYMENT=... # team: pipatchies, project: ad-pilot-com

NEXT_PUBLIC_CONVEX_URL=...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
```

🔑 La clé Clerk est disponible sur https://dashboard.clerk.com
🌐 L’URL Convex est fournie lors du setup via npx convex init

### 4. Lancer l'application

```bash
pnpm run dev
```

## 🔐 Authentification Clerk

L’authentification utilisateur repose sur Clerk, uniquement pour la connexion (sign-in).
Les identifiants et mots de passe se trouvent sur https://dashboard.clerk.com.

## 🧱 Backend Convex (setup en place)

Convex est prêt à être utilisé pour stocker et synchroniser en temps réel :

- campagnes

- factures

- documents

- medias

- cibles

- permissions utilisateurs

- ect...

Convex permet de gérer les données métier côté serveur avec des fonctions query ou mutation en TypeScript.

➡️ Pour lancer Convex localement :

```bash
npx convex dev
```

➡️ Pour créer un schéma (table de données) :

```bash
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  campaigns: defineTable({
    name: v.string(),
    startDate: v.string(),
    status: v.string(),
  }),
})
```

➡️ Pour ajouter une fonction (exemple : créer une campagne) :

```bash
import { mutation } from "convex/server"
import { v } from "convex/values"

export const createCampaign = mutation({
  args: {
    name: v.string(),
    startDate: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("campaigns", {
      name: args.name,
      startDate: args.startDate,
      status: args.status,
    })
  },
})
```

➡️ Pour appeler une fonction côté front :

```bash
"use client"
import { useMutation } from "convex/react"
import { api } from "../convex/_generated/api"

export function CreateCampaignButton() {
  const createCampaign = useMutation(api.createCampaign)

  return (
    <button onClick={() => createCampaign({ name: "TV 2025", startDate: "2025-09-01", status: "draft" })}>
      Créer une campagne
    </button>
  )
}
```

## 📌 À venir

- Intégration des données avec Convex

- Interface dashboard admin

---

## 🐳 Docker (Environnement de développement)

Pour lancer l'application avec Docker :

1. Assurez-vous d'avoir [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/) installés.
2. Créez un fichier `.env.local` vérifiez que les variables sont correctes.
3. Lancez la commande :

```bash
docker-compose up
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).
Le volume est monté, donc les changements dans le code source seront reflétés immédiatement (hot-reload).
