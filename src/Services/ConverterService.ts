import MarkerPosition from "../Models/MarkerPosition";
import PositionMarker from "../Models/PositionMarker";

export default class ConverterService {

    private markerProps: string[];

    constructor () {
        this.markerProps = ["content", "documentUri", "line", "isDeleted"];
    }
    /**
     * Converts api v1 response from JSON to markers array
     * @param response 
     * @returns 
     */
    public fromJSONToMarkerByDocument(response: any) : PositionMarker[] {
        try {
            const markers: PositionMarker[] = response.filter((marker: any) => {
                for(let i = 0; i < this.markerProps.length; i++) {
                    if(!marker.hasOwnProperty(this.markerProps[i])){
                        return false;
                    }
                }
    
                return true;
            }).map((marker: any) => {
                const position = new MarkerPosition(marker.documentUri, "", marker.line);
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
            console.error(e);
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
    public createCreateOrUpdateScoreRequest(marker : PositionMarker, user: string, score: number) : any {
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
    public createRemoveScoreRequest(marker: PositionMarker, user: string) : any {
        return {
            "documentUri": marker.position.document.split("/").join("--"),
            "repository": marker.position.repository.split("/").join("--"),
            "line": marker.position.line,
            "user": user
        };
    }
}