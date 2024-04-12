/**
 * model that contain results from user and API:
 * - haiku,reaction time
 *
 */
import { runPython, passPara, destroyPara } from "./jsPyModel.js"

export default class ResultModel {
    constructor(database,sim_table) {
        this.ID = 0;
        this.result = [];//result of stimuli, reaction time, choice, etc
        this.next_stimuli = "";
        this.score = 48;//score that is left for user to re-generate
        this.database = database;//database to fetch the stimuli from
        this.stmPool = [];//pool of chosen stimulus
        this.sim_table = sim_table;//similarity table
        this.isDistracted = false;//whether user is distracted during the task
    }

    getID() {
        return ID;
    }

    setID(id) {
        this.ID = id;
    }

    confirmDistracted() {
        this.isDistracted = true;
    }

    //save statistics in the model after the experiment is finished
    saveModel() {
        var model2save = { ID: this.ID, final_score: this.score, is_distracted: this.isDistracted };
        this.result.push(model2save);
        return this.result;//for display
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

    getTable() {
        return this.sim_table;
    }

    addCount() {
        this.score -= 2;
    }

    getCount() {
        return this.score;
    }

    //save user response
    //elements:stimulus,response,response time, time that user can start to response
    //set stm to ""if not using the data.stimulus, set startTime to -1 if using the data.rt directly
    saveResult(stm, accept, rt, startTime) {
        //if pre-loading is involved when measuring time
        if (startTime >= 0)
            rt = Date.now() - startTime;//if pre-loading is involved

        //if stm is from stimulus pool
        var myStm = stm;
        if (stm == "")
            myStm = this.stmPool[this.stmPool.length - 1];

        var myResponse = {
            stimulus: myStm,
            acceptance: accept,
            rspTime: rt
        };
        //save result
        this.result.push(myResponse);
        //return this.result;
    }

    getResult() {
        return this.result;
    }

}