export default class Emoji {
    public readonly emoji:          string;
    public readonly filePath:       string;
    public readonly label:          string;
    public readonly size:           string;
    public readonly worth:          number;
    public readonly usedForRating:  boolean;
    public readonly executeCommand: string;

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
        this.emoji          = emoji;
        this.filePath       = filePath;
        this.label          = label;
        this.size           = gutterSize;
        this.worth          = worth;
        this.usedForRating  = userCanRate;
        this.executeCommand = command;
    }
}