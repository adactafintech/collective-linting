export class MarkerPosition {
    readonly document:      string;
    readonly repository:    string;
    line:                   number;

    /**
     * 
     * @param document 
     * @param repository 
     * @param line 
     */
    constructor(document: string, repository: string, line: number) {
        this.document      = document;
        this.repository    = repository;
        this.line          = line;
    }

    /**
     * Compares two locations and returns if they are the same or not
     * @param other 
     * @returns 
     */
    public compare(other: MarkerPosition) : boolean {        
        return other.line === this.line && other.document.trim() === this.document.trim() && other.repository.trim() === this.repository.trim();
    }

    /**
     * 
     * @param newLine 
     */
    public update(newLine: number) : void {
        this.line = newLine;
    }

    /**
     * 
     * @param adjustment 
     * @returns 
     */
    public calculateNewLine(adjustment: number) : number {
        this.line += adjustment;
        return this.line;
    }
}