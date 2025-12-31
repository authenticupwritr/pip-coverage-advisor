# 🚀 Deployment Instructions for PIP Coverage Advisor

## Step 1: Push to GitHub

### Option A: Create a new repository on GitHub first (Recommended)

1. Go to https://github.com/new
2. Create a new repository named `pip-coverage-advisor`
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL (e.g., `https://github.com/yourusername/pip-coverage-advisor.git`)

5. In your terminal, navigate to the project folder and run:
```bash
cd /home/claude/pip-coverage-advisor
git remote add origin https://github.com/yourusername/pip-coverage-advisor.git
git branch -M main
git push -u origin main
```

### Option B: Use GitHub CLI (if you have it installed)

```bash
cd /home/claude/pip-coverage-advisor
gh repo create pip-coverage-advisor --public --source=. --remote=origin --push
```

---

## Step 2: Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click **"Add New..."** → **"Project"**
4. Import your `pip-coverage-advisor` repository
5. Vercel will auto-detect the Vite framework
6. Click **"Deploy"**
7. Wait 1-2 minutes for deployment to complete
8. Your app will be live at `https://pip-coverage-advisor-<random>.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
cd /home/claude/pip-coverage-advisor
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? [Select your account]
# - Link to existing project? No
# - Project name: pip-coverage-advisor
# - Directory: ./
# - Override settings? No
```

---

## Step 3: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Update your DNS records as instructed by Vercel

---

## Configuration Details

### Build Settings (Auto-detected by Vercel)
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables
None required for this project!

---

## Troubleshooting

### Issue: Build fails
- Check the build logs in Vercel
- Ensure all dependencies are in package.json
- Try building locally: `npm install && npm run build`

### Issue: Page shows 404
- Verify Output Directory is set to `dist`
- Check that build completed successfully

### Issue: Styling not working
- Clear Vercel cache and redeploy
- Check browser console for errors

---

## Testing Locally Before Deploy

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit http://localhost:5173 to test locally.

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Repository**: [Add your repo URL here]
- **Live Site**: [Will be provided after deployment]

---

## Next Steps After Deployment

1. ✅ Test the live site thoroughly
2. ✅ Set up custom domain (if desired)
3. ✅ Configure analytics (Vercel Analytics)
4. ✅ Set up monitoring alerts
5. ✅ Share the URL with stakeholders

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- Project Issues: Create an issue in your GitHub repo
