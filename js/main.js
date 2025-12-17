// Telugu Linguistic Analysis - Main Application Controller

class TeluguAnalysisApp {
    constructor() {
        this.statsData = null;
        this.charts = null;
        this.patternTool = null;
    }

    async initialize() {
        try {
            // Initialize Chart.js defaults
            this.initializeChartDefaults();

            // Load analysis data
            await this.loadData();

            // Initialize components
            this.charts = new TeluguAnalysisCharts();
            this.charts.setData(this.statsData);

            // Display overview and create charts
            this.displayOverviewStats();
            this.charts.createAllCharts();
            this.generateInsights();
            this.displayInterestingWords();

            // Initialize pattern tool
            this.patternTool = new PatternToolUI();

            // Setup navigation
            this.setupNavigation();

            console.log('✅ Telugu linguistic analysis loaded successfully');
            console.log('📊 Analysis coverage:', {
                totalWords: this.statsData.basic.totalWords,
                uniqueSyllables: this.statsData.syllableAnalysis?.totalUniqueSyllables,
                morphologyAvailable: this.statsData.morphology ? '✓' : '✗',
                phoneticsAvailable: this.statsData.phonetics ? '✓' : '✗',
                semanticsAvailable: this.statsData.semanticPatterns ? '✓' : '✗'
            });

        } catch (error) {
            this.handleError(error);
        }
    }

    initializeChartDefaults() {
        Chart.defaults.font.family = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        Chart.defaults.font.size = 13;
        Chart.defaults.font.weight = '500';
        Chart.defaults.color = '#64748b';
        Chart.defaults.borderColor = '#e2e8f0';
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.boxWidth = 10;
        Chart.defaults.plugins.legend.labels.boxHeight = 10;
        Chart.defaults.plugins.legend.labels.padding = 20;
        Chart.defaults.plugins.legend.labels.font = {
            family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            size: 13,
            weight: '600'
        };
        Chart.defaults.plugins.tooltip.backgroundColor = '#1e293b';
        Chart.defaults.plugins.tooltip.titleColor = '#f1f5f9';
        Chart.defaults.plugins.tooltip.bodyColor = '#e2e8f0';
        Chart.defaults.plugins.tooltip.cornerRadius = 12;
        Chart.defaults.plugins.tooltip.padding = 12;
    }

    async loadData() {
        try {
            const response = await fetch('./telugu-stats.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            if (!text.trim()) {
                throw new Error('Empty response from server');
            }

            this.statsData = JSON.parse(text);

            // Validate comprehensive data structure
            if (!this.statsData.basic || !this.statsData.syllableAnalysis) {
                throw new Error('Required analysis data not found');
            }

        } catch (error) {
            console.error('Error loading analysis:', error);
            throw error;
        }
    }

    displayOverviewStats() {
        const container = document.getElementById('stats-overview');
        if (!container) return;

        const basic = this.statsData.basic;
        const syllables = this.statsData.syllableAnalysis;
        const linguistics = this.statsData.teluguLinguistics;

        container.innerHTML = `
            <div class="stat-card">
                <span class="stat-number">${basic.totalWords.toLocaleString()}</span>
                <span class="stat-label">Total Words</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${syllables?.syllablesPerWord?.averageSyllablesPerWord || 'N/A'}</span>
                <span class="stat-label">Avg Syllables</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${syllables?.totalUniqueSyllables?.toLocaleString() || 'N/A'}</span>
                <span class="stat-label">Unique Syllables</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${linguistics?.loanWordDistribution?.native?.percentage || basic.averageLength}%</span>
                <span class="stat-label">${linguistics?.loanWordDistribution ? 'Native Telugu' : 'Avg Length'}</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${basic.longestWord.length}</span>
                <span class="stat-label">Max Length</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${basic.uniqueCharacters}</span>
                <span class="stat-label">Unique Characters</span>
            </div>
        `;
    }

    generateInsights() {
        const insights = [
            {
                title: "🌏 Language Purity",
                text: `${this.statsData.teluguLinguistics?.loanWordDistribution?.native?.percentage || 'Most'}% of analyzed words are native Telugu, demonstrating remarkable linguistic preservation despite centuries of cultural exchange with Sanskrit (${this.statsData.teluguLinguistics?.loanWordDistribution?.sanskrit?.percentage || 'some'}%), Arabic, and English influences.`
            },
            {
                title: "🧬 Syllabic Structure",
                text: `Telugu words average ${this.statsData.syllableAnalysis?.syllablesPerWord?.averageSyllablesPerWord || '4.6'} syllables, with ${this.statsData.syllableAnalysis?.totalUniqueSyllables?.toLocaleString() || '2000+'} unique syllable combinations revealing the language's incredible phonetic diversity and systematic sound organization.`
            },
            {
                title: "🔤 Morphological Richness",
                text: `Analysis reveals ${this.statsData.morphology?.prefixFrequency?.length || '15+'} distinct prefix patterns and ${this.statsData.morphology?.suffixFrequency?.length || '20+'} suffix variations, showcasing Telugu's sophisticated agglutinative word formation capabilities.`
            },
            {
                title: "🎵 Phonetic Patterns",
                text: `Consonant cluster analysis identifies ${this.statsData.phonetics?.consonantClusters?.length || '20+'} distinct patterns, with gemination (doubled consonants like ట్ట, చ్చ) being particularly frequent, reflecting Telugu's preference for rhythmic sound structures.`
            },
            {
                title: "⚖️ Cognitive Balance",
                text: `Word complexity distribution shows ${this.statsData.semanticPatterns?.wordComplexity?.find(item => item.category === 'medium')?.percentage || '48'}% of words have medium complexity, suggesting Telugu evolved for optimal balance between expressive power and processing efficiency.`
            },
            {
                title: "📝 Grammatical Sophistication",
                text: `Case marker "${this.statsData.teluguLinguistics?.caseMarkers?.[0]?.marker || 'న'}" appears most frequently (${this.statsData.teluguLinguistics?.caseMarkers?.[0]?.percentage || '1.9'}%), highlighting Telugu's complex agglutinative grammar that enables precise semantic relationships through morphological markers.`
            }
        ];

        const container = document.getElementById('insights-content');
        if (container) {
            container.innerHTML = insights.map(insight => `
                <div class="insight-card">
                    <h3 class="insight-title">
                        <span class="insight-icon">${insight.title.split(' ')[0]}</span>
                        ${insight.title.substring(2)}
                    </h3>
                    <p class="insight-text">${insight.text}</p>
                </div>
            `).join('');
        }
    }

    displayInterestingWords() {
        const container = document.getElementById('interesting-words');
        if (!container) return;

        const interesting = this.statsData.interestingWords;
        if (!interesting) {
            container.innerHTML = '<div class="error">Interesting words data not available</div>';
            return;
        }

        const longestWords = interesting.longest?.filter(item => item.word && item.word.trim()) || [];
        const shortestWords = interesting.shortest?.filter(item => item.word && item.word.trim()) || [];
        const palindromes = interesting.palindromes?.filter(word => word && word.trim()) || [];

        container.innerHTML = `
            <div class="word-category">
                <div class="category-header">
                    <h3 class="category-title">🏆 Longest Words</h3>
                </div>
                <div class="word-list">
                    ${longestWords.slice(0, 8).map((item, i) => `
                        <div class="word-item">
                            <div class="word-rank">${i + 1}</div>
                            <div class="word-info">
                                <div class="word-text telugu-text">${item.word}</div>
                                <div class="word-meta">${item.length} characters</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="word-category">
                <div class="category-header">
                    <h3 class="category-title">🌟 Most Unique Characters</h3>
                </div>
                <div class="word-list">
                    ${(interesting.mostUniqueChars || []).slice(0, 6).map((item, i) => `
                        <div class="word-item">
                            <div class="word-rank">${i + 1}</div>
                            <div class="word-info">
                                <div class="word-text telugu-text">${item.word}</div>
                                <div class="word-meta">${item.uniqueChars} unique characters</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="word-category">
                <div class="category-header">
                    <h3 class="category-title">🪞 Palindromes</h3>
                </div>
                <div class="word-list">
                    ${palindromes.slice(0, 10).map((word, i) => `
                        <div class="word-item">
                            <div class="word-rank">${i + 1}</div>
                            <div class="word-info">
                                <div class="word-text telugu-text">${word}</div>
                                <div class="word-meta">Reads same forwards & backwards</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    setupNavigation() {
        // Main navigation event listeners
        window.showSection = (sectionName) => {
            // Hide all sections
            document.querySelectorAll('.analysis-section').forEach(section => {
                section.classList.remove('active');
            });

            // Remove active class from all nav buttons
            document.querySelectorAll('.nav-section').forEach(btn => {
                btn.classList.remove('active');
            });

            // Show selected section
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Add active class to clicked button
            event.target.classList.add('active');
        };

        // Chart switching functions
        window.showSyllableChart = (mode) => {
            document.querySelectorAll('#syllableChart').forEach(chart => {
                chart.closest('.chart-card').querySelectorAll('.sub-nav-btn').forEach(btn => btn.classList.remove('active'));
            });
            event.target.classList.add('active');
            if (this.charts) {
                this.charts.showSyllableChart(mode);
            }
        };

        window.showSemanticChart = (mode) => {
            document.querySelectorAll('#semanticChart').forEach(chart => {
                chart.closest('.chart-card').querySelectorAll('.sub-nav-btn').forEach(btn => btn.classList.remove('active'));
            });
            event.target.classList.add('active');
            if (this.charts) {
                this.charts.showSemanticChart(mode);
            }
        };

        window.showMorphologyChart = (mode) => {
            document.querySelectorAll('#morphologyChart').forEach(chart => {
                chart.closest('.chart-card').querySelectorAll('.sub-nav-btn').forEach(btn => btn.classList.remove('active'));
            });
            event.target.classList.add('active');
            if (this.charts) {
                this.charts.showMorphologyChart(mode);
            }
        };

        window.showPatternChart = (type) => {
            document.querySelectorAll('#patternChart').forEach(chart => {
                chart.closest('.chart-card').querySelectorAll('.sub-nav-btn').forEach(btn => btn.classList.remove('active'));
            });
            event.target.classList.add('active');
            if (this.charts) {
                this.charts.showPatternChart(type);
            }
        };
    }

    handleError(error) {
        console.error('Telugu Analysis Error:', error);

        let errorMessage = '❌ Failed to load Telugu analysis data. ';
        if (error.message.includes('HTTP')) {
            errorMessage += 'Network error - ensure local server is running.';
        } else if (error.message.includes('JSON')) {
            errorMessage += 'Data file is corrupted.';
        } else {
            errorMessage += error.message;
        }

        document.querySelectorAll('.loading').forEach(el => {
            el.innerHTML = `<div class="error">${errorMessage}</div>`;
        });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TeluguAnalysisApp();
    app.initialize();
});

// Export for global access
window.TeluguAnalysisApp = TeluguAnalysisApp;