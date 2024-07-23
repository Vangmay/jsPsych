/**
 * Ending page of the exp
 *
 */

import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import fullscreen from '@jspsych/plugin-fullscreen';
import surveyText from '@jspsych/plugin-survey-text';


import { jsPsych } from "../models/jsPsychModel.js"
import { get_condition } from "../models/conditionManager"
import { fullscreenListener } from "../utilities"
import { text } from "./txtSource"

// display result in a format
function showResult(result) {
    var displayR = "";
    result.forEach((rr) => {
/*        console.log(rr);*/
        displayR += rr.stimulus + "<br>"
            + rr.acceptance + " " + rr.rspTime + "ms"
            + "<br><br>";
    })
    return displayR;
}

//-----------------------------------------------------------------------
//------------exit fullscreen after the results are shown-------------------------
var exit_fullscreen = {
    type: fullscreen,
    fullscreen_mode: false,
    delay_after: 0,
}

//-----------------------------------------------------------------------
//-------------------------additional feedback-------------------------
var s4 = {
    type: surveyText,
    questions: [
        { prompt: `<p class="p-descript">${text.endQuestion}.</p>`, name: 'feedback',rows:4,columns:70},
    ],
    button_label: 'submit',

    on_finish: function (data) {
        globalThis.myResultModel.setFeedback(data.response.feedback);
        data.myResult = globalThis.myResultModel.saveModel();//save statistics and user response
        //save experiment conditions
        data.myResult.push(get_condition());
        //console.log("similarity length", get_condition().similarity.length)
        //exit fullscreen
        window.removeEventListener('resize', fullscreenListener);
        jsPsych.addNodeToEndOfTimeline(exit_fullscreen);

    },
};



export {
    s4
}