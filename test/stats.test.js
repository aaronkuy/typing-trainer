const test = require("node:test");
const assert = require("node:assert/strict");

const { calcAccuracy, calcWpm, countKeystrokes } = require("../stats.js");

// Replays a list of input values the way the page does: one `input` event per
// entry, keystroke counters summed up across the whole round.
function replay(values, target) {
    let previous = "";
    let total = 0;
    let correct = 0;
    for (const value of values) {
        const step = countKeystrokes(previous, value, target);
        total += step.typed;
        correct += step.correct;
        previous = value;
    }
    return { total, correct, accuracy: calcAccuracy(correct, total) };
}

test("accuracy is 100 before anything was typed", () => {
    assert.equal(calcAccuracy(0, 0), 100);
});

test("accuracy rounds to whole percent", () => {
    assert.equal(calcAccuracy(2, 3), 67);
    assert.equal(calcAccuracy(0, 5), 0);
});

test("accuracy never leaves 0 to 100, whatever the counters say", () => {
    assert.equal(calcAccuracy(4, 1), 100);
    assert.equal(calcAccuracy(-1, 4), 0);
});

test("regression: four correct characters, three backspaces stays at 100, not 400", () => {
    const result = replay(["T", "Th", "The", "The ", "The", "Th", "T"], "The quick");
    assert.deepEqual(result, { total: 4, correct: 4, accuracy: 100 });
});

test("regression: retyping after backspace counts the new keystrokes", () => {
    const result = replay(
        ["T", "Th", "The", "The ", "The", "Th", "T", "Th", "The", "The "],
        "The quick"
    );
    assert.deepEqual(result, { total: 7, correct: 7, accuracy: 100 });
});

test("regression: a corrected mistake still counts as a mistake", () => {
    const result = replay(["x", "", "T"], "The quick");
    assert.deepEqual(result, { total: 2, correct: 1, accuracy: 50 });
});

test("a pure deletion counts no keystroke", () => {
    assert.deepEqual(countKeystrokes("The", "Th", "The quick"), { typed: 0, correct: 0 });
});

test("several characters in one event are each compared to the target", () => {
    assert.deepEqual(countKeystrokes("", "Thx", "The quick"), { typed: 3, correct: 2 });
});

test("replacing the last character counts as one keystroke", () => {
    assert.deepEqual(countKeystrokes("Thx", "The", "The quick"), { typed: 1, correct: 1 });
});

test("characters past the end of the target are wrong", () => {
    assert.deepEqual(countKeystrokes("Hi", "Hi!", "Hi"), { typed: 1, correct: 0 });
});

test("wpm uses five characters per word", () => {
    assert.equal(calcWpm(50, 60), 10);
    assert.equal(calcWpm(25, 30), 10);
    assert.equal(calcWpm(44, 13), 41);
});

test("wpm is 0 before any time has passed or anything was typed", () => {
    assert.equal(calcWpm(10, 0), 0);
    assert.equal(calcWpm(0, 10), 0);
});
