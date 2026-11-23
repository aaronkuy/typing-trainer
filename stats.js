// Pure calculations for the typing test. No DOM access in here, so the same
// file runs in the browser (as a classic script, which keeps `open index.html`
// working without a server) and in Node for the tests.
(function (root) {
    // Convention used by typing tests: one "word" is five characters.
    const CHARS_PER_WORD = 5;

    // Share of keystrokes that hit the expected character, in whole percent.
    // Counted per keystroke on purpose: deleting a character does not take the
    // keystroke back, so a corrected mistake still lowers the result and the
    // value can never leave the range 0 to 100.
    function calcAccuracy(correctKeystrokes, totalKeystrokes) {
        if (totalKeystrokes <= 0) return 100;
        const ratio = correctKeystrokes / totalKeystrokes;
        return Math.round(Math.min(1, Math.max(0, ratio)) * 100);
    }

    // Gross words per minute: every typed character counts, wrong ones too.
    function calcWpm(typedChars, elapsedSeconds) {
        if (typedChars <= 0 || elapsedSeconds <= 0) return 0;
        const words = typedChars / CHARS_PER_WORD;
        const minutes = elapsedSeconds / 60;
        return Math.round(words / minutes);
    }

    // Compares the input value before and after one `input` event and returns
    // how many characters were typed in that event and how many of them match
    // the target text. The unchanged start and the unchanged end are skipped,
    // what lies between them in the new value is the newly typed part. A
    // deletion leaves nothing in between and counts as zero, also when the
    // cursor was moved into the middle of the text.
    function countKeystrokes(previousValue, nextValue, targetText) {
        const shorter = Math.min(previousValue.length, nextValue.length);

        let start = 0;
        while (start < shorter && previousValue[start] === nextValue[start]) {
            start++;
        }

        // The end must not reach back into the start that is already matched,
        // otherwise "aa" -> "a" would skip the same character twice.
        let end = 0;
        while (
            end < shorter - start &&
            previousValue[previousValue.length - 1 - end] === nextValue[nextValue.length - 1 - end]
        ) {
            end++;
        }

        const typedUntil = nextValue.length - end;
        let correct = 0;
        for (let i = start; i < typedUntil; i++) {
            if (nextValue[i] === targetText[i]) correct++;
        }
        return { typed: typedUntil - start, correct };
    }

    const api = { calcAccuracy, calcWpm, countKeystrokes };

    if (typeof module === "object" && module.exports) {
        module.exports = api;
    } else {
        root.TypingStats = api;
    }
})(typeof globalThis !== "undefined" ? globalThis : this);
