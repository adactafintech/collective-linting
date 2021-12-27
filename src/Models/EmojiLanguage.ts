import * as vscode from 'vscode';

export default class EmojiLanguage {
    private _id:         string;
    private _disposable: vscode.Disposable|undefined;
    private _enabled:     boolean;

    /**
     * 
     * @param id 
     */
    constructor(id: string) {
        this._id            = id;
        this._enabled       = false;
        this._disposable    = undefined;
    }

    /**
     * 
     * @param disposable 
     */
    public enableLanguage(disposable: vscode.Disposable) : void {
        this._enabled = true;
        this._disposable = disposable;
    }

    public disableLanguage() : void {
        this._enabled = false;
        this._disposable?.dispose();
    }

    public get id() : string {
        return this._id;
    }

    public get enabled() : boolean {
        return this._enabled;
    }
}