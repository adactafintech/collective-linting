import * as assert from 'assert';
import * as vscode from 'vscode';
import {SyncService} from '../../Services/SyncService';
import {DocumentChange} from '../../Models/DocumentChange';
import {PositionMarker} from '../../Models/PositionMarker';
import { Change } from '../../Models/enums';
import {MarkerPosition} from '../../Models/MarkerPosition';

suite('Sync file changes test', () => {
    const testDocument1 = vscode.Uri.file("src\test\suite\testDocument-original.cs");
    const repo = "origin https://test-user@github.org/test-repo/test.git (fetch)";

    // Create mocked data
    let documentData: string[];
    documentData = [];
    documentData.push("    Lorem ipsum dolor sit amet, consectetur adipiscing elit. ");
    documentData.push("Donec interdum, neque in maximus sodales, eros turpis tempus felis, ac iaculis purus ligula eu justo. Vestibulum tristique lobortis pellentesque. ");
    documentData.push("    Mauris vulputate nulla non porta imperdiet. ");
    documentData.push("    Donec et pharetra neque, a sodales libero. ");

    const position = new MarkerPosition(testDocument1.toString(), repo, 3);

    let marker2 = new PositionMarker(documentData[3], position);
    marker2.addNewScore("test-user", -2);

    let syncService = new SyncService();
    
    test("Nothing to sync", () => {
        const change = new DocumentChange(1, documentData, Change.lineDeleted);
        const position1 = new MarkerPosition(testDocument1.toString(), repo, 1);
        let marker1 = new PositionMarker(documentData[1], position1);

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(false, marker1.softDelete);
        assert.strictEqual(false, marker2.softDelete);
    });

    test("Added whitespace to marked line", () => {
        const change = new DocumentChange(1, documentData, Change.lineWhiteSpaced);
        const position1 = new MarkerPosition(testDocument1.toString(), repo, 1);
        let marker1 = new PositionMarker(documentData[1], position1);

        documentData[1] = "         " + documentData[1];

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(false, marker1.softDelete);
        assert.strictEqual(1, marker1.position.line);

        assert.strictEqual(false, marker2.softDelete);
        assert.strictEqual(3, marker2.position.line);
    });

    test("Move Single Line Emoji to specific line", () => {
        //Step 1: delete content on marked line (marker1)
        let tempDocumentData = [...documentData];
        tempDocumentData[1] = "";

        let change = new DocumentChange(1, tempDocumentData, Change.lineDeleted);
        const position1 = new MarkerPosition(testDocument1.toString(), repo, 1);
        let marker1 = new PositionMarker(documentData[1], position1);
        marker1.addNewScore("test-user", 2);

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(true, marker1.softDelete);
        assert.strictEqual(1, marker1.position.line);

        assert.strictEqual(false, marker2.softDelete);
        assert.strictEqual(3, marker2.position.line);

        //Step 2: add the same content on last line
        tempDocumentData.splice(tempDocumentData.length, 0, documentData[1]);

        change = new DocumentChange(tempDocumentData.length-1, tempDocumentData, Change.lineAdded);

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(false, marker1.softDelete);
        assert.strictEqual(tempDocumentData.length-1, marker1.position.line);

        assert.strictEqual(false, marker2.softDelete);
        assert.strictEqual(3, marker2.position.line);
    });

    test("Delete marked line", () => {
        const change = new DocumentChange(1, documentData, Change.lineDeleted);
        const position1 = new MarkerPosition(testDocument1.toString(), repo, 1);
        let marker1 = new PositionMarker("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent neque eros, hendrerit imperdiet elit in.", position1);

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(true, marker1.softDelete);
        assert.strictEqual(1, marker1.position.line);

        assert.strictEqual(false, marker2.softDelete);
        assert.strictEqual(3, marker2.position.line);
    });

    test("Change line content", () => {
        let tempDocumentData = [...documentData];
        tempDocumentData[1] = "this is changed line text";

        const change = new DocumentChange(1, tempDocumentData, Change.lineUpdated);
        const position1 = new MarkerPosition(testDocument1.toString(), repo, 1);
        let marker1 = new PositionMarker(documentData[1], position1);

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(true, marker1.softDelete);
        assert.strictEqual(1, marker1.position.line);

        assert.strictEqual(false, marker2.softDelete);
        assert.strictEqual(3, marker2.position.line);
    });

    test("Add newline before one emoji", () => {
        let tempDocumentData = [...documentData];
        tempDocumentData.splice(2, 0, "text that is inserted into the third line");

        const change = new DocumentChange(2, tempDocumentData, Change.lineUpdated);
        const position1 = new MarkerPosition(testDocument1.toString(), repo, 1);
        let marker1 = new PositionMarker(documentData[1], position1);
        marker1.addNewScore("test-user", 2);

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(false, marker1.softDelete);
        assert.strictEqual(1, marker1.position.line);

        assert.strictEqual(false, marker2.softDelete);
        assert.strictEqual(4, marker2.position.line);
    });

    test("Add newline before multiple emojis", () => {
        let tempDocumentData = [...documentData];
        tempDocumentData.splice(0, 0, "text that is inserted into the first line");

        const change = new DocumentChange(0, tempDocumentData, Change.lineAdded);
        const position1 = new MarkerPosition(testDocument1.toString(), repo, 1);
        let marker1 = new PositionMarker(documentData[1], position1);
        marker1.addNewScore("test-user", 2);

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(false, marker1.softDelete);
        assert.strictEqual(2, marker1.position.line);

        assert.strictEqual(false, marker2.softDelete);
        assert.strictEqual(4, marker2.position.line);
    });

    test("Delete line before one emoji", () => {
        let tempDocumentData = [...documentData];
        tempDocumentData.splice(2, 1);

        const change = new DocumentChange(2, tempDocumentData, Change.lineDeleted);
        const position1 = new MarkerPosition(testDocument1.toString(), repo, 1);
        let marker1 = new PositionMarker(documentData[1], position1);
        marker1.addNewScore("test-user", 2);

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(false, marker1.softDelete);
        assert.strictEqual(1, marker1.position.line);

        assert.strictEqual(false, marker2.softDelete);
        assert.strictEqual(2, marker2.position.line);
    });

    test("Delete line before multiple emojis", () => {
        let tempDocumentData = [...documentData];
        tempDocumentData.splice(0, 1);

        const change = new DocumentChange(0, tempDocumentData, Change.lineDeleted);
        const position1 = new MarkerPosition(testDocument1.toString(), repo, 1);
        let marker1 = new PositionMarker(documentData[1], position1);
        marker1.addNewScore("test-user", 2);

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(false, marker1.softDelete);
        assert.strictEqual(0, marker1.position.line);

        assert.strictEqual(false, marker2.softDelete);
        assert.strictEqual(2, marker2.position.line);
    });

    test("Delete specific marker line and move another marked line there", () => {
        //Step 1: delete content of first mark line
        let tempDocumentData = [...documentData];
        tempDocumentData[1] = "";

        let change = new DocumentChange(1, tempDocumentData, Change.lineUpdated);
        const position1 = new MarkerPosition(testDocument1.toString(), repo, 1);
        let marker1 = new PositionMarker(documentData[1], position1);
        marker1.addNewScore("test-user", 2);

        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(true, marker1.softDelete);
        assert.strictEqual(1, marker1.position.line);

        assert.strictEqual(false, marker2.softDelete);
        assert.strictEqual(3, marker2.position.line);

        //Step 2: delete content of second mark line
        tempDocumentData[3] = "";
        change = new DocumentChange(3, tempDocumentData, Change.lineUpdated);
        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(true, marker1.softDelete);
        assert.strictEqual(1, marker1.position.line);

        assert.strictEqual(true, marker2.softDelete);
        assert.strictEqual(3, marker2.position.line);

        //Step 3: insert first mark content to second marks line
        tempDocumentData[3] = documentData[1];
        change = new DocumentChange(3, tempDocumentData, Change.lineUpdated);
        syncService.sync(change, [marker1, marker2]);

        assert.strictEqual(false, marker1.softDelete);
        assert.strictEqual(3, marker1.position.line);

        assert.strictEqual(true, marker2.softDelete);
        assert.strictEqual(3, marker2.position.line);
    });

    //TODO: create tests for 
});
