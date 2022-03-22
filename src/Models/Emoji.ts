export class Emoji {
    readonly emoji:          string;
    readonly filePath:       string;
    readonly label:          string;
    readonly size:           string;
    readonly worth:          number;
    readonly usedForRating:  boolean;
    readonly executeCommand: string;

    /**
     * 
     * @param label 
     * @param emoji 
     * @param filePath 
     * @param gutterSize 
     * @param worth 
     * @param userCanRate 
     * @param command 
     */
    constructor(label: string, emoji: string, filePath: string, gutterSize: string, worth: number, userCanRate: boolean, command: string) {
        this.label          = label;
        this.emoji          = emoji;
        this.filePath       = filePath;
        this.size           = gutterSize;
        this.worth          = worth;
        this.usedForRating  = userCanRate;
        this.executeCommand = command;
    }
}