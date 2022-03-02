export default class MarkerPosition {
    private _document:  string;
    private _repository: string;
    private _line:      number;

    /**
     * 
     * @param document 
     * @param repository 
     * @param line 
     */
    constructor(document: string, repository: string, line: number) {
        this._document      = document;
        this._line          = line;
        this._repository    = repository;
    }

    /**
     * Compares two locations and returns if they are the same or not
     * @param other 
     * @returns 
     */
    public compare(other: MarkerPosition) : boolean {        
        return other.line === this._line && other.document.trim() === this._document.trim() && other.repository.trim() === this._repository.trim();
    }

    /**
     * 
     * @param newLine 
     */
    public update(newLine: number) : void {
        this._line = newLine;
    }

    /**
     * 
     * @param adjustment 
     * @returns 
     */
    public calculateNewLine(adjustment: number) : number {
        this._line += adjustment;
        return this._line;
    }

    public get line() : number {
        return this._line;
    }

    public get document() : string {
        return this._document;
    }

    public get repository(): string {
        return this._repository;
    }
}