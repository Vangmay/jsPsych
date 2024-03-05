/**
 * Test running python script in js file
 * as intro view
 *
 */

import htmlSliderResponse from '@jspsych/plugin-html-slider-response';
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { s3 } from "./endView.js"
import { jsPsych } from "../models/jsPsychModel.js"
import { runPython, passPara } from "../models/jsPyModel.js"
import { appendResult, getResult, setHaiku, getHaiku, addCount, getCount, setData, getData } from "../models/resultModel.js"

var startTime;

function load(name) {
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("text/html;charset=utf-8");
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}


var s_py = {
    type: htmlSliderResponse,
    stimulus: '<p id="stimulus" style="font-size:24px;">loading...</p>',
    labels: ['0% similarity', '50%', '100% similarity'],

    on_load: async function () {
        var currentStimulus = getHaiku();

        //if blank, initialize. if not, display this stimulus
        if (currentStimulus == "") {
            let text = load('assets/sample.txt');
            const myArray = text.split("\n");
            setData(myArray);
            document.getElementById("stimulus").innerText = myArray[0];
            setHaiku(myArray[0]);
        }
        else {
            document.getElementById("stimulus").innerText = currentStimulus;
        }
        
        startTime = Date.now();//start timing after the haiku is presented
    },

    on_finish: async function (data) {
        // save the response of this slide
        data.stimulus = getHaiku();//otherwise it will be the initial stimuli somehow....
        var myResponse = {
            stimulus: data.stimulus,
            acceptance: data.response / 100,
            rspTime: Date.now() - startTime
        };
        //save result
        appendResult(myResponse);
        data.myResult = getResult();

        //jump to next slide
        jsPsych.addNodeToEndOfTimeline(s_py1);

    }
};

var s_py1 = {
    type: htmlButtonResponse,
    stimulus: '<p id="stimulus" style="font-size:24px;">loading...</p>',
    choices: ['Accept', 'Re-generate'],

    on_load: async function () {
        var sim = jsPsych.data.getLastTrialData().values()[0].response / 100;
        let para = { s1: getHaiku(), database: getData(), distance: sim };
        passPara(para);

        runPython(`
            from pyModel import nlpModel
            from my_js_namespace import s1,database,distance
            nlpModel.find_similar(s1,database,distance)
        `).then((result) => {
            setHaiku(result);
            document.getElementById("stimulus").innerText = result
            console.log("Python says version is ", result);

        });

        startTime = Date.now();//start timing after the haiku is presented
        addCount();
    },

    on_finish: async function (data) {
        // save the response of this slide
        data.stimulus = getHaiku();//otherwise it will be the initial stimuli somehow....
        var myResponse = {
            stimulus: data.stimulus,
            acceptance: data.response,
            rspTime: Date.now() - startTime
        };
        //save result
        appendResult(myResponse);
        data.myResult = getResult();

        if (data.response == 0) {
            jsPsych.addNodeToEndOfTimeline(s3);
        }
        else {
            if (getCount() >= 3)
                jsPsych.addNodeToEndOfTimeline(s3)
            else
                jsPsych.addNodeToEndOfTimeline(s_py)

        }

    }
};

export {
    s_py,
}