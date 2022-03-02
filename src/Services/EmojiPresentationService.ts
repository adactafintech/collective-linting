import {EmojiContainer} from "../Models/EmojiContainer";
import {EmojiDecoration} from "../Models/EmojiDecoration";
import {Gutter} from "../Models/Gutter";
import {UIEmoji} from "../Models/UIEmoji";
import * as vscode from 'vscode';
import {MarkerService} from "./MarkerService";
import {MarkerPosition} from "../Models/MarkerPosition";
import {SyncService} from "./SyncService";
import {DocumentChange} from "../Models/DocumentChange";
import {Change} from "../Models/enums";

export class EmojiPresentationService {
    emojiContainer:     EmojiContainer      = new EmojiContainer();
    markerService:      MarkerService       = new MarkerService();
    snycService:        SyncService         = new SyncService();
    activeDecoration:   EmojiDecoration[]   = [];

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

        for(const marker of markers) {
            if(marker.softDelete) {
                continue;
            }

            const tmpEmoji = this.emojiContainer.getEmojiByScore(marker.score.calculateAverage());
            if(tmpEmoji !== undefined) {
                emojis.push(new UIEmoji(tmpEmoji, marker.position));
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
        
        if(marker !== null && marker.softDelete === false) {
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

        for(const uiEmoji of uiEmojis) {
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

        if(marker !== null && marker.softDelete === false) {
            const occurenceMap = marker.getStatistics();
            const gradeEmojis = this.emojiContainer.gradeEmojis;
    
            let hoverMessage = "";

            for(const gradeEmoji of gradeEmojis) {
                const num = occurenceMap.get(gradeEmoji.worth);
                if(num !== undefined) {
                    hoverMessage += gradeEmoji.emoji + ": " + num + " ";
                } else {
                    hoverMessage += gradeEmoji.emoji + ": 0 "; 
                }
            }
        
            hoverMessage += "Avg: " + marker.score.calculateAverage();
    
            return hoverMessage;
        } else {
            return null;
        }
    }
}