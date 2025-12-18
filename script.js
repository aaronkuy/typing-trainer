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


//ID's of html pull 
    
    const sampleText = document.getElementById("sample-text");
    const newTextBtn = document.getElementById("new-text-btn");
    const inputField = document.getElementById("input-field");

//Sample text generate  
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

   //Initial postion determination, 'let' makes it flexible  
    let currentText = "";
    let currentPosition = 0;
    let typedText = "";

    //Reusable function
    function getRandomText() {
    //Each level contains one sentence, random with math
        const randomIndex = Math.floor(Math.random() * textLibrary.length);
    //Adjust text library 
        return textLibrary[randomIndex];
    }

    //Implementation of prior function
    function displayNewText() {
        if (sampleText) {
            currentText = getRandomText();
            currentPosition = 0;
            typedText = "";
//Self explanatory, setting the conditions for getRandomText()
//Exchange of text in HTML             
            sampleText.innerHTML = currentText
//For index seperation and the color active event             
                .split('')
//Span for CSS
                .map(char => `<span class="char">${char}</span>`)
                .join('');

//Empty the input field for the new text       
            if (inputField) {
                inputField.value = "";
 //Sets cursor automatically to the input field
                inputField.focus(); 
            }

//Marks the first letter 
            highlightCurrentChar();
        }
    }

    
    function highlightCurrentChar() {
        const chars = sampleText.querySelectorAll('.char');
        chars.forEach((char, index) => {
//Reseting char neutralize the color 
            char.className = 'char'; 

            if (index === currentPosition) {
//User input if True then color it blue
                char.classList.add('char-current');
            } else if (index < currentPosition) {
 //Later red colored index because user typed False executions                
//  
                if (typedText[index] === currentText[index]) {
//Char is shifiting green when True, when False then red
                    char.classList.add('char-correct'); 
                } else {
                    char.classList.add('char-incorrect'); 
                }
            }
        });
    }

    
    function setupTypingListener() {
        if (!inputField) return;
//JS listens if user makes an input, save it to 'typedText'
        inputField.addEventListener('input', (e) => {
            typedText = e.target.value;
//Length of elements of user's input saved to 'currentPosition'
            currentPosition = typedText.length;

//Resume the prior function so the coloring is active          
            highlightCurrentChar();

//When the index of currentPosition is smaller equal as currentText,
//then terminate program
            if (currentPosition >= currentText.length) {
                setTimeout(() => {
                    alert("Text completed! Loading new text...");
//Prior function gets resumed, 500 miliseconds awaiting for UX
                    displayNewText();
                }, 500);
            }
        });
    }

    
    displayNewText();
    setupTypingListener();

//Set up the newTextBtn in HTML 
    if (newTextBtn) {
        newTextBtn.addEventListener("click", displayNewText);
    }

//Special keys special treatment in JS    
    function setupSpecialKeys() {
        const specialKeys = {
            ' ': 'space',
            'Enter': 'enter',
            ',': ',',
            '.': '.'
        };
//Blue color implementation of the special keys 
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


//Blue color implementation of all other keys of the grid template, or displayed keys in the DOM
//when user's input is inside the index of the defined html keys
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

//Pull all the cons of stats of HTML to JS
    const sampleText = document.getElementById("sample-text");
    const newTextBtn = document.getElementById("new-text-btn");
    const inputField = document.getElementById("input-field");
    const wpmElement = document.getElementById("wpm");
    const accuracyElement = document.getElementById("accuracy");
    const timeElement = document.getElementById("time");

//Just in case copy the textLibrary again in 
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

 //Setting up the initial values of stats 
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

    //Erase the individuality if the user isn't typing anything at first,
    //the timer won't start.
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

     //Test if the timer is undefined or not zero    
        if (timerInterval) {
    //If True, stopp the timer
            clearInterval(timerInterval);
    //Empty the variable, else the timer still goes on even after one iteration
            timerInterval = null;
        }
    //Empty the starttime for the next iteration 
        startTime = null;

     //Update sample text for the display elements in HTML    
        sampleText.innerHTML = currentText
    //Make it to e.g. ['Hallo' 'Welt'....]
            .split('')
    //Every element of Array converts to char in a span box
            .map(char => `<span class="char">${char}</span>`)
    //Add every span box to joint string 
            .join('');

    //If inputField is True   
        if (inputField) {
    //Empty the value of input field
            inputField.value = "";
    //Set the cursor automatically to the input field 
            inputField.focus();
        }

    //Activate those functions (updateStats()) beneath  
        updateStats();
        highlightCurrentChar();
    }

    //Implemate the start timer function 
    function startTimer() {
    //If those two cons are False the applies
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
