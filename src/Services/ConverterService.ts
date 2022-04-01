import {MarkerPosition} from "../Models/MarkerPosition";
import {PositionMarker} from "../Models/PositionMarker";
import { CreateOrUpdateRequest, RemoveScoreRequest, FindMarkerRequest, GetRepoStats } from "../DTO/apiRequests";
import { StatHolder } from "../DTO/apiResponse";

export class ConverterService {
    private readonly markerProps: string[] = ["content", "documentUri", "line", "isDeleted"];
    private readonly repoStatProps: string[] = ["highQualityDocuments", "lowQualityDocuments"];
    private readonly documentStatProps: string[] = ["documentURI", "averageScore", "numberofScores"];

    /**
     * TODO: optimize
     * Converts api v1 response from JSON to markers array
     * @param response 
     * @returns 
     */
    public fromJSONToMarkerByDocument(response: any) : PositionMarker[] {

        console.log(response);

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
    

            console.log(response);

            return markers;
        } catch(e) {
            console.log("Returning null");
            return [];
        }
    }    

    public fromJSONStatResponseToData(response: any) : string[] {
        try {
            return this.formatToTableData(response as StatHolder);
        } catch(e) {
            console.error(e);
        }

        return ["", ""];
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

    /**
     * 
     * @param repository 
     * @param numberOfResults 
     * @returns 
     */
    public createGetStatRequest(repository: string, numberOfResults: number) : GetRepoStats {
        return {
            repository: repository,
            numberOfResults: numberOfResults 
        };
    }

    public formatToTableData(stats: StatHolder|undefined) : string[] {
        	
        let positiveTableData = "";
        let negativeTableData = "";

        if(stats !== undefined) {
            for(let i = 0; i < stats.highQualityDocuments.length; i++) {
                positiveTableData += "<tr>" +
                "<td>" + stats.highQualityDocuments[i].documentURI + "</td>" +
                "<td>" + stats.highQualityDocuments[i].averageScore + "</td>" +
                "<td>" + stats.highQualityDocuments[i].numberofScores + "</td>" +
                "</tr>";

                negativeTableData += "<tr>" +
                "<td>" + stats.lowQualityDocuments[i].documentURI + "</td>" +
                "<td>" + stats.lowQualityDocuments[i].averageScore + "</td>" +
                "<td>" + stats.lowQualityDocuments[i].numberofScores + "</td>" +
                "</tr>";
            }
        }

        return [positiveTableData, negativeTableData];
    }
}