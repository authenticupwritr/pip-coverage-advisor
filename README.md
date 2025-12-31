# PIP Coverage Advisor

A personalized Personal Injury Protection (PIP) coverage recommendation tool built with React and Vite.

## 🚀 Quick Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add -A
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/pip-coverage-advisor.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy" (no configuration needed!)

## ✨ Features

- **Interactive Questionnaire** - Comprehensive assessment of coverage needs
- **Smart Recommendations** - Personalized based on income, dependents, and health insurance
- **Benefit Calculations** - Automatic Work Loss Benefits calculations
- **Priority Levels** - Clear indication of essential vs. recommended coverage
- **Mobile Responsive** - Works perfectly on all devices
- **Modern UI** - Built with Tailwind CSS via CDN

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit http://localhost:5173 to view the app.

## 📦 Tech Stack

- **React 18.3** - UI library
- **Vite 5.4** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **Lucide React** - Icon library

## 🏗️ Project Structure

```
pip-coverage-advisor/
├── src/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # React entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── .gitignore          # Git ignore rules
```

## 🎯 How It Works

1. User fills out questionnaire about their situation
2. App analyzes responses to determine coverage needs
3. Recommendations are categorized by priority:
   - **Essential Coverage** (High Priority) - Critical based on user's situation
   - **Recommended Coverage** (Medium Priority) - Beneficial additions
   - **Important Considerations** - Warnings about coverage gaps
   - **Good to Know** - General PIP information

## 📊 Coverage Types Assessed

- **Medical Expense Benefits (MEB)** - Up to $10,000 for medical expenses
- **Work Loss Benefits (WLB)** - 80% of income up to $900/week
- **Replacement Services Expenses (RSE)** - Up to $20/day for household services
- **Extended Work Loss Benefits** - For higher income earners

## ⚙️ Vercel Deployment Settings

No special configuration needed! Vercel auto-detects:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 📝 Notes

- Tailwind CSS is loaded via CDN for simplicity
- All dependencies are production-ready versions
- No environment variables required
- Works out of the box with Vercel's zero-config deployment

## 🆘 Troubleshooting

**Build fails locally:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Vercel deployment issues:**
- Ensure all files are committed to Git
- Check that package.json has correct dependencies
- Verify build works locally first

## 📄 License

MIT

## 🤝 Contributing

This is a standalone project. Feel free to fork and customize for your needs.

---

**Disclaimer:** This tool provides general guidance only. PIP coverage requirements vary by state and insurance provider. Always consult with a licensed insurance agent or attorney for personalized advice.
