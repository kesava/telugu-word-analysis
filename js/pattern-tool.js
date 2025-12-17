// Telugu Pattern Matching Tool - Gunintam & Othu Pattern Analysis

class TeluguPatternAnalyzer {
    constructor() {
        this.exampleWords = [
            'అమ్మ', 'అప్పా', 'అక్క', 'అన్న', 'తమ్ముడు', 'చెల్లెలు',
            'రాము', 'కృష్ణ', 'సీతా', 'లక్ష్మీ', 'శ్రీనివాస్', 'పద్మావతి',
            'వేంకట్', 'గోపాల్', 'రాధిక', 'భారతి', 'అనిల్', 'సుజాత',
            'మధుర్', 'చంద్ర', 'సుర్య', 'చంద్రశేఖర్', 'వివేక్', 'ప్రీతి',
            'నర్సింహ', 'గణేష్', 'సరస్వతి', 'దుర్గా', 'శివ', 'విష్ణు',
            'బ్రహ్మ', 'ఇంద్ర', 'వరుణ', 'వాయు', 'అగ్ని', 'పృథ్వీ',
            'కమల', 'చందన', 'మల్లిక', 'జాస్మిన్', 'రోజా', 'సుందరి',
            'రమణ', 'మోహన్', 'సుధాకర్', 'ప్రసాద్', 'శేఖర్', 'రవీంద్ర',
            'ఆకాశం', 'భూమి', 'నీరు', 'గాలి', 'అగ్ని', 'చంద్రుడు', 'సూర్యుడు',
            'గురువు', 'శిష్యుడు', 'మిత్రుడు', 'శత్రువు', 'బంధువు', 'పొరుగు',
            'పుస్తకం', 'కలం', 'కాగితం', 'పాఠశాల', 'ఉపాధ్యాయుడు', 'విద్యార్థి',
            'ప్రేమ', 'శాంతి', 'ఆనందం', 'దుఃఖం', 'కోపం', 'భయం', 'ఆశ', 'నమ్మకం',
            'వసంతం', 'వేసవి', 'వర్షాకాలం', 'శరత్కాలం', 'శీతాకాలం', 'హేమంతం',
            'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం', 'ఆదివారం',
            'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జులై', 'ఆగస్టు',
            'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్',
            'బంగారం', 'వెండి', 'రాగి', 'ఇనుము', 'అల్యూమినియం', 'జింక్',
            'ఎర్రటి', 'తెల్లని', 'నలుపు', 'పసుపు', 'ఆకుపచ్చ', 'నీలం', 'గులాబి',
            'పెద్ద', 'చిన్న', 'పొడవు', 'పొట్టి', 'మందం', 'సన్నని',
            'తీయటి', 'పులుపు', 'చేదు', 'కారం', 'ఉప్పు', 'చల్లని', 'వేడుకగా',
            'పిల్లలు', 'తల్లిదండ్రులు', 'దాతలు', 'అతిథులు', 'స్నేహితులు', 'బంధువులు'
        ];
    }

    // Extract syllables from Telugu word
    extractTeluguSyllables(word) {
        if (!word || typeof word !== 'string') return [];

        const syllables = [];
        let currentSyllable = '';

        // Telugu Unicode ranges
        const isConsonant = (char) => char >= '\u0C15' && char <= '\u0C39';
        const isVowel = (char) => char >= '\u0C05' && char <= '\u0C14';
        const isVowelSign = (char) => char >= '\u0C3E' && char <= '\u0C4C';
        const isVirama = (char) => char === '\u0C4D';

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const nextChar = word[i + 1];

            currentSyllable += char;

            if (isVowel(char)) {
                // Standalone vowel forms a syllable
                syllables.push(currentSyllable);
                currentSyllable = '';
            } else if (isConsonant(char)) {
                // Check if followed by virama (conjunct) or vowel sign
                if (nextChar && isVirama(nextChar)) {
                    // Consonant cluster continues
                    continue;
                } else if (nextChar && isVowelSign(nextChar)) {
                    // Wait for vowel sign
                    continue;
                } else {
                    // Consonant with inherent vowel 'a'
                    syllables.push(currentSyllable);
                    currentSyllable = '';
                }
            } else if (isVowelSign(char)) {
                // Vowel sign completes the syllable
                syllables.push(currentSyllable);
                currentSyllable = '';
            }
        }

        // Add any remaining characters as a syllable
        if (currentSyllable) {
            syllables.push(currentSyllable);
        }

        return syllables.filter(syl => syl.trim().length > 0);
    }

    // Analyze word shape and structure
    analyzeWordShape(word) {
        if (!word || typeof word !== 'string') return null;

        const shape = {
            syllableCount: 0,
            structure: '',
            consonantVowelPattern: '',
            conjunctCount: 0,
            vowelModifierCount: 0
        };

        // Get syllables
        const syllables = this.extractTeluguSyllables(word);
        shape.syllableCount = syllables.length;

        // Unicode classification helpers
        const isConsonant = (char) => char >= '\u0C15' && char <= '\u0C39';
        const isVowel = (char) => char >= '\u0C05' && char <= '\u0C14';
        const isVowelSign = (char) => char >= '\u0C3E' && char <= '\u0C4C';
        const isVirama = (char) => char === '\u0C4D';

        // Analyze structure
        let structurePattern = '';
        let cvPattern = '';

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const nextChar = word[i + 1];

            if (isConsonant(char)) {
                structurePattern += 'C';
                cvPattern += 'C';

                if (nextChar && isVirama(nextChar)) {
                    structurePattern += 'V'; // Virama
                    shape.conjunctCount++;
                }
            } else if (isVowel(char)) {
                structurePattern += 'V';
                cvPattern += 'V';
            } else if (isVowelSign(char)) {
                structurePattern += 'M'; // Modifier
                cvPattern += 'V';
                shape.vowelModifierCount++;
            } else if (isVirama(char)) {
                // Already counted with consonant
                continue;
            }
        }

        shape.structure = structurePattern;
        shape.consonantVowelPattern = cvPattern;

        return shape;
    }

    // Complete Telugu pattern analysis
    analyzeTeluguPattern(word) {
        if (!word || typeof word !== 'string') {
            return null;
        }

        const pattern = {
            gunintam: [],  // Vowel modifiers
            othu: [],      // Consonant conjuncts/clusters
            consonants: [],
            vowels: [],
            shape: null,
            syllables: []
        };

        // Get shape and syllables
        pattern.shape = this.analyzeWordShape(word);
        pattern.syllables = this.extractTeluguSyllables(word);

        // Telugu Unicode ranges
        const isConsonant = (char) => char >= '\u0C15' && char <= '\u0C39';
        const isVowel = (char) => char >= '\u0C05' && char <= '\u0C14';
        const isVowelSign = (char) => char >= '\u0C3E' && char <= '\u0C4C';
        const isVirama = (char) => char === '\u0C4D';

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const nextChar = word[i + 1];
            const prevChar = word[i - 1];

            if (isVowelSign(char)) {
                // Gunintam (vowel modifier) pattern
                pattern.gunintam.push({
                    position: i,
                    modifier: char,
                    attachedTo: prevChar || ''
                });
            } else if (isVirama(char) && nextChar) {
                // Othu (consonant conjunct) pattern
                pattern.othu.push({
                    position: i,
                    conjunct: prevChar + char + nextChar,
                    baseConsonant: prevChar,
                    conjunctConsonant: nextChar
                });
            } else if (isConsonant(char)) {
                pattern.consonants.push({
                    position: i,
                    consonant: char
                });
            } else if (isVowel(char)) {
                pattern.vowels.push({
                    position: i,
                    vowel: char
                });
            }
        }

        return pattern;
    }

    // Check if two patterns match exactly
    patternsMatch(pattern1, pattern2) {
        if (!pattern1 || !pattern2) return false;

        // Compare gunintam patterns
        if (pattern1.gunintam.length !== pattern2.gunintam.length) return false;
        for (let i = 0; i < pattern1.gunintam.length; i++) {
            if (pattern1.gunintam[i].position !== pattern2.gunintam[i].position ||
                pattern1.gunintam[i].modifier !== pattern2.gunintam[i].modifier) {
                return false;
            }
        }

        // Compare othu patterns
        if (pattern1.othu.length !== pattern2.othu.length) return false;
        for (let i = 0; i < pattern1.othu.length; i++) {
            if (pattern1.othu[i].position !== pattern2.othu[i].position ||
                pattern1.othu[i].baseConsonant !== pattern2.othu[i].baseConsonant ||
                pattern1.othu[i].conjunctConsonant !== pattern2.othu[i].conjunctConsonant) {
                return false;
            }
        }

        return true;
    }

    // Calculate position-aware pattern similarity
    calculatePatternSimilarity(pattern1, pattern2) {
        let score = 0;
        let total = 0;

        // Compare gunintam patterns (position-aware)
        const gunintam1Map = new Map(pattern1.gunintam.map(g => [g.position, g.modifier]));
        const gunintam2Map = new Map(pattern2.gunintam.map(g => [g.position, g.modifier]));

        const allGunintamPositions = new Set([...gunintam1Map.keys(), ...gunintam2Map.keys()]);
        for (const pos of allGunintamPositions) {
            total++;
            if (gunintam1Map.has(pos) && gunintam2Map.has(pos) &&
                gunintam1Map.get(pos) === gunintam2Map.get(pos)) {
                score++;
            }
        }

        // Compare othu patterns (position-aware)
        const othu1Map = new Map(pattern1.othu.map(o => [o.position, o.conjunct]));
        const othu2Map = new Map(pattern2.othu.map(o => [o.position, o.conjunct]));

        const allOthuPositions = new Set([...othu1Map.keys(), ...othu2Map.keys()]);
        for (const pos of allOthuPositions) {
            total++;
            if (othu1Map.has(pos) && othu2Map.has(pos) &&
                othu1Map.get(pos) === othu2Map.get(pos)) {
                score++;
            }
        }

        return total > 0 ? score / total : 0;
    }

    // Calculate syllable-length based similarity
    calculateSyllableLengthSimilarity(pattern1, pattern2) {
        let score = 0;
        let total = 4; // Number of comparison factors

        // 1. Same syllable count (baseline requirement)
        if (pattern1.shape.syllableCount === pattern2.shape.syllableCount) {
            score += 1;
        }

        // 2. Shared gunintam types (not necessarily same positions)
        const gunintam1Types = pattern1.gunintam.map(g => g.modifier);
        const gunintam2Types = pattern2.gunintam.map(g => g.modifier);
        const sharedGunintam = gunintam1Types.filter(g => gunintam2Types.includes(g));
        const maxGunintam = Math.max(gunintam1Types.length, gunintam2Types.length);
        if (maxGunintam > 0) {
            score += (sharedGunintam.length / maxGunintam);
        } else {
            score += 0.5; // Both have no gunintam
        }

        // 3. Shared othu types (not necessarily same positions)
        const othu1Types = pattern1.othu.map(o => o.baseConsonant + o.conjunctConsonant);
        const othu2Types = pattern2.othu.map(o => o.baseConsonant + o.conjunctConsonant);
        const sharedOthu = othu1Types.filter(o => othu2Types.includes(o));
        const maxOthu = Math.max(othu1Types.length, othu2Types.length);
        if (maxOthu > 0) {
            score += (sharedOthu.length / maxOthu);
        } else {
            score += 0.5; // Both have no othu
        }

        // 4. Similar overall structural complexity
        const complexity1 = pattern1.shape.conjunctCount + pattern1.shape.vowelModifierCount;
        const complexity2 = pattern2.shape.conjunctCount + pattern2.shape.vowelModifierCount;
        const maxComplexity = Math.max(complexity1, complexity2, 1);
        const complexitySimilarity = 1 - (Math.abs(complexity1 - complexity2) / maxComplexity);
        score += complexitySimilarity;

        return score / total;
    }

    // Calculate structural shape similarity
    calculateShapeSimilarity(shape1, shape2) {
        let score = 0;
        let total = 4; // Number of comparison criteria

        // Same syllable count
        if (shape1.syllableCount === shape2.syllableCount) score++;

        // Similar structure pattern
        if (shape1.structure === shape2.structure) score++;
        else if (shape1.consonantVowelPattern === shape2.consonantVowelPattern) score += 0.5;

        // Similar conjunct count
        if (shape1.conjunctCount === shape2.conjunctCount) score++;
        else if (Math.abs(shape1.conjunctCount - shape2.conjunctCount) <= 1) score += 0.5;

        // Similar vowel modifier count
        if (shape1.vowelModifierCount === shape2.vowelModifierCount) score++;
        else if (Math.abs(shape1.vowelModifierCount - shape2.vowelModifierCount) <= 1) score += 0.5;

        return score / total;
    }

    // Generate detailed pattern information
    calculatePatternDetails(pattern1, pattern2, mode) {
        const details = [];

        switch (mode) {
            case 'similar':
                // Show shared patterns
                const sharedGunintam = pattern1.gunintam.filter(g1 =>
                    pattern2.gunintam.some(g2 =>
                        g1.modifier === g2.modifier && g1.position === g2.position
                    )
                );
                const sharedOthu = pattern1.othu.filter(o1 =>
                    pattern2.othu.some(o2 =>
                        o1.conjunct === o2.conjunct && o1.position === o2.position
                    )
                );

                if (sharedGunintam.length > 0) {
                    details.push(`${sharedGunintam.length} exact gunintam match${sharedGunintam.length > 1 ? 'es' : ''}`);
                }
                if (sharedOthu.length > 0) {
                    details.push(`${sharedOthu.length} exact othu match${sharedOthu.length > 1 ? 'es' : ''}`);
                }
                break;

            case 'syllable':
                // Show syllable-based similarities
                details.push(`${pattern2.shape.syllableCount} syllables`);

                const gunintamTypes1 = pattern1.gunintam.map(g => g.modifier);
                const gunintamTypes2 = pattern2.gunintam.map(g => g.modifier);
                const commonGunintam = gunintamTypes1.filter(g => gunintamTypes2.includes(g));

                const othuTypes1 = pattern1.othu.map(o => o.baseConsonant + o.conjunctConsonant);
                const othuTypes2 = pattern2.othu.map(o => o.baseConsonant + o.conjunctConsonant);
                const commonOthu = othuTypes1.filter(o => othuTypes2.includes(o));

                if (commonGunintam.length > 0) {
                    details.push(`${commonGunintam.length} shared gunintam type${commonGunintam.length > 1 ? 's' : ''}`);
                }
                if (commonOthu.length > 0) {
                    details.push(`${commonOthu.length} shared othu type${commonOthu.length > 1 ? 's' : ''}`);
                }
                if (commonGunintam.length === 0 && commonOthu.length === 0) {
                    details.push('Same length, different patterns');
                }
                break;

            case 'shape':
                // Show structural similarities
                details.push(`CV: ${pattern2.shape.consonantVowelPattern}`);

                if (pattern2.shape.conjunctCount > 0) {
                    details.push(`${pattern2.shape.conjunctCount} conjunct${pattern2.shape.conjunctCount > 1 ? 's' : ''}`);
                }
                if (pattern2.shape.vowelModifierCount > 0) {
                    details.push(`${pattern2.shape.vowelModifierCount} modifier${pattern2.shape.vowelModifierCount > 1 ? 's' : ''}`);
                }
                break;

            default:
                details.push('Pattern match');
        }

        return details.length > 0 ? details : ['Similar structure'];
    }

    // Find words by similarity with different search modes
    findWordsBySimilarity(inputWord, inputPattern, searchMode) {
        const matches = [];

        for (const word of this.exampleWords) {
            if (word === inputWord) continue;

            const wordPattern = this.analyzeTeluguPattern(word);
            if (!wordPattern || !wordPattern.shape) continue;

            let similarity = 0;
            let matchType = '';
            let details = [];

            switch (searchMode) {
                case 'exact':
                    if (this.patternsMatch(inputPattern, wordPattern)) {
                        similarity = 1.0;
                        matchType = 'Exact Pattern Match';
                        details = ['Perfect gunintam & othu match'];
                    }
                    break;

                case 'similar':
                    similarity = this.calculatePatternSimilarity(inputPattern, wordPattern);
                    if (similarity > 0.3) {
                        matchType = 'Similar Pattern';
                        details = this.calculatePatternDetails(inputPattern, wordPattern, 'similar');
                    }
                    break;

                case 'syllable':
                    // Same syllable count with structural similarities
                    if (inputPattern.shape && wordPattern.shape &&
                        inputPattern.shape.syllableCount === wordPattern.shape.syllableCount) {

                        similarity = this.calculateSyllableLengthSimilarity(inputPattern, wordPattern);
                        if (similarity > 0.2) {
                            matchType = `${wordPattern.shape.syllableCount} Syllables`;
                            details = this.calculatePatternDetails(inputPattern, wordPattern, 'syllable');
                        }
                    }
                    break;

                case 'shape':
                    // Similar structural shape regardless of exact positions
                    if (inputPattern.shape && wordPattern.shape) {
                        similarity = this.calculateShapeSimilarity(inputPattern.shape, wordPattern.shape);
                        if (similarity > 0.4) {
                            matchType = 'Similar Shape';
                            details = this.calculatePatternDetails(inputPattern, wordPattern, 'shape');
                        }
                    }
                    break;
            }

            if (similarity > 0 && matchType) {
                matches.push({
                    word: word,
                    pattern: wordPattern,
                    similarity: similarity,
                    matchType: matchType,
                    details: details
                });
            }
        }

        // Sort by similarity (highest first)
        matches.sort((a, b) => b.similarity - a.similarity);

        return matches.slice(0, 24); // Show more results
    }
}

// Pattern Tool UI Manager
class PatternToolUI {
    constructor() {
        this.analyzer = new TeluguPatternAnalyzer();
        this.initializeElements();
        this.attachEventListeners();
        this.setupAutoDemo();
    }

    initializeElements() {
        this.patternInput = document.getElementById('patternSearch');
        this.findBtn = document.getElementById('findPatternsBtn');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.patternResults = document.getElementById('patternResults');
        this.patternError = document.getElementById('patternError');
        this.patternLoading = document.getElementById('patternLoading');
        this.matchingWords = document.getElementById('matchingWords');
        this.patternInfo = document.getElementById('patternInfo');
    }

    attachEventListeners() {
        // Mode button event listeners
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleModeChange(btn);
            });
        });

        // Search functionality
        if (this.patternInput && this.findBtn) {
            this.findBtn.addEventListener('click', () => {
                this.handleSearch();
            });

            this.patternInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });

            this.patternInput.addEventListener('input', (e) => {
                this.handleInputValidation(e);
            });
        }

        // Add helpful tooltips
        this.addTooltips();
    }

    handleModeChange(btn) {
        // Remove active class from all buttons
        this.modeButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        // Update button text if needed
        const mode = btn.getAttribute('data-mode');
        const buttonText = this.findBtn.querySelector('span:last-child');
        if (buttonText) {
            const modeNames = {
                'exact': 'Find Exact',
                'similar': 'Find Similar',
                'syllable': 'Find Same Length',
                'shape': 'Find Same Shape'
            };
            buttonText.textContent = modeNames[mode] || 'Find Patterns';
        }

        // Auto-search if there's already text
        if (this.patternInput && this.patternInput.value.trim()) {
            this.findPatternMatches(this.patternInput.value.trim());
        }
    }

    handleSearch() {
        const inputWord = this.patternInput.value.trim();
        if (inputWord) {
            this.findPatternMatches(inputWord);
        } else {
            this.showError('Please enter a Telugu word to analyze');
        }
    }

    handleInputValidation(e) {
        const value = e.target.value.trim();

        if (value.length > 0) {
            // Check if it contains Telugu characters
            const hasTeluguChars = /[\u0C00-\u0C7F]/.test(value);
            if (hasTeluguChars) {
                this.findBtn.disabled = false;
                this.findBtn.style.opacity = '1';
                e.target.style.borderColor = 'var(--primary-500)';
            } else {
                this.findBtn.disabled = true;
                this.findBtn.style.opacity = '0.6';
                e.target.style.borderColor = 'var(--gray-200)';
            }
        } else {
            this.findBtn.disabled = true;
            this.findBtn.style.opacity = '0.6';
            e.target.style.borderColor = 'var(--gray-200)';
        }
    }

    addTooltips() {
        const tooltips = {
            'exact': 'Find words with identical gunintam and othu in same positions',
            'similar': 'Find words with shared gunintam/othu patterns',
            'syllable': 'Find words with same syllable count and structural features',
            'shape': 'Find words with similar consonant-vowel patterns'
        };

        this.modeButtons.forEach(btn => {
            const mode = btn.getAttribute('data-mode');
            if (tooltips[mode]) {
                btn.setAttribute('title', tooltips[mode]);
            }
        });
    }

    setupAutoDemo() {
        // Example demonstration with delay
        setTimeout(() => {
            if (!this.patternInput.value.trim()) {
                this.patternInput.value = 'కృష్ణ';
                this.patternInput.dispatchEvent(new Event('input'));

                setTimeout(() => {
                    this.findPatternMatches('కృష్ణ');
                }, 1500);
            }
        }, 2000);
    }

    async findPatternMatches(inputWord) {
        // Get selected search mode
        const activeMode = document.querySelector('.mode-btn.active');
        const searchMode = activeMode ? activeMode.getAttribute('data-mode') : 'exact';

        // Reset UI
        this.patternResults.style.display = 'none';
        this.patternError.style.display = 'none';
        this.patternLoading.style.display = 'block';

        try {
            // Validate and analyze input word
            const trimmedWord = inputWord.trim();
            if (!trimmedWord) {
                throw new Error('Please enter a Telugu word');
            }

            const inputPattern = this.analyzer.analyzeTeluguPattern(trimmedWord);
            if (!inputPattern || !inputPattern.shape) {
                throw new Error('Unable to analyze word. Please enter a valid Telugu word.');
            }

            // Find matches using enhanced algorithms
            const matches = this.analyzer.findWordsBySimilarity(trimmedWord, inputPattern, searchMode);
            this.displayEnhancedPatternResults(trimmedWord, inputPattern, matches, searchMode);

        } catch (error) {
            this.showError(error.message);
        }
    }

    displayEnhancedPatternResults(inputWord, inputPattern, matches, searchMode) {
        this.patternLoading.style.display = 'none';

        // Generate enhanced pattern description
        const searchModeLabels = {
            'exact': 'Exact Pattern Match',
            'similar': 'Similar Patterns',
            'syllable': 'Same Syllable Count',
            'shape': 'Similar Shape'
        };

        const gunintamInfo = inputPattern.gunintam.length > 0
            ? `Gunintam (${inputPattern.gunintam.length}): ${inputPattern.gunintam.map(g => `${g.modifier}`).join(', ')}`
            : 'No gunintam';

        const othuInfo = inputPattern.othu.length > 0
            ? `Othu (${inputPattern.othu.length}): ${inputPattern.othu.map(o => o.baseConsonant + '్' + o.conjunctConsonant).join(', ')}`
            : 'No othu';

        const syllableInfo = inputPattern.shape
            ? `${inputPattern.shape.syllableCount} syllables, CV pattern: ${inputPattern.shape.consonantVowelPattern}`
            : 'Pattern analysis unavailable';

        this.patternInfo.innerHTML = `
            <strong>Analysis of:</strong> <span class="telugu-text" style="font-size: 1.2em;">${inputWord}</span><br>
            <strong>Search mode:</strong> ${searchModeLabels[searchMode]}<br>
            <strong>Structure:</strong> ${syllableInfo}<br>
            <strong>Details:</strong> ${gunintamInfo}; ${othuInfo}
        `;

        // Display results with enhanced formatting
        if (matches.length === 0) {
            const suggestions = {
                'exact': 'Try "Similar Patterns" mode or words like కృష్ణ, లక్ష్మీ',
                'similar': 'Try "Same Syllables" mode or simpler words',
                'syllable': 'Try different syllable counts or "Similar Shape" mode',
                'shape': 'Try "Similar Patterns" or enter a different word'
            };

            this.matchingWords.innerHTML = `
                <div class="no-matches">
                    <strong>No ${searchModeLabels[searchMode].toLowerCase()} found</strong><br>
                    <span style="margin-top: 8px; opacity: 0.8; font-size: 0.9em;">
                        ${suggestions[searchMode] || 'Try a different search mode or word'}
                    </span>
                </div>
            `;
        } else {
            this.matchingWords.innerHTML = matches.map(match => `
                <div class="word-match-card" title="Click for detailed analysis">
                    <div class="matched-word">${match.word}</div>
                    <div class="match-details">
                        <span style="font-weight: 600; color: var(--primary-600);">
                            ${match.matchType}
                        </span>
                        <span style="font-size: 0.85em; opacity: 0.8;">
                            ${Math.round(match.similarity * 100)}% similarity
                        </span>
                    </div>
                    <div style="margin-top: 8px; font-size: 0.8em; opacity: 0.7; line-height: 1.3;">
                        ${match.details.join(' • ')}
                    </div>
                </div>
            `).join('');

            // Add click handlers for detailed analysis
            document.querySelectorAll('.word-match-card').forEach((card, index) => {
                card.addEventListener('click', () => {
                    this.showDetailedWordAnalysis(matches[index], inputPattern);
                });
                card.style.cursor = 'pointer';
            });
        }

        this.patternResults.style.display = 'block';

        // Show results summary
        const resultsSummary = document.createElement('div');
        resultsSummary.style.cssText = `
            margin-top: 16px;
            text-align: center;
            font-size: 0.9em;
            color: var(--gray-600);
            font-weight: 500;
        `;
        resultsSummary.textContent = matches.length > 0
            ? `Found ${matches.length} ${searchModeLabels[searchMode].toLowerCase()}`
            : `No ${searchModeLabels[searchMode].toLowerCase()} found`;

        if (!this.matchingWords.querySelector('.results-summary')) {
            resultsSummary.className = 'results-summary';
            this.matchingWords.appendChild(resultsSummary);
        }
    }

    showDetailedWordAnalysis(match, inputPattern) {
        // Create modal for comprehensive analysis
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: white; padding: 32px;
            border-radius: 16px; box-shadow: var(--shadow-xl);
            max-width: 500px; width: 90vw; z-index: 1000;
            border: 1px solid var(--gray-200);
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5); z-index: 999;
        `;

        // Detailed comparison analysis
        const comparison = {
            syllables: {
                input: inputPattern.syllables.join(' + '),
                match: match.pattern.syllables.join(' + ')
            },
            structure: {
                input: `${inputPattern.shape.syllableCount} syllables, ${inputPattern.shape.conjunctCount} conjuncts, ${inputPattern.shape.vowelModifierCount} modifiers`,
                match: `${match.pattern.shape.syllableCount} syllables, ${match.pattern.shape.conjunctCount} conjuncts, ${match.pattern.shape.vowelModifierCount} modifiers`
            }
        };

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h3 style="margin: 0; color: var(--gray-900); font-size: 1.25rem;">Detailed Analysis</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); this.parentElement.parentElement.parentElement.previousSibling.remove();"
                        style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--gray-500);">×</button>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="font-weight: 600; margin-bottom: 8px;">Word Comparison</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div style="text-align: center; padding: 16px; background: var(--gray-50); border-radius: 12px;">
                        <div style="font-size: 1.5rem; font-family: 'Noto Sans Telugu', serif; margin-bottom: 8px; color: var(--primary-600);">
                            ${inputPattern.syllables.join('')}
                        </div>
                        <div style="font-size: 0.8rem; opacity: 0.7;">Input Word</div>
                    </div>
                    <div style="text-align: center; padding: 16px; background: var(--primary-50); border-radius: 12px;">
                        <div style="font-size: 1.5rem; font-family: 'Noto Sans Telugu', serif; margin-bottom: 8px; color: var(--primary-700);">
                            ${match.word}
                        </div>
                        <div style="font-size: 0.8rem; opacity: 0.7;">Match (${Math.round(match.similarity * 100)}%)</div>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="font-weight: 600; margin-bottom: 12px;">Syllable Breakdown</div>
                <div style="font-size: 0.9em; line-height: 1.6; color: var(--gray-700);">
                    <div><strong>Input:</strong> ${comparison.syllables.input}</div>
                    <div><strong>Match:</strong> ${comparison.syllables.match}</div>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="font-weight: 600; margin-bottom: 12px;">Structural Analysis</div>
                <div style="font-size: 0.9em; line-height: 1.6; color: var(--gray-700);">
                    <div><strong>Input:</strong> ${comparison.structure.input}</div>
                    <div><strong>Match:</strong> ${comparison.structure.match}</div>
                </div>
            </div>

            <div style="margin-bottom: 24px;">
                <div style="font-weight: 600; margin-bottom: 12px;">Match Details</div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${match.details.map(detail => `
                        <span style="background: var(--primary-100); color: var(--primary-700);
                                     padding: 4px 8px; border-radius: 6px; font-size: 0.8em;">
                            ${detail}
                        </span>
                    `).join('')}
                </div>
            </div>

            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove(); this.parentElement.parentElement.parentElement.previousSibling.remove();"
                        style="background: var(--primary-600); color: white; border: none;
                               padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Close Analysis
                </button>
            </div>
        `;

        // Add click to close
        overlay.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        });

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    showError(message) {
        this.patternLoading.style.display = 'none';
        this.patternError.style.display = 'block';
        this.patternError.textContent = message;
        setTimeout(() => {
            this.patternError.style.display = 'none';
        }, 3000);
    }
}

// Export for global use
window.TeluguPatternAnalyzer = TeluguPatternAnalyzer;
window.PatternToolUI = PatternToolUI;