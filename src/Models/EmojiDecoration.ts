import Gutter from "./Gutter";
import MarkerPosition from "./MarkerPosition";

export default class EmojiDecoration {
    public readonly gutter:     Gutter;
    public readonly position:   MarkerPosition;

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