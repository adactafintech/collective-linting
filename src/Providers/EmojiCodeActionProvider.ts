/**
 * Provides code actions for converting :) to a smiley emoji.
 */
import * as vscode from 'vscode';
import EmojiContainer from '../Models/EmojiContainer';

export class EmojiCodeActionProvider implements vscode.CodeActionProvider {
	emojiContainer: EmojiContainer;

	constructor() {
		this.emojiContainer = new EmojiContainer();
	}

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	/**
	 * @param document 
	 * @param range 
	 * @returns 
	 */
	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined {
		let fixes: vscode.CodeAction[];
		fixes = [];

		for(let emoji of this.emojiContainer.gradeEmojis) {
			if(fixes !== undefined) {
				let tmpFix = new vscode.CodeAction(`${emoji}`, vscode.CodeActionKind.QuickFix);
				tmpFix.title = emoji.emoji;
				tmpFix.command = { command: emoji.executeCommand, title: emoji.label, tooltip: ''};
				tmpFix.isPreferred = false;
				fixes.push(tmpFix);
			}
		}

		// Clear emoji command
		let clearFix = new vscode.CodeAction(`Clear`, vscode.CodeActionKind.QuickFix);
		clearFix.title = "Clear my emoji";
		clearFix.command = { command: "emojilinting.clear-emoji", title: "Clear my emoji", tooltip: 'Deletes users emoji on given lines'};
		clearFix.isPreferred = false;
		fixes.push(clearFix);

		return fixes;
	}
}