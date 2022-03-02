import {MarkerPosition} from "./MarkerPosition";
import {PositionMarker} from "./PositionMarker";
import {ApiService} from "../Services/ApiService";
import {ConverterService} from "../Services/ConverterService";
export class MarkerContainer {
    markerPositions:    PositionMarker[]    = [];
    private apiService: ApiService          = new ApiService();
    private converter:  ConverterService = new ConverterService();

    /**
     * Get all markers that are positioned inside provided document
     * @param document 
     * @returns 
     */
    public async getMarkersByDocument(document: string, repository: string) : Promise<PositionMarker[]> {
        let markers: PositionMarker[]  = [];
        this.markerPositions = [...this.markerPositions, ...await this.getMarkerApiCall(document, repository)];

        for(const marker of this.markerPositions) {
            if(marker.position.document === document.trim() && marker.position.repository === repository.trim()) {
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
        for(const marker of this.markerPositions) {
            if(marker.position.compare(position)) {
                return marker;
            }
        }

        return null;
    }

    /**
     * Creates new marker for given position
     * @param marker 
     */
    public async registerNewMarker(marker: PositionMarker, user: string, score: number) {
        if(this.getMarkerByPosition(marker.position) === null) {
            marker.addNewScore(user, score);
            this.markerPositions.push(marker);

            // Call api 
            if(!await this.apiService.saveNewMarker(this.converter.createNewMarkerRequest(marker, score, user))) {
                console.error("Couldn't save new marker");
            }
        }
    }

    /**
     * 
     * @param marker 
     * @param score 
     * @param user 
     */
    public addMarkerScore(marker: PositionMarker, score: number, user: string) {
        marker.addNewScore(user, score);
        this.apiService.saveNewMarker(this.converter.createNewMarkerRequest(marker, score, user)); 
    }

    /**
     * 
     * @param marker 
     * @param user 
     * @returns 
     */
    public removeMarkerScore(marker: PositionMarker, user: string) : PositionMarker|null {
        this.apiService.removeScore(this.converter.createRemoveMarkerRequest(marker, user));
        
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
        marker.softDelete = true;
    }

    /**
     * Calls api service
     * @param document 
     * @returns 
     */
    public async getMarkerApiCall(document: string|undefined, repository: string|undefined) : Promise<any> {
        let markers: any = [];

        if(document !== undefined && repository !== undefined) {
            markers = await this.apiService.getMarkersFromApiByDocument(this.converter.createFindMarkersRequest(document, repository));
        } else {
            markers = await this.apiService.getAllMarkers();
        }

        return this.converter.fromJSONToMarkerByDocument(markers);
    }

    /**
     * Calls api to remove score from marker
     * @param marker 
     * @param user 
     */
    public async removeScore(marker: PositionMarker, user: string) {
        this.apiService.removeScore(this.converter.createRemoveMarkerRequest(marker, user));
    }
} 