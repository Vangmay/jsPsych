/**
 * The follow-up survey
 */


import surveyLikert from '@jspsych/plugin-survey-likert';
import survey from '@jspsych/plugin-survey';
import surveyText from '@jspsych/plugin-survey-text';
import surveyMultiChoice from '@jspsych/plugin-survey-multi-choice'

import { s4 } from "./endView.js"
import { jsPsych } from "../models/jsPsychModel.js"

//a survey of scales
var likert_scale = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7"
];

//-----------------------------------------------------------------------
//-------------------------user evaluation on titles-------------------------
var s3 = {
    type: surveyLikert,
    preamble: () => {
        //list the shown titles and the question
        var pool = globalThis.myResultModel.getPool();
        var pool_html = pool.map((tt) => ' ' + tt);

        var title_html = '<div>'
        title_html += ' <div class="div-upperLeft" >Here are the generated titles.'
        title_html += '<div class="div-scroll">' + pool_html +'</div>';
        title_html+='<b>In your opinion, they are...</b></div > ';
        title_html += '<div class="div-likert-scale"><p class="p-likert-scale-0">Strongly_disagree Strongly_agree</p><p class="p-likert-scale-1">1 2 3 4 5 6 7</p></div>'
        title_html += '</div > ';
        return title_html;
    },
    questions: [
        { prompt: "creative", name: 'rate_creative', labels: likert_scale, required: true},
        { prompt: "unique", name: 'rate_unique', labels: likert_scale, required: true },
        { prompt: "novel", name: 'rate_novel', labels: likert_scale, required: true },
        { prompt: "accurate", name: 'rate_accurate', labels: likert_scale, required: true },
        { prompt: "practical", name: 'rate_practical', labels: likert_scale, required: true },
        { prompt: "similar", name: 'rate_similar', labels: likert_scale, required: true },
    ],

    on_load: function () {
        //document.querySelector('#jspsych-survey-likert-next').style.position = "relative";
        //document.querySelector('#jspsych-survey-likert-next').style.top = "60px";
    },

    on_finish: function (data) {
        //save results,don't use start time
        globalThis.myResultModel.saveResult(
            data.trial_type, data.response, data.rt, -1
        );
        jsPsych.addNodeToEndOfTimeline(s3_info);
    }
};

var div = document.createElement("div");

//-----------------------------------------------------------------------
//-------------------------age and gender-------------------------
var age = 0;//age of user

var s3_info = {
    type: surveyMultiChoice,
    css_classes: ['questions'],
    questions:
        [
            {
                prompt: '<div style="width:640px;"><div class="div-error" id="error"></div>What is your age in years? Please enter a number only. <input number="number" min="0" max="100" id = "age"></div>How do you describe yourself?',
                name: 'choice_gender',
                options: ['Male','Female','Other'],
                required: true
            }
        ],

    //render age input
    on_start: function () {

    },

    //block continue if user doesn't enter the right age
    on_load() {
        var btn = document.querySelector('#jspsych-survey-multi-choice-next');
        btn.disabled = true;
        var input = document.querySelector('#age');
        input.addEventListener('input', () => {
            age = Number(input.value);
            btn.disabled = true;
            //show error msg
            var errorMsg = document.getElementById('error');
            errorMsg.innerHTML = "Please a number from 16-99"
            errorMsg.style.visibility = "visible";

            if (Number.isInteger(age))
                if (age >= 16 & age <= 99) {
                    btn.disabled = false;
                    errorMsg.style.visibility = "hidden";
                }
            }
        )
    },

    on_finish: function (data) {

        var response = {
            "gender": data.response.choice_gender,
            "age": age,
        }
        // remove the additional components
/*        document.getElementsByClassName("jspsych-display-element")[0].removeChild(div);*/
        //save results,don't use start time
        globalThis.myResultModel.saveResult(
            data.trial_type, response, data.rt, -1
        );
        jsPsych.addNodeToEndOfTimeline(s3_atn);
    }
}

//-----------------------------------------------------------------------
//-------------------------attention check-------------------------
var s3_atn = {
    type: surveyMultiChoice,
    css_classes: ['questions'],
    questions:
        [
            {
                prompt: 'Regardless of your own preferences, please select Gold to this question.<br><b>What color of iPhone would you purchase if you had to buy one tomorrow?</b>',
                name: 'choice_iPhone',
                options: ['Gold', 'Navy', 'Space Grey', 'Silver', 'Red'],
                required: true
            }
        ],
    on_finish: function (data) {
        //save results,don't use start time
        globalThis.myResultModel.saveResult(
            data.trial_type, data.response, data.rt, -1
        );
        jsPsych.addNodeToEndOfTimeline(s4);
    }
}

export {
        s3,
    }