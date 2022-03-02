import { timeStamp } from 'console';
import * as vscode from 'vscode';
import DocumentChange from '../Models/DocumentChange';
import MarkerContainer from "../Models/MarkerContainer";
import MarkerPosition from '../Models/MarkerPosition';
import PositionMarker from '../Models/PositionMarker';

export default class MarkerService {
    markerStorage: MarkerContainer;

    constructor() {
        this.markerStorage = new MarkerContainer();
    }

    public initializeMarkers() : void {
       // this.markerStorage.initMarkers();
    }
    
    /**
     * Returns all markers from marker container that are lcoated in this document
     * @param document 
     * @returns 
     */
    public async getMarkersForDocument(document: string, repository: string) : Promise<PositionMarker[]> {
        return await this.markerStorage.getMarkersByDocument(document, repository);
    }

    /**
     * Return marker if it exists for given position
     * @param line 
     * @param document 
     * @returns 
     */
    public getMarkerByPosition(position: MarkerPosition) : PositionMarker|null {
        return this.markerStorage.getMarkerByPosition(position);
    }

    /**
     * Saves new marker on a given position
     * @param score 
     * @param line 
     * @param document 
     * @param user 
     * @param lineContent 
     * @returns
     */
    public saveNewMarker(score: number, position: MarkerPosition, user: string, lineContent: string) : PositionMarker {
        let newMarker = this.markerStorage.getMarkerByPosition(position);

        if(newMarker === null) {
            newMarker = new PositionMarker(lineContent.replace(/\s/g, ""), position);
            // newMarker.addNewScore(user, score);
            this.markerStorage.registerNewMarker(newMarker, user, score);
        } else {
            this.markerStorage.addMarkerScore(newMarker, score, user);
            // newMarker.addNewScore(user, score);
        }

        return newMarker;
    }

    /**
     * Deletes marker from given location returns true if something was deleted
     * @param line 
     * @param document 
     * @param user 
     * @returns
     */
    public deleteMarker(position: MarkerPosition, user: string) : PositionMarker|null {
        // delete it from storage
        let newMarker = this.markerStorage.getMarkerByPosition(position);

        if(newMarker !== null) {
            newMarker = this.markerStorage.removeMarkerScore(newMarker, user);
        }

        return newMarker;
    }
}