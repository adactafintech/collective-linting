import fetch from 'cross-fetch';
import * as vscode from 'vscode';
import * as msal from '@azure/msal-node';
import { AzurePortalConfig, AzureClientCredentialRequest } from '../DTO/azureConfig';
import { CreateOrUpdateRequest, RemoveScoreRequest, FindMarkerRequest, GetRepoStats } from '../DTO/apiRequests';
import { instance } from 'ts-mockito';

export class ApiService {
    private apiMarkerURL:                       string|undefined                = undefined;
    readonly apiEndPoint:                       string                          = "/api/v1/markerService";
    private bearerToken:                        string                          = "";
    private readonly attempts:                  number                          = 5;
    private readonly azureConfig:              AzurePortalConfig               = 
    { auth: {
        authority:      vscode.workspace.getConfiguration('EmojiSettings').get<string>('AzureAuthority')!,
        clientId:       vscode.workspace.getConfiguration('EmojiSettings').get<string>('AzureClientId')!,
        clientSecret:   vscode.workspace.getConfiguration('EmojiSettings').get<string>('AzureClientSecret')!,
        redirectUri:    vscode.workspace.getConfiguration('EmojiSettings').get<string>('AzureRedirectURI')!,
        navigateToLoginRequestUrl: true
    }};
    
    private readonly clientCredentialRequest:  AzureClientCredentialRequest = {
        authority: vscode.workspace.getConfiguration('EmojiSettings').get<string>('AzureAuthority')!,
        scopes: [vscode.workspace.getConfiguration('EmojiSettings').get<string>('AzureScope')!]
    };

    constructor() {
        this.fetchAPIURL();
    }

    /**
     * Fetches the latest setting from extension configuration
     */
    private fetchAPIURL() : void {
        const apiUrl = vscode.workspace.getConfiguration('EmojiSettings').get<string>('ApiURL');
        this.apiMarkerURL = apiUrl + this.apiEndPoint;
    }

    /**
     * 
     * @param document 
     * @param remote 
     * @returns 
     */
    public async getMarkersFromApiByDocument(req: FindMarkerRequest) {
        this.fetchAPIURL();

        let i = 0;
        while(i < this.attempts) {

            // Get Data
            let finalResponse = await fetch(this.apiMarkerURL + "/" + req.document.split("/").join("--") + "/" + req.remote.split("/").join("--") + "/find", 
            {
                method: "GET", 
                mode: "no-cors",
                headers: {
                    "authorization": "Bearer " + this.bearerToken
                }
            }).then(response => response);

            if(await this.unauthenticatedResponse(finalResponse.status)) {
                return finalResponse.json();
            }

            i++;
        }

        return [];
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    public async getRepositoryStatistics(req: GetRepoStats) {
        this.fetchAPIURL();

        let i = 0;
        while(i < this.attempts) {
            // Get Data
            let finalResponse = await fetch(
                this.apiMarkerURL + "/score/statistics?repository=" + req.repository.split("/").join("--") + "/" + req.repository.split("/").join("--") + "&numberOfResults=" + req.numberOfResults, 
            {
                method: "GET", 
                mode: "no-cors",
                headers: {
                    "authorization": "Bearer " + this.bearerToken
                }
            }).then(response => response);

            if(await this.unauthenticatedResponse(finalResponse.status)) {
                return finalResponse.json();
            }

            i++;
        }

        return [];
    }

    /**
     * Saves new marker to database
     * @param marker 
     * @returns 
     */
    public async saveNewMarker(marker: CreateOrUpdateRequest) {
        this.fetchAPIURL();

        let i = 0;
        while(i < this.attempts) {

            let finalResponse = await fetch(this.apiMarkerURL + "/newScore", 
            { 
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(marker),
                headers: {
                    "authorization": "Bearer " + this.bearerToken
                }
            }).then(response => response);

            if(await this.unauthenticatedResponse(finalResponse.status)) {
                return finalResponse.json();
            }

            i++;
        }
        
        return [];
    }

    /**
     * 
     * @returns 
     */
    public async getAllMarkers() {
        this.fetchAPIURL();

        let i = 0;
        while(i < this.attempts) {
            let finalResponse = await fetch(this.apiMarkerURL + "/all", 
            { 
                method: "GET", 
                mode: "no-cors",
                headers: {
                    "authorization": "Bearer " + this.bearerToken
                }
            }).then(response => response);

            if(await this.unauthenticatedResponse(finalResponse.status)) {
                return finalResponse.json();
            }

            i++;
        }

        return [];
    }

    /**
     * 
     * @param request 
     * @returns 
     */
    public async removeScore(request: RemoveScoreRequest) {
        this.fetchAPIURL();

        let i = 0;
        while(i < this.attempts) {
            let finalResponse = await fetch(this.apiMarkerURL + "/removeScore", 
            { 
                method: "POST", 
                mode: "no-cors", 
                body: JSON.stringify(request),
                headers: {
                    "authorization": "Bearer " + this.bearerToken
                }
            }).then(response => response);

            if(await this.unauthenticatedResponse(finalResponse.status)) {
                return finalResponse.json();
            }

            i++;
        }

        return [];
    }

    /**
     * 
     * @returns 
     */
    private async authenticateClient() : Promise<string> {
        let debug = vscode.window.createOutputChannel("EmojiDebug");

        const cca = new msal.ConfidentialClientApplication(this.azureConfig);
        try {
            const result = await cca.acquireTokenByClientCredential(this.clientCredentialRequest).then(res => res);
            if(result?.accessToken !== undefined) {
                return result.accessToken;
            }
        } catch (error) {
            vscode.window.showInformationMessage((error as Error).message + " - " + "Getting error");
        }

        return "";
    }

    /**
     * 
     * @param response 
     * @returns 
     */
    private async unauthenticatedResponse(status: number) : Promise<boolean> {
        if(status !== 401) {
            return true;
        }
        const bearer = await this.authenticateClient();
        this.bearerToken = bearer;
        
        return false;
    }

    public testMethod () : string {
        return "minimin";
    }

    /*
    const results = Promise.all(Object.entries(animalsRecordingsDictionary).map((animal, string) => figureOutAnimalNoisiness(animal, string)));
	const expectedResults = [
		animalsRecordingsDictionary.cat.length,
		animalsRecordingsDictionary.cow.length,
		animalsRecordingsDictionary.sheep.length,
		animalsRecordingsDictionary.elfitz.length,
	];*/
}