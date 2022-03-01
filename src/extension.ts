// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { strict } from 'assert';
import { networkInterfaces } from 'os';
import path = require('path');
import { domainToUnicode } from 'url';
import * as vscode from 'vscode';
import DocumentChange from './Models/DocumentChange';
import { Change } from './Models/enums';
import MarkerContainer from './Models/MarkerContainer';
import { EmojiCodeActionProvider } from './Providers/EmojiCodeActionProvider';
import EmojiEventHandler from './Providers/EmojiEventHandler';
import GitService from './Services/GitService';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "EmojiLinting" is now active!');

	let emojiEventHandler 	= new EmojiEventHandler();

	//TODO: registration command
	let disposable = vscode.commands.registerCommand('emojilinting.startLinting', () => {
		const enabledLanguges = emojiEventHandler.onExtensionActivated(context);
		emojiEventHandler.onInitialize();
	});

	// Shows gutter icons when chaning active text editor
	vscode.window.onDidChangeActiveTextEditor(textEditor => {
		if(textEditor !== undefined) {
			emojiEventHandler.onFileOpen(textEditor);
		}
	});

	/**
	 * Fires everytime any configuration is changed
	 */
	vscode.workspace.onDidChangeConfiguration(event => {
		if(event.affectsConfiguration("EmojiSettings")) {
			emojiEventHandler.onSettingsUpdated(context);
		}
	});

	/**
	 * Fires everytime document changes in any way - new character/line is added/removed....
	 */
	vscode.workspace.onDidChangeTextDocument(event => {
		if(event.contentChanges.length > 0) {
			const line 			= event.contentChanges[0].range.start.line;
			const eventChange 	= event.contentChanges[0].text;
			let documentContent = [];

			for(let i = 0; i < event.document.lineCount; i++) {
				documentContent.push(event.document.lineAt(i).text.replace(/\s/g, ""));
			}
			
			if(eventChange.startsWith("\r\n")) {
				emojiEventHandler.onFileChanged(event.document, new DocumentChange(line, documentContent, Change.lineAdded));
			} else if(eventChange === "") {
				emojiEventHandler.onFileChanged(event.document, new DocumentChange(line, documentContent, Change.lineDeleted));
			} else {
				emojiEventHandler.onFileChanged(event.document, new DocumentChange(line, documentContent, Change.lineUpdated));
			}
		}
	});

	/**
	 * Fires when document is saved
	 */
	vscode.workspace.onDidSaveTextDocument(document =>  {
		//TODO: refactor
		let editor = vscode.window.activeTextEditor;
		if(editor !== undefined) {
			let documentContent = [];
			for(let i = 0; i < document.lineCount; i++) {
				documentContent.push(document.lineAt(i).text.replace(/\s/g, ""));
			}

			emojiEventHandler.onFileSaved(editor, new DocumentChange(-1, documentContent, Change.fileSaved));
			const neki = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath)[0].toString();
			if(neki !== undefined) {	
				let gitService = new GitService(neki);
				console.log(gitService.getBaseDir());
				console.log(gitService.getRepository().then(result => console.log(result)));
				console.log(gitService.getFileName(document.uri.fsPath.toString()).then(result => console.log(result)));
			}
		}
	});

	let statWindowCommand = vscode.commands.registerCommand('emojilinting.showStats', () => {
		vscode.window.showInformationMessage("Showing stat window");
		emojiEventHandler.onStatWindowOpen();
	});

	context.subscriptions.push(disposable, statWindowCommand);

	context.subscriptions.push(
		vscode.commands.registerCommand('emojilinting.smily', () => {
			emojiEventHandler.hoverService?.dispose();
			const editor = vscode.window.activeTextEditor;
			const selection = editor?.selection;

			if(selection && editor) {
				for (let index = selection.start.line; index <= selection.end.line; index++) {
					emojiEventHandler.onEmojiAdd(2, index, editor, 'extUser', editor.document.lineAt(index).text);
				}

				// Add on hover to selected rows
				emojiEventHandler.hoverService = vscode.languages.registerHoverProvider(editor.document.languageId, {
					provideHover(document, position, token) {
						return emojiEventHandler.onHover(position.line, document);
					}
				});
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('emojilinting.mehemoji', async () => {
			emojiEventHandler.hoverService?.dispose();
			const editor = vscode.window.activeTextEditor;
			const selection = editor?.selection;

			if(selection && editor) {
				for (let index = selection.start.line; index <= selection.end.line; index++) {
					emojiEventHandler.onEmojiAdd(0, index, editor, 'extUser2', editor.document.lineAt(index).text);
				}

				// Add on hover to selected rows
				emojiEventHandler.hoverService = vscode.languages.registerHoverProvider(editor.document.languageId, {
					provideHover(document, position, token) {
						return emojiEventHandler.onHover(position.line, document);
					}
				});
			}
		})
	);

	//TODO: merge code of all commands
	context.subscriptions.push(
		vscode.commands.registerCommand('emojilinting.angry', () => {
			emojiEventHandler.hoverService?.dispose();
			const editor = vscode.window.activeTextEditor;
			const selection = editor?.selection;

			if(selection && editor) {
				for (let index = selection.start.line; index <= selection.end.line; index++) {
					emojiEventHandler.onEmojiAdd(-2, index, editor, 'extUser', editor.document.lineAt(index).text);
				}
				
				// Add on hover to selected rows
				emojiEventHandler.hoverService = vscode.languages.registerHoverProvider(editor.document.languageId, {
					provideHover(document, position, token) {
						return emojiEventHandler.onHover(position.line, document);
					}
				});
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('emojilinting.clear-emoji', async () => {
			emojiEventHandler.hoverService?.dispose();
			
			const editor = vscode.window.activeTextEditor;
			const selection = editor?.selection;

			if(selection && editor) {
				for (let index = selection.start.line; index <= selection.end.line; index++) {
					emojiEventHandler.onEmojiDelete(index, editor, 'extUser');
				}

				// Add on hover to selected rows
				emojiEventHandler.hoverService = vscode.languages.registerHoverProvider(editor.document.languageId, {
					provideHover(document, position, token) {
						return emojiEventHandler.onHover(position.line, document);
					}
				});
			}
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}