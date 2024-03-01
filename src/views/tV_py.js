/**
 * Test running python script in js file
 * as intro view
 *
 */

import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { s3 } from "./endView.js"
import { s2 } from "./stimuliView.js"
import { jsPsych } from "../models/jsPsychModel.js"
import { runPython, passPara } from "../models/jsPyModel.js"

//async function isFileExisted(file) {
//    const stat = await fs.stat(file);
//    console.log(stat.isFile());
//};


function load(name) {
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("text/html;charset=utf-8");//Ä¬ÈÏÎªutf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}


var s_py = {
    type: htmlButtonResponse,
    stimulus: '<p id="stimulus" style="font-size:48px; color:red;">Intro</p>',
    choices: ['Start', 'Exit'],

    on_start: function () {
        let text = load('assets/sample.txt');
        const myArray = text.split("\n");
        console.log(myArray[0]);
        let para = { s1: myArray[0], database: myArray,distance:0.0};

        passPara(para)

        runPython(`
            from pyModel import nlpModel
            from my_js_namespace import s1,database,distance
            nlpModel.find_similar(s1,database,distance)
        `).then((result) => {
            console.log("Python says version is ", result);
        });
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
    s_py,
}