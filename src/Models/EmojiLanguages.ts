import EmojiLanguage from "./EmojiLanguage";
import * as vscode from 'vscode';

export default class EmojiLanguages {
    private _languages: EmojiLanguage[];

    constructor() {
        this._languages = [];

        //TODO: get this data from somewhere else
        const csharpLanguage        = new EmojiLanguage("csharp");
        const javascriptLanguage    = new EmojiLanguage("javascript");
        const phpLanguage           = new EmojiLanguage("php");
        const pythonLanguege        = new EmojiLanguage("python");

        this._languages.push(csharpLanguage);
        this._languages.push(javascriptLanguage);
        this._languages.push(phpLanguage);
        this._languages.push(pythonLanguege);
    }

    public get languages() : EmojiLanguage[] {
        return this._languages;
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    public isLanguageEnabled(id: string) : boolean|undefined {
        const language = this._languages.find(language => language.id === id);
        return language?.enabled;
    }

    /**
     * 
     * @param id 
     * @param disposable 
     * @returns 
     */
    public enableLanguage(id: string, disposable: vscode.Disposable) : boolean {
        let language = this._languages.find(language => language.id === id);
        if(language !== undefined) {
            language.enableLanguage(disposable);
            return true;
        }

        return false;
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    public disableLanguage(id: string) : boolean {
        let language = this._languages.find(language => language.id === id);
        if(language !== undefined) {
            language.disableLanguage();
            return true;
        }

        return false;
    }

    /**
     * 
     * @returns 
     */
    public getEnabledLanguages() : EmojiLanguage[] {
        let tmp: EmojiLanguage[];
        tmp = [];

        for(let i=0; i < this._languages.length; i++) {
            if(this._languages[i].enabled) {
                tmp.push(this._languages[i]);
            }
        }

        return tmp;
    }

    //TODO: fix in extension settings
}