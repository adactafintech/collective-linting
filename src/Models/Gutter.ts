import * as vscode from 'vscode';
import path = require('path');

export default class Gutter {
    gutter: vscode.TextEditorDecorationType;
    filePath: string;
    size: string;

    /**
     * 
     * @param filePath 
     * @param size 
     */
    constructor(filePath: string, size: string) {
        this.filePath = filePath;
        this.size = size;

        this.gutter = vscode.window.createTextEditorDecorationType({
            gutterIconPath: path.join(__dirname, '../../src', 'icons', filePath),
            gutterIconSize: size,
        });
    }

    /**
     * Set gutter icon for document decoration
     * @param filePath 
     * @param size 
     */
    public setGutter(filePath: string, size: string) : void {
        this.gutter = vscode.window.createTextEditorDecorationType({
            gutterIconPath: path.join(__dirname, '../../src', 'icons', filePath),
            gutterIconSize: size,
        });
    }
}