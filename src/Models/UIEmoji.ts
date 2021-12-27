import Emoji from "./Emoji";
import Gutter from "./Gutter";
import MarkerPosition from "./MarkerPosition";

export default class UIEmoji {
    emoji:      Emoji;
    position:   MarkerPosition;

    /**
     * @param emoji 
     * @param position 
     */
    constructor(emoji: Emoji, position: MarkerPosition) {
        this.emoji      = emoji;
        this.position   = position;
    }

}