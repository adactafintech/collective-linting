import {Emoji} from "./Emoji";
import {MarkerPosition} from "./MarkerPosition";

export class UIEmoji {
    readonly emoji:      Emoji;
    readonly position:   MarkerPosition;

    /**
     * @param emoji 
     * @param position 
     */
    constructor(emoji: Emoji, position: MarkerPosition) {
        this.emoji      = emoji;
        this.position   = position;
    }
}