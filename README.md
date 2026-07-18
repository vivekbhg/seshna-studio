# seshna studio

Portfolio de **Seshna Gungah** — architecte urbaniste, scénographe de concerts et festivals, créatrice de bijoux (studio saigu).

Next.js (App Router) + Supabase. Design : minimalisme — typographie bas de casse, blancs généreux, un clin d'œil au motif de texte miroir du portfolio imprimé.

## Stack

- **Next.js 15** — App Router, rendu serveur dynamique, CSS vanilla (pas de framework CSS)
- **Supabase** — projet `maraudeurs`, données dans les tables préfixées `seshna_*` (cohabite avec les données `cv_*` / `fitwell_*` existantes)

## Modèle de données

| Table | Rôle |
|---|---|
| `seshna_profile` | Profil (bio, contacts, réseaux, logiciels) — singleton |
| `seshna_disciplines` | architecture, urbanisme, scénographie, photographies, collages, vidéos, espace culinaire, création de bijoux |
| `seshna_projects` | 24 projets — programme, MOA, agence, équipe, surface, budget, certifications, distinctions |
| `seshna_project_images` | 115 images liées aux projets (chemin, dimensions, couverture, ordre) |
| `seshna_experiences` | Parcours (7 expériences) pour la page à propos |

Toutes les tables ont RLS activé avec des politiques de lecture publique ; les écritures passent par le service role uniquement.

## Images

Les visuels ont été extraits du portfolio PDF, convertis en JPEG web et servis depuis `public/images/` (v1). La base référence des chemins relatifs (`storage_path`), résolus par `lib/images.ts` via `NEXT_PUBLIC_IMAGE_BASE_URL`.

Un bucket public `seshna` existe déjà dans le projet Supabase : pour basculer les images vers le Storage plus tard, il suffit d'y téléverser le contenu de `public/images/` (mêmes chemins) et de pointer `NEXT_PUBLIC_IMAGE_BASE_URL` vers `https://<project>.supabase.co/storage/v1/object/public/seshna` — aucun changement de schéma ni de code.

## Démarrer

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Pages

- `/` — projets groupés par discipline
- `/projets/[slug]` — fiche projet (faits + description + images ; grille pour bijoux, culinaire, vidéos)
- `/a-propos` — bio, parcours, logiciels, contacts

## Atelier (administration)

`/atelier` est une interface d'administration non référencée (`noindex`, aucun lien depuis le site) protégée par une phrase de passe. Elle permet de :

- modifier tous les champs d'un projet, le publier/dépublier, le mettre à la une ;
- ajouter, supprimer, réordonner, pivoter les images, choisir la couverture, éditer les textes alternatifs ;
- créer de nouveaux projets (créés en brouillon, slug généré depuis le titre).

### Fonctionnement

- La phrase de passe est vérifiée côté base : son hash SHA-256 est stocké dans `seshna_admin_config` (RLS sans politique — invisible via l'API). La session est un cookie `HttpOnly` de 30 jours.
- Les écritures passent par des fonctions RPC `security definer` (`seshna_admin_*`) qui vérifient la phrase de passe à chaque appel — aucune clé service role dans l'application.
- Les fichiers (upload/suppression) passent par l'edge function `seshna-admin-files`, seule détentrice du service role, qui écrit dans le bucket public `seshna`.
- Les images sont retraitées au téléversement (`sharp` : orientation EXIF, max 1600 px, JPEG q85). La rotation (90° anti-horaire) régénère le fichier ; une image historique du dépôt (`source = 'repo'`) migre alors automatiquement vers le bucket (`source = 'bucket'`).

Pour changer la phrase de passe :

```sql
update seshna_admin_config set passphrase_hash = encode(sha256('nouvelle-phrase'::bytea), 'hex');
```
