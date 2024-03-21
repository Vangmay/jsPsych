/**
 * @title demo
 * @description
 * Current demo: similar title choice experiment design 1, title band at the corner
 * installing and importing the Python packages takes time.
 * @author Yawen D
 * @version 0.2.0
 *
 * @assets assets/pyModel-0.1-py3-none-any.whl,assets/sample.txt,assets/img.png
 */

import "../styles/main.scss";

import { jsPsych } from "./models/jsPsychModel.js"
import { s1_0 } from "./views/introView.js"



/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */

export async function run({ assetPaths, input = {}, environment, title, version }) {

    const timeline = [];
    timeline.push(s1_0);


    await jsPsych.run(timeline);

    return jsPsych;
}