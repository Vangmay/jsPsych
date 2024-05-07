/**
 * Manage API issue from jsPsych
 *
 */

import { initJsPsych } from "jspsych";

var jsPsych;

function initJsp(user_batch) {
    jsPsych = initJsPsych({
        on_finish: () => {
            if (typeof jatos !== 'undefined') {
                // in jatos environment
                jatos.endStudyAndRedirect(`https://app.prolific.com/submissions/complete?cc=${user_batch}`, JSON.stringify(jsPsych.data.get().select('myResult')));
            } else {
                return jsPsych;
            };
        }
    });
}

export {
    jsPsych, initJsp
}
