import {DocumentChange} from '../Models/DocumentChange';
import {Change} from '../Models/enums';
import {PositionMarker} from '../Models/PositionMarker';
export class SyncService {
    /**
     * 
     * @param change 
     * @param markers 
     */
    public sync(change: DocumentChange, markers: PositionMarker[]) {
        if(markers.length > 0) {
            if(change.change === Change.lineAdded || change.change === Change.lineUpdated || change.change === Change.lineDeleted) {
                this.locationChange(change.document, markers);
            } else if(change.change === Change.lineWhiteSpaced) {
                this.contentChanged(change, markers);
            }
        }
        return markers;
    }

    /**
     * 
     * @param document 
     * @param markers 
     */
    private locationChange(content: string[], markers: PositionMarker[]) {
        markers.forEach(element => {
            this.calculateNewLocation(content, element);
        });
    }

    /**
     * 
     * @param document 
     * @param marker 
     */
    private calculateNewLocation(content: string[], marker: PositionMarker) {
        const newLine = this.findNewLine(content, marker.content);
        if(newLine === -1 ) {
            marker.softDelete = true;
        } else if(newLine !== marker.position.line && marker.score.numberOfScores() > 0) {
            marker.enabledMarker();
            marker.position.update(newLine);
        }
    }

    /**
     * 
     * @param document 
     * @param lineContent 
     * @returns 
     */
    private findNewLine(content: string[], lineContent: string) : number {
        for(let i = 0; i < content.length; i++) {
            if(content[i] === lineContent) {
                return i;
            }
        }
        
        return -1;
    }

    /**
     * 
     * @param change 
     * @param markers 
     */
    private contentChanged(change: DocumentChange, markers: PositionMarker[]) : void {
        let marker = this.findMarkerOnChangeLocation(change, markers);
        marker?.updateContent(change.lineContent);
    }

    /**
     * 
     * @param change 
     * @param markers 
     * @returns 
     */
    private findMarkerOnChangeLocation(change: DocumentChange, markers: PositionMarker[]) : PositionMarker|undefined {
        for(const marker of markers) {
            if(marker.position.line === change.lineStart) {
                return marker;
            }
        }
    }
}