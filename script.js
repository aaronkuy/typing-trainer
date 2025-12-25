document.addEventListener("DOMContentLoaded", () => {
//Fetch all HTML keys to the variable 'allKeys' 
    const allKeys = document.querySelectorAll(".key");
    console.log("Gefundene Keys:", allKeys.length);
//If the user types 'U' it converts to 'u'
    window.addEventListener("keydown", (event) => {
        const pressed = event.key.toLowerCase();
//The key the user is pressing is saved to selector 
        let selector = `.key[data-key="${pressed}"], .key[data-key="${event.key}"]`;
//Testing if the key is on the website, if so save it to keyEl
        let keyEl = document.querySelector(selector);
 //If keyEl is false test if the element may be find in upper case 
        if (!keyEl) {
            keyEl = document.querySelector(`.key[data-key="${pressed.toUpperCase()}"]`);
        }
//If keyEl stil false, skip every code beneath, and await the next iteration 
        if (!keyEl) {
            return;
        }
//If/keyEl is true activate the color in CSS for 150 ms and then remove it again
        keyEl.classList.add("active");
        setTimeout(() => keyEl.classList.remove("active"), 150);
    });

//Fetch HTML elements and allocate it to 
    const sampleText = document.getElementById("sample-text");
    const newTextBtn = document.getElementById("new-text-btn");
    const inputField = document.getElementById("input-field");
    const wpmElement = document.getElementById("wpm");
    const accuracyElement = document.getElementById("accuracy");
    const timeElement = document.getElementById("time");

//Our sample text for the user to write
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

//Setting the intial values of the varialbles 
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

//E.g. 0.452 * 10 = 4.52 → 4 element of the library 
    function getRandomText() {
        const randomIndex = Math.floor(Math.random() * textLibrary.length);
        return textLibrary[randomIndex];
    }

//Setting the initial values before the user starts typing 
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

//Reset the value of timerInterval if it exist for the next iteration 
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
//Also reset startTime
        startTime = null;

//Insert the absorbed text to the sampleText element in HTML 
        sampleText.innerHTML = currentText
//Make the sample text string to an array 
            .split('')
//Convert it to span in order to change the color of the letter and join it to a string
            .map(char => `<span class="char">${char}</span>`)
            .join('');

//Clear out the elements in input field 
        if (inputField) {
            inputField.value = "";
//Input field is already clicked for better UX
            inputField.focus();
        }

//Functions defined beneath 
        updateStats();
        highlightCurrentChar();
    }

//Enable the timer only when the iteration hasn't started nor completed 
    function startTimer() {
        if (!testActive && !testCompleted) {
//If so start the test
            testActive = true;
//Save the current time (1.000.000 ms) 
            startTime = Date.now();
//Set elepased time to zero
            timeElapsed = 0;
//Make every 0.1 seconds an interval, timer implementation 
            timerInterval = setInterval(() => {
                timeElapsed = Math.floor((Date.now() - startTime) / 1000);
                updateStats();
            }, 100);
        }
    }

//Set wpm to zero
    function updateStats() {
        let wpm = 0;
//Only update stats if the user started typing
        if (timeElapsed > 0 && typedText.length > 0) {
//We say an index of 5 is one word as a standard rule for reckoning
            const wordsTyped = typedText.length / 5;
//Convert the value of elapsed time to a minute for reckoning 
            const minutes = timeElapsed / 60;
//Float value expected, so we round it 
            wpm = Math.max(0, Math.round(wordsTyped / minutes));
        }
//Initial value of accuracy is set to 100%
        let accuracy = 100;
//If the user starts typed the first element of the text 
        if (totalChars > 0) {
//Calculate the accuracy to per cent 
            accuracy = Math.max(0, Math.round((correctChars / totalChars) * 100));
        }
//Display the calculated values in DOM 
        if (wpmElement) wpmElement.textContent = wpm;
        if (accuracyElement) accuracyElement.textContent = accuracy;
        if (timeElement) timeElement.textContent = timeElapsed;
//Change the color of wpm and accuracy depending on how the user is typing for better UX
        updateStatColors(wpm, accuracy);
    }
//Color implementation of the elements of the sample text 
    function highlightCurrentChar() {
//If sample text in HTML is false, then skip the code beneath 
        if (!sampleText) return;
//Allocate all chars in HTML to the correponded variable 
        const chars = sampleText.querySelectorAll('.char');

        chars.forEach((char, index) => {
            char.className = 'char';

            if (index === currentPosition) {
                char.classList.add('char-current');
            }
//Determination of the color of the element 
            else if (index < currentPosition) {
                if (typedText[index] === currentText[index]) {
                    char.classList.add('char-correct');
                } else {
                    char.classList.add('char-incorrect');
                }
            }
        });
    }


//Saved information of wmp and accuracy in order to determine the color 
    function updateStatColors(wpm, accuracy) {
//Skip the code beneath if one of those variables are false 
        if (!wpmElement || !accuracyElement || !timeElement) return;
//Green if at least 60 wpm, yellow if at least 30 wpm, else red 
        if (wpm >= 60) {
            wpmElement.style.color = "#4caf50";
        } else if (wpm >= 30) {
            wpmElement.style.color = "#ffc107";
        } else {
            wpmElement.style.color = "#ff4444";
        }
//Green if at least 95% accuaracy, yellow if at least 85%, else red
        if (accuracy >= 95) {
            accuracyElement.style.color = "#4caf50";
        } else if (accuracy >= 85) {
            accuracyElement.style.color = "#ffc107";
        } else {
            accuracyElement.style.color = "#ff4444";
        }
//Red if above 120 secs, yellow if above 60 secs, else green
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
//If input field is false skip the code beneath
    function setupTypingListener() {
        if (!inputField) return;

        inputField.addEventListener('input', (e) => {
//If testCompleted is true then empty our input field and skip the code beneath
            if (testCompleted) {
                e.target.value = "";
                return;
            }
//Save the current elements of the input field to newTypedText
            const newTypedText = e.target.value;

//If the user starts typing, enable the startTimer function 
            if (newTypedText.length === 1 && typedText.length === 0) {
                startTimer();
//The variable userIsTyping is shifting to true 
                userIsTyping = true;
            }
//If more elements in newTypedText than typeText, test if new key got pressed

            if (newTypedText.length > typedText.length) {
//Save the index of the last element typed to newChar
                const newChar = newTypedText[newTypedText.length - 1];
//Which element should be pressed on the text
                const expectedChar = currentText[newTypedText.length - 1];
//Add +1 to totalChars and add +1 to correctChars if the typed element equals the 
//expected one 
                totalChars++;
                if (newChar === expectedChar) {
                    correctChars++;
                }
            }

//If the user press backspace, erase one value of totalChars, not beneath 0
//no negative value of the input field
            if (newTypedText.length < typedText.length) {
                totalChars = Math.max(0, totalChars - 1);
            }
//Update to the old state 
            typedText = newTypedText;
//Correspondingly save the amount of elements of the prior cache 
            currentPosition = typedText.length;

//Enable the linked function for UX and stabiltiy 
            updateStats();
            highlightCurrentChar();

//Enable finishTest if we reached the same length of elements of the sample text 
//and testCompleted is set to false
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

//If enable finishTest, variable values are correspondignly shifting
    function finishTest() {
        testCompleted = true;
        testActive = false;
        userIsTyping = false;
//Reset the timer 
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

//Including the HTML in DOM of the stats 
        updateStats();

//Executed after 0,3 secs, prevent abrupt finishing 
        setTimeout(() => {
//Makes an integer of the HTML value of wmpElement if false, else 0
            const wpm = parseInt(wpmElement.textContent) || 0;
//The same with accuracy, or 100% if e.g. the user hasn't typed
            const accuracy = parseInt(accuracyElement.textContent) || 100;

//End result notation 
            if (wpm > 0 || accuracy < 100) {
                alert(`Test abgeschlossen!\n\nWPM: ${wpm}\nGenauigkeit: ${accuracy}%\nZeit: ${timeElapsed}s`);
            }

//After 0.5 seconds new text generated and timer reset 
            setTimeout(() => {
                startNewText();
            }, 500);

        }, 300);
    }

//Implementation of the extra signs 
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

//Merge all prior functions together 
    function initialize() {
        startNewText();
        setupTypingListener();
        setupSpecialKeys();

//Button implementation, by pressing, generate a new text
        if (newTextBtn) {
            newTextBtn.addEventListener("click", startNewText);
        }

//If the input field isn't clicked and we press enter, then the input field is 
//enabled
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !inputField.matches(':focus')) {
                startNewText();
            }
        });

//The same with esc key 
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                startNewText();
            }
        });
    }

//Starting the DOM functions 
    initialize();
});
