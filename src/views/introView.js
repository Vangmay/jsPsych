/**
 * Introduction page of the exp
 * preload the packages and scripts
 */


import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import surveyText from '@jspsych/plugin-survey-text';
import { s4 } from "./endView.js"
import { s2_img } from "./stimuliView"
import { init_py } from "../models/jsPyModel.js"
import { jsPsych } from "../models/jsPsychModel.js"
import { runPython} from "../models/jsPyModel.js"
import { loadFile } from "../utilities"
import ResultModel from "../models/ResultModel.js"

var s1_0 = {
    type: htmlButtonResponse,
    stimulus: '<p id="stimulus" style="font-size:48px; color:red;">Intro</p>',
    choices: ['Start', 'Exit'],

    on_finish: function () {
        globalThis.myResultMoodel = new ResultModel([]);//initialize an empty model
        jsPsych.addNodeToEndOfTimeline(s4)
    }
};

// the consent form
//the HTML consent form content should be in another file?
var s1 = {
    type: surveyText,
    preamble: '<p class="p-descript"><b>Hello! </b>Our studies are purely for academic purposes. The results will be made available to the public in scientific journals. You are free to withdraw from the study without any penalty to you. Your data will remain completely confidential and will not be released in any way that can be linked to you.<br><b>I declare being of age and accept of free will, after having read and fully understood the above paragraphs, to participate in the study.</b></br></p>',
    questions: [
        { prompt: 'Your Prolific ID:', placeholder: '123456', name: 'ID', required: true },
    ],
    button_label: "Yes, I agree to participate in this study",

    //preload the python packages
    on_load: async function () {
        document.querySelector('#jspsych-survey-text-next').disabled = true;//disable the button before the packages loaded
        await init_py();
        //load the database of titles
        let text = loadFile('assets/sample.txt');
        const myArray = text.split("\r\n");//each sample ends with this flag
        globalThis.myResultMoodel = new ResultModel(myArray);//initialize the model with database

        document.querySelector('#jspsych-survey-text-next').disabled = false;
    },

    on_finish: function (data) {
        globalThis.myResultMoodel.setID(data.response.ID);
        jsPsych.addNodeToEndOfTimeline(s1_instruction);
    }
}

//the instruction
var s1_instruction = {
    type: htmlButtonResponse,
    stimulus: '<p id="stimulus" style="font-size:48px; color:red;">Instruction</p>',
    prompt: '<p style="width:70%; margin:auto; text-align:left;">Please select the most creative title for the coming image. If not satisfied with the proposed title, you may re-generate one. Note: each generation of title costs.</p>',
    choices: ['Start'],

    on_load: async function () {
        document.querySelector('#jspsych-html-button-response-button-0 button').disabled = true;

        //run the python script once for preloading
        await runPython(`
            from pyModel import nlpModel
            nlpModel.find_similar("apple",["orange","apple banana"],0.1)
        `);
        document.querySelector('#jspsych-html-button-response-button-0 button').disabled = false;
    },

    on_finish: function () {
        jsPsych.addNodeToEndOfTimeline(s2_img);
    },
}

export {
    s1,s1_0,
}