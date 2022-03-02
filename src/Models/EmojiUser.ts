import {Emoji} from "./Emoji";

export class EmojiUser {
    readonly name:      string;
    readonly timestamp: string;
    readonly emojiMark: Emoji;

    /**
     * 
     * @param userName 
     * @param time 
     * @param mark 
     */
    constructor(userName: string, time: string, mark: Emoji) {
        this.name = userName;
        this.timestamp = time;
        this.emojiMark = mark;
    }
} 