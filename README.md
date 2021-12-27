# EmojiLinting README

EmojiLinting is extension for Visual Studio Code that enables users to mark and score code in their project. Emojis create an easy to use friendly system that everyone can unserstand.
Emojis also present the general opinion of the given code, of your team, making code smells and bad code quality more apparent.

## Features

This repository implements both the client and the server side of extension. All the code related to the server side can be found in the subdirectory backend and all the code related to the client side in frontend. 

### Server Side Features

> We use SQL Server 2018 for the persitance of scores and marked lines
> The communication between client and server is implemented with Azure Functions v4
> We implemented REST API that is used for retrieving and storing scores

### Client Side Features

> Use menu, quick command and code actions to mark lines with the specific emoji that represents your impression of highlighted lines
> You can exlude files based on programming language they include.

## Requirements

Server side of the extension uses Microsoft Azure Functions v4 and SDK .NET 6.0 with Microsoft SQL 2018.

## How to use:

1. In Visual Studio Code go under Run and Debug Tab and select Run Extension from the dropdown menu.
2. New Window will appear named Extension Development Host in this window open a project or a single file that contains code
3. Press Ctrl-P to open window for quick commands and type in emojilinting.startLinting
4. In the Debug Console you should see the message "Congratulations, your extension "EmojiLinting" is now active!"
5. If you right click in the newly opened document you should see options for adding emojis to lines.

## Extension Settings

TODO: complete