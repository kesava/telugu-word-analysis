# Telugu Linguistic Analysis Platform

A comprehensive computational linguistics platform analyzing 54,265+ Telugu words with advanced syllable-based morphology, phonetics, and semantic insights.

## 🌟 Live Demo

**[View Live Analysis Dashboard](https://yourusername.github.io/telugu-word-analysis/)**

*Replace `yourusername` with your GitHub username after deployment*

## Overview

This project provides deep linguistic analysis of Telugu language through multiple specialized dashboards:

- **🎨 Complete Analysis Dashboard** - Beautiful unified interface with 27+ linguistic analysis categories
- **🔬 Advanced Research Dashboard** - Comprehensive morphological, phonetic, and semantic analysis
- **📊 Interactive Visualizations** - Stunning charts and data representations

### Key Features

✅ **Syllable-based Analysis** - Proper Telugu aksharam (syllable) recognition and analysis
✅ **27+ Analysis Types** - Comprehensive linguistic insights
✅ **Advanced Morphology** - Prefix, suffix, and root pattern analysis
✅ **Phonetic Structure** - Consonant clusters, sandhi patterns, gunintam analysis
✅ **Semantic Complexity** - Word complexity and cognitive load assessment
✅ **Etymology Analysis** - Native Telugu vs loan word classification
✅ **Interactive Charts** - Beautiful visualizations with Chart.js
✅ **Mobile Responsive** - Works perfectly on all devices
✅ **GitHub Pages Ready** - Deploy anywhere with static hosting

## Quick Start

### Option 1: GitHub Pages Deployment (Recommended)

1. **Fork this repository** to your GitHub account

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Set Source to "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

3. **Access your dashboard**:
   ```
   https://yourusername.github.io/telugu-word-analysis/
   ```

4. **Custom domain** (optional):
   - Add your domain in Settings → Pages → Custom domain
   - Create CNAME file in repository root with your domain

### Option 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/telugu-word-analysis.git
   cd telugu-word-analysis
   ```

2. **Start a local server** (required for JSON loading):
   ```bash
   # Using Python (recommended)
   python3 -m http.server 8000

   # Or using Node.js
   npx http-server -p 8000

   # Or using npm
   npm run serve
   ```

3. **Open dashboard**: Visit `http://localhost:8000`

⚠️ **Important**: Must be served via HTTP (not file://) due to JSON loading restrictions

## Dashboard Features

### 🎨 Complete Analysis Dashboard (`beautiful-analysis.html`)
- **Core Analysis**: Syllable frequency, word length distribution
- **Linguistic Deep-Dive**: Etymology, case markers, word formation
- **Morphology & Structure**: Prefix/suffix patterns, aksharam analysis
- **Phonetics & Sound**: Consonant clusters, sandhi patterns, gunintam
- **Key Insights**: Automated linguistic discoveries and patterns

### 🔬 Advanced Research Dashboard (`advanced-analysis.html`)
- Specialized morphological analysis
- Advanced phonetic structure examination
- Semantic complexity assessment
- Cognitive load analysis
- Word formation pattern recognition

## Analysis Highlights

📊 **54,265+ Telugu Words Analyzed**
🔤 **2,000+ Unique Syllables Identified**
🌏 **Etymology Classification** (Native vs Loan Words)
🧬 **Morphological Patterns** (Prefixes, Suffixes, Roots)
🎵 **Phonetic Structures** (Consonant Clusters, Sandhi)
💭 **Cognitive Complexity** Assessment
⚖️ **Grammatical Analysis** (Case Markers, Honorifics)

## Project Structure

```
telugu-word-analysis/
├── index.html              # Landing page with dashboard options
├── beautiful-analysis.html # Complete analysis dashboard (recommended)
├── advanced-analysis.html  # Advanced research dashboard
├── sortdict.js            # Source Telugu dictionary (54K+ words)
├── analyze.js             # Node.js analysis generator
├── telugu-stats.json      # Comprehensive analysis data
├── telugu-stats.min.json  # Compressed version
├── .nojekyll             # GitHub Pages configuration
├── CLAUDE.md             # Development documentation
├── package.json          # Node.js configuration
└── README.md             # This file
```

## Technical Implementation

### Syllable-Based Analysis
- Proper Telugu script Unicode handling (U+0C00-U+0C7F)
- Consonant-vowel combination recognition
- Virama (్) and conjunct consonant processing
- Vowel modifier (gunintam) identification

### Advanced Linguistic Features
- **Morphological Analysis**: Root, prefix, suffix pattern recognition
- **Phonetic Analysis**: Consonant cluster frequency, sandhi patterns
- **Semantic Analysis**: Word complexity, cognitive load assessment
- **Etymology Classification**: Native Telugu vs Sanskrit/Arabic/English loans
- **Grammatical Analysis**: Case marker usage, honorific patterns

### Data Visualization
- Chart.js powered interactive charts
- 10+ chart types: Bar, line, doughnut, pie, polar, radar, scatter
- Responsive design with glassmorphism effects
- Real-time data filtering and navigation

## Regenerating Analysis Data

To update the analysis with new word data or algorithms:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run analysis script**:
   ```bash
   node analyze.js
   ```

3. **Deploy updated data**:
   - Commit changes to GitHub
   - GitHub Pages will automatically update

## Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: ES6 modules, Fetch API, CSS Grid/Flexbox

## Deployment Options

### GitHub Pages (Free)
- ✅ Zero configuration required
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Global CDN

### Other Static Hosts
- **Netlify**: Drag and drop deployment
- **Vercel**: Git integration
- **Firebase Hosting**: Google infrastructure
- **Surge.sh**: CLI deployment

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test locally
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature-name`
6. Create Pull Request

## License

MIT License - Free to use, modify, and distribute.

## Citation

If you use this analysis in research, please cite:
```
Telugu Linguistic Analysis Platform
https://github.com/yourusername/telugu-word-analysis
```

---

**Built with ❤️ for Telugu language research and education**