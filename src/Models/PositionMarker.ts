import {MarkerPosition} from "./MarkerPosition";
import {EmojiScore} from "./EmojiScore";

export class PositionMarker {
    position:      MarkerPosition;
    content:       string;
    score:         EmojiScore = new EmojiScore();
    softDelete:    boolean;

    /**
     * 
     * @param content 
     * @param document 
     * @param line 
     */
    constructor(content: string, position: MarkerPosition, deleted: boolean = false) {
        this.content       = content;
        this.position      = position;
        this.softDelete    = deleted;
    }

    /**
     * Adds new user score, if user already posted a score, its changed to the new value
     * @param user 
     * @param score 
     * @returns 
     */
    public addNewScore(user: string, score: number) : number {
        this.score.addScore(user, score);
        return this.score.calculateAverage();
    }

    /**
     * Removes users score
     * @param user 
     * @returns 
     */
    public removeScore(score: number) : number {
        this.score.removeScore(score);
        return this.score.calculateAverage();
    }

    /**
     * 
     * @param user 
     * @returns 
     */
    public removeScoreByUser(user: string): number {
        const score = this.score.getUsersScore(user);
        this.score.removeScore(score);
        return this.score.calculateAverage();
    }

    /**
     * 
     * @param newContent 
     */
    public updateContent(newContent: string) : void {
        this.content = newContent;
    }

    /**
     * Is called when marker content is found in the document again or another score is added
     */
    public enabledMarker() : void {
        this.softDelete = false;
    }

    /**
     * @returns 
     */
    public getStatistics() : Map<number, number> {
        return this.score.scores;
    }
}