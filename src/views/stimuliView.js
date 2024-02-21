/**
 * Stimuli page of the exp
 * - show haiku and choose accept or not
 */
import { appendResult, getResult,setHaiku, getHaiku, addCount, getCount } from "../models/resultModel.js"
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { getHaiku_API } from "../APIs/openAI.js"
import { s3 } from "./endView.js"
import { jsPsych } from "../models/jsPsychModel.js"

var startTime;

var s2 = {
    type: htmlButtonResponse,
    choices: ['Accept', 'Re-generate'],
    stimulus: '<p id="stimulus" style="font-size:24px;">loading...</p>',
    on_start: async function getStimuli() {
        var next_haiku = await getHaiku_API();
        setHaiku(next_haiku);

        //enable button and s
        document.getElementById("stimulus").innerText = next_haiku;
        document.querySelector('#jspsych-html-button-response-button-0 button').disabled = false;
        document.querySelector('#jspsych-html-button-response-button-1 button').disabled = false;

        startTime = Date.now();//start timing after the haiku is presented
        //console.log(startTime);
        console.log(next_haiku);

        addCount();
    },

    on_load: function () {
        //idk why it should be on_load to disable the button, but don't move to on_start as it will report undefined!
        document.querySelector('#jspsych-html-button-response-button-0 button').disabled = true;
        document.querySelector('#jspsych-html-button-response-button-1 button').disabled = true;
    },

    on_finish: function (data) {
        addRespFromButton(data, Date.now() - startTime);
        if (data.response == 0) {
            jsPsych.addNodeToEndOfTimeline(s3);
        }
        else {
            if (getCount() >= 3)
                jsPsych.addNodeToEndOfTimeline(s3)
            else
                jsPsych.addNodeToEndOfTimeline(s2)

        }
    }
};

function addRespFromButton(data,rt) {
    var accept = "rejected";
    if (data.response == 0)
        accept = "accepted";
    data.stimulus = getHaiku();//otherwise it will be the initial stimuli somehow....
    var result = {
        stimulus: data.stimulus,
        acceptance: accept,
        rspTime:rt
    };
    appendResult(result);
    data.myResult = getResult();
    //console.log(data.myResult);
}

export {
    s2
}


