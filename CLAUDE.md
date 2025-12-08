# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Telugu word analysis project that provides comprehensive statistical analysis of Telugu language patterns. The project has evolved from a simple word dictionary to a sophisticated linguistic analysis tool that focuses on **syllable-based analysis** rather than character-based analysis.

### Key Insight
**CRITICAL**: Telugu analysis should be syllable-based, not character-based. Individual characters are not meaningful units in Telugu - syllables (aksharams) are the proper linguistic units for analysis.

## File Structure

### Core Files
- `sortdict.js` - ES6 module exporting `wordList` array with 54,196+ Telugu words (1.5 MB)
- `analyze.js` - Node.js script for syllable-based statistical analysis with comprehensive linguistic analysis (27+ categories)
- `index.html` - Interactive dashboard displaying core analysis results with Chart.js
- `advanced-analysis.html` - Comprehensive linguistic analysis dashboard with all advanced features
- `beautiful-analysis.html` - **NEW** Ultimate unified dashboard combining all analyses with beautiful design
- `package.json` - Project configuration and npm scripts
- `telugu-stats.json` - Generated statistical analysis data with comprehensive linguistic insights

### Test and Documentation Files
- `test-syllables.html` - Proof-of-concept demonstration of syllable analysis
- `telugu-stats-syllable-sample.json` - Sample syllable-based data structure
- `test_syllables.py` - Python validation script for syllable extraction logic
- `CLAUDE.md` - This documentation file

## Telugu Linguistic Analysis

### Syllable-Based Analysis Approach

This project implements sophisticated Telugu language analysis based on **syllables (aksharams)** rather than individual characters. This approach is linguistically correct because:

1. **Telugu is a syllabic script**: Each aksharam represents a complete phonetic unit
2. **Characters alone are meaningless**: Individual vowel signs (matras) or consonants don't convey linguistic meaning
3. **Syllables are the proper unit**: Consonant + vowel combinations form complete sound units

### Syllable Extraction Algorithm

The core algorithm (`extractSyllables()` function) handles:

- **Consonants**: క, గ, మ, న, ప, etc. (U+0C15 to U+0C39)
- **Vowels**: అ, ఆ, ఇ, ఈ, ఉ, etc. (U+0C05 to U+0C14)
- **Vowel Signs (Matras)**: ా, ి, ీ, ు, ూ, etc. (U+0C3E to U+0C4C)
- **Virama (Halanta)**: ్ (U+0C4D) for conjunct consonants
- **Conjunct patterns**: కా, ప్ర, స్త్ర, etc.

### Analysis Categories

The syllable-based analysis provides comprehensive Telugu linguistic analysis:

#### Core Syllable Analysis
1. **Syllable Frequency**: Most common syllables in Telugu
2. **Consonant Patterns**: Distribution of consonant usage
3. **Vowel Usage**: Frequency of different vowel sounds
4. **Syllables per Word**: Distribution patterns
5. **Consonant-Vowel Combinations**: Common CV pairs
6. **Word Structure Patterns**: Beginnings, endings, length distribution

#### Advanced Telugu-Specific Analysis
7. **Sandhi Patterns**: Telugu word joining and sound changes
8. **Compound Word Analysis**: Multi-part word structures
9. **Case Marker Analysis**: Telugu grammatical case usage (కు, తో, లో, etc.)
10. **Honorific Patterns**: Respectful language usage (గారు, వారు, etc.)
11. **Reduplication Analysis**: Word repetition patterns (పచ్చపచ్చ, etc.)
12. **Loan Word Classification**: Sanskrit, Arabic, English, and native Telugu origins

#### Morphological Analysis
13. **Prefix Analysis**: Common Telugu prefixes (అ-, ప్ర-, సం-, వి-, etc.)
14. **Suffix Analysis**: Derivational and inflectional suffixes
15. **Root Pattern Analysis**: Consonant-vowel patterns in word roots
16. **Derivational Patterns**: Word formation processes (noun→adjective, etc.)
17. **Morpheme Estimation**: Complexity based on morphological structure

#### Phonetic Analysis
18. **Phonetic Patterns**: Sound structure analysis (CVCV patterns)
19. **Consonant Clusters**: Gemination and conjunct patterns
20. **Vowel Sequences**: Multi-vowel combinations
21. **Alliteration Patterns**: Sound repetition analysis
22. **Phonotactic Constraints**: Allowed/forbidden sound combinations

#### Semantic and Cognitive Analysis
23. **Word Complexity**: Simple/medium/complex/highly complex classification
24. **Word Class Analysis**: Noun, verb, adjective, adverb identification
25. **Semantic Field Analysis**: Family, body, nature, food, time, action categories
26. **Word Formation Types**: Negation, compounds, honorifics, causatives
27. **Cognitive Load Estimation**: Processing difficulty assessment

## Usage and Development

### Analysis Workflow

**Generate syllable-based statistics:**
```bash
node analyze.js
```
This creates:
- `telugu-stats.json` - Formatted analysis data
- `telugu-stats.min.json` - Compressed version

**Start dashboard server:**
```bash
npm run serve
# or
python3 -m http.server 8000
```

**View dashboards:**
- Basic analysis: `http://localhost:8000/index.html`
- Advanced analysis: `http://localhost:8000/advanced-analysis.html`
- **Beautiful unified dashboard**: `http://localhost:8000/beautiful-analysis.html` ⭐ **RECOMMENDED**

**Test syllable extraction:**
```bash
python3 test_syllables.py
```

### npm Scripts

```bash
npm run analyze    # Run syllable analysis
npm run serve      # Start HTTP server
npm run dev        # Start development server
npm start          # Start server
```

### Direct Data Usage

```javascript
import { wordList } from './sortdict.js';
// wordList is now an array of 54,196+ Telugu words
```

## Technical Implementation

### Data Structures

The analysis generates a comprehensive JSON structure with:

```json
{
  "syllableAnalysis": {
    "mostFrequentSyllables": [
      { "syllable": "మ", "count": 1250, "percentage": 12.5 }
    ],
    "consonantFrequency": [
      { "consonant": "మ", "count": 1250, "percentage": 12.5 }
    ],
    "syllablesPerWord": {
      "distribution": [
        { "syllableCount": 3, "wordCount": 3500, "percentage": 35.0 }
      ],
      "averageSyllablesPerWord": 3.1
    },
    "totalUniqueSyllables": 1842
  },
  "aksharams": {
    "consonantVowelCombinations": [
      { "combination": "కా", "count": 420, "percentage": 4.2 }
    ]
  }
}
```

### Dashboard Features

**Beautiful Unified Dashboard (`beautiful-analysis.html`):** ⭐ **RECOMMENDED**
- **Complete Integration**: Combines all basic and advanced analysis in one beautiful interface
- **Sectioned Navigation**: Organized into Core Analysis, Linguistic Deep-Dive, Morphology, Phonetics, and Insights
- **Stunning Visual Design**:
  - Gradient backgrounds and glassmorphism effects
  - Professional color palette with Telugu-optimized styling
  - Smooth animations and hover effects
  - Enhanced typography and spacing
- **Comprehensive Coverage**: All 27+ linguistic analysis categories in one place
- **Advanced Interactivity**:
  - Tabbed navigation between analysis sections
  - Sub-navigation for different chart modes
  - Enhanced tooltips with detailed linguistic information
- **Beautiful Chart Variety**: Bar, line, doughnut, pie, polar area, radar, and scatter charts
- **Responsive Excellence**: Optimized for desktop, tablet, and mobile viewing
- **Professional Insights**: Curated linguistic findings with emoji icons and detailed explanations

**Advanced Analysis Dashboard (`advanced-analysis.html`):**
- **Comprehensive Coverage**: All 27+ linguistic analysis categories
- **Advanced Chart Types**: Radar charts, scatter plots, polar area charts
- **Interactive Navigation**: Tabbed sections for different analysis modes
- **Telugu-Specific Insights**:
  - Loan word distribution (Native vs Sanskrit/Arabic/English origins)
  - Morphological analysis (prefixes, suffixes, root patterns)
  - Phonetic analysis (consonant clusters, sandhi patterns)
  - Semantic analysis (word complexity, cognitive load assessment)
  - Case marker usage and grammatical patterns
- **Enhanced Visualizations**:
  - Multi-dimensional phonetic analysis
  - Etymological breakdowns
  - Morpheme frequency patterns
  - Cognitive complexity assessments
- **Professional UI**: Gradient design, enhanced tooltips, linguistic terminology
- **Real-time Loading**: Fetches comprehensive analysis data from `telugu-stats.json`

**Basic Dashboard (`index.html`):**
- **Interactive Charts**: Bar, line, doughnut, and polar area charts
- **Multiple Views**: Frequency, consonant patterns, CV combinations
- **Core syllable analysis**: Most common syllables, word length distribution
- **Responsive Design**: Works on desktop and mobile
- **Telugu Font Support**: Proper rendering of Telugu text

**Advanced Analysis Dashboard (`advanced-analysis.html`):**
- **Comprehensive Coverage**: All 27+ linguistic analysis categories
- **Advanced Chart Types**: Radar charts, scatter plots, polar area charts
- **Interactive Navigation**: Tabbed sections for different analysis modes
- **Telugu-Specific Insights**: Loan word distribution, morphological analysis, phonetic analysis, semantic analysis, case marker usage
- **Professional UI**: Gradient design, enhanced tooltips, linguistic terminology

### Browser Requirements

- Modern browser with ES6 support
- HTTP server (not file:// protocol) for JSON loading
- Telugu font support (automatically handled)

## Important Notes

### Node.js Compatibility
- Use Node.js 16+ for best compatibility
- ES module/CommonJS conflicts may require manual resolution
- System-level Node.js issues may prevent script execution

### Browser Security
- Dashboard must be served via HTTP server (not opened directly)
- Use `python3 -m http.server 8000` or similar
- Prevents CORS errors when loading JSON data

### Telugu Rendering
- Automatic fallback fonts: 'Noto Sans Telugu', 'Telugu Sangam MN'
- Proper Unicode range handling (U+0C00 to U+0C7F)
- Chart.js configured for Telugu text display

## Troubleshooting

**Analysis script fails:**
```bash
# Try with explicit flags
node --experimental-modules analyze.js

# Check Node.js version
node --version  # Should be 16+

# Alternative: Use Python test script
python3 test_syllables.py
```

**Dashboard shows loading error:**
```bash
# Ensure HTTP server is running
python3 -m http.server 8000

# Check file exists
ls -la telugu-stats.json

# Test with sample data
mv telugu-stats-syllable-sample.json telugu-stats.json
```

**Chart display issues:**
- Ensure proper internet connection (Chart.js CDN)
- Check browser console for errors
- Verify JSON structure matches expected format

## Development History

1. **Initial**: Character-based analysis (incorrect approach)
2. **Restructured**: Syllable-based analysis (linguistically correct)
3. **Implemented**: Comprehensive syllable extraction algorithm
4. **Enhanced**: Interactive dashboard with multiple chart types
5. **Validated**: Proof-of-concept with sample data

The project now provides accurate Telugu linguistic analysis focusing on meaningful syllabic units rather than individual characters.
- **Range**: From "అంక" to "హ్ల్హాదుండు"
- **Content**: Includes nouns, verbs, compound terms, Sanskrit-origin words, technical terminology

### Integration Context

This repository is part of a Telugu language learning ecosystem (visible in parent directory structure). It likely serves as a vocabulary source for:
- FlashCards applications
- Duolingo-style language learning apps
- Pair/memory games
- React Native flash card applications

### File Modifications

When modifying the word list:
1. Maintain ES6 export syntax: `export const wordList = [`
2. Keep Telugu alphabetical ordering
3. Ensure proper UTF-8 encoding for Telugu characters
4. Each word should be a quoted string followed by comma (except last entry)
5. Close with `];` on final line

### Testing the Module

```bash
# Test import in Node.js
node -e "import('./sortdict.js').then(m => console.log('Words loaded:', m.wordList.length))"

# Validate no syntax errors
node --check sortdict.js
```