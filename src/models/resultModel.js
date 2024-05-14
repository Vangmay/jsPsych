/**
 * model that contain results from user and API:
 * - haiku,reaction time
 *
 */
import { runPython, passPara, destroyPara } from "./jsPyModel.js"
import { get_condition, appendSimilarity } from "../models/conditionManager"
import { getSimilar } from "../utilities"
import { getTitle_API } from "../APIs/openAI"

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
        this.feedback = '';//feedback from user after the exp
    }

    getID() {
        return ID;
    }

    setID(id) {
        this.ID = id;
    }

    setFeedback(fb) {
        this.feedback = fb;
    }

    confirmDistracted() {
        this.isDistracted = true;
    }

    //save statistics in the model after the experiment is finished
    saveModel() {
        var model2save = {
            ID: this.ID,
            final_score: this.score,
            is_distracted: this.isDistracted,
            feedback: this.feedback,
        };
        //console.log("model2save: ", model2save);
        this.result.push(model2save);
        return this.result;//for display
    }

    appendPool(newStm) {
        //if (this.stmPool.indexOf(newStm) == -1)//debouncing, if the title hasn't appeared before, add to pool
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

    //get the initial title or calculate similar title
    //initIndex:the first title to pick from the database, 0-24
    //delayTime:ms, like [3000,5000]->delay for 3-5s after calculation
    async calTitle(initIndex,delayTime) {
        return new Promise((resolve) => {
            var pool = this.stmPool;
            var data = this.database;
            var table = this.sim_table;

            //it's the first title
            if (pool.length <= 0) {
                var title = data[initIndex];
                resolve(title);
            }

            else {
                var last_title = pool[pool.length - 1];
                if (get_condition().isSlider)
                    var sim_queue = [...get_condition().similarity];//deep copy so that the actuall queue is not popped later
                else
                    var sim_queue = get_condition().similarity;
                let para = {};

                //choose similarity measurement algorithms
                if (get_condition().use_table) {
                    para = { "s1": last_title, "database": table, "similarity": sim_queue.pop(), "pool": pool };
                    if (get_condition().isSlider)
                        para.similarity = 1 - para.similarity;//0 in slider is similar, 1 is different
                    const result = getSimilar(para);
                    //console.log("Similar title counted from table:", result);
                    //pretend it's loading
                    const delay = t => new Promise(resolve => setTimeout(resolve, t));
                    delay(Math.random() * (delayTime[1] - delayTime[0]) + delayTime[0]).then(() => resolve(result));
                }
                else {
                    para = { "s1": last_title, "database": data, "similarity": sim_queue.pop(), "pool": pool };//the distance is actually similarity
                    //convert the similarity value to the temperature (1-2, it start with 1 since <1 in temperature is very similar)
                    //0 in slider is similar, 1 is different
                    var temperature = para.similarity * 1 + 1;

                    //without slider, similarity is a value of 0-1 which measures the similarity.
                    if (!get_condition().isSlider)
                        temperature = 2 - 2*para.similarity;
                    getTitle_API(last_title, temperature).then((result) => {
                        //console.log("Similar title fetched real-time:", temperature);
                        resolve(result);
                    });

                    //if (get_condition().isSlider)
                    //    para.similarity = 1 - para.similarity;//0 in slider is similar, 1 is different
                    //passPara(para);
                    //runPython(`
                    //        from pyModel import nlpModel
                    //        nlpModel.find_similar(s1,database,similarity,pool)
                    //    `).then((result) => {
                    //    console.log("Similar title counted real-time:", result);
                    //    destroyPara(para);//destroy the global parameters to avoid memory leak
                    //    resolve(result);
                    //});
                }
            }
        });
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