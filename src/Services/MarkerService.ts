import {MarkerContainer} from "../Models/MarkerContainer";
import {MarkerPosition} from '../Models/MarkerPosition';
import {PositionMarker} from '../Models/PositionMarker';
import * as vscode from 'vscode';
import { ApiService } from "./ApiService";
import { ConverterService } from "./ConverterService";

export class MarkerService {
    //TODO: change to constructor
    markerStorage: MarkerContainer = new MarkerContainer( new ApiService(), new ConverterService());
    
    /**
     * Returns all markers from marker container that are lcoated in this document
     * @param document 
     * @returns 
     */
    public getMarkersForDocument(document: string, repository: string) : Promise<PositionMarker[]> {
        return this.markerStorage.getMarkersByDocument(document, repository);
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
            this.markerStorage.registerNewMarker(newMarker, user, score);
        } else {
            this.markerStorage.addMarkerScore(newMarker, score, user);
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

    /**
     * 
     * @param repository 
     * @param numberOfResults 
     * @returns 
     */
    public getRepoStats(repository: string, numberOfResults: number) {
       return this.markerStorage.getRepoStats(repository, numberOfResults);
    }
}