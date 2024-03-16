/**
 * Stimuli page of the exp
 * - show haiku and choose accept or not
 */

import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import imageButtonResponse from '@jspsych/plugin-image-button-response';
import surveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import { getHaiku_API } from "../APIs/openAI.js"
import { s3 } from "./surveyView"
import { jsPsych } from "../models/jsPsychModel.js"
import { runPython, passPara, destroyPara } from "../models/jsPyModel.js"

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
async function calTitle(initIndex,sim) {
    var pool = globalThis.myResultMoodel.getPool();
    var data = globalThis.myResultMoodel.getData();

    if (pool.length <= 0) {//it's the first title
        var title = data[initIndex];
        document.getElementById('title').innerHTML = title;
        globalThis.myResultMoodel.appendPool(title);//save this title in stimulus pool
    }
    else {
        var last_title = pool[pool.length - 1];
        let para = { "s1": last_title, "database": data, "distance": sim };
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
    prompt: '<div style = "position:relative; bottom: 50px"><p style="font-size:16px; color: grey;">New title</p><p id="title" style="font-size:24px;">loading...</p></div >',

    //render some additional components
    on_start: function () {
        //register template for components
        var html1 = '<div class="div-score" id="remain"></div>';//html for the remaining points
        html1 +='<div class="div-pool" id="pool"></div>';//html for title pools

        div.innerHTML = html1;
        document.getElementsByClassName("jspsych-display-element")[0].appendChild(div);//put the template on display

        // get actual data of components
        document.getElementById('remain').innerHTML = "Remaining points " + globalThis.myResultMoodel.getCount();
        var pool = globalThis.myResultMoodel.getPool();
        //put the pool list into seperate lines
        document.getElementById('pool').innerHTML = pool.map((tt) => '<br>' + tt + '</br>');

    },

    on_load: async function () {
        await calTitle(5,0.05);//get or calculate title
    },

    on_finish: function (data) {
        // remove the additional components
        document.getElementsByClassName("jspsych-display-element")[0].removeChild(div);

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
    questions: [
        {
            prompt: "Select the painting title you think that is the most creative.",
            name: 'choice_title',
            options: function () {
                return globalThis.myResultMoodel.getPool();
            },
            required: true
        },
    ],
    on_finish: function (data) {
        jsPsych.addNodeToEndOfTimeline(s3);
    }
};

export {
    s2,
    s2_img
}


