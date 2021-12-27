import * as assert from 'assert';
import MarkerPosition from '../../Models/MarkerPosition';

suite('Marker Position Test Suite', () => {
    
    const startLine = 17;
    const endLine   = 22;

    const originalDocument = "src\test\suite\testDocument-original.cs";
    const modiiedDocument  = "src\test\suite\testDocument-modified.cs";

    const repo1 = "origin https://test-user@github.org/test-repo/test.git (fetch)";
    const repo2 = "origin https://test-user2@github.org/test-repo2/test2.git (fetch)";

    test("Marker position - same ", () => {
        let markerPos = new MarkerPosition(originalDocument, repo1, startLine);
        assert.strictEqual(true, markerPos.compare(new MarkerPosition(originalDocument, repo1, startLine)));
    });

    test("Marker position - different lines ", () => {        
        let markerPos = new MarkerPosition(originalDocument, repo1, startLine);
        assert.strictEqual(false, markerPos.compare(new MarkerPosition(originalDocument, repo1, endLine)));
    });

    test("Marker position - different documents ", () => {        
        let markerPos = new MarkerPosition(originalDocument, repo1, startLine);
        assert.strictEqual(false, markerPos.compare(new MarkerPosition(modiiedDocument, repo1, startLine)));
    });

    test("Marker position - different repos ", () => {        
        let markerPos = new MarkerPosition(originalDocument, repo1, startLine);
        assert.strictEqual(false, markerPos.compare(new MarkerPosition(modiiedDocument, repo2, startLine)));
    });

});