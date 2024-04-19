/**
 * The follow-up survey
 */


import surveyLikert from '@jspsych/plugin-survey-likert';
import fullscreen from '@jspsych/plugin-fullscreen';

import { s4 } from "./endView.js"
import { jsPsych } from "../models/jsPsychModel.js"

//a survey of scales
var likert_scale = [
    "1",
    "2",
    "3",
    "4",
    "5"
];


var s3 = {
    type: surveyLikert,
    preamble: '<p>Choose from 1-5, 1 for strongly disagree and 5 for strongly agree.</p>',
    questions: [
        { prompt: "The title I chose is creative.", name: 'rate_creative', labels: likert_scale, required: true},
        { prompt: "The selection process is intuitive.", name: 'rate_intuitive', labels: likert_scale, required: true  },
    ],
    on_finish: function (data) {
        //save results,don't use start time
        globalThis.myResultModel.saveResult(
            data.trial_type, data.response, data.rt, -1
        );
        jsPsych.addNodeToEndOfTimeline(s4);
    }
};

export {
        s3,
    }