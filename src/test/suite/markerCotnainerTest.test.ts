import {MarkerContainer} from "../../Models/MarkerContainer";
import {PositionMarker} from "../../Models/PositionMarker";
import * as vscode from 'vscode';
import * as assert from 'assert';
import {MarkerPosition} from "../../Models/MarkerPosition";
import { describe } from 'mocha';
import { ApiService } from "../../Services/ApiService";
import { ConverterService } from "../../Services/ConverterService";
import { AzureClientCredentialRequest, AzurePortalConfig } from "../../DTO/azureConfig";
import { FindMarkerRequest } from "../../DTO/apiRequests";
import { mock, when } from "ts-mockito";
import { verify } from "crypto";

var rewire = require("rewire");
var mockedApiModule = rewire("../../Services/ApiService");

suite('Marker Container Test Suite', () => {
    const testDocument1 = vscode.Uri.file("src\test\suite\testDocument-original.cs");
    const testDocument2 = vscode.Uri.file("src\test\suite\testDocument-modified.cs");

    const repo1 = "origin https://test-user@github.org/test-repo/test.git (fetch)";

    const lineContent = "dasdasdasasd";

    const startLine = 17;

    const user1 = "user1";
    const user2 = "user2";
    
    const req : FindMarkerRequest = {
        document: testDocument1.toString(),
        remote: repo1
    };

    describe.skip('These tests need improvements', function () {
        test("Container test - new mark", async () => {

            let apiServiceMock : ApiService = mock(ApiService);
            when(apiServiceMock.getMarkersFromApiByDocument(req)).thenResolve([]);

            const position = new MarkerPosition(testDocument1.toString(), repo1, startLine);
            let marker = new PositionMarker(lineContent, position);
            
            const container = new MarkerContainer(apiServiceMock, new ConverterService());
            container.registerNewMarker(marker, user1, 1);

            const markers = (await container.getMarkersByDocument(testDocument1.toString(), repo1));

            // assert.strictEqual(1, markers.length);

        });

        test("Container test - new mark duplicate", async () => {
            let container = new MarkerContainer(new ApiService(), new ConverterService());
            const position = new MarkerPosition(testDocument1.toString(), repo1, startLine);

            let marker = new PositionMarker(lineContent, position);

            container.registerNewMarker(marker, user1, 1);
            container.registerNewMarker(marker, user1, 1);

            assert.strictEqual(1, container.markerPositions.length);
            assert.strictEqual(1, (await container.getMarkersByDocument(testDocument1.toString(), repo1)).length);
        });

        test("Container test - duplicate addition", async () => {
            let container = new MarkerContainer(new ApiService(), new ConverterService());
            const position = new MarkerPosition(testDocument1.toString(), repo1, startLine);

            let marker = new PositionMarker(lineContent, position);
            let marker1 = new PositionMarker(lineContent, position);

            container.registerNewMarker(marker, user1, 1);
            container.registerNewMarker(marker1, user1, 1);

            assert.strictEqual(1, container.markerPositions.length);
            assert.strictEqual(1, (await container.getMarkersByDocument(testDocument1.toString(), repo1)).length);
        });

        test("Container test - multiple new marks", async () => {
            let container = new MarkerContainer(new ApiService(), new ConverterService());
            const position = new MarkerPosition(testDocument1.toString(), repo1, startLine);
            const position1 = new MarkerPosition(testDocument1.toString(), repo1, startLine+1);

            let marker = new PositionMarker(lineContent, position);
            let marker1 = new PositionMarker(lineContent+"dsdaas", position1);

            container.registerNewMarker(marker, user1, 1);
            container.registerNewMarker(marker1, user1, 1);

            assert.strictEqual(2, container.markerPositions.length);
            assert.strictEqual(2, (await container.getMarkersByDocument(testDocument1.toString(), repo1)).length);
        });

        test("Container test - delete marker", async () => {
            let container = new MarkerContainer(new ApiService(), new ConverterService());
            const position = new MarkerPosition(testDocument1.toString(), repo1, startLine);
            const position1 = new MarkerPosition(testDocument1.toString(), repo1, startLine+1);

            let marker = new PositionMarker(lineContent, position);
            let marker1 = new PositionMarker(lineContent+"dsdaas", position1);

            container.registerNewMarker(marker, user1, 1); 
            container.registerNewMarker(marker1, user1, 1);

            container.deleteMarker(marker1);

            assert.strictEqual(2, container.markerPositions.length);
            assert.strictEqual(marker1, container.getMarkerByPosition(marker1.position));
            assert.strictEqual(marker, container.getMarkerByPosition(marker.position));
            assert.strictEqual(2, (await container.getMarkersByDocument(testDocument1.toString(), repo1)).length);
            assert.strictEqual(true, container.getMarkerByPosition(marker1.position)?.softDelete);
            assert.strictEqual(false, container.getMarkerByPosition(marker.position)?.softDelete);
        });

        test("Container test - delete marker duplicate", async () => {
            let container = new MarkerContainer(new ApiService(), new ConverterService());
            const position = new MarkerPosition(testDocument1.toString(), repo1, startLine);
            const position1 = new MarkerPosition(testDocument1.toString(), repo1, startLine+1);

            let marker  = new PositionMarker(lineContent, position);
            let marker1 = new PositionMarker(lineContent+"dsdaas", position1);

            container.registerNewMarker(marker, user1, 1);
            container.registerNewMarker(marker1, user1, 1);

            container.deleteMarker(marker1);
            container.deleteMarker(marker1);

            assert.strictEqual(2, container.markerPositions.length);
            assert.strictEqual(marker1, container.getMarkerByPosition(marker1.position));
            assert.strictEqual(marker, container.getMarkerByPosition(marker.position));
            assert.strictEqual(2, (await container.getMarkersByDocument(testDocument1.toString(), repo1)).length);
            assert.strictEqual(true, container.getMarkerByPosition(marker1.position)?.softDelete);
            assert.strictEqual(false, container.getMarkerByPosition(marker.position)?.softDelete);
        });

        test("Container test - delete markers until empty", async () => {
            let container = new MarkerContainer(new ApiService(), new ConverterService());
            const position = new MarkerPosition(testDocument1.toString(), repo1, startLine);
            const position1 = new MarkerPosition(testDocument1.toString(), repo1, startLine+1);

            let marker  = new PositionMarker(lineContent, position);
            let marker1 = new PositionMarker(lineContent+"dsdaas", position1);

            container.registerNewMarker(marker, user1, 1);
            container.registerNewMarker(marker1, user1, 1);

            container.deleteMarker(marker);
            container.deleteMarker(marker1);

            assert.strictEqual(2, container.markerPositions.length);
            assert.strictEqual(marker1, container.getMarkerByPosition(marker1.position));
            assert.strictEqual(marker, container.getMarkerByPosition(marker.position));
            assert.strictEqual(2, (await container.getMarkersByDocument(testDocument1.toString(), repo1)).length);
            assert.strictEqual(true, container.getMarkerByPosition(marker1.position)?.softDelete);
            assert.strictEqual(true, container.getMarkerByPosition(marker.position)?.softDelete);
        });
    });
});