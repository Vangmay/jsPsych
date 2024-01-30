/**
 * Introduction page of the exp
 * issue: why API is called 3 times with the exactly same settings as stimuli view
 */


import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { s3 } from "./endView.js"
import {s2} from "./stimuliView.js"
import { jsPsych } from "../models/jsPsychModel.js"


var s1 = {
    type: htmlButtonResponse,
    stimulus: '<p id="stimulus" style="font-size:48px; color:red;">Intro</p>',
    choices: ['Start', 'Exit'],

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
}