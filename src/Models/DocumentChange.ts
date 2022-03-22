import { Change } from './enums';

export class DocumentChange {
    readonly lineStart:     number;
    readonly change:        Change;
    readonly lineContent:   string;
    readonly document:      string[];

    /**
     * 
     * @param line 
     * @param documentContent 
     * @param change 
     * @param lineContent 
     */
    constructor(line: number, documentContent: string[], change: Change, lineContent: string = "") {
        this.lineStart     = line;
        this.document      = documentContent;
        this.change        = change;
        this.lineContent   = lineContent;
    }
}