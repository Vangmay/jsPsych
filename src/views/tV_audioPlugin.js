// test the multimedia input via audio response plugin
// the playback trial doesn't work so well

import htmlAudioResponse from '@jspsych/plugin-html-audio-response';

import { jsPsych } from "../models/jsPsychModel.js"
import { s3 } from "./endView.js"
import { s2 } from "./stimuliView.js"
import p5 from 'p5';
import aniTest from './aniTest.js'

var record = {
    type: htmlAudioResponse,
    stimulus: `
        <p>Recording...</p>
    `,
    recording_duration: 3000,
    save_audio_url: true,
    on_finish: function () {
        jsPsych.addNodeToEndOfTimeline(playback);
    }
};

var playback = {
    type: htmlAudioResponse,
    stimulus: () => {
        return jsPsych.data.get().last(1).values()[0].audio_url;
    },
    prompt: '<p>Click to start.</p>',
    choices: ['start', 'exit'],
    on_start: function () {
        new p5(aniTest);
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
    record
}