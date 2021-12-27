import { Change } from './enums';

export default class DocumentChange {
    public readonly lineStart:     number;
    public readonly change:        Change;
    public readonly lineContent:   string;
    public readonly document:      string[];

    /**
     * 
     * @param line 
     * @param documentContent 
     * @param change 
     * @param lineContent 
     */
    constructor(line: number, documentContent: string[], change: Change, lineContent: string = "") {
        this.lineStart     = line;
        this.change        = change;
        this.lineContent   = lineContent;
        this.document      = documentContent;
    }
}