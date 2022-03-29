import {DocumentChange} from "../Models/DocumentChange";
import { Change } from "../Models/enums";
import {PositionMarker} from "../Models/PositionMarker";

export class ChangeManager {
    documentChanges: Map<string, DocumentChange[]> = new Map<string, DocumentChange[]>();

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
        for(const marker of markers) {
            if(marker.position.line > line) {
                marker.position.calculateNewLine(1);
            }
        }
    }

    /**
     * 
     * @param change 
     * @param markers 
     */
    private contentChanged(change: DocumentChange, markers: PositionMarker[]) : void {
        for(const marker of markers) {
            if(marker.position.line === change.lineStart) {
                marker.updateContent(change.lineContent);
            }
        }
    }
}