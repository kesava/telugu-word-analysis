// Telugu Linguistic Analysis - Chart Creation and Data Visualization

// Professional color palette for visualizations
const colors = {
    primary: '#5c7cfa',
    secondary: '#3c4bdc',
    accent: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    neutral: '#64748b',
    gradients: [
        '#5c7cfa', '#3b82f6', '#06b6d4', '#10b981',
        '#84cc16', '#eab308', '#f59e0b', '#f97316',
        '#ef4444', '#ec4899', '#d946ef', '#8b5cf6',
        '#6366f1', '#4f46e5', '#3730a3', '#1e1b4b'
    ],
    teluguSpecific: [
        '#4c63d2', '#5c7cfa', '#748ffc', '#91a7ff',
        '#06b6d4', '#0891b2', '#0e7490', '#155e75',
        '#10b981', '#059669', '#047857', '#065f46',
        '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'
    ]
};

// Enhanced Chart.js defaults for professional appearance
function initializeChartDefaults() {
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

class TeluguAnalysisCharts {
    constructor() {
        this.charts = {};
        this.statsData = null;
    }

    setData(data) {
        this.statsData = data;
    }

    createAllCharts() {
        this.createLengthChart();
        this.createSyllableDistributionChart();
        this.createSyllableChart('frequency');
        this.createLoanWordChart();
        this.createCaseMarkerChart();
        this.createFormationChart();
        this.createSemanticChart('complexity');
        this.createMorphologyChart('prefixes');
        this.createAksharamChart();
        this.createPatternChart('beginnings');
        this.createConsonantClusterChart();
        this.createSandhiChart();
        this.createGunintamChart();
    }

    createLengthChart() {
        const ctx = document.getElementById('lengthChart')?.getContext('2d');
        if (!ctx) return;

        const data = this.statsData.lengthDistribution;
        if (!data) return;

        this.charts.length = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.lengths.map(l => l + (l === 1 ? ' char' : ' chars')),
                datasets: [{
                    data: data.counts,
                    backgroundColor: colors.gradients[0],
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.primary,
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const percentage = data.percentages[context.dataIndex];
                                return `${context.formattedValue} words (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { color: colors.neutral }
                    },
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: { color: colors.neutral }
                    }
                }
            }
        });
    }

    createSyllableDistributionChart() {
        const ctx = document.getElementById('syllableDistChart')?.getContext('2d');
        if (!ctx) return;

        const data = this.statsData.syllableAnalysis?.syllablesPerWord?.distribution || [];
        if (!data.length) return;

        this.charts.syllableDist = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => `${item.syllableCount}`),
                datasets: [{
                    label: 'Words',
                    data: data.map(item => item.wordCount),
                    borderColor: colors.success,
                    backgroundColor: colors.success + '30',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.primary,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const item = data[context.dataIndex];
                                return `${item.wordCount.toLocaleString()} words (${item.percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { color: colors.neutral }
                    },
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: { color: colors.neutral },
                        title: { display: true, text: 'Number of Syllables' }
                    }
                }
            }
        });
    }

    createSyllableChart(mode = 'frequency') {
        const ctx = document.getElementById('syllableChart')?.getContext('2d');
        if (!ctx) return;

        if (this.charts.syllable) this.charts.syllable.destroy();

        let data, chartType = 'bar';

        if (mode === 'frequency') {
            data = (this.statsData.syllableAnalysis?.mostFrequentSyllables || []).slice(0, 20);
            chartType = 'bar';
        } else if (mode === 'consonants') {
            data = (this.statsData.syllableAnalysis?.consonantFrequency || []).slice(0, 15);
            chartType = 'doughnut';
        } else if (mode === 'combinations') {
            data = (this.statsData.aksharams?.consonantVowelCombinations || []).slice(0, 15);
            chartType = 'bar';
        }

        if (!data.length) return;

        const config = {
            type: chartType,
            data: chartType === 'doughnut' ? {
                labels: data.map(item => item.consonant || item.combination || item.syllable),
                datasets: [{
                    data: data.map(item => item.count),
                    backgroundColor: colors.gradients.slice(0, data.length),
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff'
                }]
            } : {
                labels: data.map(item => item.syllable || item.combination || item.consonant),
                datasets: [{
                    data: data.map(item => item.count),
                    backgroundColor: colors.gradients.slice(0, data.length),
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: chartType === 'doughnut' ? {
                        position: 'right',
                        labels: {
                            font: { family: 'Telugu Sangam MN, Noto Sans Telugu, Inter', size: 14 },
                            padding: 20
                        }
                    } : { display: false },
                    tooltip: {
                        backgroundColor: colors.primary,
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const item = data[context.dataIndex];
                                return `${item.syllable || item.consonant || item.combination}: ${item.percentage}%`;
                            }
                        }
                    }
                },
                scales: chartType !== 'doughnut' ? {
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { color: colors.neutral }
                    },
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: {
                            color: colors.neutral,
                            font: { family: 'Telugu Sangam MN, Noto Sans Telugu, Inter', size: 16 }
                        }
                    }
                } : undefined
            }
        };

        this.charts.syllable = new Chart(ctx, config);
    }

    createLoanWordChart() {
        const ctx = document.getElementById('loanWordChart')?.getContext('2d');
        if (!ctx) return;

        const data = this.statsData.teluguLinguistics?.loanWordDistribution;
        if (!data) {
            ctx.canvas.parentNode.innerHTML = '<div class="error">Loan word data not available</div>';
            return;
        }

        this.charts.loanWord = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Native Telugu', 'Sanskrit Origin', 'Arabic Origin', 'English Origin'],
                datasets: [{
                    data: [data.native.percentage, data.sanskrit.percentage,
                           data.arabic.percentage, data.english.percentage],
                    backgroundColor: [colors.success, colors.primary, colors.warning, colors.accent],
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 20, font: { size: 13 } }
                    },
                    tooltip: {
                        backgroundColor: colors.primary,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const labels = ['native', 'sanskrit', 'arabic', 'english'];
                                const key = labels[context.dataIndex];
                                return `${context.label}: ${context.parsed}% (${data[key].count.toLocaleString()} words)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createCaseMarkerChart() {
        const ctx = document.getElementById('caseMarkerChart')?.getContext('2d');
        if (!ctx) return;

        const data = (this.statsData.teluguLinguistics?.caseMarkers || []).slice(0, 12);
        if (!data.length) {
            ctx.canvas.parentNode.innerHTML = '<div class="error">Case marker data not available</div>';
            return;
        }

        this.charts.caseMarker = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.marker),
                datasets: [{
                    data: data.map(item => item.count),
                    backgroundColor: colors.gradients.slice(0, data.length),
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.primary,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const item = data[context.dataIndex];
                                return `${item.marker}: ${item.count.toLocaleString()} (${item.percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { color: colors.neutral }
                    },
                    y: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: {
                            color: colors.neutral,
                            font: { family: 'Telugu Sangam MN, Noto Sans Telugu, Inter', size: 14 }
                        }
                    }
                }
            }
        });
    }

    createFormationChart() {
        const ctx = document.getElementById('formationChart')?.getContext('2d');
        if (!ctx) return;

        const data = (this.statsData.semanticPatterns?.wordFormation || []).slice(0, 8);
        if (!data.length) {
            ctx.canvas.parentNode.innerHTML = '<div class="error">Word formation data not available</div>';
            return;
        }

        this.charts.formation = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.formation.replace('_', ' ')),
                datasets: [{
                    data: data.map(item => item.percentage),
                    backgroundColor: colors.gradients.slice(0, data.length),
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.primary,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const item = data[context.dataIndex];
                                return `${item.formation.replace('_', ' ')}: ${item.percentage}% (${item.count?.toLocaleString()} words)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { color: colors.neutral },
                        title: { display: true, text: 'Percentage of Words' }
                    },
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: {
                            color: colors.neutral,
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    createSemanticChart(mode = 'complexity') {
        const ctx = document.getElementById('semanticChart')?.getContext('2d');
        if (!ctx) return;

        if (this.charts.semantic) this.charts.semantic.destroy();

        let data, chartType;

        if (mode === 'complexity') {
            data = this.statsData.semanticPatterns?.wordComplexity || [];
            chartType = 'polarArea';
        } else if (mode === 'classes') {
            data = (this.statsData.semanticPatterns?.wordClasses || []).slice(0, 8);
            chartType = 'doughnut';
        } else if (mode === 'cognitive') {
            data = this.statsData.semanticPatterns?.cognitiveLoad || [];
            chartType = 'bar';
        }

        if (!data.length) {
            ctx.canvas.parentNode.innerHTML = '<div class="error">Semantic analysis data not available</div>';
            return;
        }

        const config = {
            type: chartType,
            data: {
                labels: data.map(item => item.category || item.wordClass),
                datasets: [{
                    data: data.map(item => item.percentage || item.count),
                    backgroundColor: colors.gradients.slice(0, data.length),
                    borderWidth: chartType === 'bar' ? 0 : 3,
                    borderColor: chartType !== 'bar' ? '#ffffff' : undefined,
                    borderRadius: chartType === 'bar' ? 8 : undefined
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: chartType === 'doughnut' ? 'right' : 'bottom',
                        labels: { padding: 16 }
                    },
                    tooltip: {
                        backgroundColor: colors.primary,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const item = data[context.dataIndex];
                                return `${item.category || item.wordClass}: ${item.percentage}% (${item.count?.toLocaleString()} words)`;
                            }
                        }
                    }
                },
                scales: chartType === 'bar' ? {
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { color: colors.neutral }
                    },
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: { color: colors.neutral }
                    }
                } : (chartType === 'polarArea' ? {
                    r: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { display: false }
                    }
                } : undefined)
            }
        };

        this.charts.semantic = new Chart(ctx, config);
    }

    createMorphologyChart(mode = 'prefixes') {
        const ctx = document.getElementById('morphologyChart')?.getContext('2d');
        if (!ctx) return;

        if (this.charts.morphology) this.charts.morphology.destroy();

        let data, title;

        if (mode === 'prefixes') {
            data = (this.statsData.morphology?.prefixFrequency || []).slice(0, 15);
            title = 'Most Common Prefixes';
        } else if (mode === 'suffixes') {
            data = (this.statsData.morphology?.suffixFrequency || []).slice(0, 15);
            title = 'Most Common Suffixes';
        } else if (mode === 'roots') {
            data = (this.statsData.morphology?.rootPatterns || []).slice(0, 12);
            title = 'Root Patterns (CV Structure)';
        }

        if (!data.length) {
            ctx.canvas.parentNode.innerHTML = '<div class="error">Morphology data not available</div>';
            return;
        }

        this.charts.morphology = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.prefix || item.suffix || item.pattern),
                datasets: [{
                    label: title,
                    data: data.map(item => item.count),
                    borderColor: colors.accent,
                    backgroundColor: colors.accent + '20',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.primary,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const item = data[context.dataIndex];
                                return `${item.prefix || item.suffix || item.pattern}: ${item.count.toLocaleString()} (${item.percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { color: colors.neutral }
                    },
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: {
                            color: colors.neutral,
                            font: { family: 'Telugu Sangam MN, Noto Sans Telugu, Inter' }
                        }
                    }
                }
            }
        });
    }

    createAksharamChart() {
        const ctx = document.getElementById('aksharamChart')?.getContext('2d');
        if (!ctx) return;

        const data = (this.statsData.aksharams?.top20 || this.statsData.aksharams?.top30 || []).slice(0, 15);
        if (!data.length) return;

        this.charts.aksharam = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: data.map(item => item.aksharam),
                datasets: [{
                    data: data.map(item => item.count),
                    backgroundColor: colors.gradients.slice(0, data.length).map(color => color + '80'),
                    borderColor: colors.gradients.slice(0, data.length),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'Telugu Sangam MN, Noto Sans Telugu, Inter', size: 12 },
                            padding: 16
                        }
                    },
                    tooltip: {
                        backgroundColor: colors.primary,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const item = data[context.dataIndex];
                                return `${item.aksharam}: ${item.count.toLocaleString()} (${item.percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { display: false }
                    }
                }
            }
        });
    }

    createPatternChart(type = 'beginnings') {
        const ctx = document.getElementById('patternChart')?.getContext('2d');
        if (!ctx) return;

        if (this.charts.pattern) this.charts.pattern.destroy();

        if (type === 'both') {
            const beginnings = (this.statsData.wordBeginnings?.twoChar || []).slice(0, 8);
            const endings = (this.statsData.wordEndings?.twoChar || []).slice(0, 8);

            this.charts.pattern = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: beginnings.map(item => item.beginning),
                    datasets: [{
                        label: 'Beginnings',
                        data: beginnings.map(item => item.count),
                        backgroundColor: colors.primary,
                        borderRadius: 6
                    }, {
                        label: 'Endings',
                        data: endings.map(item => item.count),
                        backgroundColor: colors.secondary,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            backgroundColor: colors.primary,
                            cornerRadius: 8
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            border: { display: false },
                            grid: { color: '#f3f4f6' },
                            ticks: { color: colors.neutral }
                        },
                        x: {
                            border: { display: false },
                            grid: { display: false },
                            ticks: {
                                color: colors.neutral,
                                font: { family: 'Telugu Sangam MN, Noto Sans Telugu, Inter' }
                            }
                        }
                    }
                }
            });
        } else {
            const data = type === 'beginnings' ?
                (this.statsData.wordBeginnings?.twoChar || []).slice(0, 15) :
                (this.statsData.wordEndings?.twoChar || []).slice(0, 15);

            if (!data.length) return;

            this.charts.pattern = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => type === 'beginnings' ? item.beginning : item.ending),
                    datasets: [{
                        label: type === 'beginnings' ? 'Word Beginnings' : 'Word Endings',
                        data: data.map(item => item.count),
                        borderColor: colors.success,
                        backgroundColor: colors.success + '20',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: colors.primary,
                            cornerRadius: 8,
                            callbacks: {
                                afterLabel: function(context) {
                                    const item = data[context.dataIndex];
                                    return `Examples: ${item.examples?.slice(0, 2).join(', ') || 'N/A'}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            border: { display: false },
                            grid: { color: '#f3f4f6' },
                            ticks: { color: colors.neutral }
                        },
                        x: {
                            border: { display: false },
                            grid: { display: false },
                            ticks: {
                                color: colors.neutral,
                                font: { family: 'Telugu Sangam MN, Noto Sans Telugu, Inter' }
                            }
                        }
                    }
                }
            });
        }
    }

    createConsonantClusterChart() {
        const ctx = document.getElementById('consonantClusterChart')?.getContext('2d');
        if (!ctx) return;

        const data = (this.statsData.phonetics?.consonantClusters || []).slice(0, 12);
        if (!data.length) {
            ctx.canvas.parentNode.innerHTML = '<div class="error">Consonant cluster data not available</div>';
            return;
        }

        this.charts.consonantCluster = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.map(item => item.cluster),
                datasets: [{
                    label: 'Frequency',
                    data: data.map(item => item.count),
                    borderColor: colors.warning,
                    backgroundColor: colors.warning + '30',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.primary,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const item = data[context.dataIndex];
                                return `${item.cluster}: ${item.count.toLocaleString()} (${item.percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { display: false },
                        pointLabels: {
                            font: { family: 'Telugu Sangam MN, Noto Sans Telugu, Inter', size: 14 }
                        }
                    }
                }
            }
        });
    }

    createSandhiChart() {
        const ctx = document.getElementById('sandhiChart')?.getContext('2d');
        if (!ctx) return;

        const data = (this.statsData.teluguLinguistics?.sandhiPatterns || []).slice(0, 12);
        if (!data.length) {
            ctx.canvas.parentNode.innerHTML = '<div class="error">Sandhi pattern data not available</div>';
            return;
        }

        this.charts.sandhi = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Sandhi Patterns',
                    data: data.map((item, index) => ({
                        x: index,
                        y: item.count,
                        pattern: item.pattern
                    })),
                    backgroundColor: colors.danger,
                    borderColor: colors.danger,
                    pointRadius: 10,
                    pointHoverRadius: 14
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.primary,
                        cornerRadius: 8,
                        callbacks: {
                            title: function(context) {
                                return context[0].raw.pattern;
                            },
                            label: function(context) {
                                const item = data[context.dataIndex];
                                return `Frequency: ${item.count.toLocaleString()} (${item.percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        title: { display: true, text: 'Frequency' },
                        ticks: { color: colors.neutral }
                    },
                    x: {
                        type: 'linear',
                        border: { display: false },
                        grid: { display: false },
                        ticks: {
                            callback: function(value) {
                                return data[value]?.pattern || '';
                            },
                            font: { family: 'Telugu Sangam MN, Noto Sans Telugu, Inter' },
                            color: colors.neutral
                        }
                    }
                }
            }
        });
    }

    createGunintamChart() {
        const ctx = document.getElementById('gunintamChart')?.getContext('2d');
        if (!ctx) return;

        const data = (this.statsData.gunintam?.all || []).slice(0, 10);
        if (!data.length) return;

        this.charts.gunintam = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.gunintam),
                datasets: [{
                    data: data.map(item => item.count),
                    backgroundColor: colors.gradients.slice(0, data.length),
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: colors.primary,
                        cornerRadius: 8,
                        callbacks: {
                            title: function(context) {
                                return data[context[0].dataIndex].gunintam;
                            },
                            label: function(context) {
                                const item = data[context.dataIndex];
                                return `${item.count.toLocaleString()} (${item.percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        border: { display: false },
                        grid: { color: '#f3f4f6' },
                        ticks: { color: colors.neutral }
                    },
                    y: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: {
                            color: colors.neutral,
                            font: { family: 'Telugu Sangam MN, Noto Sans Telugu, Inter', size: 16 }
                        }
                    }
                }
            }
        });
    }

    // Chart switching functions
    showSyllableChart(mode) {
        this.createSyllableChart(mode);
    }

    showSemanticChart(mode) {
        this.createSemanticChart(mode);
    }

    showMorphologyChart(mode) {
        this.createMorphologyChart(mode);
    }

    showPatternChart(type) {
        this.createPatternChart(type);
    }
}

// Export for global use
window.TeluguAnalysisCharts = TeluguAnalysisCharts;