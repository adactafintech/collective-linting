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

### AD Authentication for Azure Functions

By default the project is using AD Authentication, that allows members of our organization to easily authenticate and call azure functions ednpoints.
Implementation of authentication was made with Microsoft MSAL library, following examples listed in 
    - https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code and 
    - https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/client-credentials

Extensions first generates bearer token that is later appended to all requests. Config data that is used for procuring bearer token is listed in config folder, that should contain files azurePortalConfig.json and azureClientCrdentialRequest.json. For your own use replace the data with your organizations data. 
## Requirements

Server side of the extension uses Microsoft Azure Functions v4 and SDK .NET 6.0 with Microsoft SQL 2018.

## How to use:

1. In Visual Studio Code go under Run and Debug Tab and select Run Extension from the dropdown menu.
2. New Window will appear named Extension Development Host in this window open a project or a single file that contains code
3. Press Ctrl-P to open window for quick commands and type in emojilinting.startLinting
4. In the Debug Console you should see the message "Congratulations, your extension "EmojiLinting" is now active!"
5. If you right click in the newly opened document you should see options for adding emojis to lines.

## Pack and publish the extension
Documentation regarding packing and publishing the extension is available at https://code.visualstudio.com/api/working-with-extensions/publishing-extension
To package the extension as vsix and make it available for others to install run:
```
npm install -g vsce
vsce package
```

## Extension Settings

TODO: complete