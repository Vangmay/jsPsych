/**
 * model that contain results from user and API:
 * - haiku,reaction time
 *
 */
import { runPython, passPara, destroyPara } from "./jsPyModel.js"

export default class ResultModel {
    constructor(database) {
        this.result = [];//result of stimuli, reaction time, choice, etc
        this.next_stimuli = "";
        this.score = 6;//score that is left for user to re-generate
        this.database = database;//database to fetch the stimuli from
        this.stmPool = [];//pool of chosen stimulus
    }

    appendPool(newStm) {
        this.stmPool.push(newStm);
    }

    getPool() {
        return this.stmPool;
    }

    setHaiku(haiku) {
        this.next_stimuli = haiku;
    }

    getData() {
        return this.database;
    }

    addCount() {
        this.score -= 2;
    }

    getCount() {
        return this.score;
    }


    appendResult(r) {
        this.result.push(r);
    }

    getResult() {
        return this.result;
    }

}