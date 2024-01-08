/**
 * Stimuli page of the exp
 * - show haiku and choose accept or not
 */
import { setResult, getResult,setHaiku, getHaiku, addCount, getCount } from "../models/resultModel.js"
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { getHaiku_API } from "../APIs/openAI.js"
import { s3 } from "./endView.js"
import { jsPsych } from "../models/jsPsychModel.js"



var s2 = {
    type: htmlButtonResponse,
    choices: ['Accept', 'Re-generate'],
    stimulus: function () {
        return getHaiku();
    },
    on_start: async function getStimuli() {
        var next_haiku = await getHaiku_API();
        setHaiku(next_haiku);
        console.log(next_haiku);
        addCount();
    },

    on_finish: function (data) {
        addRespFromButton(data);
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

function addRespFromButton(data) {
    var accept = "rejected";
    if (data.response == 0)
        accept = "accepted";
    var result =getResult()+ data.stimulus + "<br>"
        + accept + " " + data.rt + "ms"
        + "<br><br>";
    setResult(result);
}

export {
    s2
}


