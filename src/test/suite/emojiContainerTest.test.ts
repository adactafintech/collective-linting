import * as assert from 'assert';
import EmojiContainer from '../../Models/EmojiContainer';

suite('Display Emoji Test Suite', () => {

    test("Display Emojis - perfect grade", async () => {

        let emojiContainer = new EmojiContainer();
        const emoji = emojiContainer.getEmojiByScore(2);

        assert.strictEqual("star-struck", emoji?.label);
    });

    test("Display Emojis - lowest grade", async () => {

        let emojiContainer = new EmojiContainer();
        const emoji = emojiContainer.getEmojiByScore(-2);

        assert.strictEqual("thumbs-down", emoji?.label);
    });

    test("Display Emojis - perfect average grade", async () => {

        let emojiContainer = new EmojiContainer();
        const emoji = emojiContainer.getEmojiByScore(0);

        assert.strictEqual("thinking", emoji?.label);
    });

    test("Display Emojis - around average grade 1", async () => {

        let emojiContainer = new EmojiContainer();
        const emoji = emojiContainer.getEmojiByScore(0.33);

        assert.strictEqual("thinking", emoji?.label);
    });

    test("Display Emojis - around average grade 2", async () => {

        let emojiContainer = new EmojiContainer();
        const emoji = emojiContainer.getEmojiByScore(-0.42);

        assert.strictEqual("thinking", emoji?.label);
    });

    test("Display Emojis - slightly good", async () => {

        let emojiContainer = new EmojiContainer();
        const emoji = emojiContainer.getEmojiByScore(0.66);

        assert.strictEqual("smile", emoji?.label);
    });

    test("Display Emojis - slightly bad", async () => {

        let emojiContainer = new EmojiContainer();
        const emoji = emojiContainer.getEmojiByScore(-0.52);

        assert.strictEqual("frown", emoji?.label);
    });

    test("Display Emojis - abnormal good", async () => {

        let emojiContainer = new EmojiContainer();
        const emoji = emojiContainer.getEmojiByScore(100);

        assert.strictEqual("star-struck", emoji?.label);
    });

    test("Display Emojis - abnormal bad", async () => {

        let emojiContainer = new EmojiContainer();
        const emoji = emojiContainer.getEmojiByScore(-123.22);

        assert.strictEqual("thumbs-down", emoji?.label);
    });

});