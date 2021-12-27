import * as assert from 'assert';

import EmojiLanguages from '../../Models/EmojiLanguages';
import EmojiSetting from '../../Models/EmojiSettngs';

suite('EmojiSettings Test Suite', () => {

    test("Disable language", () => {
        let languages = new EmojiLanguages();
        
    });

    test("Test document paths", () => {
        let es = new EmojiSetting();

        const firstPath         = "src\Models\Emoji.ts";
        const secondPath        = "src\Providers\EmojiClass.ts";
        const notExistingPath   = "dasdsa\dasdasd\teeeest\neki.ts";

        assert.strictEqual(1, es.ignoreNewDocument(firstPath).size);
        assert.strictEqual(2, es.ignoreNewDocument(secondPath).size);

        let ignoredDocuments = es.ignoreNewDocument(secondPath);

        assert.strictEqual(2, ignoredDocuments.size);
        assert.strictEqual(true, ignoredDocuments.has(firstPath));
        assert.strictEqual(true, ignoredDocuments.has(secondPath));
        assert.strictEqual(false, ignoredDocuments.has(notExistingPath));
    });
});