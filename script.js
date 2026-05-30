// --- Hardcoded Question Matrix ---
// By keeping this in the JS file, we bypass local server (CORS) requirements
const masterQuestionBank = [
    { type: "HTML", question: "What does HTML stand for?", options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Tool Multi Language", "Hyperlink and Text Markup Language"], correct: 1 },
    { type: "HTML", question: "Which HTML element is used to define the most important heading?", options: ["<heading>", "<h6>", "<head>", "<h1>"], correct: 3 },
    { type: "HTML", question: "What is the correct HTML element for inserting a line break?", options: ["<break>", "<lb>", "<br>", "<span>"], correct: 2 },
    { type: "HTML", question: "Which attribute is used to specify a unique identifier for an HTML element?", options: ["class", "id", "type", "link"], correct: 1 },
    { type: "HTML", question: "How can you create an e-mail link in HTML?", options: ["<a href=\"mailto:x@y.com\">", "<a href=\"x@y.com\">", "<mail href=\"x@y.com\">", "<a href=\"email:x@y.com\">"], correct: 0 },
    { type: "HTML", question: "Which HTML5 element is used to display autonomous, self-contained compositions?", options: ["<section>", "<div>", "<article>", "<aside>"], correct: 2 },

    { type: "CSS", question: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], correct: 2 },
    { type: "CSS", question: "How do you select an element with id 'demo' in CSS?", options: [".demo", "#demo", "*demo", "demo"], correct: 1 },
    { type: "CSS", question: "What is the default value of the position property in CSS?", options: ["absolute", "relative", "static", "fixed"], correct: 2 },
    { type: "CSS", question: "Which property is used to change the background color of an element?", options: ["color", "background-color", "bgcolor", "surface-color"], correct: 1 },
    { type: "CSS", question: "How do you make a list that lists items with square bullets?", options: ["list-type: square", "list-style-type: square", "bullet: square", "type: square"], correct: 1 },
    { type: "CSS", question: "Which layout model aligns elements inside a one-dimensional row or column structure?", options: ["Grid", "Flexbox", "Float", "Inline-Block"], correct: 1 },

    { type: "JS", question: "Inside which HTML element do we put the JavaScript?", options: ["<js>", "<scripting>", "<javascript>", "<script>"], correct: 3 },
    { type: "JS", question: "How do you write 'Hello World' in an alert box?", options: ["msgBox('Hello World');", "alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');"], correct: 3 },
    { type: "JS", question: "How do you create a function in JavaScript?", options: ["function = myFunction()", "function myFunction()", "create myFunction()", "def myFunction()"], correct: 1 },
    { type: "JS", question: "Which operator is used to assign a value to a variable?", options: ["*", "-", "=", "=="], correct: 2 },
    { type: "JS", question: "What will `typeof []` evaluate to in JavaScript?", options: ["array", "object", "list", "undefined"], correct: 1 },
    { type: "JS", question: "Which array method removes the last element from an array?", options: ["shift()", "pop()", "push()", "slice()"], correct: 1 }
];

// --- Application State parameters ---
let activeQuestionSet = [];
let currentQuestionIndex = 0;
let userScore = 0;

// --- DOM Reference Mapping ---
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const setupForm = document.getElementById('quiz-setup-form');
const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const scoreTracker = document.getElementById('score-tracker');
const progressBar = document.getElementById('progress-bar');
const badge = document.getElementById('badge');
const counterEl = document.getElementById('question-counter');

// --- Step 1: Form Evaluation Handler ---
setupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Read the selected checkboxes
    const selectedLanguages = Array.from(setupForm.elements['language'])
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const targetCount = parseInt(document.getElementById('question-count').value);

    if (selectedLanguages.length === 0) {
        alert("System Configuration Failure: Ensure at least one evaluation framework is chosen.");
        return;
    }

    // Filter elements out of the local master array
    let filteredQuestions = masterQuestionBank.filter(q => selectedLanguages.includes(q.type));

    if (filteredQuestions.length === 0) {
        alert("The question matrix is currently empty for the selected targets.");
        return;
    }

    // Array Randomization Engine (Fisher-Yates Shuffle)
    for (let i = filteredQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
    }

    // Slice down to requested array constraint limit
    activeQuestionSet = filteredQuestions.slice(0, Math.min(targetCount, filteredQuestions.length));

    // Structural UI Transition Sequence
    welcomeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');

    currentQuestionIndex = 0;
    userScore = 0;
    scoreTracker.innerHTML = `<i class="fa-solid fa-star text-accent"></i> Score: 0`;

    renderCurrentQuestion();
});

// --- Step 2: Dynamic Rendering Engine ---
function renderCurrentQuestion() {
    clearOptionGrid();
    const activeQuestion = activeQuestionSet[currentQuestionIndex];

    // Ambient Immersive Background Themes Engine
    document.body.className = '';
    document.body.classList.add(`theme-${activeQuestion.type.toLowerCase()}`);

    // Update Text & Vector Markers
    let iconMarkup = getLanguageIcon(activeQuestion.type);
    badge.innerHTML = `${iconMarkup} ${activeQuestion.type}`;
    counterEl.innerHTML = `<i class="fa-regular fa-compass"></i> Segment ${currentQuestionIndex + 1} of ${activeQuestionSet.length}`;
    questionEl.innerText = activeQuestion.question;

    // Linearly Scale Progress Tracking bar
    const progressPercent = (currentQuestionIndex / activeQuestionSet.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Render Response Interfaces
    activeQuestion.options.forEach((optionString, optionIdx) => {
        const optionBtn = document.createElement('button');
        optionBtn.innerText = optionString;
        optionBtn.classList.add('btn');
        optionBtn.dataset.index = optionIdx;
        optionBtn.addEventListener('click', evaluateSelectedAnswer);
        optionsContainer.appendChild(optionBtn);
    });
}

function clearOptionGrid() {
    nextBtn.classList.add('hidden');
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function getLanguageIcon(type) {
    switch (type) {
        case 'HTML': return '<i class="fa-brands fa-html5"></i>';
        case 'CSS': return '<i class="fa-brands fa-css3-alt"></i>';
        case 'JS': return '<i class="fa-brands fa-square-js"></i>';
        default: return '<i class="fa-solid fa-code"></i>';
    }
}

// --- Step 3: System Verification Engine ---
function evaluateSelectedAnswer(e) {
    const selectedBtn = e.target;
    const pickedIndex = parseInt(selectedBtn.dataset.index);
    const correctIndex = activeQuestionSet[currentQuestionIndex].correct;
    const allOptionButtons = optionsContainer.querySelectorAll('.btn');

    allOptionButtons.forEach(button => button.disabled = true);

    if (pickedIndex === correctIndex) {
        selectedBtn.classList.add('correct');
        userScore++;
        scoreTracker.innerHTML = `<i class="fa-solid fa-star text-accent"></i> Score: ${userScore}`;
    } else {
        selectedBtn.classList.add('wrong');
        allOptionButtons[correctIndex].classList.add('correct');
    }

    nextBtn.classList.remove('hidden');
}

// --- Step 4: Iteration Progression Logic ---
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < activeQuestionSet.length) {
        renderCurrentQuestion();
    } else {
        displayFinalPerformanceMetrics();
    }
});

// --- Step 5: Diagnostic Terminal Complete View ---
function displayFinalPerformanceMetrics() {
    progressBar.style.width = '100%';
    document.body.className = 'theme-default'; // Reset to standard configuration aura

    questionEl.innerText = `Matrix Diagnostics Complete!`;
    badge.innerHTML = `<i class="fa-solid fa-flag-checkered"></i> FINISH`;
    counterEl.innerText = "Review Stage";

    optionsContainer.innerHTML = `
        <div style="text-align: center; padding: 1rem 0;">
            <h3 style="font-family: 'Orbitron', sans-serif; font-size: 3rem; color: var(--accent-color); margin-bottom: 0.5rem;">
                ${userScore} / ${activeQuestionSet.length}
            </h3>
            <p style="color: var(--text-muted); margin-bottom: 2.5rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                EVALUATION RATING: ${((userScore / activeQuestionSet.length) * 100).toFixed(0)}%
            </p>
            <button class="action-btn" onclick="location.reload()">
                <i class="fa-solid fa-rotate-left"></i> <span>Reinitialize Matrix</span>
            </button>
        </div>
    `;
    nextBtn.classList.add('hidden');
}