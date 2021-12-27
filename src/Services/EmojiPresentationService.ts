import Emoji from "../Models/Emoji";
import EmojiContainer from "../Models/EmojiContainer";
import EmojiDecoration from "../Models/EmojiDecoration";
import Gutter from "../Models/Gutter";
import PositionMarker from "../Models/PositionMarker";
import UIEmoji from "../Models/UIEmoji";
import * as vscode from 'vscode';
import MarkerService from "./MarkerService";
import MarkerPosition from "../Models/MarkerPosition";
import SyncService from "./SyncService";
import DocumentChange from "../Models/DocumentChange";
import ChangeManager from "../Providers/ChangeManager";
import { Change } from "../Models/enums";

export default class EmojiPresentationService {
    emojiContainer:     EmojiContainer;
    markerService:      MarkerService;
    snycService:        SyncService;
    activeDecoration:   EmojiDecoration[];

    constructor() {
        this.emojiContainer     = new EmojiContainer();
        this.markerService      = new MarkerService();
        this.snycService        = new SyncService();
        this.activeDecoration   = [];
    }

    public initializeMarkers() : void {
        this.markerService.initializeMarkers();
    }

    /**
     * 
     * @param score 
     * @param line 
     * @param editor 
     * @param user 
     * @param lineContent 
     */
    public saveNewMarker(score: number, position: MarkerPosition, editor: vscode.TextEditor, user: string, lineContent: string) : void {
        this.markerService.saveNewMarker(score, position, user, lineContent);
        this.hideDecorationOnPosition(position);
        this.showDecorationOnPosition(position, editor);
    }

    /**
     * 
     * @param line 
     * @param editor 
     * @param user 
     */
    public deleteMarker(position: MarkerPosition, editor: vscode.TextEditor, user: string) : void {
        this.markerService.deleteMarker(position, user);
        this.hideDecorationOnPosition(position);
        this.showDecorationOnPosition(position, editor);
    }

    /**
     * 
     * @param change 
     * @param document 
     */
    public async documentChanged(change: DocumentChange, fileName: string, repository: string) {
        this.snycService.sync(change, await this.markerService.getMarkersForDocument(fileName, repository));
        
        let editor = vscode.window.activeTextEditor;
        if(editor !== undefined) {
            this.resetGutterDecorations(editor, fileName, repository);
        }
    }

    /**
     * 
     * @param document 
     */
    public async documentSaved(change: DocumentChange, editor: vscode.TextEditor, fileName: string, repository: string) {
        this.snycService.sync(change, await this.markerService.getMarkersForDocument(fileName, repository));
        this.resetGutterDecorations(editor, fileName, repository);
    }

    /**
     * 
     * @param editor 
     */
    public resetGutterDecorations(editor: vscode.TextEditor, fileName: string, repository: string) : void {
        this.clearActiveDecoration();
        this.showDecorationForDocument(editor, fileName, repository);
    }

    /**
     * Gets array of position and labels and creates array of emojis
     * @param document 
     * @returns 
     */
    private async getEmojisForDocument(document: vscode.TextDocument, fileName: string, repository: string) : Promise<UIEmoji[]> {
        let documentContent = [];

        for(let i = 0; i < document.lineCount; i++) {
            documentContent.push(document.lineAt(i).text.replace(/\s/g, ""));
        }

        let change              = new DocumentChange(-1, documentContent, Change.lineAdded, "");
        const markers           = this.snycService.sync(change, await this.markerService.getMarkersForDocument(fileName, repository));
        let emojis: UIEmoji[]   = [];

        for(let i=0; i < markers.length; i++) {
            if(markers[i].deleted === false) {
                const tmpEmoji = this.emojiContainer.getEmojiByScore(markers[i].score.calculateAverage());
                if(tmpEmoji !== undefined) {
                    emojis.push(new UIEmoji(tmpEmoji, markers[i].position));
                }
            }
        }

        return emojis;
    }

    /**
     * 
     * @param decoration 
     * @param line 
     * @param document 
     */
    private registerActiveDecoration(decoration: Gutter, position: MarkerPosition) {
        this.activeDecoration.push(new EmojiDecoration(decoration, position));
    }

    /**
     * 
     * @param line 
     * @param document 
     */
    private hideDecorationOnPosition(position: MarkerPosition) {
        let index = undefined;

        for(let i=0; i < this.activeDecoration.length; i++) {
            if(this.activeDecoration[i].position.compare(position)) {
                index = i;
                break;
            }
        }

        if(index !== undefined) {
            this.activeDecoration[index].gutter.gutter.dispose();
            this.activeDecoration.splice(index, 1);
        }
    }

    /**
     * 
     * @param line 
     * @param editor 
     */
    private showDecorationOnPosition(position: MarkerPosition, editor: vscode.TextEditor) {
        const marker = this.markerService.getMarkerByPosition(position);
        
        if(marker !== null && marker.deleted === false) {
            const uiEmoji = this.emojiContainer.getEmojiByScore(marker.score.calculateAverage());
            if(uiEmoji !== undefined) {
                const tmpGutter = new Gutter(uiEmoji.filePath, uiEmoji.size);

                this.registerActiveDecoration(tmpGutter, position);

                editor.setDecorations(tmpGutter.gutter, [new vscode.Range(
                    new vscode.Position(position.line, 0),
                    new vscode.Position(position.line, 0)
                )]);
            }
        }
    }

    /**
     * Shows gutter icons for given document
     * @param editor 
     */
    public async showDecorationForDocument(editor: vscode.TextEditor, fileName: string, repository: string) {
        let uiEmojis = await this.getEmojisForDocument(editor.document, fileName, repository);
        for(let i=0; i < uiEmojis.length; i++) {
            const uiEmoji = uiEmojis[i];

            //Create ne gutter
            const tmpGutter = new Gutter(uiEmoji.emoji.filePath, uiEmoji.emoji.size);
            this.registerActiveDecoration(tmpGutter, new MarkerPosition(fileName, repository, uiEmoji.position.line));

            // add gutter to open document
            vscode.window.activeTextEditor?.setDecorations(tmpGutter.gutter, [new vscode.Range(
                new vscode.Position(uiEmoji.position.line, 0),
                new vscode.Position(uiEmoji.position.line, 0)
            )]);
        }   
    }

    /**
     * Disposes all active gutter icons
     */
    private hideAllActiveDecorations() : void {
        this.activeDecoration.forEach((decoration, position) => {
            decoration.gutter.gutter.dispose();
        });
    }

    /**
     * Hides all active gutter icons
     */
    public clearActiveDecoration() : void {
        this.hideAllActiveDecorations();
        this.activeDecoration = [];
    }

    /**
     * Provides hover message for given line in given document if markers on that position exists
     * @param line 
     * @param document 
     * @returns 
     */
    public provideHoverMessage(position: MarkerPosition) : string|null {
        let marker = this.markerService.getMarkerByPosition(position);

        if(marker !== null && marker.deleted === false) {
            const occurenceMap = marker.getStatistics();
            const gradeEmojis = this.emojiContainer.gradeEmojis;
    
            let hoverMessage = "";

            for(let i=0; i < gradeEmojis.length; i++) {
                const num = occurenceMap.get(gradeEmojis[i].worth);
                if(num !== undefined) {
                    hoverMessage += gradeEmojis[i].emoji + ": " + num + " ";
                } else {
                    hoverMessage += gradeEmojis[i].emoji + ": 0 "; 
                }
            }
        
            hoverMessage += "Avg: " + marker.score.calculateAverage();
    
            return hoverMessage;
        } else {
            return null;
        }
    }
}