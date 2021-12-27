import Emoji from "./Emoji";
import Gutter from "./Gutter";

export default class EmojiContainer {
    public readonly allEmojis: Map<number, Emoji>;
    public readonly gradeEmojis: Emoji[];

    constructor() {
        this.allEmojis = new Map<number, Emoji>();
        this.gradeEmojis = [];

        const excited = new Emoji('star-struck', '🤩', 'star-struck.svg', "65%", 2, true, 'emojilinting.smily');
        const smily = new Emoji('smile', '🙂', 'slightly-smiling-face.svg', "65%", 0, false, '');
        const meh = new Emoji('thinking', '🤨', 'face-with-raised-eyebrow.svg', "65%", 0, true, 'emojilinting.mehemoji');
        const frowny = new Emoji('frown', '☹️', 'frowning-face.svg', "65%", 0, false, '');
        const angry = new Emoji('thumbs-down', '👎', 'thumbs-down.svg', "65%", -2, true, 'emojilinting.angry');

        this.gradeEmojis.push(excited, meh, angry);

        this.allEmojis.set(1, excited);
        this.allEmojis.set(0.5, smily);
        this.allEmojis.set(0, meh);
        this.allEmojis.set(-0.5, frowny);
        this.allEmojis.set(-1, angry);
    }

    //TODO: refactor
    /**
     * Returns emoji based on provided score
     * @param score 
     * @returns 
     */
    public getEmojiByScore(score: number) : Emoji|undefined {
        if(score > 1) {
            return this.allEmojis.get(1);
        } else if(score > 0.5) {
            return this.allEmojis.get(0.5);
        } else if(score > -0.5) {
            return this.allEmojis.get(0);
        } else if(score >= -1) { 
            return this.allEmojis.get(-0.5);
        } else {
            return this.allEmojis.get(-1);
        }
    }
}