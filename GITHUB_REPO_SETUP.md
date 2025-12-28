# GitHub Repository Setup - Step by Step

## 🎯 Goal
Create a GitHub repository named `datavoid` and push your PrivacyBlitz code to it.

---

## Step 1: Create GitHub Account (if you don't have one)

1. Go to https://github.com/signup
2. Create your account
3. Verify your email

**Skip this if you already have a GitHub account!**

---

## Step 2: Create New Repository on GitHub

1. **Go to GitHub.com** and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**

4. **Fill in the details:**
   - **Repository name:** `datavoid`
   - **Description:** `Chrome extension to discover and delete forgotten online accounts. Reclaim your digital privacy.`
   - **Visibility:** Select **Public** ✅
   - **DO NOT check** "Add a README file" (you already have one)
   - **DO NOT check** "Add .gitignore" (you already have one)
   - **DO NOT check** "Choose a license" (you already have one)

5. Click **"Create repository"**

6. **IMPORTANT:** After creating, GitHub will show you setup instructions. **DON'T follow those yet!** We'll do it from your local folder.

---

## Step 3: Install Git (if not installed)

### Check if Git is installed:
Open Terminal and type:
```bash
git --version
```

### If Git is NOT installed:

**On Mac:**
```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Git
brew install git
```

**Or download from:** https://git-scm.com/download/mac

---

## Step 4: Configure Git (First Time Only)

Open Terminal and run:

```bash
# Set your name (replace with your name)
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"
```

---

## Step 5: Push Your Code to GitHub

### Open Terminal and navigate to your project:

```bash
cd /Users/tanushaggarwal/DataVoid
```

### Initialize Git (if not already done):

```bash
git init
```

### Add all files:

```bash
git add .
```

### Create your first commit:

```bash
git commit -m "Initial commit: DataVoid Chrome Extension - Production Ready"
```

### Connect to GitHub:

**Replace `YOUR_USERNAME` with your actual GitHub username!**

```bash
git remote add origin https://github.com/YOUR_USERNAME/datavoid.git
```

### Push to GitHub:

```bash
git branch -M main
git push -u origin main
```

**You'll be asked for your GitHub username and password/token:**
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (not your password)

---

## Step 6: Create Personal Access Token (if needed)

If Git asks for a password, you need a Personal Access Token:

1. Go to GitHub.com → Click your profile picture → **Settings**
2. Scroll down → Click **Developer settings** (left sidebar)
3. Click **Personal access tokens** → **Tokens (classic)**
4. Click **Generate new token** → **Generate new token (classic)**
5. **Note:** `DataVoid Repo Access`
6. **Expiration:** Choose 90 days (or No expiration)
7. **Select scopes:** Check **`repo`** (this gives full repository access)
8. Click **Generate token**
9. **COPY THE TOKEN** (you won't see it again!)
10. Use this token as your password when Git asks

---

## Step 7: Verify It Worked

1. Go to: `https://github.com/YOUR_USERNAME/datavoid`
2. You should see all your files!
3. Click on `README.md` - it should show your beautiful README

---

## Step 8: Configure Repository Settings

### Add Topics/Tags:

1. Go to your repository: `https://github.com/YOUR_USERNAME/datavoid`
2. Click the **⚙️ Settings** icon (or go to Settings tab)
3. Scroll down to **Topics** section
4. Add these topics (one per line):
   ```
   chrome-extension
   privacy
   javascript
   web-extension
   digital-privacy
   gdpr
   account-management
   ```
5. Click **Save changes**

### Enable Features:

1. Still in **Settings**
2. Scroll to **Features** section
3. Check:
   - ✅ **Issues** (for bug reports and feature requests)
   - ✅ **Discussions** (optional, for community discussions)
4. Click **Save changes**

### Add Description:

1. On your repository page, click the **⚙️ Settings** icon
2. Scroll to **About** section (right sidebar)
3. Add:
   - **Website:** (leave blank for now)
   - **Description:** `Chrome extension to discover and delete forgotten online accounts`
4. Click **Save changes**

---

## Step 9: Pin to Your Profile

1. Go to your GitHub profile: `https://github.com/YOUR_USERNAME`
2. Click **"Customize your pins"** (or look for the pin icon)
3. Select **datavoid** from the list
4. Click **Save pins**
5. Your repository will now appear at the top of your profile!

---

## Step 10: Update README Links

1. Open `README.md` in your editor
2. Find and replace `yourusername` with your GitHub username (there are 3 places)
3. Save the file

4. Push the update:
```bash
git add README.md
git commit -m "Update: Fix GitHub links in README"
git push
```

---

## ✅ Final Checklist

- [ ] GitHub account created
- [ ] Repository `datavoid` created on GitHub
- [ ] Git installed and configured
- [ ] Code pushed to GitHub
- [ ] Repository topics added
- [ ] Issues enabled
- [ ] Repository pinned to profile
- [ ] README links updated

---

## 🎉 You're Done!

Your repository is now live at:
**`https://github.com/YOUR_USERNAME/datavoid`**

---

## 🆘 Troubleshooting

### "Repository not found" error:
- Check your GitHub username is correct
- Make sure the repository exists on GitHub
- Verify you're using the right URL

### "Permission denied" error:
- Use Personal Access Token instead of password
- Make sure token has `repo` scope

### "Git is not recognized":
- Git is not installed - follow Step 3

### "Remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/datavoid.git
```

### Need to update code later:
```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 📞 Need Help?

- **Git Documentation:** https://git-scm.com/doc
- **GitHub Help:** https://docs.github.com
- **Check your repo:** `https://github.com/YOUR_USERNAME/datavoid`

---

**Good luck! 🚀**

