# Guide de bonnes pratiques (Workflow DevOps)

Ce document définit les standards de développement et le flux de travail Git pour le projet **ad-pilot**. Ces règles doivent être respectées par tous les membres de l'équipe pour assurer la qualité du code et l'efficacité de la livraison.

## 1. Stratégie Git : GitHub Flow

Nous utilisons une variante simplifiée du **GitHub Flow**.
La règle d'or : **La branche `main` est toujours déployable.**

### Le Cycle de Vie

1.  **Création de branche** : Pour chaque nouvelle fonctionnalité ou correction, créez une branche à partir de `main`.
2.  **Développement** : Commitez vos changements localement.
3.  **Pull Request (PR)** : Ouvrez une PR vers `main` pour demander une revue de code.
4.  **Review & Test** : La CI (Intégration Continue) lance les tests. Un collègue relit le code.
5.  **Merge** : Une fois validée, la branche est fusionnée (Squash & Merge) dans `main`.

## 2. Conventions de Nommage des Branches

Format : `type/description-courte`

| Type    | Utilisation                             | Exemple                     |
| :------ | :-------------------------------------- | :-------------------------- |
| `feat`  | Nouvelle fonctionnalité                 | `feat/login-page`           |
| `fix`   | Correction de bug                       | `fix/header-alignment`      |
| `chore` | Maintenance technique (Docker, deps...) | `chore/update-dependencies` |
| `docs`  | Documentation                           | `docs/add-readme`           |
| `ui`    | Changements purement visuels            | `ui/update-button-color`    |

## 3. Conventions de Commits (Conventional Commits)

Nous suivons la convention **Conventional Commits** pour faciliter la génération automatique de changelogs et la lecture de l'historique.

Format : `type(scope): description`

- **type** : Même que pour les branches (`feat`, `fix`, `chore`...).
- **scope** (optionnel) : La partie du code touchée (ex: `auth`, `api`, `ui`).
- **description** : Description courte et impérative (en anglais de préférence).

### Exemples :

PROPRE ✅ :

- `feat(auth): add google updates`
- `fix: crash on profile page`
- `chore: update docker configuration`

SALE ❌ :

- `wip`
- `bugfix`
- `ça marche enfin`

## 4. Commandes Utiles (Memo)

### Créer et publier une branche

```bash
git checkout -b feature/ma-feature
git push -u origin feature/ma-feature
```

### Rester à jour avec main (Rebase)

Pour éviter les commits de merge inutiles ("Merge branch 'main' into..."), privilégiez le rebase :

```bash
git pull --rebase origin main
git push --force-with-lease # Si vous avez déjà pushé votre branche
```

### Configurer le rebase par défaut (Recommandé)

```bash
git config --global pull.rebase true
```

## 5. Processus de Pull Request

- Le titre de la PR doit être explicite.
- Une description doit expliquer **ce qui** a été fait et **pourquoi**.
- La CI (GitHub Actions) doit être **verte**.
- Au moins **1 approbation** est requise pour merger.
