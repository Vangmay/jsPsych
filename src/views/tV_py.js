/**
 * Test running python script in js file
 * as intro view
 *
 */

import htmlSliderResponse from '@jspsych/plugin-html-slider-response';
import htmlButtonResponse from '@jspsych/plugin-html-button-response';

import { s4 } from "./endView.js"
import { jsPsych } from "../models/jsPsychModel.js"
import { runPython, passPara, destroyPara } from "../models/jsPyModel.js"
import { saveResult, getResult, setHaiku, getHaiku, addCount, getCount, setData, getData } from "../models/resultModel.js"
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

        globalThis.myResultMoodel.addCount();
    },

    on_finish: async function (data) {
        // save the response of this slide
        data.stimulus = getHaiku();//otherwise it will be the initial stimuli somehow....
        //save results
        data.myResult = globalThis.myResultMoodel.saveResult(
            data.stimulus, data.response, data.rt, startTime
        );

        if (data.response == 0) {
            jsPsych.addNodeToEndOfTimeline(s4);
        }
        else {
            if (getCount() >= 3)
                jsPsych.addNodeToEndOfTimeline(s4)
            else
                jsPsych.addNodeToEndOfTimeline(s_py)

        }

    }
};

// test the scatter plot
// to-be-done:change the distribution over time,destroy previous display?
var s_py2 = {
    type: htmlButtonResponse,
    stimulus: '<p id="stimulus" style="font-size:16px;">waiting for random distribution</p>',
    choices: ['Uniform', 'Gaussian','Poisson'],

    on_load: async function () {
        // set the distribution type
        let para = { "type": "uniform", "mean": 0, "sd": 1 };
        passPara(para);

        runPython(`
            from pyModel import plotModel
            plotModel.plotRandom()
        `).then(() => {
            document.getElementById("stimulus").innerText = "random distribution";
            startTime = Date.now();//start timing after the stimuli is presented
        });

        globalThis.myResultMoodel.addCount();
    },

    on_finish: async function (data) {
        if (getCount() >= 3)
            jsPsych.addNodeToEndOfTimeline(s4)
        else
            jsPsych.addNodeToEndOfTimeline(s_py2)


    }
};

export {
    s_py,
    s_py2,
}