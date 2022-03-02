import fetch from 'cross-fetch';
import * as vscode from 'vscode';
import * as msal from '@azure/msal-node';

import { AzurePortalConfig, AzureClientCredentialRequest } from '../DTO/azureConfig';
import { CreateOrUpdateRequest, RemoveScoreRequest, FindMarkerRequest } from '../DTO/apiRequests';

export default class ApiService {
    public _apiMarkerURL: string|undefined;
    private _apiEndPoint = "/api/v1/markerService";
    private _bearerToken: string = "";
    private _azureConfig: AzurePortalConfig = require('../../config/azurePortalConfig.json');
    private _clientCredentialRequest: AzureClientCredentialRequest = require('../../config/azureClientCredentialRequest.json');
    private _attempts: number = 5;

    constructor() {
        this.fetchAPIURL();
    }

    /**
     * Fetches the latest setting from extension configuration
     */
    private fetchAPIURL() : void {
        const apiUrl = vscode.workspace.getConfiguration('EmojiSettings').get<string>('ApiURL');
        this._apiMarkerURL = apiUrl + this._apiEndPoint;
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
        while(i < this._attempts) {
            // Get Data
            let response = await fetch(this._apiMarkerURL + "/" + req.document.split("/").join("--") + "/" + req.remote.split("/").join("--") + "/find", 
            {
                method: "GET", 
                mode: "no-cors",
                headers: {
                    "authorization": "Bearer " + this._bearerToken
                }
            }).then(response => response);

            if(await this.unauthenticatedResponse(response.status)) {
                return response.json();
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
        while(i < this._attempts) {

            let response = await fetch(this._apiMarkerURL + "/newScore", 
            { 
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(marker),
                headers: {
                    "authorization": "Bearer " + this._bearerToken
                }
            }).then(response => response);

            if(await this.unauthenticatedResponse(response.status)) {
                return response.json();
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
        while(i < this._attempts) {
            let response = await fetch(this._apiMarkerURL + "/all", 
            { 
                method: "GET", 
                mode: "no-cors",
                headers: {
                    "authorization": "Bearer " + this._bearerToken
                }
            }).then(response => response);

            if(await this.unauthenticatedResponse(response.status)) {
                return response.json();
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
        while(i < this._attempts) {
            let response = await fetch(this._apiMarkerURL + "/removeScore", 
            { 
                method: "POST", 
                mode: "no-cors", 
                body: JSON.stringify(request),
                headers: {
                    "authorization": "Bearer " + this._bearerToken
                }
            }).then(response => response);

            if(await this.unauthenticatedResponse(response.status)) {
                return response.json();
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
        const cca = new msal.ConfidentialClientApplication(this._azureConfig);
        try {
            const result = await cca.acquireTokenByClientCredential(this._clientCredentialRequest).then(res => res?.accessToken);
            if(result !== undefined) {
                return result;
            }
        } catch (error) {
            console.error(error);
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
        this._bearerToken = bearer;
        
        return false;
    }
}