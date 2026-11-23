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
    let correctKeystrokes = 0;
    let totalKeystrokes = 0;
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
        correctKeystrokes = 0;
        totalKeystrokes = 0;
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
        const wpm = TypingStats.calcWpm(typedText.length, timeElapsed);
        const accuracy = TypingStats.calcAccuracy(correctKeystrokes, totalKeystrokes);
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
            const step = TypingStats.countKeystrokes(typedText, newTypedText, currentText);
            totalKeystrokes += step.typed;
            correctKeystrokes += step.correct;

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
            // Computed from state. Reading the numbers back from the page
            // with parseInt(...) || 100 reported an accuracy of 0 as 100.
            const wpm = TypingStats.calcWpm(typedText.length, timeElapsed);
            const accuracy = TypingStats.calcAccuracy(correctKeystrokes, totalKeystrokes);

            if (wpm > 0 || accuracy < 100) {
                alert(`Test complete!\n\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nTime: ${timeElapsed}s`);
            }

//After 0.5 seconds new text generated and timer reset 
            setTimeout(() => {
                startNewText();
            }, 500);

        }, 300);
    }

//Merge all prior functions together 
    function initialize() {
        startNewText();
        setupTypingListener();

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
