
// Global State
let currentScreen = 'splash';
let currentQuestionIndex = 0;
let heartPoints = 0;
let gameStats = {
    hunger: 100,
    hygiene: 100,
    energy: 100,
    happiness: 100,
    hearts: 50
};
let companionName = 'Uteroo';
let currentRoom = 'bedroom';
let currentPhase = 'menstruation';

// Onboarding Data
const onboardingQuestions = [
    {
        id: 'lastPeriodStart',
        title: 'When did your last period start?',
        options: [
            { value: 'current', label: 'I\'m on it right now!', icon: '🩸' },
            { value: 'week-ago', label: 'About a week ago', icon: '📅' },
            { value: 'two-weeks', label: 'Two weeks ago', icon: '📅' },
            { value: 'unknown', label: 'I don\'t remember', icon: '🤷' }
        ]
    },
    {
        id: 'periodLength',
        title: 'How long do your periods usually last?',
        options: [
            { value: '3-5', label: '3-5 days' },
            { value: '6-7', label: '6-7 days' },
            { value: '8+', label: '8+ days' },
            { value: 'varies', label: 'It varies a lot', icon: '♾️' }
        ]
    },
    {
        id: 'cyclePredictability',
        title: 'How predictable is your cycle?',
        options: [
            { value: 'clockwork', label: 'Like clockwork!', icon: '⏱️' },
            { value: 'regular-varies', label: 'Usually 25-35 days', icon: '🔄' },
            { value: 'irregular', label: 'Complete surprise every month', icon: '🌪️' }
        ]
    },
    {
        id: 'ovulationSigns',
        title: 'Do you notice any signs around ovulation?',
        options: [
            { value: 'discharge', label: 'Egg-white discharge', icon: '🥚' },
            { value: 'energy', label: 'Energy boost', icon: '⚡' },
            { value: 'none', label: 'No signs', icon: '🚫' }
        ]
    },
    {
        id: 'premenstrualSymptoms',
        title: 'How do you feel 5-7 days before your period?',
        options: [
            { value: 'irritable', label: 'Irritable/sensitive', icon: '🌋' },
            { value: 'bloated', label: 'Bloated/craving carbs', icon: '🥨' },
            { value: 'fine', label: 'Totally fine, no changes!', icon: '🌈' }
        ]
    },
    {
        id: 'worstSymptom',
        title: 'What\'s your most annoying symptom?',
        options: [
            { value: 'cramps', label: 'Cramps', icon: '🤕' },
            { value: 'mood', label: 'Mood swings', icon: '😤' },
            { value: 'fatigue', label: 'Fatigue', icon: '🥱' }
        ]
    }
];

let onboardingAnswers = {};

// Room Items Data
const roomItems = {
    bedroom: [
        { id: 'bed', icon: '🛏️', x: 20, y: 30, action: 'rest' },
        { id: 'pillow', icon: '🪑', x: 80, y: 40, action: 'comfort' },
        { id: 'book', icon: '📚', x: 70, y: 70, action: 'read' }
    ],
    kitchen: [
        { id: 'apple', icon: '🍎', x: 30, y: 50, action: 'feed' },
        { id: 'water', icon: '💧', x: 60, y: 30, action: 'drink' },
        { id: 'stove', icon: '🍳', x: 80, y: 60, action: 'cook' }
    ],
    bathroom: [
        { id: 'shower', icon: '🚿', x: 25, y: 40, action: 'clean' },
        { id: 'toilet', icon: '🚽', x: 70, y: 50, action: 'relieve' },
        { id: 'mirror', icon: '🪞', x: 50, y: 20, action: 'groom' }
    ],
    lab: [
        { id: 'microscope', icon: '🔬', x: 40, y: 45, action: 'research' },
        { id: 'test-tube', icon: '🧪', x: 60, y: 35, action: 'experiment' },
        { id: 'chart', icon: '📊', x: 70, y: 65, action: 'analyze' }
    ]
};

// Phase Messages
const phaseMessages = {
    menstruation: { emoji: '🌸', message: 'Gentle movement reduces cramps!' },
    follicular: { emoji: '🌱', message: 'Great time for new projects!' },
    ovulatory: { emoji: '☀️', message: 'Peak energy - socialize & connect!' },
    luteal: { emoji: '🍂', message: 'Focus on self-care & rest' }
};

// Utility Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
}

function showToast(title, description) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function addFloatingHeart(containerId, x = 50, y = 70) {
    const container = document.getElementById(containerId);
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️ +1';
    heart.style.left = `${x + (Math.random() * 10 - 5)}%`;
    heart.style.top = `${y}%`;
    container.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1500);
    
    heartPoints += 1;
    updateHeartDisplay();
}

function updateHeartDisplay() {
    const heartCountEl = document.getElementById('heart-count');
    const gameHeartsEl = document.getElementById('game-hearts');
    if (heartCountEl) heartCountEl.textContent = heartPoints;
    if (gameHeartsEl) gameHeartsEl.textContent = gameStats.hearts;
}

function updateStats() {
    const stats = ['hunger', 'hygiene', 'energy', 'happiness'];
    stats.forEach(stat => {
        const bar = document.getElementById(`${stat}-bar`);
        const value = document.getElementById(`${stat}-value`);
        if (bar && value) {
            bar.style.width = `${gameStats[stat]}%`;
            value.textContent = gameStats[stat];
        }
    });
    updateHeartDisplay();
}

// Screen Transition Functions
function init() {
    setTimeout(() => {
        showScreen('welcome-screen');
    }, 4000);
}

function startOnboarding() {
    showScreen('onboarding-screen');
    renderCurrentQuestion();
}

function showPhaseExplanation() {
    showScreen('phase-explanation');
}

function showLogin() {
    showToast('Demo Mode', 'Login functionality would connect to your backend');
}

function renderCurrentQuestion() {
    const question = onboardingQuestions[currentQuestionIndex];
    if (!question) return;
    
    document.getElementById('question-title').textContent = question.title;
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = onboardingQuestions.length;
    
    const optionsContainer = document.getElementById('question-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.onclick = () => selectOption(question.id, option.value);
        
        const isSelected = onboardingAnswers[question.id] === option.value;
        if (isSelected) button.classList.add('selected');
        
        button.innerHTML = `
            ${option.icon ? `<span class="option-icon">${option.icon}</span>` : ''}
            <span>${option.label}</span>
        `;
        
        optionsContainer.appendChild(button);
    });
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / onboardingQuestions.length) * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    nextBtn.textContent = currentQuestionIndex === onboardingQuestions.length - 1 ? 'Get Results' : 'Next';
    nextBtn.disabled = !onboardingAnswers[question.id];
}

function selectOption(questionId, value) {
    onboardingAnswers[questionId] = value;
    
    // Update UI
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    event.target.closest('.option-btn').classList.add('selected');
    
    // Add floating heart
    addFloatingHeart('floating-hearts');
    
    // Show toast
    showToast('Great choice!', 'Your answer has been recorded.');
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
    
    // Auto-advance after a short delay
    setTimeout(() => {
        if (currentQuestionIndex < onboardingQuestions.length - 1) {
            nextQuestion();
        }
    }, 1000);
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderCurrentQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < onboardingQuestions.length - 1) {
        currentQuestionIndex++;
        renderCurrentQuestion();
    } else {
        showSummary();
    }
}

function showSummary() {
    // Determine phase based on answers
    if (onboardingAnswers.lastPeriodStart === 'current') {
        currentPhase = 'menstruation';
    } else if (onboardingAnswers.lastPeriodStart === 'week-ago') {
        currentPhase = 'follicular';
    } else if (onboardingAnswers.lastPeriodStart === 'two-weeks') {
        currentPhase = 'ovulatory';
    } else {
        currentPhase = 'luteal';
    }
    
    const phaseInfo = {
        menstruation: 'your body is resetting! Estrogen and progesterone are at their lowest. Rest is your superpower right now. 💤',
        follicular: 'energy and creativity are peaking. Perfect time for new projects or workouts!',
        ovulatory: 'testosterone and estrogen are high—you might feel extra confident or social. Baby-making or not, this is your glow phase.',
        luteal: 'progesterone is running the show now. Bloating, mood swings, or cravings? Totally normal!'
    };
    
    const phaseEmojis = {
        menstruation: '🌑',
        follicular: '🌱', 
        ovulatory: '🌕',
        luteal: '🌗'
    };
    
    const summary = `
        You're likely in your ${phaseEmojis[currentPhase]} <strong>${currentPhase} phase</strong> — ${phaseInfo[currentPhase]}
        <br><br>
        Based on your answers, we recommend focusing on self-care and tracking your symptoms daily to get more personalized advice!
        <br><br>
        Remember: Your cycle isn't a flaw—it's a rhythm. Uteroo's here to help you sync with it! 🌸
    `;
    
    document.getElementById('summary-text').innerHTML = summary;
    showScreen('summary-screen');
}

function copySummary() {
    const summaryText = document.getElementById('summary-text').textContent;
    navigator.clipboard.writeText(summaryText).then(() => {
        showToast('Copied!', 'Summary copied to clipboard');
    });
}

function enterGame() {
    showScreen('game-screen');
    initializeGame();
}

// Game Functions
function initializeGame() {
    updateStats();
    switchRoom('bedroom');
    updateCharacterMessage();
    
    // Show naming modal
    setTimeout(() => {
        document.getElementById('naming-modal').classList.add('active');
    }, 1000);
    
    // Start stat decay
    startStatDecay();
}

function switchRoom(roomName) {
    currentRoom = roomName;
    
    // Update room buttons
    document.querySelectorAll('.room-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-room="${roomName}"]`).classList.add('active');
    
    // Update game area background
    const gameArea = document.getElementById('game-area');
    gameArea.className = `game-area ${roomName}`;
    
    // Update room items
    renderRoomItems();
    
    showToast('Room Changed', `Welcome to the ${roomName}!`);
}

function renderRoomItems() {
    const itemsContainer = document.getElementById('room-items');
    itemsContainer.innerHTML = '';
    
    const items = roomItems[currentRoom] || [];
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'room-item';
        itemEl.style.left = `${item.x}%`;
        itemEl.style.top = `${item.y}%`;
        itemEl.onclick = () => useRoomItem(item);
        itemEl.innerHTML = `<div style="font-size: 2rem;">${item.icon}</div>`;
        itemsContainer.appendChild(itemEl);
    });
}

function useRoomItem(item) {
    const actions = {
        rest: () => { gameStats.energy = Math.min(100, gameStats.energy + 20); },
        feed: () => { gameStats.hunger = Math.min(100, gameStats.hunger + 30); },
        clean: () => { gameStats.hygiene = Math.min(100, gameStats.hygiene + 25); },
        comfort: () => { gameStats.happiness = Math.min(100, gameStats.happiness + 15); },
        drink: () => { gameStats.energy = Math.min(100, gameStats.energy + 10); },
        cook: () => { gameStats.hunger = Math.min(100, gameStats.hunger + 20); },
        relieve: () => { gameStats.hygiene = Math.min(100, gameStats.hygiene + 10); },
        groom: () => { gameStats.happiness = Math.min(100, gameStats.happiness + 10); },
        research: () => { gameStats.happiness = Math.min(100, gameStats.happiness + 15); },
        experiment: () => { gameStats.energy = Math.min(100, gameStats.energy + 5); },
        analyze: () => { gameStats.happiness = Math.min(100, gameStats.happiness + 10); }
    };
    
    if (actions[item.action]) {
        actions[item.action]();
        updateStats();
        addFloatingHeart('character-hearts');
        showToast('Item Used', `Used ${item.icon} - stats improved!`);
    }
}

function clickCharacter() {
    addFloatingHeart('character-hearts');
    gameStats.happiness = Math.min(100, gameStats.happiness + 5);
    updateStats();
    
    const messages = [
        'Thanks for the love! 💕',
        'That tickles! 😊',
        'You\'re the best! ✨',
        'Feeling better already! 🌟'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showToast('Character Interaction', randomMessage);
}

function updateCharacterMessage() {
    const phaseData = phaseMessages[currentPhase];
    document.getElementById('character-emoji').textContent = phaseData.emoji;
    document.getElementById('character-message').textContent = phaseData.message;
}

// Action Bar Functions
function feedCharacter() {
    if (gameStats.hearts >= 5) {
        gameStats.hunger = Math.min(100, gameStats.hunger + 25);
        gameStats.hearts -= 5;
        updateStats();
        addFloatingHeart('character-hearts');
        showToast('Fed!', 'Uteroo is feeling satisfied! 🍎');
    } else {
        showToast('Not enough hearts', 'You need 5 ❤️ to feed Uteroo');
    }
}

function cleanCharacter() {
    if (gameStats.hearts >= 3) {
        gameStats.hygiene = Math.min(100, gameStats.hygiene + 30);
        gameStats.hearts -= 3;
        updateStats();
        addFloatingHeart('character-hearts');
        showToast('Clean!', 'Uteroo is sparkling clean! ✨');
    } else {
        showToast('Not enough hearts', 'You need 3 ❤️ to clean Uteroo');
    }
}

function playWithCharacter() {
    if (gameStats.hearts >= 2) {
        gameStats.happiness = Math.min(100, gameStats.happiness + 20);
        gameStats.energy = Math.max(0, gameStats.energy - 10);
        gameStats.hearts -= 2;
        updateStats();
        addFloatingHeart('character-hearts');
        showToast('Playtime!', 'Uteroo had so much fun! 🎮');
    } else {
        showToast('Not enough hearts', 'You need 2 ❤️ to play with Uteroo');
    }
}

function restCharacter() {
    gameStats.energy = Math.min(100, gameStats.energy + 35);
    gameStats.happiness = Math.min(100, gameStats.happiness + 10);
    updateStats();
    addFloatingHeart('character-hearts');
    showToast('Rest time!', 'Uteroo is feeling refreshed! 😴');
}

// Companion Naming
function saveCompanionName() {
    const nameInput = document.getElementById('companion-name');
    const name = nameInput.value.trim();
    
    if (name && name.length <= 15) {
        companionName = name;
        document.getElementById('naming-modal').classList.remove('active');
        showToast('Name Saved!', `Your companion is now called ${companionName}! 💕`);
    } else {
        showToast('Invalid Name', 'Please enter a name (max 15 characters)');
    }
}

function skipNaming() {
    document.getElementById('naming-modal').classList.remove('active');
    showToast('Name Skipped', 'Your companion will be called Uteroo');
}

// Stat Decay System
function startStatDecay() {
    setInterval(() => {
        gameStats.hunger = Math.max(0, gameStats.hunger - 1);
        gameStats.hygiene = Math.max(0, gameStats.hygiene - 0.5);
        gameStats.energy = Math.max(0, gameStats.energy - 0.8);
        
        // Happiness decreases faster if other stats are low
        const avgStats = (gameStats.hunger + gameStats.hygiene + gameStats.energy) / 3;
        const happinessDecay = avgStats < 50 ? 1.5 : 0.5;
        gameStats.happiness = Math.max(0, gameStats.happiness - happinessDecay);
        
        // Gain hearts slowly over time
        if (Math.random() < 0.1) {
            gameStats.hearts = Math.min(999, gameStats.hearts + 1);
        }
        
        updateStats();
        
        // Show warning if stats are getting low
        const lowStats = Object.entries(gameStats)
            .filter(([key, value]) => key !== 'hearts' && value < 20)
            .map(([key]) => key);
            
        if (lowStats.length > 0 && Math.random() < 0.1) {
            showToast('Low Stats Warning', `${companionName}'s ${lowStats[0]} is getting low!`);
        }
    }, 10000); // Update every 10 seconds for demo purposes
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    init();
});

// Handle modal clicks outside content
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
