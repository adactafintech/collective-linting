import * as vscode from 'vscode';
import {DocumentChange} from '../Models/DocumentChange';
import {MarkerPosition} from '../Models/MarkerPosition';
import {EmojiPresentationService} from '../Services/EmojiPresentationService';
import {GitService} from '../Services/GitService';
import {EmojiSettingsService} from '../Services/SettingsService';
import { WebviewService } from '../Services/WebviewService';

export class EmojiEventHandler {
    emojiService:           EmojiPresentationService    = new EmojiPresentationService();
    hoverService:           vscode.Disposable|undefined = undefined;
    emojiSettingsService:   EmojiSettingsService        = new EmojiSettingsService();
    lastUsedRepo:           string                      = "";

    /**
     * Event that is fired whenever user adds new emoji
     * @param score 
     * @param line 
     * @param editor 
     * @param user 
     * @param lineContent 
     */
    public async onEmojiAdd(score: number, line: number, editor: vscode.TextEditor, user: string, lineContent: string)  : Promise<void> {
        const position = await this.provideLocation(editor.document, line);

        // TODO: get eligable language ids from settings
        if(editor.document.languageId === "csharp") {
            this.emojiService.saveNewMarker(score, position, editor, user, lineContent);
        }
    }

    /**
     * Event that is fired when user clicks on clear emoji on given position
     * @param line 
     * @param editor 
     * @param user 
     */
    public async onEmojiDelete(line: number, editor: vscode.TextEditor, user: string) : Promise<void> {
        const position = await this.provideLocation(editor.document, line);
        this.emojiService.deleteMarker(position, editor, user);
    }

    public async onStatWindowOpen() {
        // Get repo form git service and 5 from settings
        const res = await this.emojiService.provideRepoStats(this.lastUsedRepo, 5);

        const panel = vscode.window.createWebviewPanel(
            "statView",
            "Stat View",
            vscode.ViewColumn.Beside
        );

        panel.webview.html = WebviewService.getStatWebviewContent(res[0], res[1]);
    }

    /**
     * Event that fires whenever the file is saved 
     * @param document 
     */
    public async onFileChanged(document: vscode.TextDocument, change: DocumentChange) : Promise<void> {
        const fileName = await this.getFileName(document);
        const repository = await this.getRepository(document);

        this.emojiService.documentChanged(change, fileName, repository);
    }

    /**
     * 
     * @param document 
     * @param change 
     */
    public async onFileSaved(editor: vscode.TextEditor, change: DocumentChange) : Promise<void> {
        const fileName = await this.getFileName(editor.document);
        const repository = await this.getRepository(editor.document);

        this.emojiService.documentSaved(change, editor, fileName, repository);
    }

    /**
     * Event that fires when text document is opened
     * @param editor 
     */
    public async onFileOpen(editor: vscode.TextEditor) {
        const fileName = await this.getFileName(editor.document);
        const repository = await this.getRepository(editor.document);

        this.lastUsedRepo = repository;

        this.emojiService.resetGutterDecorations(editor, fileName, repository);
        this.emojiSettingsService.updateContext(editor.document.languageId);
    }

    /**
     * Event that fires when user hovers over a line. It returns hover message if marks exist on given position
     * @param line 
     * @param document 
     * @returns 
     */
    public async onHover(line: number, document: vscode.TextDocument) :  Promise<vscode.Hover|null> {
        const position = await this.provideLocation(document, line);
        const hoverMessage = this.emojiService.provideHoverMessage(position);

        if(hoverMessage === null) {
            return hoverMessage;
        } else {
            return new vscode.Hover(hoverMessage);
        }
    }

    /**
     * 
     * @param context 
     * @returns 
     */
    public onExtensionActivated(context: vscode.ExtensionContext) : void {
        this.onSettingsUpdated(context);
    }

    /**
     * 
     * @param context 
     */
    public onSettingsUpdated(context: vscode.ExtensionContext) : void {
        //TODO: implement
    }

    private async provideLocation(document: vscode.TextDocument, line: number) {
        const usedFolder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath)[0].toString();

        let fileName                    = "";
        let repository : string|void    = "";

        if(usedFolder !== undefined) {
            const filePath = document.uri.fsPath.toString();
            let gitService = new GitService(usedFolder);
    
            fileName    = await gitService.getFileName(filePath);
            repository  = await gitService.getRepository();
        }

        return new MarkerPosition(fileName, (repository === undefined) ? "" : repository, line);
    }

    /**
     * 
     * @param document 
     * @returns 
     */
    private async getFileName(document: vscode.TextDocument) : Promise<string> {
        const usedFolder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath)[0].toString();

        if(usedFolder === undefined) {
            return "";
        }

        let gitService = new GitService(usedFolder);
        const filePath = document.uri.fsPath.toString();
        return gitService.getFileName(filePath); 
    }

    /**
     * 
     * @param document 
     * @returns 
     */
    private async getRepository(document: vscode.TextDocument) : Promise<string> {
        const usedFolder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath)[0].toString();

        if(usedFolder === undefined) {
            return "";
        }

        let gitService = new GitService(usedFolder);
        const repo      = await gitService.getRepository();
        return (repo === undefined) ? "" : repo;
    }
}