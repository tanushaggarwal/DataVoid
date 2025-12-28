# Correct Git Commands for DataVoid Repository

## Your Repository Details:
- **Username:** `tanushaggarwal`
- **Repository Name:** `DataVoid`
- **URL:** `https://github.com/tanushaggarwal/DataVoid.git`

---

## Commands to Run:

Since you already have files, **DON'T** follow GitHub's "create new repository" instructions. Instead, use these:

```bash
# Make sure you're in the right folder
cd /Users/tanushaggarwal/DataVoid

# Remove any existing remote (if you added one)
git remote remove origin

# Add the correct remote
git remote add origin https://github.com/tanushaggarwal/DataVoid.git

# Verify it's correct
git remote -v

# Push to GitHub
git push -u origin main
```

---

## If You Get "Repository is Empty" Error:

If GitHub says the repository is empty, you might need to pull first:

```bash
git pull origin main --allow-unrelated-histories
```

Then push:
```bash
git push -u origin main
```

---

## If You Haven't Committed Yet:

If you haven't made your first commit:

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: DataVoid Chrome Extension - Production Ready"

# Add remote
git remote add origin https://github.com/tanushaggarwal/DataVoid.git

# Push
git branch -M main
git push -u origin main
```

---

## Complete Sequence (If Starting Fresh):

```bash
cd /Users/tanushaggarwal/DataVoid
git init
git add .
git commit -m "Initial commit: DataVoid Chrome Extension - Production Ready"
git branch -M main
git remote add origin https://github.com/tanushaggarwal/DataVoid.git
git push -u origin main
```

---

**That's it! Your code will be on GitHub at:**
**`https://github.com/tanushaggarwal/DataVoid`**

