import { timeStamp } from "console";

export default class EmojiScore {
    private _average:           number;
    private _scores:            Map<number, number>;
    private _users:             Map<string, number>;

    constructor() {
        this._average           = 0;
        this._scores            = new Map<number, number>();
        this._users             = new Map<string, number>();

        //TODO: fill scores with available grade emojis
    }

    /**
     * Adds/Changes users score
     * @param user 
     * @param score 
     * @returns 
     */
    public addScore(user: string, score: number) : number {
        let scores = this._scores.get(score);

        if(scores !== undefined) {
            scores+= 1;
            this.scores.set(score, scores);
        } else {
            this.scores.set(score, 1);
        }

        //TODO: refactor later
        this._users.set(user, score);

        return this._average;
    }

    /**
     * 
     * @param user 
     * @returns 
     */
    public getUsersScore(user: string) : number {
        const score = this._users.get(user); 
        return (score !== undefined) ? score : -53;
    }

    /**
     * Removes users score, returns number of remaining scores
     * @param user 
     * @returns 
     */
    public removeScore(score: number) : number {
        let newScore = this._scores.get(score);

        if(newScore !== undefined && score > 0) {
            newScore -= 1;
        } else {
            newScore = 0;
        }

        this._scores.set(score, newScore);

        let numberOfScores = 0;
        this._scores.forEach((value, key) => {
            numberOfScores+= value;
        });

        return numberOfScores;
    }

    /**
     * Reformats score in Map<score, number of occurrences>
     * @returns 
     */
    public getScoreOccurences() : Map<number, number> {
        return this._scores;
    }

    /**
     * Cheks is user submitted score
     * @param user 
     * @returns 
     */
    public usersScoreExists(user: string) : boolean {
        for(let key in this._scores) {
            if (user === key) {return true;};
        }

        return false;
    }

    /**
     * Calculates average from all submitted scores
     * @returns average
     */
    public calculateAverage() : number {
        let sum = 0;
        let numberOfScores = 0;

        this._scores.forEach((value, key) => {
            sum += (key * value);
            numberOfScores += value;
        });

        return (numberOfScores > 0) ? sum/numberOfScores:0;
    }

    /**
     * 
     * @returns 
     */
    public numberOfScores() : number {
        let numberOfScores = 0;

        this._scores.forEach((value, key) => {
            numberOfScores += value;
        });

        return numberOfScores;
    }

    public get scores() {
        return this._scores;
    }

    public set scores(scores: Map<number, number>) {
        this._scores = scores;
    }
}