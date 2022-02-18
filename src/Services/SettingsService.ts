import { debug } from 'console';
import * as vscode from 'vscode';
import { EmojiCodeActionProvider } from '../Providers/EmojiCodeActionProvider';

export default class EmojiSettingsService {
    private _emojinizer: EmojiCodeActionProvider;

    constructor() {
        this._emojinizer        = new EmojiCodeActionProvider();
    }

    /**
     * Shows/Hides emojis from the right click menu based on enabled/disabled languages in settings
     * @param langId 
     */
    public updateContext(langId: string) {
        console.log("updating context");

        const config = vscode.workspace.getConfiguration("EmojiSettings");
        const enabled = config.get('langId'+langId);

        vscode.commands.executeCommand('setContext', 'emojilinting:isMenuAllowed', enabled);
    }

    /**
     * Provides code action for document, if the document language is enabled in extension settings
     * @param document 
     * @param range 
     * @returns 
     */
    public showCodeActions(document: vscode.TextDocument, range: vscode.Range) : vscode.CodeAction[] | undefined {
        if(vscode.workspace.getConfiguration("EmojiSettings").get('langId'+document.languageId)) {
            return this._emojinizer.provideCodeActions(document, range);
        }

        return undefined;
    }
}