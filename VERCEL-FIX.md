# 🔧 Vercel Build Fix

## The Problem
Vercel couldn't find `index.html` during build, showing:
```
Could not resolve entry module "index.html"
```

## ✅ The Solution (Already Applied!)

I've updated two files to fix this:

### 1. `vite.config.js` - Now includes explicit root and build settings
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
```

### 2. `vercel.json` - Simplified configuration
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

## 🚀 Deploy Steps (Updated)

### Push the Fixed Code to GitHub:
```bash
cd pip-coverage-advisor
git add -A
git commit -m "Fix Vercel build configuration"
git push
```

### On Vercel:
1. If you already have the project, go to your project settings
2. Click **"Redeploy"** - Vercel will pull the latest code
3. The build should now succeed! ✅

### If Starting Fresh:
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. **DON'T override any settings** - our config files handle everything
5. Click "Deploy"

## 🧪 Verify Before Deploying

Test the build locally:
```bash
npm install
npm run build
```

If you see:
```
✓ built in 4.11s
```
You're good to go! 🎉

## ⚙️ Alternative: Manual Vercel Settings

If for some reason the config files don't work, set these in Vercel dashboard:

**Settings → General:**
- Framework Preset: `Vite`
- Root Directory: `./` (leave blank or use root)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 🆘 Still Having Issues?

### Check 1: File Structure
Verify these files exist in project root:
```bash
ls -la
# Should see:
# - index.html
# - package.json
# - vite.config.js
# - vercel.json
# - src/
```

### Check 2: package.json Scripts
Should have:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Check 3: Clear Vercel Cache
In Vercel dashboard:
1. Go to Settings → General
2. Scroll to "Build & Development Settings"
3. Toggle something on/off and back (forces cache clear)
4. Redeploy

### Check 4: Try Without vercel.json
Sometimes Vercel's auto-detection works better:
```bash
# Temporarily rename vercel.json
mv vercel.json vercel.json.backup
git add -A
git commit -m "Test without vercel.json"
git push
```

Then redeploy. Vercel should auto-detect Vite.

## 📋 Build Logs to Check

If build still fails, look for these in Vercel logs:

✅ **Good signs:**
- "Detected Vite framework"
- "Installing dependencies"
- "transforming..."
- "built in X.XXs"

❌ **Bad signs:**
- "Could not resolve entry module"
- "Cannot find module"
- "ENOENT: no such file"

Share the full build log if you need more help!

---

**The configuration is now fixed and tested. Push to GitHub and redeploy! 🚀**
