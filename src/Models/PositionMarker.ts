import MarkerPosition from "./MarkerPosition";
import EmojiScore from "./EmojiScore";
import * as vscode from 'vscode';
import internal = require("stream");
import { statSync } from "fs";
import { stringify } from "querystring";
import { Type } from "class-transformer";

export default class PositionMarker {
    private _position:      MarkerPosition;
    private _content:       string;
    private _score:         EmojiScore;
    private _softDelete:    boolean;

    /**
     * 
     * @param content 
     * @param document 
     * @param line 
     */
    constructor(content: string, position: MarkerPosition, deleted: boolean = false) {
        this._content       = content;
        this._position      = position;
        this._score         = new EmojiScore();
        this._softDelete    = deleted;
    }

    /**
     * Adds new user score, if user already posted a score, its changed to the new value
     * @param user 
     * @param score 
     * @returns 
     */
    public addNewScore(user: string, score: number) : number {
        this._score.addScore(user, score);
        return this._score.calculateAverage();
    }

    /**
     * Removes users score
     * @param user 
     * @returns 
     */
    public removeScore(score: number) : number {
        this._score.removeScore(score);
        return this._score.calculateAverage();
    }

    /**
     * 
     * @param user 
     * @returns 
     */
    public removeScoreByUser(user: string): number {
        const score = this._score.getUsersScore(user);
        this._score.removeScore(score);
        return this._score.calculateAverage();
    }

    /**
     * 
     * @param newContent 
     */
    public updateContent(newContent: string) : void {
        this._content = newContent;
    }

    /**
     * Is called when we don't want to display this marker anymore
     */
    public softDelete() : void {
        this._softDelete = true;
    }

    /**
     * Is called when marker content is found in the document again or another score is added
     */
    public enabledMarker() : void {
        this._softDelete = false;
    }

    /**
     * @returns 
     */
    public getStatistics() : Map<number, number> {
        return this._score.getScoreOccurences();
    }

    public get position() : MarkerPosition {
        return this._position;
    }

    public get content() : string {
        return this._content;
    }

    public get score() : EmojiScore {
        return this._score;
    }

    public get deleted() : boolean {
        return this._softDelete;
    }
}