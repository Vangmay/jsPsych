// test the multimedia input via p5.js
// test as an intro slide
// the height of the ball is determined by the amplitude of the mic sound

import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { s4 } from "./endView.js"
import { s2 } from "./stimuliView.js"
import { jsPsych } from "../models/jsPsychModel.js"
import p5 from 'p5';
import "../p5.sound";
import "../grafica";
import aniTest from './aniTest.js'

var s_p5 = {
    type: htmlButtonResponse,
    stimulus: '<p id="stimulus" style="font-size:48px; color:red;">Intro</p>',
    choices: ['Start', 'Exit'],

    on_start: function () {
        new p5(aniTest);
    },

    on_finish: function (data) {
        if (data.response == 0) {
            jsPsych.addNodeToEndOfTimeline(s2);
            console.log("jump to s2")
        }
        else {
            jsPsych.addNodeToEndOfTimeline(s4)
        }
    }
};

export {
    s_p5,
}