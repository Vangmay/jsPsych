/**
 * Test running python script in js file
 * as intro view
 *
 */

import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { s3 } from "./endView.js"
import { s2 } from "./stimuliView.js"
import { jsPsych } from "../models/jsPsychModel.js"
import { runPython } from "../models/jsPyModel.js"

//async function isFileExisted(file) {
//    const stat = await fs.stat(file);
//    console.log(stat.isFile());
//};


//async function hello_python() {

//    let pyodide = await globalThis.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });//`${window.location.origin}/pyodide`
//    await pyodide.loadPackage("micropip");
//    const micropip = pyodide.pyimport("micropip");
//    await micropip.install('assets/pyModel-0.1-py3-none-any.whl');
//    //await micropip.install('assets/sentence_transformers-2.5.0.dev0-py3-none-any.whl');
//    return pyodide.runPythonAsync(`
//        from pyModel import nlpModel
//        nlpModel.testAPI()
//        `);
//    }


var s_py = {
    type: htmlButtonResponse,
    stimulus: '<p id="stimulus" style="font-size:48px; color:red;">Intro</p>',
    choices: ['Start', 'Exit'],

    on_start: function () {
        runPython(`
            from pyModel import nlpModel
            nlpModel.testAPI()
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