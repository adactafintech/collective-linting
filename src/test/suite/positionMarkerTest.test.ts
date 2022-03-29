import * as assert from 'assert';
import * as vscode from 'vscode';
import {PositionMarker} from '../../Models/PositionMarker';
import {MarkerPosition} from '../../Models/MarkerPosition';

suite('Position Marker Test Suite', () => {

    const documentPath  = vscode.Uri.file("src\test\suite\testDocument-original.cs");
    const documentPath1 = vscode.Uri.file("src\test\suite\testDocument-modified.cs");

    const repo1 = "origin https://test-user@github.org/test-repo/test.git (fetch)";

    const lineContent   = "test line content";

    const lineStart     = 17;
    const lineEnd       = 22;

    const user1 = "user1";
    const user2 = "user2";
 
    test("PositionMarker test - content ok", () => {
        const position      = new MarkerPosition(documentPath.toString(), repo1, lineStart);
        let positionMakrer = new PositionMarker(lineContent, position);
        assert.strictEqual(lineContent, positionMakrer.content);
    });

    test("PositionMarker test - content not ok", () => {
        const position      = new MarkerPosition(documentPath.toString(), repo1, lineStart);
        let positionMakrer = new PositionMarker(lineContent, position);
        assert.notStrictEqual(212321321, positionMakrer.content);
    });

    test("PositionMarker test - position true", () => {
        const position      = new MarkerPosition(documentPath.toString(), repo1, lineStart);
        let positionMakrer = new PositionMarker(lineContent, position);
        let tmpPosition = new MarkerPosition(documentPath.toString(), repo1, lineStart);

        assert.strictEqual(true, positionMakrer.position.compare(tmpPosition));
        assert.strictEqual(lineStart, positionMakrer.position.line);
        assert.strictEqual(documentPath.toString(), positionMakrer.position.document);
    });
});