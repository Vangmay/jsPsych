/**
 * Ending page of the exp
 *
 */
//import { getResult } from "../models/resultModel.js"
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
    stimulus: '<p style="font-size:48px; color:red;">Final page</p>',
    prompt: function () {
        var result = getResult();
        return showResult(result);
    },
    trial_duration: 5000,
};

export {
    s4
}