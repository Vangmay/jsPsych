/**
 * Stimuli page of the exp
 * - show haiku and choose accept or not
 */
import { appendResult, getResult,setHaiku, getHaiku, addCount, getCount } from "../models/resultModel.js"
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import imageButtonResponse from '@jspsych/plugin-image-button-response';
import surveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import { getHaiku_API } from "../APIs/openAI.js"
import { s3 } from "./surveyView"
import { jsPsych } from "../models/jsPsychModel.js"

var startTime;

// haiku-acceptance interaction
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
            jsPsych.addNodeToEndOfTimeline(s4);
        }
        else {
            if (getCount() >= 3)
                jsPsych.addNodeToEndOfTimeline(s4)
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

// image-title match

// show image and title
var s2_img = {
    type: imageButtonResponse,
    stimulus: 'assets/img.png',
    stimulus_height: 300,
    button_html: ['<button class="jspsych-btn" style = "position:relative; top: 100px">%choice%</button>', '<button class="jspsych-btn" style = "position:relative; top: 100px">%choice%</button>'],
    choices: ['STOP', 'Generate New Title'],
    prompt: '<div style = "position:relative; bottom: 50px"><p style="font-size:16px; color: grey;">New title</p><p style="font-size:24px;">Infinity and beyond</p></div>',

    //render some additional components
    on_load: function () {
        var html = '<div class="div-score"><p>Remaining points</p></div>';
        var div = document.createElement("div");
        div.innerHTML = html;
        document.getElementsByClassName("jspsych-display-element")[0].appendChild(div);
    },

    on_finish: function (data) {
        if (data.response == 0) {
            jsPsych.addNodeToEndOfTimeline(s2_choose);
        }
        else {
            jsPsych.addNodeToEndOfTimeline(s2_img);
        }
    },
}

// choose the ideal title
var s2_choose = {
    type: surveyMultiChoice,
    questions: [
        {
            prompt: "Select the painting title you think that is the most creative.",
            name: 'choice_title',
            options: ['Infinity and beyond', 'Solar System', 'Eggplant'],
            required: true
        },
    ],
    on_finish: function (data) {
        jsPsych.addNodeToEndOfTimeline(s3);
    }
};

export {
    s2,
    s2_img
}


