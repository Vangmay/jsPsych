/**
 * Introduction page of the exp
 * preload the packages and scripts
 */


import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import surveyText from '@jspsych/plugin-survey-text';
import fullscreen from '@jspsych/plugin-fullscreen';

import { s4 } from "./endView.js"
import { s2_img } from "./stimuliView"
import { jsPsych } from "../models/jsPsychModel.js"
import { prepare_data } from "../models/conditionManager"

var s1_0 = {
    type: fullscreen,
    stimulus: '<p id="stimulus" style="font-size:48px;">Welcome to the experiment</p>',

    on_finish: function () {
        jsPsych.addNodeToEndOfTimeline(s1)
    }
};

//var isFull;//global in introView, if it's fullscreen

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
        await prepare_data();
        //listen to exit of fullscreen, if exit pop up alert
        window.addEventListener('resize', (event) => {
            //different browser has different ways of detecting fullscreen
            var userAgent = navigator.userAgent;
            var isFull = window.screenTop && window.screenY;
            if (userAgent.indexOf('Chrome') != -1)
                isFull = !isFull;
            //var isFull = window.innerWidth == screen.width && window.innerHeight == screen.height;//it will fire every time resized
            if (isFull) {
                //globalThis.myResultMoodel.confirmDistracted();//the listen doesn't recognize globalThis
                alert("Please press Fn+F11 to enter fullscreen mode!");
            }
        });
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
        //document.querySelector('#jspsych-html-button-response-button-0 button').disabled = true;
        //document.querySelector('#jspsych-html-button-response-button-0 button').disabled = false;
    },

    on_finish: function () {
        jsPsych.addNodeToEndOfTimeline(s2_img);
    },
}

export {
    s1,s1_0,
}