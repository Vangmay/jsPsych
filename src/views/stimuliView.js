/**
 * Stimuli page of the exp
 * - show haiku and choose accept or not
 */

import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import imageButtonResponse from '@jspsych/plugin-image-button-response';
import surveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import htmlSliderResponse from '@jspsych/plugin-html-slider-response';

import { getHaiku_API } from "../APIs/openAI.js"
import { s3 } from "./surveyView"
import { jsPsych } from "../models/jsPsychModel.js"
import { runPython, passPara, destroyPara } from "../models/jsPyModel.js"
import { get_condition} from "../conditionManager"

var startTime;
var div = document.createElement("div");//div for additional components

// haiku-acceptance interaction
var s2 = {
    type: htmlButtonResponse,
    choices: ['Accept', 'Re-generate'],
    stimulus: '<p id="stimulus" style="font-size:24px;">loading...</p>',
    on_start: async function getStimuli() {
        var next_haiku = await getHaiku_API();
        setHaiku(next_haiku);

        //enable button and s
        document.getElementById("stimulus").innerText = next_haiku;
        document.querySelector('#jspsych-html-button-response-button-0 button').disabled = false;
        document.querySelector('#jspsych-html-button-response-button-1 button').disabled = false;

        startTime = Date.now();//start timing after the haiku is presented
        //console.log(startTime);
        console.log(next_haiku);

        addCount();
    },

    on_load: function () {
        //idk why it should be on_load to disable the button, but don't move to on_start as it will report undefined!
        document.querySelector('#jspsych-html-button-response-button-0 button').disabled = true;
        document.querySelector('#jspsych-html-button-response-button-1 button').disabled = true;
    },

    on_finish: function (data) {
        addRespFromButton(data, Date.now() - startTime);
        if (data.response == 0) {
            jsPsych.addNodeToEndOfTimeline(s4);
        }
        else {
            if (getCount() >= 3)
                jsPsych.addNodeToEndOfTimeline(s4)
            else
                jsPsych.addNodeToEndOfTimeline(s2)

        }
    }
};

function addRespFromButton(data,rt) {
    var accept = "rejected";
    if (data.response == 0)
        accept = "accepted";
    data.stimulus = getHaiku();//otherwise it will be the initial stimuli somehow....
    var result = {
        stimulus: data.stimulus,
        acceptance: accept,
        rspTime:rt
    };
    appendResult(result);
    data.myResult = getResult();
    //console.log(data.myResult);
}

// image-title match

//get the initial title or calculate similar title
//set the title component to be the fetched title
//sim:similarity, a number 0-1;initIndex:the first title to pick from the database, 0-24
//this function cannot be in model as the asynchronization is not blocked....
async function calTitle(initIndex) {
    var pool = globalThis.myResultMoodel.getPool();
    var data = globalThis.myResultMoodel.getData();

    if (pool.length <= 0) {//it's the first title
        var title = data[initIndex];
        document.getElementById('title').innerHTML = title;
        globalThis.myResultMoodel.appendPool(title);//save this title in stimulus pool
    }
    else {
        var last_title = pool[pool.length - 1];
        let para = { "s1": last_title, "database": data, "distance": get_condition().similarity.pop() };
        console.log("current parameters in js ", para);
        passPara(para);

        //calculate the title
        runPython(`
                    from pyModel import nlpModel
                    nlpModel.find_similar(s1,database,distance)
                `).then((result) => {
                    console.log("Python says ", result);
                    destroyPara(para);//destroy the global parameters to avoid memory leak
                    globalThis.myResultMoodel.appendPool(result);//save this title in stimulus pool
                    document.getElementById('title').innerHTML = result;
                    startTime = Date.now();//start timing after the stimuli presented
                });
    }
}

// show image and title
var s2_img = {
    type: imageButtonResponse,
    stimulus: 'assets/img.png',
    stimulus_height: 300,
    button_html: ['<button class="jspsych-btn" style = "position:relative; top: 100px">%choice%</button>', '<button class="jspsych-btn" style = "position:relative; top: 100px">%choice%</button>'],
    choices: ['STOP', 'Generate New Title'],
    prompt: '<div class="div-title"><p id="above_title" class="p-aboveTitle">New title</p><p id="title" style="font-size:24px;">loading...</p></div >',

    //render some additional components
    on_start: function () {
        //register template for components
        var html1 = '<div class="div-score" id="remain"></div>';//html for the remaining points
        html1 += '<div class="div-pool" id="pool"></div>';//html for title pools
        //hints for buttons
        html1 +='<div class="div-hint" id="hint_stop">I have made up my mind.</div>'
        html1 += '<div class="div-hint" id="hint_gen">Use 2 scores to generate another title.</div>'

        div.innerHTML = html1;
        document.getElementsByClassName("jspsych-display-element")[0].appendChild(div);//put the template on display

        // get actual data of components
        //score component
        document.getElementById('remain').innerHTML = "Remaining points " + globalThis.myResultMoodel.getCount();
        //title pool
        if (get_condition().bank_position == "corner") {
            var pool = globalThis.myResultMoodel.getPool();
            var html_pool = pool.map((tt) => '<br>' + tt + '</br>');//put the pool list into seperate lines
            html_pool = '<p>Title bank\n</p>'+html_pool.join("");
            document.getElementById('pool').innerHTML = html_pool;
        }

    },

    on_load: async function () {
        await calTitle(5);//get or calculate title
        //hint below button
        document.querySelector('#jspsych-image-button-response-button-0 button').addEventListener("mouseover", () => {
            document.getElementById('hint_stop').style.visibility = "visible";
        });
        document.querySelector('#jspsych-image-button-response-button-0 button').addEventListener("mouseout", () => {
            document.getElementById('hint_stop').style.visibility = "hidden";
        });
        document.querySelector('#jspsych-image-button-response-button-1 button').addEventListener("mouseover", () => {
            document.getElementById('hint_gen').style.visibility = "visible";
        });
        document.querySelector('#jspsych-image-button-response-button-1 button').addEventListener("mouseout", () => {
            document.getElementById('hint_gen').style.visibility = "hidden";
        });
        //display the most recent titles as prompt
        if (get_condition().bank_position == "center") {
            var pool = globalThis.myResultMoodel.getPool();
            var last_titles = pool.slice(-3);//latest 3 titles
            var html_titles = last_titles.map((tt) => tt + '\t');
            html_titles = "..."+html_titles.join(",")+"...";
            document.getElementById('above_title').innerHTML = html_titles;
        }

    },

    on_finish: function (data) {
        // remove the additional components
        document.getElementsByClassName("jspsych-display-element")[0].removeChild(div);
        //save results:don't use the data.stimulus,use startTime
        data.myResult = globalThis.myResultMoodel.saveResult(
            "", data.response, data.rt, startTime
        );
        //jump to current page or choosing page
        if (globalThis.myResultMoodel.getCount() <= 0)
            jsPsych.addNodeToEndOfTimeline(s2_choose);
        else {
            if (data.response == 0) {//if subject choose to stop
                jsPsych.addNodeToEndOfTimeline(s2_choose);
            }
            else {//if subject choose to generate
                globalThis.myResultMoodel.addCount();//add the times of generation, in this case, minus 2 score
                jsPsych.addNodeToEndOfTimeline(s2_img);
            }
        }
    },
}

// choose the ideal title
var s2_choose = {
    type: surveyMultiChoice,
    css_classes: ['questions'],
    button_html: ['<button class="jspsych-btn" style = "position:fixed; bottom: 20px;right:60px;">%choice%</button>'],
    questions: 
        [
            {
                prompt: 'Select the painting title you think that is the most creative',
                name: 'choice_title',
                options: function () {
                    return globalThis.myResultMoodel.getPool();
                },
                required: true
            }
        ],

    //render some additional components
    on_start: function () {
        var html1 = '<img src="assets/img.png" class="img-choice">';//html for the image
        div.innerHTML = html1;
        document.getElementsByClassName("jspsych-display-element")[0].appendChild(div);//put the template on display

    },

    on_finish: function (data) {
        // remove the additional components
        document.getElementsByClassName("jspsych-display-element")[0].removeChild(div);
        //save results,don't use start time
        data.myResult = globalThis.myResultMoodel.saveResult(
            data.trial_type, data.response.choice_title, data.rt, -1
        );
        jsPsych.addNodeToEndOfTimeline(s3);
    }
};

export {
    s2,
    s2_img
}


