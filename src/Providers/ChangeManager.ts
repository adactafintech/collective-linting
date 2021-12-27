import DocumentChange from "../Models/DocumentChange";
import { Change } from "../Models/enums";
import PositionMarker from "../Models/PositionMarker";
import MarkerService from "../Services/MarkerService";

export default class ChangeManager {
    documentChanges: Map<string, DocumentChange[]>;

    constructor() {
        this.documentChanges = new Map<string, DocumentChange[]>();
    }

    /**
     * 
     * @param document 
     * @returns 
     */
    public getChangesForDocument(document: string) : DocumentChange[]|undefined {
        return this.documentChanges.get(document);
    }

    /**
     * 
     * @param change 
     * @param markers 
     */
    public newChange(change: DocumentChange, markers: PositionMarker[]) : void {
        if(change.change === Change.lineAdded) {
            this.onLineAdded(change.lineStart, markers);
        } else if(change.change === Change.lineUpdated) {
            this.contentChanged(change, markers);
        }
    }

    /**
     * 
     * @param line 
     * @param markers 
     */
    private onLineAdded(line: number, markers: PositionMarker[]) : void {
        for(let i = 0; i < markers.length; i++) {
            if(markers[i].position.line > line) {
                markers[i].position.calculateNewLine(1);
            }
        }
    }

    /**
     * 
     * @param change 
     * @param markers 
     */
    private contentChanged(change: DocumentChange, markers: PositionMarker[]) : void {
        for(let i = 0; i < markers.length; i++) {
            if(markers[i].position.line === change.lineStart) {
                markers[i].updateContent(change.lineContent);
            }
        }
    }
}