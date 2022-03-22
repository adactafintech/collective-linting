export class EmojiScore {
    private average:    number              = 0;
    private users:      Map<string, number> = new Map<string, number>();
    scores:             Map<number, number> = new Map<number, number>();

    /**
     * Adds/Changes users score
     * @param user 
     * @param score 
     * @returns 
     */
    public addScore(user: string, score: number) : number {
        let scores = this.scores.get(score);

        if(scores !== undefined) {
            scores+= 1;
            this.scores.set(score, scores);
        } else {
            this.scores.set(score, 1);
        }

        //TODO: refactor later
        this.users.set(user, score);
        return this.average;
    }

    /**
     * 
     * @param user 
     * @returns 
     */
    public getUsersScore(user: string) : number {
        const score = this.users.get(user); 
        return (score !== undefined) ? score : -53;
    }

    /**
     * Removes users score, returns number of remaining scores
     * @param user 
     * @returns 
     */
    public removeScore(score: number) : number {
        let newScore = this.scores.get(score);

        if(newScore !== undefined && score > 0) {
            newScore -= 1;
        } else {
            newScore = 0;
        }

        this.scores.set(score, newScore);

        let numberOfScores = 0;
        this.scores.forEach((value, key) => {
            numberOfScores+= value;
        });

        return numberOfScores;
    }

    /**
     * Reformats score in Map<score, number of occurrences>
     * @returns 
     */
    public getScoreOccurences() : Map<number, number> {
        return this.scores;
    }

    /**
     * Cheks is user submitted score
     * @param user 
     * @returns 
     */
    public usersScoreExists(user: string) : boolean {
        for(let key in this.scores) {
            if (user === key) {
                return true;
            }
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

        this.scores.forEach((value, key) => {
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

        this.scores.forEach((value, key) => {
            numberOfScores += value;
        });

        return numberOfScores;
    }
}