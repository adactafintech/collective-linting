import fetch from 'cross-fetch';

export default class ApiService {
    public _apiMarkerURL: string;

    constructor(apiUrl : string = "http://localhost:7071/api/v1/markerService") {
        this._apiMarkerURL = apiUrl;
    }

    /**
     * 
     * @param document 
     * @param remote 
     * @returns 
     */
    public async getMarkersFromApiByDocument(document: string, remote: string) {
        // Get Data
        let response = await fetch(this._apiMarkerURL + "/" + document.split("/").join("--") + "/" + remote.split("/").join("--") + "/find", { method: "GET", mode: "no-cors" })
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
          console.error("Error: " + error);
          return [];
        });

        return response;
    }

    /**
     * Saves new marker to database
     * @param marker 
     * @returns 
     */
    public saveNewMarker(marker: any) : boolean {
        try {
            fetch(this._apiMarkerURL + "/newScore", 
            { 
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(marker)
            }).then(response => response.status)
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