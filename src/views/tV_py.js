/**
 * Test running python script in js file
 * as intro view
 *
 */

import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { s3 } from "./endView.js"
import { s2 } from "./stimuliView.js"
import { jsPsych } from "../models/jsPsychModel.js"
const { loadPyodide } = require("pyodide");


async function hello_python() {
    let pyodide = await globalThis.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });//`${window.location.origin}/pyodide`
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('scikit-learn');
    return pyodide.runPythonAsync(`
        from sklearn import linear_model
        reg = linear_model.LinearRegression()
        reg.fit([[0, 0], [1, 1], [2, 2]], [0, 1, 2])
        reg.coef_
        `);
}


var s_py = {
    type: htmlButtonResponse,
    stimulus: '<p id="stimulus" style="font-size:48px; color:red;">Intro</p>',
    choices: ['Start', 'Exit'],

    on_start: function () {
        hello_python().then((result) => {
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