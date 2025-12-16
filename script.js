//Arrow function. Await of DOM is fully loaded. Query all 

document.addEventListener("DOMContentLoaded", () => {
//All elements of key (HTML) saved to 'allKeys'
    const allKeys = document.querySelectorAll(".key");
    console.log("Gefundene Keys:", allKeys.length);

//Eavesdrop of keys allocated to 'pressed', in low caps because of HTML 
    window.addEventListener("keydown", (event) => {

        const pressed = event.key.toLowerCase();


//User input of 'key' lower case else upper case
        let selector = `.key[data-key="${pressed}"], .key[data-key="${event.key}"]`;
//Test in HTML if key exist, then applies it to 'keyEl'. 'Let' because its an multitasking event
        let keyEl = document.querySelector(selector);

//Fallback mechanism for UX, to make it stable. 
        if (!keyEl) {
            keyEl = document.querySelector(`.key[data-key="${pressed.toUpperCase()}"]`);
        }


        if (!keyEl) {

            return;
        }

//CSS Template initiate. Coloring event for 'key' active for 150 milliseconds
        keyEl.classList.add("active");
        setTimeout(() => keyEl.classList.remove("active"), 150);
    });
});



    
    const sampleText = document.getElementById("sample-text");
    const newTextBtn = document.getElementById("new-text-btn");
    const inputField = document.getElementById("input-field");

    
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

    
    let currentText = "";
    let currentPosition = 0;
    let typedText = "";

    
    function getRandomText() {
        const randomIndex = Math.floor(Math.random() * textLibrary.length);
        return textLibrary[randomIndex];
    }

    
    function displayNewText() {
        if (sampleText) {
            currentText = getRandomText();
            currentPosition = 0;
            typedText = "";

            
            sampleText.innerHTML = currentText
                .split('')
                .map(char => `<span class="char">${char}</span>`)
                .join('');

            
            if (inputField) {
                inputField.value = "";
                inputField.focus(); 
            }

            
            highlightCurrentChar();
        }
    }

    
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

    
    function setupTypingListener() {
        if (!inputField) return;

        inputField.addEventListener('input', (e) => {
            typedText = e.target.value;
            currentPosition = typedText.length;

            
            highlightCurrentChar();

            
            if (currentPosition >= currentText.length) {
                setTimeout(() => {
                    alert("Text completed! Loading new text...");
                    displayNewText();
                }, 500);
            }
        });
    }

    
    displayNewText();
    setupTypingListener();

    
    if (newTextBtn) {
        newTextBtn.addEventListener("click", displayNewText);
    }

    
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

    
    const sampleText = document.getElementById("sample-text");
    const newTextBtn = document.getElementById("new-text-btn");
    const inputField = document.getElementById("input-field");
    const wpmElement = document.getElementById("wpm");
    const accuracyElement = document.getElementById("accuracy");
    const timeElement = document.getElementById("time");

    
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
    let testCompleted = false; 

    
    function getRandomText() {
        const randomIndex = Math.floor(Math.random() * textLibrary.length);
        return textLibrary[randomIndex];
    }

    
    function startNewText() {
        currentText = getRandomText();
        currentPosition = 0;
        typedText = "";
        correctChars = 0;
        totalChars = 0;
        timeElapsed = 0;
        testActive = false;
        userIsTyping = false;
        testCompleted = false; 

        
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        startTime = null;

        
        sampleText.innerHTML = currentText
            .split('')
            .map(char => `<span class="char">${char}</span>`)
            .join('');

        
        if (inputField) {
            inputField.value = "";
            inputField.focus();
        }

        
        updateStats();
        highlightCurrentChar();
    }

    
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

    
    function setupTypingListener() {
        if (!inputField) return;

        inputField.addEventListener('input', (e) => {
            
            if (testCompleted) {
                e.target.value = ""; 
                return;
            }

            const newTypedText = e.target.value;

            
            if (newTypedText.length === 1 && typedText.length === 0) {
                startTimer();
                userIsTyping = true;
            }

            
            if (newTypedText.length > typedText.length) {
                const newChar = newTypedText[newTypedText.length - 1];
                const expectedChar = currentText[newTypedText.length - 1];

                totalChars++;
                if (newChar === expectedChar) {
                    correctChars++;
                }
            }

            
            if (newTypedText.length < typedText.length) {
                totalChars = Math.max(0, totalChars - 1);
            }

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

        
        setTimeout(() => {
            const wpm = parseInt(wpmElement.textContent) || 0;
            const accuracy = parseInt(accuracyElement.textContent) || 100;

            
            if (wpm > 0 || accuracy < 100) {
                alert(`Test abgeschlossen!\n\nWPM: ${wpm}\nGenauigkeit: ${accuracy}%\nZeit: ${timeElapsed}s`);
            }

            
            setTimeout(() => {
                startNewText();
            }, 500);

        }, 300);
    }

    
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

    
    function initialize() {
        startNewText();
        setupTypingListener();
        setupSpecialKeys();

        
        if (newTextBtn) {
            newTextBtn.addEventListener("click", startNewText);
        }

        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !inputField.matches(':focus')) {
                startNewText();
            }
        });

        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                startNewText();
            }
        });
    }

    
    initialize();
});
