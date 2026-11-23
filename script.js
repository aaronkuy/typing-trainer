document.addEventListener("DOMContentLoaded", () => {
    // Look the pressed key up in a map instead of building a CSS selector
    // from event.key: a selector made from `"` or `\` is invalid and throws.
    const keyElements = new Map();
    document.querySelectorAll(".key").forEach((keyEl) => {
        keyElements.set(keyEl.dataset.key, keyEl);
    });

    window.addEventListener("keydown", (event) => {
        // data-key values are lower case ("a", "enter", " "), so "A" and
        // "Enter" have to be normalized before the lookup.
        const keyEl = keyElements.get(event.key.toLowerCase());
        if (!keyEl) {
            return;
        }
        keyEl.classList.add("active");
        setTimeout(() => keyEl.classList.remove("active"), 150);
    });

    const sampleText = document.getElementById("sample-text");
    const newTextBtn = document.getElementById("new-text-btn");
    const inputField = document.getElementById("input-field");
    const wpmElement = document.getElementById("wpm");
    const accuracyElement = document.getElementById("accuracy");
    const timeElement = document.getElementById("time");

    // Practice sentences; one is picked at random per round.
    const textLibrary = [
        "The quick brown fox jumps over the lazy dog.",
        "Practice makes perfect when learning to type faster.",
        "Typing is a skill that improves with consistent practice.",
        "Programming requires good typing skills to write code.",
        "The sun shines brightly on beautiful green mountains.",
        "Learning new things helps keep your mind sharp.",
        "Technology continues to evolve at a rapid pace.",
        "Reading books is an excellent way to practice typing.",
        "JavaScript is powerful for web development.",
        "Every developer should master typing skills."
    ];

    // Round state
    let currentText = "";
    let currentPosition = 0;
    let typedText = "";
    let startTime = null;
    let timerInterval = null;
    let timeElapsed = 0;
    let correctKeystrokes = 0;
    let totalKeystrokes = 0;
    let testActive = false;
    let userIsTyping = false;
    let testCompleted = false;

    function getRandomText() {
        const randomIndex = Math.floor(Math.random() * textLibrary.length);
        return textLibrary[randomIndex];
    }

    // Resets the round state and renders a new sentence.
    function startNewText() {
        currentText = getRandomText();
        currentPosition = 0;
        typedText = "";
        correctKeystrokes = 0;
        totalKeystrokes = 0;
        timeElapsed = 0;
        testActive = false;
        userIsTyping = false;
        testCompleted = false;

        // Stop a timer left over from the previous round.
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        startTime = null;

        // One <span> per character so each can be styled on its own.
        sampleText.innerHTML = currentText
            .split('')
            .map(char => `<span class="char">${char}</span>`)
            .join('');

        if (inputField) {
            inputField.value = "";
            // Keep focus in the input so typing can start right away.
            inputField.focus();
        }

        updateStats();
        highlightCurrentChar();
    }

    // Starts the timer once per round, on the first keystroke.
    function startTimer() {
        if (!testActive && !testCompleted) {
            testActive = true;
            startTime = Date.now();
            timeElapsed = 0;
            // Refresh the stats every 100 ms; elapsed time is derived from Date.now()
            // rather than counted, so a throttled tab does not fall behind.
            timerInterval = setInterval(() => {
                timeElapsed = Math.floor((Date.now() - startTime) / 1000);
                updateStats();
            }, 100);
        }
    }

    // Recomputes WPM and accuracy and writes them to the page.
    function updateStats() {
        const wpm = TypingStats.calcWpm(typedText.length, timeElapsed);
        const accuracy = TypingStats.calcAccuracy(correctKeystrokes, totalKeystrokes);
        if (wpmElement) wpmElement.textContent = wpm;
        if (accuracyElement) accuracyElement.textContent = accuracy;
        if (timeElement) timeElement.textContent = timeElapsed;
        updateStatColors(wpm, accuracy);
    }

    // Marks typed characters as correct or incorrect and highlights the next one.
    function highlightCurrentChar() {
        if (!sampleText) return;
        const chars = sampleText.querySelectorAll('.char');

        chars.forEach((char, index) => {
            char.className = 'char';

            if (index === currentPosition) {
                char.classList.add('char-current');
            }
            else if (index < currentPosition) {
                if (typedText[index] === currentText[index]) {
                    char.classList.add('char-correct');
                } else {
                    char.classList.add('char-incorrect');
                }
            }
        });
    }

    // Colours each stat by threshold: good, ok, poor.
    function updateStatColors(wpm, accuracy) {
        if (!wpmElement || !accuracyElement || !timeElement) return;
        if (wpm >= 60) {
            wpmElement.style.color = "#4caf50";
        } else if (wpm >= 30) {
            wpmElement.style.color = "#ffc107";
        } else {
            wpmElement.style.color = "#ff4444";
        }
        if (accuracy >= 95) {
            accuracyElement.style.color = "#4caf50";
        } else if (accuracy >= 85) {
            accuracyElement.style.color = "#ffc107";
        } else {
            accuracyElement.style.color = "#ff4444";
        }
        // The time is only coloured while a round is being typed.
        if (userIsTyping) {
            if (timeElapsed > 120) {
                timeElement.style.color = "#ff4444";
            } else if (timeElapsed > 60) {
                timeElement.style.color = "#ffc107";
            } else {
                timeElement.style.color = "#4caf50";
            }
        }
    }

    function setupTypingListener() {
        if (!inputField) return;

        inputField.addEventListener('input', (e) => {
            // Ignore input in the short pause between the result and the next round.
            if (testCompleted) {
                e.target.value = "";
                return;
            }
            const newTypedText = e.target.value;

            if (newTypedText.length === 1 && typedText.length === 0) {
                startTimer();
                userIsTyping = true;
            }

            // Keystrokes are only ever added. Subtracting on backspace is what let
            // accuracy climb above 100% before.
            const step = TypingStats.countKeystrokes(typedText, newTypedText, currentText);
            totalKeystrokes += step.typed;
            correctKeystrokes += step.correct;

            typedText = newTypedText;
            currentPosition = typedText.length;

            updateStats();
            highlightCurrentChar();

            if (currentPosition >= currentText.length && !testCompleted) {
                finishTest();
            }
        });

        inputField.addEventListener('blur', () => {
            userIsTyping = false;
        });

        inputField.addEventListener('focus', () => {
            if (typedText.length > 0 && !testCompleted) {
                userIsTyping = true;
            }
        });
    }

    function finishTest() {
        testCompleted = true;
        testActive = false;
        userIsTyping = false;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        updateStats();

        // Let the last character render before the blocking alert opens.
        setTimeout(() => {
            // Computed from state. Reading the numbers back from the page
            // with parseInt(...) || 100 reported an accuracy of 0 as 100.
            const wpm = TypingStats.calcWpm(typedText.length, timeElapsed);
            const accuracy = TypingStats.calcAccuracy(correctKeystrokes, totalKeystrokes);

            if (wpm > 0 || accuracy < 100) {
                alert(`Test complete!\n\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nTime: ${timeElapsed}s`);
            }

            setTimeout(() => {
                startNewText();
            }, 500);

        }, 300);
    }

    // Entry point: render the first sentence and register the listeners.
    function initialize() {
        startNewText();
        setupTypingListener();

        if (newTextBtn) {
            newTextBtn.addEventListener("click", startNewText);
        }

        // Enter outside the input starts a new round.
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !inputField.matches(':focus')) {
                startNewText();
            }
        });

        // Escape always restarts the round.
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                startNewText();
            }
        });
    }

    initialize();
});
