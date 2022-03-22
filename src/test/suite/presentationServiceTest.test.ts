import * as vscode from 'vscode';
import {EmojiPresentationService} from '../../Services/EmojiPresentationService';

suite('Presentation Service Test Suite', () => {
    const document1 = vscode.Uri.file("C:\\Users\\Nejc Mlakar\\Desktop\\Adacta\\emojiextension\\src\\test\\suite\\testDocument-original.cs");
    const document2 = vscode.Uri.parse("src\\test\\suite\\testDocument-modified.cs");
    
    const lines         = [1, 18, 29];
    const scores        = [2, 0, -2];
    const users         = ["user1", "user2"];
    const lineContents  = ["const lines = [1, 18, 29];", "const scores = [2, 0, -2];"];

    test("New Marker - empty location", () => {
        let presentationService = new EmojiPresentationService();

        vscode.workspace.openTextDocument(document1).then((e) => {
        }, (error: any) => {
            console.error(error);
            debugger;
        });

        // presentationService.saveNewMarker(scores[0], lines[0], );

        //TODO: assert emojis for document
        //TODO: assert active decoration - position and emoji
        //TODO: assert hover message
    });

    test("New Marker - 2 markers same location same user", () => {

        //TODO: assert emojis for document
        //TODO: assert active decoration - position and emoji
        //TODO: assert hover message
    });

    test("New Marker - 2 markers same location different user", () => {

        //TODO: assert emojis for document
        //TODO: assert active decoration - position and emoji
        //TODO: assert hover message
    });

    test("Delete marker - empty location", () => {

        //TODO: assert emojis for document
        //TODO: assert active decoration - position and emoji
        //TODO: assert hover message
    });

    test("Delete existing marker", () => {

        //TODO: assert emojis for document
        //TODO: assert active decoration - position and emoji
        //TODO: assert hover message
    });

    test("Delete marker - multiple scores", () => {

        //TODO: assert emojis for document
        //TODO: assert active decoration - position and emoji
        //TODO: assert hover message
    });
});