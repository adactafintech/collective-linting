import * as vscode from 'vscode';
import EmojiLanguages from "../Models/EmojiLanguages";
import EmojiLanguage from "../Models/EmojiLanguage";
import { EmojiCodeActionProvider } from '../Providers/EmojiCodeActionProvider';

export default class EmojiSettingsService {
    private _languageContainer: EmojiLanguages;
    private _emojinizer: EmojiCodeActionProvider;

    constructor() {
        this._languageContainer = new EmojiLanguages();
        this._emojinizer        = new EmojiCodeActionProvider();
    }

    /**
     * 
     * @param context 
     */
    public updateLanguages(context: vscode.ExtensionContext) : void {
        const emLanguages = this._languageContainer.languages;

        for(let i=0; i < emLanguages.length; i++) {
            const languageId = emLanguages[i].id;
            const previousState = emLanguages[i].enabled;
            const settingsEnabled = vscode.workspace.getConfiguration('EmojiSettings').get<boolean>('langId' + languageId);

            if(settingsEnabled !== undefined && settingsEnabled !== previousState) {
                if(settingsEnabled) {
                    let disposable = vscode.languages.registerCodeActionsProvider(languageId, this._emojinizer, {
                        providedCodeActionKinds: EmojiCodeActionProvider.providedCodeActionKinds
                    });
                    this._languageContainer.enableLanguage(languageId, disposable);
                    context.subscriptions.push(disposable);
                } else {
                    this._languageContainer.disableLanguage(languageId);
                }
            }
        }
    }

    /**
     * 
     * @returns 
     */
    public getLanguageSettings() : EmojiLanguage[] {
        return this._languageContainer.languages;
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    public isLanguageEnabled(id: string) : boolean {
        const enabled = this._languageContainer.isLanguageEnabled(id);
        return enabled !== undefined && enabled === true;
    }

    /**
     * 
     * @returns 
     */
    public getEnabledLangauges() : string[] {
        let enabledLanguages : string[];
        enabledLanguages = [];

        const enabled = this._languageContainer.getEnabledLanguages();
        enabled.forEach(element => {
            enabledLanguages.push(element.id);
        });

        return enabledLanguages;
    } 
}