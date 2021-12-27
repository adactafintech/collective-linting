import Emoji from "./Emoji";

export default class EmojiUser {
    name: string;
    timestamp: string;
    emojiMark: Emoji;

    /**
     * 
     * @param userName 
     * @param time 
     * @param mark 
     */
    constructor(userName: string, time: string, mark: Emoji) {
        this.name = userName;
        this.timestamp = '';
        this.timestamp = time;
        this.emojiMark = mark;
    }
} 