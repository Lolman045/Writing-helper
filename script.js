// Get elements
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const pauseResumeBtn = document.getElementById("pauseResumeBtn");
const restartBtn = document.getElementById("restartBtn");
const toggleSpeechBtn = document.getElementById("toggleSpeechBtn");
const languageSelector = document.getElementById("languageSelector");

let interval;
let index = 0;
let isPaused = false;
let words = [];
let highlightedWords = []; // Store highlighted words
let currentSpeed = parseInt(speedSlider.value);
let synth = window.speechSynthesis; // Initialize speech synthesis
let speechEnabled = false;  // Track if speech is enabled
let selectedLanguage = languageSelector.value;  // Default language is English

// Function to highlight words one by one and read aloud
function highlightText() {
    const text = inputText.value.trim();
    words = text.split(/\s+/);  // Split by spaces

    // If text was previously highlighted, continue from the last highlighted word
    if (highlightedWords.length > 0) {
        index = highlightedWords.length;
    }

    interval = setInterval(() => {
        if (index < words.length) {
            const span = document.createElement("span");
            span.textContent = words[index] + " ";
            span.style.backgroundColor = "yellow";
            outputText.appendChild(span);
            highlightedWords.push(words[index]); // Store highlighted word

            // Read aloud the current word if speech is enabled
            if (speechEnabled) {
                const utterance = new SpeechSynthesisUtterance(words[index]);
                utterance.lang = selectedLanguage;  // Set the selected language
                utterance.rate = 1;  // Normal speech rate
                utterance.pitch = 1; // Normal pitch
                utterance.volume = 1; // Full volume

                // Speak the word as soon as it appears in the output text
                synth.speak(utterance);
            }

            index++;
        } else {
            clearInterval(interval);  // Stop once all words are highlighted
        }
    }, currentSpeed);  // Speed adjusted dynamically
}

// Update the speed value display and adjust the speed range
speedSlider.addEventListener("input", function () {
    const newSpeed = parseInt(speedSlider.value);
    speedValue.textContent = `${newSpeed}ms`; // Display the current speed
    if (!isPaused) {
        // Only change the interval speed if not paused
        currentSpeed = newSpeed;
        clearInterval(interval); // Clear the previous interval
        highlightText();  // Restart highlighting with the new speed
    }
});

// Event listener for when typing
inputText.addEventListener("input", function () {
    if (interval) {
        clearInterval(interval);
    }
    highlightedWords = [];  // Reset highlighted words
    outputText.innerHTML = "";  // Clear the output box
    highlightText();  // Restart highlighting with the new input
});

// Pause/Resume button functionality
pauseResumeBtn.addEventListener("click", function () {
    if (isPaused) {
        // Resume highlighting from where it left off
        highlightText();
        pauseResumeBtn.textContent = "Pause";
    } else {
        // Pause the highlighting
        clearInterval(interval);
        pauseResumeBtn.textContent = "Resume";
    }
    isPaused = !isPaused;
});

// Restart button functionality
restartBtn.addEventListener("click", function () {
    // Reset all variables and restart the highlighting process
    index = 0;
    highlightedWords = [];
    outputText.innerHTML = ""; // Clear the output text
    inputText.value = "";  // Clear the input text box
    pauseResumeBtn.textContent = "Pause";  // Reset button text
    if (interval) {
        clearInterval(interval);
    }
    highlightText();  // Restart highlighting from the beginning
});

// Toggle speech on/off
toggleSpeechBtn.addEventListener("click", function () {
    speechEnabled = !speechEnabled;  // Toggle the speech state
    toggleSpeechBtn.textContent = speechEnabled ? "Turn Speech Off" : "Turn Speech On"; // Change button text
});

// Update language selection when user chooses a new language
languageSelector.addEventListener("change", function () {
    selectedLanguage = languageSelector.value;  // Update selected language
});