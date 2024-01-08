/**
 * Introduction page of the exp
 * issue: why API is called 3 times with the exactly same settings as stimuli view
 */


import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import { getHaiku_API } from "../APIs/openAI.js"
import { s3 } from "./endView.js"
import {s2} from "./stimuliView.js"
import { jsPsych } from "../models/jsPsychModel.js"
import { setHaiku } from "../models/resultModel.js"



const hello_trial = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: 'Hello world!'
}

var s1 = {
    type: htmlButtonResponse,
    stimulus: '<p style="font-size:48px; color:red;">Intro</p>',
    choices: ['Start', 'Exit'],

    //prepare haiku for next slide
    on_start: async function getStimuli() {
        var next_haiku = await getHaiku_API();
        setHaiku(next_haiku);
        console.log(next_haiku);
    },

    on_finish: function (data) {
        if (data.response == 0) {
            jsPsych.addNodeToEndOfTimeline(s2);
            console.log("jump to s2")
        }
        else {
            jsPsych.addNodeToEndOfTimeline(s3)
        }
    }
};


export {
    s1,
    hello_trial,
}