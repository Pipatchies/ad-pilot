# BEST PRACTICES

## Git – Workflow & conventions

### Branches

- `feature/ma-feature`
- `fix/bug-corrige`
- `hotfix/patch-urgent`
- `style/ajustement-css`
- `refactor/nettoyage-code`

```bash
git checkout -b feature/ma-feature
git push --set-upstream origin feature/ma-feature
git push -u origin feature/ma-feature
```

---

### Rester à jour avec main

```bash
git pull --rebase origin main
git push --force-with-lease
```

Lors d’un rebase, je préfère éditer les fichiers conflictuels directement dans l’onglet Source Control (🔀) plutôt que d’utiliser les boutons comme Resolve conflicts.

### Ou en global

```bash
git config --global pull.rebase true
```

- Bloquer les push directs sur `main` (à configurer dans GitHub)

---

### Revenir sur main

```bash
git branch -a
```

```bash
git checkout -b main origin/main
git pull origin main
```

---

### Dépendances

```bash
pnpm config set strict-store-pkg-content-check false
```