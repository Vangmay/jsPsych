/**
 * Ending page of the exp
 *
 */

import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import { jsPsych } from "../models/jsPsychModel.js"

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

// show this page within T ms
var s4 = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<p class="p-descript">Thank you for the participation. Here are your choices.</p>',
    prompt: function () {
        var result = globalThis.myResultMoodel.getResult();
        return showResult(result);
    },
    trial_duration: 5000,
    on_finish:function (data) {
        data.myResult =globalThis.myResultMoodel.saveModel();//save statistics in the model after the experiment is finished
    },
};

export {
    s4
}