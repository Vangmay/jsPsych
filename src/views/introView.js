/**
 * Introduction page of the exp
 * preload the packages and scripts
 */


import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import surveyText from '@jspsych/plugin-survey-text';
import fullscreen from '@jspsych/plugin-fullscreen';
import instructions from '@jspsych/plugin-instructions';


import { s4 } from "./endView.js"
import { s2_img } from "./stimuliView"
import { jsPsych } from "../models/jsPsychModel.js"
import { prepare_data, get_condition } from "../models/conditionManager"
import { fullscreenListener } from "../utilities"
import {text} from "./txtSource"

var s1_0 = {
    type: fullscreen,
    message: '<p id="msg">The experiment will switch to full screen mode when you press the button below (no mobile user allowed)</p>',
    on_load: async function () {
        //detect mobile users and forbid
        var userAgentInfo = navigator.userAgent.toLowerCase();
        //console.log("user agent: ", userAgentInfo);
        var agents = ["android", "iphone",
            "symbianos", "windows phone",
            "ipad", "ipod"];

        agents.forEach((ag, index) => {
            if (userAgentInfo.indexOf(ag) >= 0) {
                document.getElementById('msg').innerHTML = 'Sorry, please switch to a PC or laptop.';
                document.querySelector('#jspsych-fullscreen-btn').style.visibility = "hidden";
                const delay = t => new Promise(resolve => setTimeout(resolve, t));
                delay(2500).then(() => jsPsych.endExperiment());
            }

        })
    },
    on_finish: function () {
        jsPsych.addNodeToEndOfTimeline(s1);
    }
};

//var isFull;//global in introView, if it's fullscreen

// the consent form
//the HTML consent form content should be in another file?
var s1 = {
    type: surveyText,
    preamble: `<p class="p-descript"><b>Hello! </b>${text.welcome1}<br><b>${text.welcome2}</b></br></p>`,
    questions: [
        { prompt: 'Your Prolific ID:', placeholder: '123456', name: 'ID', required: true },
    ],
    button_label: "Yes, I agree to participate in this study",

    //preload the python packages
    on_load: async function () {
        document.querySelector('#jspsych-survey-text-next').disabled = true;//disable the button before the packages loaded
        await prepare_data();
        //listen to exit of fullscreen, if exit pop up alert
        window.addEventListener('resize', fullscreenListener );
        document.querySelector('#jspsych-survey-text-next').disabled = false;

    },

    on_finish: function (data) {
        globalThis.myResultModel.setID(data.response.ID);
        jsPsych.addNodeToEndOfTimeline(s1_instruction);
    }
}


//the instruction
var p1_html = `<img src="assets/example.png" class="img-left-profile"><div class="div-right"><p class="p-intro-title">Instruction</p><p class="p-intro-content">${text.instruction1}</p></div>`;
var p3_html = `<div class="div-full"><p class="p-intro-title">Instruction</p><p class="p-full-content">${text.instruction3}</p></div>`;
var btn_html = '<button class="btn-corner" >%choice%</button>';

var s1_instruction = {
    type: htmlButtonResponse,
    stimulus: p1_html,
    choices:['>>Next'],

    button_html: [btn_html],

    on_finish: function () {
        jsPsych.addNodeToEndOfTimeline(s1_instruction2);
    },
}

var s1_instruction2 = {
    type: htmlButtonResponse,
    stimulus: () => {
        var img = "assets/screen.png";
        var instr = text.instruction2;
        //instruction for slider
        if (get_condition().isSlider) {
            img = "assets/screen_slider.png";
            instr = text.instruction2 + text.instruction2_slider;
        }
        return `<img src=${img} class="img-left-landscape"><div class="div-right"><p class="p-intro-title">Instruction</p><p class="p-intro-content">${instr}</p></div>`;
    },
    choices: ['>>Next'],
    button_html: [btn_html],

    on_finish: function () {
        jsPsych.addNodeToEndOfTimeline(s1_instruction3);
    },
}

var s1_instruction3 = {
    type: htmlButtonResponse,
    stimulus: p3_html,
    choices: ['>>Next'],
    button_html: [btn_html],

    on_finish: function () {
        jsPsych.addNodeToEndOfTimeline(s2_img);
    },
}

export {
    s1,s1_0,
}