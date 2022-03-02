import {MarkerPosition} from "../Models/MarkerPosition";
import {PositionMarker} from "../Models/PositionMarker";
import { CreateOrUpdateRequest, RemoveScoreRequest, FindMarkerRequest } from "../DTO/apiRequests";

export class ConverterService {
    private readonly markerProps: string[] = ["content", "documentUri", "line", "isDeleted"];

    /**
     * TODO: optimize
     * Converts api v1 response from JSON to markers array
     * @param response 
     * @returns 
     */
    public fromJSONToMarkerByDocument(response: any) : PositionMarker[] {
        try {
            const markers: PositionMarker[] = response.filter((marker: any) => {
                for(const prop of this.markerProps) {
                    if(!marker.hasOwnProperty(prop)){
                        return false;
                    }
                }
                return true;
            }).map((marker: any) => {
                const position = new MarkerPosition(marker.documentUri.trim(), marker.repository.trim(), marker.line);
                let newMarker: PositionMarker = new PositionMarker(marker.content, position, marker.isDeleted);
                let numberMap = new Map<number, number>();

                marker.scores.forEach((score: any) => {
                    numberMap.set(score.score.value, score.score.frequency);
                });

                newMarker.score.scores = numberMap;

                return newMarker;
            });
    
            return markers;
        } catch(e) {
            return [];
        }
    }    

    /**
     * Converts marker, user and score to JSON request for creation or update of user score on api v1
     * @param marker 
     * @param user 
     * @param score 
     * @returns 
     */
    public createCreateOrUpdateScoreRequest(marker : PositionMarker, user: string, score: number) : CreateOrUpdateRequest {
        return {
            "score": score,
            "user": user,
            "documentUri": marker.position.document.split("/",).join("--"),
            "repository": marker.position.repository.split("/").join("--"),
            "line": marker.position.line,
            "content": marker.content
        };
    }

    /**
     * Convertrs marker and user to JSON request for score removal on api v1
     * @param marker 
     * @param user 
     * @returns 
     */
    public createRemoveScoreRequest(marker: PositionMarker, user: string) : RemoveScoreRequest {
        return {
            "documentUri": marker.position.document.split("/").join("--"),
            "repository": marker.position.repository.split("/").join("--"),
            "line": marker.position.line,
            "user": user
        };
    }

    /**
     * 
     * @param marker 
     * @param score 
     * @param user 
     * @returns 
     */
    public createNewMarkerRequest(marker: PositionMarker, score: number, user: string) : CreateOrUpdateRequest {
        return {
            score:          score,
            user:           user,
            documentUri:    marker.position.document,
            repository:     marker.position.repository,
            line:           marker.position.line,
            content:        marker.content
        };
    }

    /**
     * 
     * @param document 
     * @param remote 
     * @returns 
     */
    public createFindMarkersRequest(document: string, remote: string) : FindMarkerRequest {
        return {
            document: document,
            remote: remote,
        };
    }

    /**
     * 
     * @param marker 
     * @param user 
     * @returns 
     */
    public createRemoveMarkerRequest(marker: PositionMarker, user: string) : RemoveScoreRequest {
        return {
            documentUri: marker.position.document,
            repository: marker.position.repository,
            line: marker.position.line,
            user: user,
        };
    }
}