import * as assert from 'assert';
import EmojiScore from '../../Models/EmojiScore';

suite('Average Score Test Suite', () => {

    const user1 = "user1";
    const user2 = "user2";
    const user3 = "user3";
    const user4 = "user4";

    test("Average score test - empty", () => {
        let scoreManager = new EmojiScore();

        assert.strictEqual(0, scoreManager.calculateAverage());
    });

    test("Average score test - 1 max", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        assert.strictEqual(2, scoreManager.calculateAverage());
    });

    test("Average score test - 1 medium", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 0);
        assert.strictEqual(0, scoreManager.calculateAverage());
    });

    test("Average score test - 1 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, -2);
        assert.strictEqual(-2/1, scoreManager.calculateAverage());
    });

    test("Average score test - 2 max 1 med", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        scoreManager.addScore(user2, 2);
        scoreManager.addScore(user3, 0);
        assert.strictEqual(4/3, scoreManager.calculateAverage());
    });

    test("Average score test - 1 max 2 med", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        scoreManager.addScore(user2, 0);
        scoreManager.addScore(user3, 0);
        assert.strictEqual(2/3, scoreManager.calculateAverage());
    });

    test("Average score test - 3 med", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 0);
        scoreManager.addScore(user2, 0);
        scoreManager.addScore(user3, 0);
        assert.strictEqual(0, scoreManager.calculateAverage());
    });

    test("Average score test - 2 med 1 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 0);
        scoreManager.addScore(user2, 0);
        scoreManager.addScore(user3, -2);
        assert.strictEqual(-2/3, scoreManager.calculateAverage());
    });

    test("Average score test - 1 med 2 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 0);
        scoreManager.addScore(user2, -2);
        scoreManager.addScore(user3, -2);
        assert.strictEqual(-4/3, scoreManager.calculateAverage());
    });

    test("Average score test - 3 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, -2);
        scoreManager.addScore(user2, -2);
        scoreManager.addScore(user3, -2);
        assert.strictEqual(-6/3, scoreManager.calculateAverage());
    });

    test("Average score test - 3 max", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        scoreManager.addScore(user2, 2);
        scoreManager.addScore(user3, 2);
        assert.strictEqual(6/3, scoreManager.calculateAverage());
    });

    test("Average score test - 1 max 2 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        scoreManager.addScore(user2, -2);
        scoreManager.addScore(user3, -2);
        assert.strictEqual(-2/3, scoreManager.calculateAverage());
    });

    test("Average score test - 2 max 1 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        scoreManager.addScore(user2, 2);
        scoreManager.addScore(user3, -2);
        assert.strictEqual(2/3, scoreManager.calculateAverage());
    });

    test("Occurence score test - empty ", () => {
        let scoreManager = new EmojiScore();
        let occurenceMap = new Map<number, number>();

        assert.strictEqual(scoreManager.getScoreOccurences().size, 0);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    test("Occurence score test - 1 max", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        let occurenceMap = new Map<number, number>([
            [2, 1]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 1);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    test("Occurence score test - 1 medium", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 0);
        let occurenceMap = new Map<number, number>([
            [0, 1]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 1);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    test("Occurence score test - 1 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, -2);
        let occurenceMap = new Map<number, number>([
            [-2, 1]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 1);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    test("Occurence score test - 2 max 1 med", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        scoreManager.addScore(user2, 2);
        scoreManager.addScore(user3, 0);
        
        let occurenceMap = new Map<number, number>([
            [0, 1],
            [2, 2]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 2);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    test("Occurence score test - 1 max 2 med", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        scoreManager.addScore(user2, 0);
        scoreManager.addScore(user3, 0);
        
        let occurenceMap = new Map<number, number>([
            [0, 2],
            [2, 1]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 2);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    test("Occurence score test - 3 med", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 0);
        scoreManager.addScore(user2, 0);
        scoreManager.addScore(user3, 0);

        let occurenceMap = new Map<number, number>([
            [0, 3]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 1);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    test("Occurence score test - 2 med 1 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 0);
        scoreManager.addScore(user2, 0);
        scoreManager.addScore(user3, -2);
        
        let occurenceMap = new Map<number, number>([
            [0, 2],
            [-2, 1]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 2);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    
    test("Occurence score test - 1 med 2 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 0);
        scoreManager.addScore(user2, -2);
        scoreManager.addScore(user3, -2);
        
        let occurenceMap = new Map<number, number>([
            [0, 1],
            [-2, 2]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 2);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    test("Occurence score test - 3 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, -2);
        scoreManager.addScore(user2, -2);
        scoreManager.addScore(user3, -2);
        
        let occurenceMap = new Map<number, number>([
            [-2, 3]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 1);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    test("Occurence score test - 3 max", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        scoreManager.addScore(user2, 2);
        scoreManager.addScore(user3, 2);

        let occurenceMap = new Map<number, number>([
            [2, 3]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 1);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    test("Occurence score test - 1 max 2 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        scoreManager.addScore(user2, -2);
        scoreManager.addScore(user3, -2);

        let occurenceMap = new Map<number, number>([
            [2, 1],
            [-2, 2]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 2);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

    
    test("Occurence score test - 2 max 1 min", () => {
        let scoreManager = new EmojiScore();

        scoreManager.addScore(user1, 2);
        scoreManager.addScore(user2, 2);
        scoreManager.addScore(user3, -2);

        let occurenceMap = new Map<number, number>([
            [2, 2],
            [-2, 1]
        ]);

        assert.strictEqual(scoreManager.getScoreOccurences().size, 2);
        assert.deepStrictEqual(occurenceMap, scoreManager.getScoreOccurences());
    });

});