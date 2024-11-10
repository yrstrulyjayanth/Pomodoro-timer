// Constants
const pomodoroDuration = 25 * 60; // 25 minutes in seconds
const shortBreakDuration = 5 * 60; // 5 minutes in seconds
const longBreakDuration = 15 * 60; // 15 minutes in seconds

// Variables
let timerInterval;
let isRunning = false;
let remainingTime = pomodoroDuration;
let session = 'work'; // Default session type

// DOM Elements
const timerDisplay = document.getElementById('timer-display');
const sessionState = document.getElementById('session-state');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');

// Helper function to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update display function
function updateDisplay() {
    timerDisplay.textContent = formatTime(remainingTime);
}

// Timer function
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = 'Pause';
        timerInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.textContent = 'Start';
                // Optional: Play sound or show notification
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'Start';
    }
}

// Reset function
async function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = 'Start';

    // Call the backend to reset timer with current session type
    try {
        const response = await fetch('/start_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_type: session,
                is_reset: true
            })
        });
        const data = await response.json();
        remainingTime = data.time_left;
        session = data.session_state;
        sessionState.textContent = `${session.charAt(0).toUpperCase() + session.slice(1)} Session`;
        updateDisplay();
    } catch (error) {
        console.error('Error resetting timer:', error);
    }
}

// Session change function
async function changeSession(newSession) {
    session = newSession;
    try {
        const response = await fetch('/start_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_type: newSession,
                is_reset: false
            })
        });
        const data = await response.json();
        remainingTime = data.time_left;
        session = data.session_state;
        sessionState.textContent = `${session.charAt(0).toUpperCase() + session.slice(1)} Session`;
        updateDisplay();
        
        // Reset timer state
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'Start';
    } catch (error) {
        console.error('Error changing session:', error);
    }
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
pomodoroBtn.addEventListener('click', () => changeSession('work'));
shortBreakBtn.addEventListener('click', () => changeSession('short-break'));
longBreakBtn.addEventListener('click', () => changeSession('long-break'));

// Initialize the display
updateDisplay();
