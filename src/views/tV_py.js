/**
 * Test running python script in js file
 * as intro view
 *
 */

import htmlSliderResponse from '@jspsych/plugin-html-slider-response';
import htmlButtonResponse from '@jspsych/plugin-html-button-response';

import { s3 } from "./endView.js"
import { jsPsych } from "../models/jsPsychModel.js"
import { runPython, passPara, destroyPara } from "../models/jsPyModel.js"
import { appendResult, getResult, setHaiku, getHaiku, addCount, getCount, setData, getData } from "../models/resultModel.js"
import { loadFile } from "../utilities"

var startTime;

var s_py = {
    type: htmlSliderResponse,
    stimulus: '<p id="stimulus" style="font-size:16px;">loading...</p>',
    labels: ['0% similarity', '50%', '100% similarity'],

    on_load: async function () {
        var currentStimulus = getHaiku();

        //if blank, initialize. if not, display this stimulus
        if (currentStimulus == "") {
            let text = loadFile('assets/sample.txt');
            const myArray = text.split("0000 0000");//each sample ends with this flag
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
    stimulus: '<p id="stimulus" style="font-size:16px;">searching for similar...</p>',
    choices: ['Accept', 'Re-generate'],

    on_load: async function () {
        // calculate the similar stimulus
        var sim = jsPsych.data.getLastTrialData().values()[0].response / 100;
        let para = { "s1": getHaiku(), "database": getData(), "distance": sim };
        console.log("current parameters in js ", para);
        passPara(para);

        runPython(`
            from pyModel import nlpModel
            nlpModel.find_similar(s1,database,distance)
        `).then((result) => {
            setHaiku(result);
            document.getElementById("stimulus").innerText = result
            destroyPara(para);//destroy the global parameters to avoid memory leak
            console.log("Python says version is ", result);
            startTime = Date.now();//start timing after the stimuli is presented
        });

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