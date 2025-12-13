document.addEventListener("DOMContentLoaded", () => {

    const allKeys = document.querySelectorAll(".key");
    console.log("Gefundene Keys:", allKeys.length);


    window.addEventListener("keydown", (event) => {

        const pressed = event.key.toLowerCase();



        let selector = `.key[data-key="${pressed}"], .key[data-key="${event.key}"]`;
        let keyEl = document.querySelector(selector);


        if (!keyEl) {
            keyEl = document.querySelector(`.key[data-key="${pressed.toUpperCase()}"]`);
        }


        if (!keyEl) {

            return;
        }


        keyEl.classList.add("active");
        setTimeout(() => keyEl.classList.remove("active"), 150);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    // 1. KEYBOARD CODE (bleibt gleich - nur blaues Aufleuchten)
    const allKeys = document.querySelectorAll(".key");
    console.log("Gefundene Keys:", allKeys.length);

    window.addEventListener("keydown", (event) => {
        const pressed = event.key.toLowerCase();
        let selector = `.key[data-key="${pressed}"], .key[data-key="${event.key}"]`;
        let keyEl = document.querySelector(selector);

        if (!keyEl) {
            keyEl = document.querySelector(`.key[data-key="${pressed.toUpperCase()}"]`);
        }

        if (!keyEl) {
            return;
        }

        keyEl.classList.add("active");
        setTimeout(() => keyEl.classList.remove("active"), 150);
    });

    // 2. TEXT-GENERATOR UND TYPING-LOGIK (NUR TEXT-FARBEN)
    const sampleText = document.getElementById("sample-text");
    const newTextBtn = document.getElementById("new-text-btn");
    const inputField = document.getElementById("input-field");

    // Text-Bibliothek
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

    // Aktueller Text und Position
    let currentText = "";
    let currentPosition = 0;
    let typedText = "";

    // Zufälligen Text holen
    function getRandomText() {
        const randomIndex = Math.floor(Math.random() * textLibrary.length);
        return textLibrary[randomIndex];
    }

    // Text in der großen Box anzeigen (mit HTML für Farben)
    function displayNewText() {
        if (sampleText) {
            currentText = getRandomText();
            currentPosition = 0;
            typedText = "";

            // Text mit neutraler Farbe anzeigen
            sampleText.innerHTML = currentText
                .split('')
                .map(char => `<span class="char">${char}</span>`)
                .join('');

            // Input-Feld leeren
            if (inputField) {
                inputField.value = "";
                inputField.focus(); // Fokus behalten
            }

            // Ersten Buchstaben als aktuell markieren
            highlightCurrentChar();
        }
    }

    // Aktuellen Buchstaben hervorheben (NUR TEXT-FARBEN)
    function highlightCurrentChar() {
        const chars = sampleText.querySelectorAll('.char');
        chars.forEach((char, index) => {
            char.className = 'char'; // Zurücksetzen

            if (index === currentPosition) {
                // Aktueller Buchstabe (wo der Cursor ist)
                char.classList.add('char-current');
            } else if (index < currentPosition) {
                // Bereits getippte Buchstaben - FARBE basierend auf Korrektheit
                if (typedText[index] === currentText[index]) {
                    char.classList.add('char-correct'); // GRÜN
                } else {
                    char.classList.add('char-incorrect'); // ROT
                }
            }
        });
    }

    // Typing-Event (NUR TEXT, KEINE TASTATUR-FARBEN)
    function setupTypingListener() {
        if (!inputField) return;

        inputField.addEventListener('input', (e) => {
            typedText = e.target.value;
            currentPosition = typedText.length;

            // Text-Highlighting aktualisieren (NUR HIER passiert die Farbänderung)
            highlightCurrentChar();

            // Wenn Text fertig getippt ist
            if (currentPosition >= currentText.length) {
                setTimeout(() => {
                    alert("Text completed! Loading new text...");
                    displayNewText();
                }, 500);
            }
        });
    }

    // Beim Laden der Seite
    displayNewText();
    setupTypingListener();

    // New Text Button Event
    if (newTextBtn) {
        newTextBtn.addEventListener("click", displayNewText);
    }

    // 3. SPEZIALTASEN HANDLING (Space, Enter, Komma, Punkt)
    function setupSpecialKeys() {
        const specialKeys = {
            ' ': 'space',
            'Enter': 'enter',
            ',': ',',
            '.': '.'
        };

        window.addEventListener('keydown', (event) => {
            const key = event.key;
            if (specialKeys[key]) {
                const keyEl = document.querySelector(`.key[data-key="${specialKeys[key]}"]`);
                if (keyEl) {
                    keyEl.classList.add('active');
                    setTimeout(() => keyEl.classList.remove('active'), 150);
                }
            }
        });
    }

    setupSpecialKeys();
});



document.addEventListener("DOMContentLoaded", () => {
    // 1. KEYBOARD CODE (bleibt gleich)
    const allKeys = document.querySelectorAll(".key");
    console.log("Gefundene Keys:", allKeys.length);

    window.addEventListener("keydown", (event) => {
        const pressed = event.key.toLowerCase();
        let selector = `.key[data-key="${pressed}"], .key[data-key="${event.key}"]`;
        let keyEl = document.querySelector(selector);

        if (!keyEl) {
            keyEl = document.querySelector(`.key[data-key="${pressed.toUpperCase()}"]`);
        }

        if (!keyEl) {
            return;
        }

        keyEl.classList.add("active");
        setTimeout(() => keyEl.classList.remove("active"), 150);
    });

    // 2. ELEMENTE UND VARIABLEN
    const sampleText = document.getElementById("sample-text");
    const newTextBtn = document.getElementById("new-text-btn");
    const inputField = document.getElementById("input-field");
    const wpmElement = document.getElementById("wpm");
    const accuracyElement = document.getElementById("accuracy");
    const timeElement = document.getElementById("time");

    // Text-Bibliothek
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

    // STATISTIK-VARIABLEN
    let currentText = "";
    let currentPosition = 0;
    let typedText = "";
    let startTime = null;
    let timerInterval = null;
    let timeElapsed = 0;
    let correctChars = 0;
    let totalChars = 0;
    let testActive = false;
    let userIsTyping = false;
    let testCompleted = false; // NEU: Flag ob Test abgeschlossen

    // 3. TEXT-GENERATOR
    function getRandomText() {
        const randomIndex = Math.floor(Math.random() * textLibrary.length);
        return textLibrary[randomIndex];
    }

    // 4. NEUEN TEXT STARTEN (kompletter Reset)
    function startNewText() {
        currentText = getRandomText();
        currentPosition = 0;
        typedText = "";
        correctChars = 0;
        totalChars = 0;
        timeElapsed = 0;
        testActive = false;
        userIsTyping = false;
        testCompleted = false; // WICHTIG: Zurücksetzen

        // Timer stoppen
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        startTime = null;

        // Text anzeigen
        sampleText.innerHTML = currentText
            .split('')
            .map(char => `<span class="char">${char}</span>`)
            .join('');

        // Input-Feld leeren und fokussieren
        if (inputField) {
            inputField.value = "";
            inputField.focus();
        }

        // Stats zurücksetzen
        updateStats();
        highlightCurrentChar();
    }

    // 5. TIMER STARTEN
    function startTimer() {
        if (!testActive && !testCompleted) {
            testActive = true;
            startTime = Date.now();
            timeElapsed = 0;

            timerInterval = setInterval(() => {
                timeElapsed = Math.floor((Date.now() - startTime) / 1000);
                updateStats();
            }, 100);
        }
    }

    // 6. STATISTIKEN BERECHNEN UND ANZEIGEN
    function updateStats() {
        let wpm = 0;
        if (timeElapsed > 0 && typedText.length > 0) {
            const wordsTyped = typedText.length / 5;
            const minutes = timeElapsed / 60;
            wpm = Math.max(0, Math.round(wordsTyped / minutes));
        }

        let accuracy = 100;
        if (totalChars > 0) {
            accuracy = Math.max(0, Math.round((correctChars / totalChars) * 100));
        }

        if (wpmElement) wpmElement.textContent = wpm;
        if (accuracyElement) accuracyElement.textContent = accuracy;
        if (timeElement) timeElement.textContent = timeElapsed;

        updateStatColors(wpm, accuracy);
    }

    // 7. STAT-FARBEN ÄNDERN
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

    // 8. TEXT-HIGHLIGHTING
    function highlightCurrentChar() {
        const chars = sampleText.querySelectorAll('.char');
        chars.forEach((char, index) => {
            char.className = 'char';

            if (index === currentPosition) {
                char.classList.add('char-current');
            } else if (index < currentPosition) {
                if (typedText[index] === currentText[index]) {
                    char.classList.add('char-correct');
                } else {
                    char.classList.add('char-incorrect');
                }
            }
        });
    }

    // 9. TYPING-EVENT LISTENER
    function setupTypingListener() {
        if (!inputField) return;

        inputField.addEventListener('input', (e) => {
            // Wenn Test bereits abgeschlossen, nichts tun
            if (testCompleted) {
                e.target.value = ""; // Eingabe löschen
                return;
            }

            const newTypedText = e.target.value;

            // Timer starten bei erster Eingabe
            if (newTypedText.length === 1 && typedText.length === 0) {
                startTimer();
                userIsTyping = true;
            }

            // Nur neue Zeichen zählen
            if (newTypedText.length > typedText.length) {
                const newChar = newTypedText[newTypedText.length - 1];
                const expectedChar = currentText[newTypedText.length - 1];

                totalChars++;
                if (newChar === expectedChar) {
                    correctChars++;
                }
            }

            // Backspace behandeln
            if (newTypedText.length < typedText.length) {
                totalChars = Math.max(0, totalChars - 1);
            }

            typedText = newTypedText;
            currentPosition = typedText.length;

            // Stats und Highlighting aktualisieren
            updateStats();
            highlightCurrentChar();

            // Wenn Text fertig getippt ist
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

    // 10. TEST BEENDEN (mit korrektem Reset)
    function finishTest() {
        testCompleted = true; // WICHTIG: Flag setzen
        testActive = false;
        userIsTyping = false;

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        // Finale Stats
        updateStats();

        // Erfolgsmeldung (mit Timeout für bessere UX)
        setTimeout(() => {
            const wpm = parseInt(wpmElement.textContent) || 0;
            const accuracy = parseInt(accuracyElement.textContent) || 100;

            // OPTIONAL: Nur bei guter Performance Meldung zeigen
            if (wpm > 0 || accuracy < 100) {
                alert(`Test abgeschlossen!\n\nWPM: ${wpm}\nGenauigkeit: ${accuracy}%\nZeit: ${timeElapsed}s`);
            }

            // Automatisch neuen Text starten (mit kurzer Pause)
            setTimeout(() => {
                startNewText();
            }, 500);

        }, 300);
    }

    // 11. SPEZIALTASTEN
    function setupSpecialKeys() {
        const specialKeys = {
            ' ': 'space',
            'Enter': 'enter',
            ',': ',',
            '.': '.'
        };

        window.addEventListener('keydown', (event) => {
            const key = event.key;
            if (specialKeys[key]) {
                const keyEl = document.querySelector(`.key[data-key="${specialKeys[key]}"]`);
                if (keyEl) {
                    keyEl.classList.add('active');
                    setTimeout(() => keyEl.classList.remove('active'), 150);
                }
            }
        });
    }

    // 12. INITIALISIERUNG
    function initialize() {
        startNewText();
        setupTypingListener();
        setupSpecialKeys();

        // New Text Button Event
        if (newTextBtn) {
            newTextBtn.addEventListener("click", startNewText);
        }

        // Enter-Taste für Neustart
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !inputField.matches(':focus')) {
                startNewText();
            }
        });

        // ESC-Taste zum Abbrechen/Reset
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                startNewText();
            }
        });
    }

    // Alles starten
    initialize();
});
