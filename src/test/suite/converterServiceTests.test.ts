import * as assert from 'assert';
import MarkerPosition from '../../Models/MarkerPosition';
import PositionMarker from '../../Models/PositionMarker';
import ConverterService from '../../Services/ConverterService';

suite('Converter Service Tests', () => {

    const repo = "origin https://test-user@github.org/test-repo/test.git (fetch)";

    test("Test Find Markers For Document - everything ok", () => {
        //JSON response
        const jsonResponse = JSON.parse('[{"documentUri":"refactor-document","line":193,"content":"tole je nova vsebina","isDeleted":false,"isSupressed":false,"isResolved":true,"scores":[{"score":{"value":2.0,"frequency":0}},{"score":{"value":0.0,"frequency":1}},{"score":{"value":-2.0,"frequency":0}}]}]');

        let converter = new ConverterService();

        let markers = converter.fromJSONToMarkerByDocument(jsonResponse);
        const occMap: Map<number, number> = new Map([
            [2, 0],[0, 1],[-2, 0]
        ]);

        assert.strictEqual(1, markers.length);
        assert.strictEqual(markers[0].deleted, false);
        assert.strictEqual(markers[0].content, "tole je nova vsebina");

        assert.deepStrictEqual(occMap, markers[0].score.getScoreOccurences());
    });

    test("Test Find Markers For Document - no scores", () => {
        //JSON response
        const jsonResponse = '[{"documentUri":"refactor-document","line":193,"content":"tole je nova vsebina","isDeleted":false,"isSupressed":false,"isResolved":true,"scores":[]}]';

        // Pass this response to  converter

        let converter = new ConverterService();
        
        let markers = converter.fromJSONToMarkerByDocument(JSON.parse(jsonResponse));
        assert.strictEqual(1, markers.length);
        assert.strictEqual(markers[0].position.line, 193);
        assert.deepStrictEqual(new Map<number, number>(), markers[0].score.getScoreOccurences());
    });

    test("Test Find Markers For Document - missing props", () => {
        const jsonResponse = '[{"documentUri":"refactor-document","content":"tole je vsebina","isDeleted":false,"isSupressed":false,"isResolved":true,"scores":[{"user":"refactor-test","score":5.0},{"user":"teeeest2","score":-1.0},{"user":"teeeest12321","score":-1.0}]},{"documentUri":"refactor-document","line":193,"content":"tole je nova vsebina","isDeleted":false,"isSupressed":false,"isResolved":true,"scores":[]}]';
        let converter = new ConverterService();
        let markers = converter.fromJSONToMarkerByDocument(JSON.parse(jsonResponse));
        assert.strictEqual(1, markers.length);
        assert.strictEqual(markers[0].position.line, 193);
    });

    test("Test Find Markers For Document - valid JSON invladi Object", () => {
        const jsonResponse = '{"documentUri": "refactor-document","line": 193,"user": "teeeest12345678"}';

        let converter = new ConverterService();
        let markers = converter.fromJSONToMarkerByDocument(JSON.parse(jsonResponse));
        
        assert.strictEqual(0, markers.length);
    });

    test("Test Find Markers For Document - corrupt input", () => {
        const jsonResponse = '[{"documentUri":"refactor-document","":"tole je vsebina","isDeleted":"isSupressed":false,"isResolved":true,"scores":[{"user":"refactor-test","score":5.0},{"user":"teeeest2","score":-1.0},{"user":"teeeest12321","score":-1.0}]},{"documentUri":"refactor-document","line":193,"content":"tole je nova vsebina","isDeleted":false,"isSupressed":false,"isResolved":true,"scores":[]}]';
        let converter = new ConverterService();
        let markers = converter.fromJSONToMarkerByDocument(jsonResponse);
        
        assert.strictEqual(0, markers.length);
    });

    test("Test Create Or Update Score Request - everyting is ok", () => {
        const position = new MarkerPosition("/refactor/document", repo, 12);
        const marker = new PositionMarker("dsadsa", position, false);
        const user = "test-user";
        const score = -1;

        let converter = new ConverterService();
        const response = converter.createCreateOrUpdateScoreRequest(marker, user, score);

        assert.strictEqual(12, response.line);
        assert.strictEqual("dsadsa", response.content);
        assert.strictEqual("--refactor--document", response.documentUri);
    });

    test("Test Remove Score Request - everyting is ok", () => {
        const position = new MarkerPosition("refactor-document", repo, 12);
        const marker = new PositionMarker("dsadsa", position, false);
        const user = "test-user";

        let converter = new ConverterService();
        const response = converter.createRemoveScoreRequest(marker, user);

        assert.strictEqual(12, response.line);
        assert.strictEqual("test-user", response.user);
        assert.strictEqual("refactor-document", response.documentUri);
        assert.strictEqual(undefined, response.content);
    });
     
});