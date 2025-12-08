const fs = require('fs');

// Read and parse the sortdict.js file manually since we need CommonJS
const fileContent = fs.readFileSync('./sortdict.js', 'utf8');

// Extract the word list from the export statement
const wordListMatch = fileContent.match(/export const wordList = \[([\s\S]*?)\];/);
if (!wordListMatch) {
    console.error('Could not extract word list from sortdict.js');
    process.exit(1);
}

// Parse the words from the matched content
const wordListContent = wordListMatch[1];
const wordList = wordListContent
    .split(',')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^["']|["']$/g, ''));

console.log(`Extracted ${wordList.length} words from sortdict.js`);

class TeluguWordAnalyzer {
    constructor(words) {
        this.words = words;
        this.stats = {};
    }

    generateAllStats() {
        console.log('Starting Telugu word analysis...');
        console.log(`Analyzing ${this.words.length} words`);

        this.generateBasicStats();
        this.analyzeLengthDistribution();
        this.analyzeSyllableFrequency();  // New syllable-based analysis
        this.analyzeAksharams();
        this.analyzeGunintam();
        this.analyzeWordBeginnings();
        this.analyzeWordEndings();
        this.analyzeWordPatterns();
        this.analyzeTeluguLinguistics();  // Advanced Telugu-specific analysis
        this.analyzeMorphology();         // Word formation patterns
        this.analyzePhonetics();          // Sound pattern analysis
        this.analyzeSemanticPatterns();   // Meaning-based analysis
        this.findInterestingWords();

        console.log('Analysis complete!');
        return this.stats;
    }

    generateBasicStats() {
        console.log('Generating basic statistics...');

        const totalWords = this.words.length;

        // Filter out unrealistic entries for basic stats too
        const validWords = this.words.filter(word => {
            return word.length <= 30 && !word.includes(' ') &&
                   (word.match(/[।॥,.!?;]/g) || []).length <= 1;
        });

        const allChars = new Set();
        let totalLength = 0;
        let longestWord = '';
        let shortestWord = validWords.find(w => w.length > 0) || '';

        this.words.forEach(word => {
            totalLength += word.length;
            for (const char of word) {
                allChars.add(char);
            }
        });

        // Use validWords for longest/shortest calculations
        validWords.forEach(word => {
            if (word.length > longestWord.length) {
                longestWord = word;
            }
            if (word.length > 0 && word.length < shortestWord.length) {
                shortestWord = word;
            }
        });

        this.stats.basic = {
            totalWords,
            averageLength: parseFloat((totalLength / totalWords).toFixed(2)),
            uniqueCharacters: allChars.size,
            longestWord: {
                word: longestWord,
                length: longestWord.length
            },
            shortestWord: {
                word: shortestWord,
                length: shortestWord.length
            },
            totalCharacters: totalLength,
            validWordsCount: validWords.length,
            filteredOutCount: totalWords - validWords.length
        };

        console.log(`Found ${validWords.length} valid words out of ${totalWords} total entries`);
        console.log(`Longest valid word: "${longestWord}" (${longestWord.length} chars)`);
    }

    analyzeLengthDistribution() {
        console.log('Analyzing word length distribution...');

        const lengthCounts = {};

        this.words.forEach(word => {
            const length = word.length;
            lengthCounts[length] = (lengthCounts[length] || 0) + 1;
        });

        // Convert to arrays for chart rendering
        const lengths = Object.keys(lengthCounts).map(Number).sort((a, b) => a - b);
        const counts = lengths.map(length => lengthCounts[length]);
        const percentages = counts.map(count => parseFloat(((count / this.words.length) * 100).toFixed(2)));

        this.stats.lengthDistribution = {
            lengths,
            counts,
            percentages,
            raw: lengthCounts
        };
    }

    analyzeSyllableFrequency() {
        console.log('Analyzing syllable frequency patterns...');

        const syllableFreq = {};
        const syllableLength = {};
        const consonantPatterns = {};

        this.words.forEach(word => {
            const syllables = this.extractSyllables(word);

            // Count syllables per word
            const syllCount = syllables.length;
            syllableLength[syllCount] = (syllableLength[syllCount] || 0) + 1;

            syllables.forEach(syllable => {
                if (syllable.trim()) {
                    syllableFreq[syllable] = (syllableFreq[syllable] || 0) + 1;

                    // Analyze consonant patterns
                    if (syllable.length > 0 && this.isConsonant(syllable[0])) {
                        const consonant = syllable[0];
                        consonantPatterns[consonant] = (consonantPatterns[consonant] || 0) + 1;
                    }
                }
            });
        });

        const sortedSyllables = Object.entries(syllableFreq)
            .sort(([,a], [,b]) => b - a);

        const sortedConsonants = Object.entries(consonantPatterns)
            .sort(([,a], [,b]) => b - a);

        const sortedSyllableLengths = Object.entries(syllableLength)
            .sort(([a], [b]) => parseInt(a) - parseInt(b));

        this.stats.syllableAnalysis = {
            mostFrequentSyllables: sortedSyllables.slice(0, 25).map(([syllable, count]) => ({
                syllable,
                count,
                percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
            })),
            consonantFrequency: sortedConsonants.slice(0, 20).map(([consonant, count]) => ({
                consonant,
                count,
                percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
            })),
            syllablesPerWord: {
                distribution: sortedSyllableLengths.map(([length, count]) => ({
                    syllableCount: parseInt(length),
                    wordCount: count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),
                averageSyllablesPerWord: parseFloat((
                    Object.entries(syllableLength).reduce((sum, [length, count]) =>
                        sum + (parseInt(length) * count), 0) / this.words.length
                ).toFixed(2))
            },
            totalUniqueSyllables: sortedSyllables.length
        };
    }

    analyzeAksharams() {
        console.log('Analyzing aksharams (syllables)...');

        const aksharams = {};
        const consonantCombinations = {};
        const vowelUsage = {};

        // Telugu Unicode ranges
        const isConsonant = (char) => char >= '\u0C15' && char <= '\u0C39';
        const isVowel = (char) => char >= '\u0C05' && char <= '\u0C14';
        const isVowelSign = (char) => char >= '\u0C3E' && char <= '\u0C4C';
        const isVirama = (char) => char === '\u0C4D';
        const isAvagraha = (char) => char === '\u0C3D';

        this.words.forEach(word => {
            const syllables = this.extractSyllables(word);

            syllables.forEach(syllable => {
                if (syllable.trim()) {
                    aksharams[syllable] = (aksharams[syllable] || 0) + 1;

                    // Analyze consonant-vowel combinations
                    if (syllable.length >= 2) {
                        const consonant = syllable[0];
                        if (isConsonant(consonant)) {
                            const combination = syllable;
                            consonantCombinations[combination] = (consonantCombinations[combination] || 0) + 1;
                        }
                    }

                    // Analyze vowel usage in syllables
                    for (const char of syllable) {
                        if (isVowel(char) || isVowelSign(char)) {
                            vowelUsage[char] = (vowelUsage[char] || 0) + 1;
                        }
                    }
                }
            });
        });

        const sortedAksharams = Object.entries(aksharams)
            .sort(([,a], [,b]) => b - a);

        const sortedCombinations = Object.entries(consonantCombinations)
            .sort(([,a], [,b]) => b - a);

        const sortedVowels = Object.entries(vowelUsage)
            .sort(([,a], [,b]) => b - a);

        this.stats.aksharams = {
            top30: sortedAksharams.slice(0, 30).map(([aksharam, count]) => ({
                aksharam,
                count,
                percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
            })),
            consonantVowelCombinations: sortedCombinations.slice(0, 20).map(([combo, count]) => ({
                combination: combo,
                count,
                percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
            })),
            vowelUsageInSyllables: sortedVowels.slice(0, 15).map(([vowel, count]) => ({
                vowel,
                count,
                percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
            })),
            totalUniqueSyllables: sortedAksharams.length,
            totalSyllableOccurrences: Object.values(aksharams).reduce((sum, count) => sum + count, 0)
        };
    }

    // Helper function to extract Telugu syllables from a word
    extractSyllables(word) {
        const syllables = [];
        let currentSyllable = '';

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const nextChar = word[i + 1];

            if (this.isConsonant(char)) {
                // Start a new syllable with consonant
                if (currentSyllable && !this.isVirama(currentSyllable[currentSyllable.length - 1])) {
                    syllables.push(currentSyllable);
                    currentSyllable = '';
                }
                currentSyllable += char;

                // Add inherent 'a' sound if no vowel sign follows
                if (!nextChar || (!this.isVowelSign(nextChar) && !this.isVirama(nextChar))) {
                    // Only add inherent vowel if it's not followed by virama
                    if (!this.isVirama(nextChar)) {
                        // Consonant with inherent 'a' - complete syllable
                    }
                }
            } else if (this.isVowel(char)) {
                // Independent vowel - complete syllable
                if (currentSyllable) {
                    syllables.push(currentSyllable);
                }
                currentSyllable = char;
                syllables.push(currentSyllable);
                currentSyllable = '';
            } else if (this.isVowelSign(char)) {
                // Vowel sign - add to current consonant
                currentSyllable += char;
            } else if (this.isVirama(char)) {
                // Virama - add to current consonant (conjunct)
                currentSyllable += char;
            } else {
                // Other characters (numbers, punctuation, etc.)
                if (currentSyllable) {
                    syllables.push(currentSyllable);
                    currentSyllable = '';
                }
                if (char.trim()) {
                    syllables.push(char);
                }
            }
        }

        // Add remaining syllable
        if (currentSyllable) {
            syllables.push(currentSyllable);
        }

        return syllables;
    }

    // Helper functions for Unicode ranges
    isConsonant(char) {
        return char >= '\u0C15' && char <= '\u0C39';
    }

    isVowel(char) {
        return char >= '\u0C05' && char <= '\u0C14';
    }

    isVowelSign(char) {
        return char >= '\u0C3E' && char <= '\u0C4C';
    }

    isVirama(char) {
        return char === '\u0C4D';
    }

    analyzeGunintam() {
        console.log('Analyzing gunintam (vowel modifiers)...');

        const gunintams = {};

        this.words.forEach(word => {
            for (const char of word) {
                const charCode = char.charCodeAt(0);
                // Telugu matras/vowel signs
                if (charCode >= 0x0C3E && charCode <= 0x0C4D) {
                    gunintams[char] = (gunintams[char] || 0) + 1;
                }
            }
        });

        const sortedGunintams = Object.entries(gunintams)
            .sort(([,a], [,b]) => b - a);

        this.stats.gunintam = {
            all: sortedGunintams.map(([gunintam, count]) => ({
                gunintam,
                count,
                percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
            })),
            totalUniqueGunintams: sortedGunintams.length
        };
    }

    analyzeWordBeginnings() {
        console.log('Analyzing word beginnings...');

        const beginnings1 = {};
        const beginnings2 = {};
        const beginnings3 = {};

        this.words.forEach(word => {
            if (word.length >= 1) {
                const beginning1 = word.substring(0, 1);
                beginnings1[beginning1] = (beginnings1[beginning1] || 0) + 1;
            }

            if (word.length >= 2) {
                const beginning2 = word.substring(0, 2);
                beginnings2[beginning2] = (beginnings2[beginning2] || 0) + 1;
            }

            if (word.length >= 3) {
                const beginning3 = word.substring(0, 3);
                beginnings3[beginning3] = (beginnings3[beginning3] || 0) + 1;
            }
        });

        this.stats.wordBeginnings = {
            oneChar: Object.entries(beginnings1)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 20)
                .map(([beginning, count]) => ({
                    beginning,
                    count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2)),
                    examples: this.words.filter(word => word.startsWith(beginning)).slice(0, 3)
                })),
            twoChar: Object.entries(beginnings2)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 20)
                .map(([beginning, count]) => ({
                    beginning,
                    count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2)),
                    examples: this.words.filter(word => word.startsWith(beginning)).slice(0, 3)
                })),
            threeChar: Object.entries(beginnings3)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 15)
                .map(([beginning, count]) => ({
                    beginning,
                    count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2)),
                    examples: this.words.filter(word => word.startsWith(beginning)).slice(0, 3)
                }))
        };
    }

    analyzeWordEndings() {
        console.log('Analyzing word endings...');

        const endings1 = {};
        const endings2 = {};
        const endings3 = {};

        this.words.forEach(word => {
            if (word.length >= 1) {
                const ending1 = word.substring(word.length - 1);
                endings1[ending1] = (endings1[ending1] || 0) + 1;
            }

            if (word.length >= 2) {
                const ending2 = word.substring(word.length - 2);
                endings2[ending2] = (endings2[ending2] || 0) + 1;
            }

            if (word.length >= 3) {
                const ending3 = word.substring(word.length - 3);
                endings3[ending3] = (endings3[ending3] || 0) + 1;
            }
        });

        this.stats.wordEndings = {
            oneChar: Object.entries(endings1)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 20)
                .map(([ending, count]) => ({
                    ending,
                    count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2)),
                    examples: this.words.filter(word => word.endsWith(ending)).slice(0, 3)
                })),
            twoChar: Object.entries(endings2)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 20)
                .map(([ending, count]) => ({
                    ending,
                    count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2)),
                    examples: this.words.filter(word => word.endsWith(ending)).slice(0, 3)
                })),
            threeChar: Object.entries(endings3)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 15)
                .map(([ending, count]) => ({
                    ending,
                    count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2)),
                    examples: this.words.filter(word => word.endsWith(ending)).slice(0, 3)
                }))
        };
    }

    analyzeWordPatterns() {
        console.log('Analyzing word patterns...');

        const patterns = {
            withMatras: 0,
            withoutMatras: 0,
            withHalanta: 0,
            withNumbers: 0,
            withPunctuation: 0,
            allConsonants: 0,
            allVowels: 0
        };

        this.words.forEach(word => {
            let hasMatras = false;
            let hasHalanta = false;
            let hasNumbers = false;
            let hasPunctuation = false;
            let allConsonants = true;
            let allVowels = true;

            for (const char of word) {
                const charCode = char.charCodeAt(0);

                // Check for matras
                if (charCode >= 0x0C3E && charCode <= 0x0C4D) {
                    hasMatras = true;
                    if (charCode === 0x0C4D) hasHalanta = true;
                }

                // Check for numbers
                if (charCode >= 0x0C66 && charCode <= 0x0C6F) {
                    hasNumbers = true;
                }

                // Check for punctuation
                if (charCode >= 0x0964 && charCode <= 0x0965) {
                    hasPunctuation = true;
                }

                // Check consonants and vowels
                if (!(charCode >= 0x0C15 && charCode <= 0x0C39)) {
                    allConsonants = false;
                }
                if (!(charCode >= 0x0C05 && charCode <= 0x0C14)) {
                    allVowels = false;
                }
            }

            if (hasMatras) patterns.withMatras++;
            else patterns.withoutMatras++;

            if (hasHalanta) patterns.withHalanta++;
            if (hasNumbers) patterns.withNumbers++;
            if (hasPunctuation) patterns.withPunctuation++;
            if (allConsonants) patterns.allConsonants++;
            if (allVowels) patterns.allVowels++;
        });

        this.stats.patterns = {
            ...patterns,
            percentages: {
                withMatras: parseFloat(((patterns.withMatras / this.words.length) * 100).toFixed(2)),
                withoutMatras: parseFloat(((patterns.withoutMatras / this.words.length) * 100).toFixed(2)),
                withHalanta: parseFloat(((patterns.withHalanta / this.words.length) * 100).toFixed(2)),
                withNumbers: parseFloat(((patterns.withNumbers / this.words.length) * 100).toFixed(2)),
                withPunctuation: parseFloat(((patterns.withPunctuation / this.words.length) * 100).toFixed(2)),
                allConsonants: parseFloat(((patterns.allConsonants / this.words.length) * 100).toFixed(2)),
                allVowels: parseFloat(((patterns.allVowels / this.words.length) * 100).toFixed(2))
            }
        };
    }

    analyzeTeluguLinguistics() {
        console.log('Analyzing Telugu-specific linguistic patterns...');

        const sandhiPatterns = {};
        const compoundWords = {};
        const caseMarkers = {};
        const honorificPatterns = {};
        const reduplicationPatterns = {};
        const loanWordPatterns = {
            sanskrit: 0, arabic: 0, english: 0, native: 0
        };

        // Telugu case markers and grammatical suffixes
        const teluguCaseMarkers = [
            'కు', 'తో', 'లో', 'న', 'కి', 'చే', 'వల్ల', 'కోసం',  // Dative, Instrumental, Locative
            'ని', 'ను', 'నుండి', 'నుంచి', 'వరకు', 'దాకా',      // Accusative, Ablative
            'గా', 'లా', 'మాత్రం', 'మాత్రమే', 'కాదు'            // Adverbial, Restrictive
        ];

        // Sanskrit/loan word indicators
        const sanskritIndicators = ['క్ష', 'జ్ఞ', 'శ్రీ', 'స్వ', 'ప్ర', 'సం', 'వి', 'అభి', 'ప్రతి'];
        const arabicIndicators = ['ఫ', 'జ', 'ఖ', 'ఘ', 'ఝ', 'ఢ', 'ధ', 'భ', 'ష'];
        const englishIndicators = ['‌', '్', 'స్టేషన్', 'స్కూల్', 'కాలేజ్'];

        // Honorific patterns
        const honorificSuffixes = ['గారు', 'వారు', 'గార్లు', 'అయ్య', 'అమ్మ', 'బాబు'];

        this.words.forEach(word => {
            if (word.length < 3) return; // Skip very short words

            // Analyze sandhi (word joining patterns)
            if (word.includes('్య') || word.includes('్వ') || word.includes('్మ')) {
                const pattern = this.extractSandhiPattern(word);
                if (pattern) {
                    sandhiPatterns[pattern] = (sandhiPatterns[pattern] || 0) + 1;
                }
            }

            // Detect compound words (multiple meaningful parts)
            if (word.length > 8) {
                const compounds = this.detectCompoundStructure(word);
                compounds.forEach(compound => {
                    compoundWords[compound] = (compoundWords[compound] || 0) + 1;
                });
            }

            // Analyze case markers
            teluguCaseMarkers.forEach(marker => {
                if (word.endsWith(marker)) {
                    caseMarkers[marker] = (caseMarkers[marker] || 0) + 1;
                }
            });

            // Analyze honorific usage
            honorificSuffixes.forEach(honorific => {
                if (word.includes(honorific)) {
                    honorificPatterns[honorific] = (honorificPatterns[honorific] || 0) + 1;
                }
            });

            // Detect reduplication (repetition patterns)
            const reduplication = this.detectReduplication(word);
            if (reduplication) {
                reduplicationPatterns[reduplication] = (reduplicationPatterns[reduplication] || 0) + 1;
            }

            // Analyze loan word patterns
            if (sanskritIndicators.some(indicator => word.includes(indicator))) {
                loanWordPatterns.sanskrit++;
            } else if (arabicIndicators.some(indicator => word.includes(indicator))) {
                loanWordPatterns.arabic++;
            } else if (englishIndicators.some(indicator => word.includes(indicator))) {
                loanWordPatterns.english++;
            } else {
                loanWordPatterns.native++;
            }
        });

        this.stats.teluguLinguistics = {
            sandhiPatterns: Object.entries(sandhiPatterns)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 15)
                .map(([pattern, count]) => ({
                    pattern, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            compoundWords: Object.entries(compoundWords)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 20)
                .map(([compound, count]) => ({
                    compound, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            caseMarkers: Object.entries(caseMarkers)
                .sort(([,a], [,b]) => b - a)
                .map(([marker, count]) => ({
                    marker, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            honorificPatterns: Object.entries(honorificPatterns)
                .sort(([,a], [,b]) => b - a)
                .map(([honorific, count]) => ({
                    honorific, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            reduplicationPatterns: Object.entries(reduplicationPatterns)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([pattern, count]) => ({
                    pattern, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            loanWordDistribution: {
                sanskrit: {
                    count: loanWordPatterns.sanskrit,
                    percentage: parseFloat(((loanWordPatterns.sanskrit / this.words.length) * 100).toFixed(2))
                },
                arabic: {
                    count: loanWordPatterns.arabic,
                    percentage: parseFloat(((loanWordPatterns.arabic / this.words.length) * 100).toFixed(2))
                },
                english: {
                    count: loanWordPatterns.english,
                    percentage: parseFloat(((loanWordPatterns.english / this.words.length) * 100).toFixed(2))
                },
                native: {
                    count: loanWordPatterns.native,
                    percentage: parseFloat(((loanWordPatterns.native / this.words.length) * 100).toFixed(2))
                }
            }
        };
    }

    // Helper methods for Telugu linguistic analysis
    extractSandhiPattern(word) {
        // Extract consonant cluster patterns that indicate sandhi
        const sandhiPatterns = word.match(/[క-హ]్[క-హ]/g);
        return sandhiPatterns ? sandhiPatterns[0] : null;
    }

    detectCompoundStructure(word) {
        // Simple compound detection based on common Telugu compound patterns
        const compounds = [];
        const commonRoots = ['గృహ', 'లోక', 'దేవ', 'రాజ', 'భూ', 'జల', 'అగ్ని', 'వాయు'];

        commonRoots.forEach(root => {
            if (word.includes(root) && word.length > root.length + 3) {
                compounds.push(root);
            }
        });

        return compounds;
    }

    detectReduplication(word) {
        // Detect complete or partial word repetition
        if (word.length >= 6) {
            const halfLength = Math.floor(word.length / 2);
            const firstHalf = word.substring(0, halfLength);
            const secondHalf = word.substring(halfLength);

            if (firstHalf === secondHalf) {
                return `${firstHalf}-${secondHalf}`;
            }

            // Partial reduplication (first 2-3 syllables)
            const firstPart = word.substring(0, 4);
            if (word.includes(firstPart) && word.lastIndexOf(firstPart) !== 0) {
                return `${firstPart}...${firstPart}`;
            }
        }
        return null;
    }

    analyzeMorphology() {
        console.log('Analyzing morphological patterns...');

        const prefixes = {};
        const suffixes = {};
        const rootPatterns = {};
        const derivationalPatterns = {};

        // Common Telugu prefixes
        const teluguPrefixes = [
            'అ', 'అన', 'ఉప', 'ప్ర', 'పర', 'సు', 'దు', 'వి', 'సం', 'నిర',
            'అధి', 'అభి', 'ప్రతి', 'పరా', 'అవ', 'అను', 'ఉత', 'అంతర'
        ];

        // Common Telugu suffixes
        const teluguSuffixes = [
            'ము', 'డు', 'లు', 'చు', 'ను', 'తి', 'కు', 'వు', 'రు', 'ది',
            'యము', 'తము', 'నము', 'కము', 'లము', 'పు', 'ిక', 'ీయ', 'త్వ'
        ];

        this.words.forEach(word => {
            if (word.length < 4) return;

            // Analyze prefixes
            teluguPrefixes.forEach(prefix => {
                if (word.startsWith(prefix) && word.length > prefix.length + 2) {
                    prefixes[prefix] = (prefixes[prefix] || 0) + 1;
                }
            });

            // Analyze suffixes
            teluguSuffixes.forEach(suffix => {
                if (word.endsWith(suffix) && word.length > suffix.length + 2) {
                    suffixes[suffix] = (suffixes[suffix] || 0) + 1;
                }
            });

            // Analyze root patterns (CV patterns in roots)
            const rootPattern = this.extractRootPattern(word);
            if (rootPattern) {
                rootPatterns[rootPattern] = (rootPatterns[rootPattern] || 0) + 1;
            }

            // Derivational analysis (base + derivational morphemes)
            const derivation = this.analyzeDerivation(word);
            if (derivation) {
                derivationalPatterns[derivation] = (derivationalPatterns[derivation] || 0) + 1;
            }
        });

        this.stats.morphology = {
            prefixFrequency: Object.entries(prefixes)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 15)
                .map(([prefix, count]) => ({
                    prefix, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            suffixFrequency: Object.entries(suffixes)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 20)
                .map(([suffix, count]) => ({
                    suffix, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            rootPatterns: Object.entries(rootPatterns)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 12)
                .map(([pattern, count]) => ({
                    pattern, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            derivationalPatterns: Object.entries(derivationalPatterns)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([pattern, count]) => ({
                    pattern, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                }))
        };
    }

    extractRootPattern(word) {
        // Extract CV (consonant-vowel) pattern from word root
        const syllables = this.extractSyllables(word);
        if (syllables.length >= 2) {
            const rootSyllables = syllables.slice(0, 2); // First two syllables as root indicator
            return rootSyllables.map(syl => {
                if (this.isConsonant(syl[0])) {
                    return syl.length > 1 ? 'CV' : 'C';
                } else if (this.isVowel(syl[0])) {
                    return 'V';
                }
                return 'X';
            }).join('-');
        }
        return null;
    }

    analyzeDerivation(word) {
        // Identify derivational patterns (noun->adjective, verb->noun, etc.)
        const adjectivalSuffixes = ['ిక', 'ీయ', 'వంత', 'మంత'];
        const nominalSuffixes = ['త్వ', 'మై', 'తనం', 'త्व'];
        const verbalSuffixes = ['చు', 'ించు', 'పించు', 'కొను'];

        for (const suffix of adjectivalSuffixes) {
            if (word.endsWith(suffix)) return `ADJ-${suffix}`;
        }
        for (const suffix of nominalSuffixes) {
            if (word.endsWith(suffix)) return `NOUN-${suffix}`;
        }
        for (const suffix of verbalSuffixes) {
            if (word.endsWith(suffix)) return `VERB-${suffix}`;
        }
        return null;
    }

    analyzePhonetics() {
        console.log('Analyzing phonetic patterns...');

        const phoneticPatterns = {};
        const consonantClusters = {};
        const vowelSequences = {};
        const alliterationPatterns = {};
        const phoneticConstraints = {};

        // Telugu-specific phonotactic rules
        const forbiddenClusters = ['ణ్క', 'ఱ్ప', 'ళ్చ']; // Some combinations are rare/forbidden
        const commonClusters = ['క్క', 'ట్ట', 'ప్ప', 'చ్చ', 'న్న', 'మ్మ']; // Gemination

        this.words.forEach(word => {
            const syllables = this.extractSyllables(word);

            // Analyze phonetic patterns in syllables
            syllables.forEach(syllable => {
                if (syllable.length > 1) {
                    const phoneticPattern = this.getPhoneticPattern(syllable);
                    if (phoneticPattern) {
                        phoneticPatterns[phoneticPattern] = (phoneticPatterns[phoneticPattern] || 0) + 1;
                    }
                }
            });

            // Analyze consonant clusters
            const clusters = word.match(/[క-హ]్[క-హ]/g) || [];
            clusters.forEach(cluster => {
                consonantClusters[cluster] = (consonantClusters[cluster] || 0) + 1;

                // Check phonotactic constraints
                if (forbiddenClusters.includes(cluster)) {
                    phoneticConstraints[`forbidden-${cluster}`] = (phoneticConstraints[`forbidden-${cluster}`] || 0) + 1;
                } else if (commonClusters.includes(cluster)) {
                    phoneticConstraints[`common-${cluster}`] = (phoneticConstraints[`common-${cluster}`] || 0) + 1;
                }
            });

            // Analyze vowel sequences
            const vowels = word.match(/[అ-ఔ]/g) || [];
            if (vowels.length > 1) {
                const vowelSeq = vowels.join('');
                vowelSequences[vowelSeq] = (vowelSequences[vowelSeq] || 0) + 1;
            }

            // Analyze alliteration (same starting sounds)
            if (syllables.length >= 2) {
                const firstSounds = syllables.slice(0, 3).map(syl => syl[0]).join('');
                if (this.hasAlliteration(firstSounds)) {
                    alliterationPatterns[firstSounds] = (alliterationPatterns[firstSounds] || 0) + 1;
                }
            }
        });

        this.stats.phonetics = {
            phoneticPatterns: Object.entries(phoneticPatterns)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 15)
                .map(([pattern, count]) => ({
                    pattern, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            consonantClusters: Object.entries(consonantClusters)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 20)
                .map(([cluster, count]) => ({
                    cluster, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            vowelSequences: Object.entries(vowelSequences)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([sequence, count]) => ({
                    sequence, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            alliterationPatterns: Object.entries(alliterationPatterns)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([pattern, count]) => ({
                    pattern, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            phoneticConstraints: Object.entries(phoneticConstraints)
                .sort(([,a], [,b]) => b - a)
                .map(([constraint, count]) => ({
                    constraint, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                }))
        };
    }

    getPhoneticPattern(syllable) {
        // Convert syllable to phonetic pattern (C=Consonant, V=Vowel)
        let pattern = '';
        for (const char of syllable) {
            if (this.isConsonant(char)) {
                pattern += 'C';
            } else if (this.isVowel(char) || this.isVowelSign(char)) {
                pattern += 'V';
            } else if (this.isVirama(char)) {
                pattern += '्';
            }
        }
        return pattern.length > 1 ? pattern : null;
    }

    hasAlliteration(soundSequence) {
        // Simple alliteration detection - same consonants at start
        if (soundSequence.length >= 2) {
            const firstChar = soundSequence[0];
            return soundSequence.split('').every(char => char === firstChar);
        }
        return false;
    }

    analyzeSemanticPatterns() {
        console.log('Analyzing semantic and word-specific patterns...');

        const wordComplexity = {};
        const wordClasses = {};
        const semanticFields = {};
        const wordFormation = {};
        const cognitiveLoad = {};

        // Telugu semantic field indicators
        const semanticFieldMarkers = {
            'family': ['అమ్మ', 'నాన్న', 'అన్న', 'అక్క', 'తమ్మ', 'చెల్లి'],
            'body': ['తల', 'కళ్లు', 'చేయి', 'కాలు', 'ముఖం', 'వేలు'],
            'nature': ['చెట్టు', 'పువ్వు', 'నది', 'కొండ', 'సముద్రం', 'ఆకాశం'],
            'food': ['అన్నం', 'రోటీ', 'కూర', 'పాలు', 'పండు', 'నీరు'],
            'time': ['రోజు', 'నెల', 'సంవత్సర', 'గంట', 'నిమిషం', 'ఉదయం'],
            'action': ['వెళ్లు', 'వచ్చు', 'చేయు', 'చూడు', 'విను', 'మాట్లాడు']
        };

        // Word class indicators
        const wordClassMarkers = {
            'noun': ['ము', 'డు', 'లు', 'మ్మ', 'న్న'],
            'verb': ['చు', 'ను', 'దు', 'ంచు', 'ించు'],
            'adjective': ['ిక', 'ైన', 'ంత', 'త'],
            'adverb': ['గా', 'లా', 'రా', 'కూడా']
        };

        this.words.forEach(word => {
            if (word.length < 3) return;

            // Analyze word complexity (syllable count + morpheme count)
            const syllables = this.extractSyllables(word);
            const morphemeCount = this.estimateMorphemes(word);
            const complexity = syllables.length + morphemeCount;

            const complexityCategory = complexity <= 3 ? 'simple' :
                                     complexity <= 6 ? 'medium' :
                                     complexity <= 9 ? 'complex' : 'highly_complex';

            wordComplexity[complexityCategory] = (wordComplexity[complexityCategory] || 0) + 1;

            // Analyze word classes
            for (const [className, markers] of Object.entries(wordClassMarkers)) {
                if (markers.some(marker => word.includes(marker))) {
                    wordClasses[className] = (wordClasses[className] || 0) + 1;
                    break; // First match wins
                }
            }

            // Analyze semantic fields
            for (const [field, indicators] of Object.entries(semanticFieldMarkers)) {
                if (indicators.some(indicator => word.includes(indicator))) {
                    semanticFields[field] = (semanticFields[field] || 0) + 1;
                }
            }

            // Analyze word formation patterns
            const formationType = this.analyzeWordFormation(word);
            if (formationType) {
                wordFormation[formationType] = (wordFormation[formationType] || 0) + 1;
            }

            // Estimate cognitive load (processing difficulty)
            const loadScore = this.estimateCognitiveLoad(word);
            const loadCategory = loadScore <= 5 ? 'easy' :
                               loadScore <= 10 ? 'medium' :
                               loadScore <= 15 ? 'hard' : 'very_hard';

            cognitiveLoad[loadCategory] = (cognitiveLoad[loadCategory] || 0) + 1;
        });

        this.stats.semanticPatterns = {
            wordComplexity: Object.entries(wordComplexity)
                .map(([category, count]) => ({
                    category, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            wordClasses: Object.entries(wordClasses)
                .sort(([,a], [,b]) => b - a)
                .map(([wordClass, count]) => ({
                    wordClass, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            semanticFields: Object.entries(semanticFields)
                .sort(([,a], [,b]) => b - a)
                .map(([field, count]) => ({
                    field, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            wordFormation: Object.entries(wordFormation)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([formation, count]) => ({
                    formation, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                })),

            cognitiveLoad: Object.entries(cognitiveLoad)
                .map(([category, count]) => ({
                    category, count,
                    percentage: parseFloat(((count / this.words.length) * 100).toFixed(2))
                }))
        };
    }

    estimateMorphemes(word) {
        // Estimate number of morphemes based on common Telugu morphological patterns
        let morphemeCount = 1; // Base word

        // Count prefixes
        const prefixes = ['అ', 'అన', 'ఉప', 'ప్ర', 'పర', 'సు', 'వి', 'సం'];
        prefixes.forEach(prefix => {
            if (word.startsWith(prefix)) morphemeCount++;
        });

        // Count suffixes
        const suffixes = ['ము', 'డు', 'లు', 'చు', 'కు', 'తి', 'య', 'న'];
        suffixes.forEach(suffix => {
            if (word.endsWith(suffix)) morphemeCount++;
        });

        // Count compound indicators
        if (word.length > 8) morphemeCount++; // Likely compound

        return morphemeCount;
    }

    analyzeWordFormation(word) {
        // Analyze how the word was likely formed
        if (word.length <= 4) return 'simple';
        if (word.startsWith('అ') || word.startsWith('అన')) return 'negation';
        if (word.startsWith('ప్ర') || word.startsWith('సం')) return 'sanskrit_compound';
        if (word.includes('గారు') || word.includes('వారు')) return 'honorific';
        if (word.endsWith('ించు') || word.endsWith('పించు')) return 'causative';
        if (word.includes('్')) return 'conjunct_formation';

        return 'basic';
    }

    estimateCognitiveLoad(word) {
        // Estimate how difficult a word is to process
        let load = 0;

        // Length factor
        load += word.length * 0.5;

        // Syllable complexity
        const syllables = this.extractSyllables(word);
        load += syllables.length;

        // Consonant cluster difficulty
        const clusters = word.match(/[క-హ]్[క-హ]/g) || [];
        load += clusters.length * 2;

        // Morphological complexity
        load += this.estimateMorphemes(word);

        // Uncommon characters (higher Unicode values are typically less frequent)
        for (const char of word) {
            const charCode = char.charCodeAt(0);
            if (charCode > 0x0C39) load += 1; // Beyond basic consonants
        }

        return Math.round(load);
    }

    findInterestingWords() {
        console.log('Finding interesting words...');

        // Filter out unrealistic "words" (likely poetry lines or phrases)
        const validWords = this.words.filter(word => {
            // Remove entries that are too long to be legitimate single words
            if (word.length > 30) return false;

            // Remove entries with spaces (phrases)
            if (word.includes(' ')) return false;

            // Remove entries that look like sentences or verses
            // (containing multiple punctuation marks or very long sequences)
            const punctuationCount = (word.match(/[।॥,.!?;]/g) || []).length;
            if (punctuationCount > 1) return false;

            return true;
        });

        const longestWords = [...validWords]
            .sort((a, b) => b.length - a.length)
            .slice(0, 15)  // Get top 15 for better selection
            .map(word => ({ word, length: word.length }));

        const shortestWords = [...validWords]
            .filter(word => word.length > 0)  // Remove empty entries
            .sort((a, b) => a.length - b.length)
            .slice(0, 10)
            .map(word => ({ word, length: word.length }));

        const wordsWithUniqueChars = validWords
            .map(word => ({
                word,
                uniqueChars: new Set(word).size,
                length: word.length
            }))
            .sort((a, b) => b.uniqueChars - a.uniqueChars)
            .slice(0, 10);

        const palindromes = validWords
            .filter(word => word.length > 1 && word === word.split('').reverse().join(''))
            .slice(0, 15);  // Get more palindromes

        console.log(`Filtered ${this.words.length} total entries to ${validWords.length} valid words`);
        console.log(`Longest valid word: "${longestWords[0]?.word}" (${longestWords[0]?.length} chars)`);

        this.stats.interestingWords = {
            longest: longestWords,
            shortest: shortestWords,
            mostUniqueChars: wordsWithUniqueChars,
            palindromes
        };
    }

    saveStats(filename = 'telugu-stats.json') {
        console.log(`Saving statistics to ${filename}...`);

        const output = {
            metadata: {
                generatedAt: new Date().toISOString(),
                version: '1.0.0',
                totalWords: this.words.length
            },
            ...this.stats
        };

        fs.writeFileSync(filename, JSON.stringify(output, null, 2));
        console.log(`Statistics saved to ${filename}`);

        const compressedFilename = filename.replace('.json', '.min.json');
        fs.writeFileSync(compressedFilename, JSON.stringify(output));
        console.log(`Compressed version saved to ${compressedFilename}`);

        return filename;
    }

    printSummary() {
        console.log('\n=== TELUGU SYLLABLE-BASED ANALYSIS SUMMARY ===');
        console.log(`Total Words: ${this.stats.basic.totalWords.toLocaleString()}`);
        console.log(`Average Length: ${this.stats.basic.averageLength} characters`);
        console.log(`Unique Characters: ${this.stats.basic.uniqueCharacters}`);
        console.log(`Average Syllables per Word: ${this.stats.syllableAnalysis?.syllablesPerWord?.averageSyllablesPerWord || 'N/A'}`);
        console.log(`Total Unique Syllables: ${this.stats.syllableAnalysis?.totalUniqueSyllables || 'N/A'}`);
        console.log(`Longest Word: "${this.stats.basic.longestWord.word}" (${this.stats.basic.longestWord.length} chars)`);
        console.log(`Shortest Word: "${this.stats.basic.shortestWord.word}" (${this.stats.basic.shortestWord.length} chars)`);

        console.log('\nTop 5 Most Common Syllables:');
        if (this.stats.syllableAnalysis?.mostFrequentSyllables) {
            this.stats.syllableAnalysis.mostFrequentSyllables.slice(0, 5).forEach((item, i) => {
                console.log(`${i + 1}. "${item.syllable}" - ${item.count.toLocaleString()} times (${item.percentage}%)`);
            });
        }

        console.log('\nTop 5 Most Common Consonants:');
        if (this.stats.syllableAnalysis?.consonantFrequency) {
            this.stats.syllableAnalysis.consonantFrequency.slice(0, 5).forEach((item, i) => {
                console.log(`${i + 1}. "${item.consonant}" - ${item.count.toLocaleString()} times (${item.percentage}%)`);
            });
        }

        console.log('\nTop 5 Most Common Word Beginnings (2 chars):');
        if (this.stats.wordBeginnings?.twoChar) {
            this.stats.wordBeginnings.twoChar.slice(0, 5).forEach((item, i) => {
                console.log(`${i + 1}. "${item.beginning}" - ${item.count.toLocaleString()} words (${item.percentage}%)`);
            });
        }

        console.log('\n=== ADVANCED TELUGU LINGUISTICS ===');

        if (this.stats.teluguLinguistics?.caseMarkers?.length > 0) {
            console.log('\nTop 3 Case Markers:');
            this.stats.teluguLinguistics.caseMarkers.slice(0, 3).forEach((item, i) => {
                console.log(`${i + 1}. "${item.marker}" - ${item.count.toLocaleString()} words (${item.percentage}%)`);
            });
        }

        if (this.stats.teluguLinguistics?.loanWordDistribution) {
            console.log('\nLoan Word Distribution:');
            const loanWords = this.stats.teluguLinguistics.loanWordDistribution;
            console.log(`• Sanskrit origin: ${loanWords.sanskrit.percentage}%`);
            console.log(`• Native Telugu: ${loanWords.native.percentage}%`);
            console.log(`• Arabic origin: ${loanWords.arabic.percentage}%`);
            console.log(`• English origin: ${loanWords.english.percentage}%`);
        }

        if (this.stats.morphology?.prefixFrequency?.length > 0) {
            console.log('\nTop 3 Prefixes:');
            this.stats.morphology.prefixFrequency.slice(0, 3).forEach((item, i) => {
                console.log(`${i + 1}. "${item.prefix}" - ${item.count.toLocaleString()} words (${item.percentage}%)`);
            });
        }

        if (this.stats.semanticPatterns?.wordComplexity) {
            console.log('\nWord Complexity Distribution:');
            this.stats.semanticPatterns.wordComplexity.forEach(item => {
                console.log(`• ${item.category}: ${item.percentage}%`);
            });
        }

        console.log('\n=== SYLLABLE ANALYSIS COMPLETE ===\n');
    }
}

// Run the analysis
try {
    const analyzer = new TeluguWordAnalyzer(wordList);
    analyzer.generateAllStats();
    analyzer.printSummary();
    analyzer.saveStats('telugu-stats.json');

    console.log('✅ Analysis complete! Check telugu-stats.json for full results.');
} catch (error) {
    console.error('❌ Error during analysis:', error);
    process.exit(1);
}