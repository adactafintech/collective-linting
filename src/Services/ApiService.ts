import fetch from 'cross-fetch';
import * as vscode from 'vscode';

export default class ApiService {
    public _apiMarkerURL: string|undefined;
    private _apiEndPoint = "/api/v1/markerService";

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
    public async getMarkersFromApiByDocument(document: string, remote: string) {
        this.fetchAPIURL();

        // Get Data
        let finalResponse = await fetch(this._apiMarkerURL + "/" + document.split("/").join("--") + "/" + remote.split("/").join("--") + "/find", { method: "GET", mode: "no-cors" })
        .then(response => {
            response.json();
            console.log(response);
        })
        .then(data => data)
        .catch(error => {
            console.error();
            console.error("Error: " + error);
          return [];
        });

        console.log(finalResponse);

        return finalResponse;
    }

    /**
     * Saves new marker to database
     * @param marker 
     * @returns 
     */
    public saveNewMarker(marker: any) : boolean {
        this.fetchAPIURL();

        try {
            fetch(this._apiMarkerURL + "/newScore", 
            { 
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(marker)
            }).then(response => {
                response.status;
                console.log(response);
            })
            .then(data => data)
            .catch(error => {
              throw new Error(error);
            });

            return true;
        } catch(e) {
            console.error(e);
            return false;
        }
    }

    /**
     * 
     * @returns 
     */
    public getAllMarkers() : any|null {
        this.fetchAPIURL();

        try {
            return fetch(this._apiMarkerURL + "/all", { method: "GET", mode: "no-cors" })
            .then(response => response.json())
            .then(data => data)
            .catch(error => {
                throw new Error(error);
            });
        } catch(e) {
            console.error(e);
            return null;
        }
    }

    /**
     * 
     * @param request 
     * @returns 
     */
    public removeScore(request: any) {
        this.fetchAPIURL();

        try {
            fetch(this._apiMarkerURL + "/removeScore", 
            { 
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(request)
            }).then(response => response.json())
            .then(data => data)
            .catch(error => {
                throw new Error(error);
            });
        } catch(e) {
            console.error(e);
        }
    }
}