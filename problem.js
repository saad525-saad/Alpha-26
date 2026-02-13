document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const solveBtn = document.getElementById('solve-btn');
    const problemText = document.getElementById('problem-text');
    const subjectSelect = document.getElementById('subject-select');
    const difficultySelect = document.getElementById('difficulty-select');
    const inputSection = document.getElementById('input-section');
    const responseSection = document.getElementById('response-section');
    const stepToggle = document.getElementById('step-toggle');
    const stepsContainer = document.getElementById('steps-container');
    const copyBtn = document.getElementById('copy-btn');
    const historyList = document.getElementById('history-list');
    // Elements for injecting content
    const finalAnswerContent = document.getElementById('final-answer-content');
    const analysisContent = document.getElementById('analysis-content');
    const stepsContent = document.getElementById('steps-content');
    const conceptsContent = document.getElementById('concepts-content');
    const confidenceBar = document.getElementById('confidence-bar');
    const confidenceText = document.getElementById('confidence-text');
    // State
    let isDarkMode = localStorage.getItem('theme') === 'dark';
    let history = JSON.parse(localStorage.getItem('solveHistory')) || [];
    // Initialize Theme
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    // Toggle Theme
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        themeToggle.innerHTML = isDarkMode ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
    // Toggle Steps
    stepToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            stepsContainer.classList.remove('hidden');
        } else {
            stepsContainer.classList.add('hidden');
        }
    });
    // Solve Problem
    solveBtn.addEventListener('click', async () => {
        const problem = problemText.value.trim();
        if (!problem) {
            alert('Please enter a problem statement.');
            return;
        }
        // UI Loading State
        const btnText = solveBtn.querySelector('.btn-text');
        const loader = solveBtn.querySelector('.loader');
        btnText.style.display = 'none';
        loader.classList.remove('hidden');
        solveBtn.disabled = true;
        // Simulate AI Delay
        await new Promise(r => setTimeout(r, 2000));
        // Generate Simulated Response
        const response = generateMockResponse(problem, subjectSelect.value, difficultySelect.value);
        // Render Response
        renderResponse(response);
        // Save to History
        saveToHistory(problem, subjectSelect.value, response);
        // Reset UI
        btnText.style.display = 'block';
        loader.classList.add('hidden');
        solveBtn.disabled = false;
        // Show Response Section
        responseSection.classList.remove('hidden');
        responseSection.scrollIntoView({ behavior: 'smooth' });
    });
    // Copy to Clipboard
    copyBtn.addEventListener('click', () => {
        const textToCopy = `Problem: ${problemText.value}\n\nAnswer: ${finalAnswerContent.innerText}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    });
    // Helper: Render Response
    function renderResponse(data) {
        finalAnswerContent.innerHTML = data.answer;
        analysisContent.innerHTML = data.analysis;
        stepsContent.innerHTML = data.steps;
        conceptsContent.innerHTML = data.concepts;
        // Animate Confidence Bar
        confidenceBar.style.width = '0%';
        confidenceText.innerText = `0%`;
        setTimeout(() => {
            confidenceBar.style.width = `${data.confidence}%`;
            confidenceText.innerText = `${data.confidence}% Very Confident`; // Simplified text logic
        }, 100);
    }
    // Helper: Mock AI Logic
    function generateMockResponse(problem, subject, difficulty) {
        // In a real app, this would call an API (e.g., OpenAI, Gemini)
        return {
            analysis: `Identified as a **${difficulty}** level **${subject}** problem.\nThe key is to isolate the variable and apply the appropriate formula.`,
            steps: `1. **Initial Setup**: Define variables based on the problem statement.\n2. **Transformation**: Rearrange the equation to solving form.\n3. **Calculation**: Substitute values and compute result.\n4. **Verification**: Check units and magnitude.`,
            answer: `The calculated result is **42**.`,
            concepts: `• Algebra\n• Linear Equations\n• Variable Substitution`,
            confidence: 95
        };
    }
    // History Logic
    function saveToHistory(problem, subject, response) {
        const item = {
            id: Date.now(),
            problem: problem.substring(0, 50) + (problem.length > 50 ? '...' : ''),
            subject: subject,
            timestamp: new Date().toLocaleString()
        };
        history.unshift(item);
        if (history.length > 5) history.pop(); // Keep last 5
        localStorage.setItem('solveHistory', JSON.stringify(history));
        renderHistory();
    }
    function renderHistory() {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = '<p class="empty-history">No problems solved yet.</p>';
            return;
        }
        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div class="history-meta">${item.timestamp} • ${item.subject}</div>
                <div class="history-preview">${item.problem}</div>
            `;
            div.addEventListener('click', () => {
                // Restore problem (simplified)
                problemText.value = item.problem; // Note: In real app, store full problem
                inputSection.scrollIntoView({ behavior: 'smooth' });
            });
            historyList.appendChild(div);
        });
    }
    // Initial Render
    renderHistory();
});
