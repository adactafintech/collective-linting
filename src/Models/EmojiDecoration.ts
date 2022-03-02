import {Gutter} from "./Gutter";
import {MarkerPosition} from "./MarkerPosition";

export class EmojiDecoration {
    readonly gutter:     Gutter;
    readonly position:   MarkerPosition;

    /**
     * 
     * @param decoration 
     * @param position 
     */
    constructor(decoration: Gutter, position: MarkerPosition) {
        this.gutter     = decoration;
        this.position   = position;
    }
}