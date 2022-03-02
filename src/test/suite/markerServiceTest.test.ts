import * as assert from 'assert';
import * as vscode from 'vscode';
import {MarkerPosition} from '../../Models/MarkerPosition';
import {MarkerService} from '../../Services/MarkerService';

suite('Marker Service Test Suite', () => {
    const document1 = vscode.Uri.file("src\test\suite\testDocument-original.cs");
    const document2 = vscode.Uri.file("src\test\suite\testDocument-modified.cs");

    const repo1 = "origin https://test-user@github.org/test-repo/test.git (fetch)";
    const repo2 = "origin https://test-user2@github.org/test-repo2/test2.git (fetch)";
    
    const lines         = [1, 18, 29];
    const scores        = [2, -2];
    const users         = ["user1", "user2"];
    const lineContents  = ["const lines = [1, 18, 29];", "const scores = [2, -2];"];

    test("Marker Service - save new marker unique", async () => {
        let markerService   = new MarkerService();
        const position      = new MarkerPosition(document1.path.toString(), repo1, lines[0]);
        let marker          = markerService.saveNewMarker(scores[0], position, users[0], lineContents[0]);

        const markers       = await markerService.getMarkersForDocument(document1.path.toString(), repo1);
        const markers2      = await markerService.getMarkersForDocument(document2.path.toString(), repo2);

        assert.strictEqual(1, markers.length);
        assert.strictEqual(0, markers2.length);
        assert.strictEqual(marker, markers[0]);
        assert.strictEqual(scores[0], markers[0].score.calculateAverage());
    });

    test("Marker Service - save new marker duplicated", async () => {
        let markerService   = new MarkerService();
        const position      = new MarkerPosition(document1.path.toString(), repo1, lines[0]);
        let marker          = markerService.saveNewMarker(scores[0], position, users[0], lineContents[0]);
        let secondMarker    = markerService.saveNewMarker(scores[0], position, users[1], lineContents[0]);

        const markers       = await markerService.getMarkersForDocument(document1.path.toString(), repo1);
        const markers2      = await markerService.getMarkersForDocument(document2.path.toString(), repo1);

        assert.strictEqual(1, markers.length);
        assert.strictEqual(0, markers2.length);
        assert.strictEqual(scores[0], markers[0].score.calculateAverage());
        assert.strictEqual(marker, secondMarker);
    });

    test("Marker Service - save new marker second location", async () => {
        let markerService   = new MarkerService();
        const position      = new MarkerPosition(document1.path.toString(), repo1, lines[0]);
        const position1     = new MarkerPosition(document1.path.toString(), repo1, lines[1]);
        const marker        = markerService.saveNewMarker(scores[0], position, users[0], lineContents[0]);
        const secondMarker  = markerService.saveNewMarker(scores[0], position1, users[1], lineContents[1]);

        const markers       = await markerService.getMarkersForDocument(document1.path.toString(), repo1); 
        const markers2      = await markerService.getMarkersForDocument(document2.path.toString(), repo1);

        assert.strictEqual(2, markers.length);
        assert.strictEqual(0, markers2.length);
        assert.notStrictEqual(marker, secondMarker);
    });

    test("Marker Service - get marker for location", () => {
        let markerService   = new MarkerService();
        const position      = new MarkerPosition(document1.toString(), repo1, lines[0]);
        const position1     = new MarkerPosition(document1.toString(), repo1, lines[1]);
        const marker        = markerService.saveNewMarker(scores[0], position, users[0], lineContents[0]);
        const secondMarker  = markerService.saveNewMarker(scores[0], position1, users[1], lineContents[1]);

        const foundMarker1  = markerService.getMarkerByPosition(position);
        const foundMarker2  = markerService.getMarkerByPosition(position1);

        assert.notStrictEqual(marker, markerService);
        assert.strictEqual(marker, foundMarker1);
        assert.strictEqual(secondMarker, foundMarker2);
    });

    test("Marker Service - get marker for location empty", async () => {
        let markerService   = new MarkerService();
        const position      = new MarkerPosition(document1.path.toString(), repo1, lines[0]);
        const foundMarker1  = markerService.getMarkerByPosition(position);

        const markers       = await markerService.getMarkersForDocument(document1.path.toString(), repo1);
        
        assert.strictEqual(null, foundMarker1);
        assert.strictEqual(0, markers.length);
    });

    test("Marker Service - get marker for second location empty", async () => {
        let markerService   = new MarkerService();
        const position      = new MarkerPosition(document1.path.toString(), repo1, lines[0]);
        const position1     = new MarkerPosition(document2.path.toString(), repo2, lines[1]);
        const marker        = markerService.saveNewMarker(scores[0], position, users[0], lineContents[0]);

        const foundMarker1  = markerService.getMarkerByPosition(position);
        const foundMarker2  = markerService.getMarkerByPosition(position1);

        const markers1      = await markerService.getMarkersForDocument(document1.path.toString(), repo1);
        const markers2      = await markerService.getMarkersForDocument(document2.path.toString(), repo2);
        
        assert.strictEqual(marker, foundMarker1);
        assert.strictEqual(1, markers1.length);
        assert.strictEqual(null, foundMarker2);
        assert.strictEqual(0, markers2.length);
    });

    test("Marker Service - delete existing marker", async () => {
        let markerService   = new MarkerService();
        const position      = new MarkerPosition(document1.path.toString(), repo1, lines[0]);
        const marker        = markerService.saveNewMarker(scores[0], position, users[0], lineContents[0]);

        const deletedMarker = markerService.deleteMarker(position, users[0]);
        const markers       = (await markerService.getMarkersForDocument(document1.path.toString(), repo1)).length;

        assert.strictEqual(1, markers);
        assert.strictEqual(marker, deletedMarker);
        assert.strictEqual(true, deletedMarker?.softDelete);
    });

    test("Marker Service - delete marker decrease score", async () => {
        let markerService   = new MarkerService();
        const position      = new MarkerPosition(document1.path.toString(), repo1, lines[0]);
        const position1     = new MarkerPosition(document1.path.toString(), repo1, lines[0]);
        const marker1       = markerService.saveNewMarker(scores[0], position, users[0], lineContents[0]);
        const marker2       = markerService.saveNewMarker(scores[1], position1, users[1], lineContents[0]);

        const deletedMarker = markerService.deleteMarker(position1, users[1]);
        const markers       = await markerService.getMarkersForDocument(document1.path.toString(), repo1);

        assert.strictEqual(1, markers.length);
        assert.strictEqual(marker1, marker2);
        assert.strictEqual(deletedMarker, marker1);
        assert.strictEqual(scores[0], markers[0].score.calculateAverage());
    });

    test("Marker Service - delete empty marker", async () => {
        let markerService   = new MarkerService();
        const position      = new MarkerPosition(document1.path.toString(), repo1, lines[0]);
        const marker        = markerService.deleteMarker(position, users[0]);
        const markers       = await markerService.getMarkersForDocument(document1.path.toString(), repo1);

        assert.strictEqual(null, marker);
        assert.strictEqual(0, markers.length);
    });
});