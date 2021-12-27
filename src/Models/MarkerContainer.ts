import MarkerPosition from "./MarkerPosition";
import PositionMarker from "./PositionMarker";
import ApiService from "../Services/ApiService";
import ConverterService from "../Services/ConverterService";
export default class MarkerContainer {
    markerPositions: PositionMarker[];
    private _apiMarkerService: ApiService;
    private converter: ConverterService;
    private test: boolean;

    /**
     * 
     * @param test 
     */
    constructor(test = false) {
        this.markerPositions    = [];
        this._apiMarkerService  = new ApiService();
        this.converter          = new ConverterService;
        this.test = test;
    }

    /**
     * Get all markers that are positioned inside provided document
     * @param document 
     * @returns 
     */
    public async getMarkersByDocument(document: string, repository: string) : Promise<PositionMarker[]> {
        let markers = [];
        let existingMarkers = [...this.markerPositions, ...await this.getMarkerApiCall(document, repository)];

        for(let i=0; i < existingMarkers.length; i++) {
            let marker = existingMarkers[i];
            if(marker.position.document === document && marker.position.repository === repository) {
                markers.push(marker);
            }
        }

        return markers;
    }

    /**
     * Returns marker that is located on given position
     * @param position 
     * @returns 
     */
    public getMarkerByPosition(position: MarkerPosition) : PositionMarker|null {
        for(let i=0; i < this.markerPositions.length; i++) {
            if(this.markerPositions[i].position.compare(position)) {
                return this.markerPositions[i];
            }
        }

        return null;
    }

    /**
     * Creates new marker for given position
     * @param marker 
     */
    public registerNewMarker(marker: PositionMarker, user: string, score: number) {
        if(this.getMarkerByPosition(marker.position) === null) {
            marker.addNewScore(user, score);
            this.markerPositions.push(marker);

            if(!this.test) {
                // Call api 
                if(!this._apiMarkerService.saveNewMarker(this.converter.createCreateOrUpdateScoreRequest(marker, user, score))) {
                    console.error("Couldn't save new marker");
                }
            }
        }
    }

    /**
     * 
     * @param marker 
     * @param score 
     * @param user 
     */
    public addmarkerScore(marker: PositionMarker, score: number, user: string) {
        marker.addNewScore(user, score);

        if(!this.test) {
            if(!this._apiMarkerService.saveNewMarker(this.converter.createCreateOrUpdateScoreRequest(marker, user, score))) {
                console.log("Saved new marker");
            }
        }
    }

    /**
     * 
     * @param marker 
     * @param user 
     * @returns 
     */
    public removeMarkerScore(marker: PositionMarker, user: string) : PositionMarker|null {
        if(!this.test) {
            this._apiMarkerService.removeScore(this.converter.createRemoveScoreRequest(marker, user));
        }
        
        let numberOfScores = marker.removeScoreByUser(user);

        if(numberOfScores <= 0) {
            this.deleteMarker(marker);
        }

        return marker;
    }

    /**
     * Removes marker that is located on given position
     * @param marker 
     */
    public deleteMarker(marker: PositionMarker) : void {
        marker.softDelete();
    }

    /**
     * Calls api service
     * @param document 
     * @returns 
     */
    public async getMarkerApiCall(document: string|undefined = undefined, repository: string|undefined) : Promise<any> {
        let markers: any = [];

        if(!this.test) {
            if(document !== undefined && repository !== undefined) {
                markers = await this._apiMarkerService.getMarkersFromApiByDocument(document, repository);
            } else {
                markers =  await this._apiMarkerService.getAllMarkers();
            }
        }

        return this.converter.fromJSONToMarkerByDocument(markers);
    }

    /**
     * Calls api to remove score from marker
     * @param marker 
     * @param user 
     */
    public async removeScore(marker: PositionMarker, user: string) {
        this._apiMarkerService.removeScore(this.converter.createRemoveScoreRequest(marker, user));
    }
} 