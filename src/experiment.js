/**
 * @title demo_design1_corner_variant
 * @description 
 * Current demo: similar title search,design 1, title bank at corner, variant similarity
 * To choose between demo:change the stimuliView to jump to in 'introView'.
 * Available demos:haiku demo,similar-text-search, random process demo
 * installing and importing the Python packages takes time.
 * @author Yawen D
 * @version 0.2.0
 *
 * @assets assets/pyModel-0.1-py3-none-any.whl,assets/sample.txt,assets/img.png
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import { jsPsych } from "./models/jsPsychModel.js"
import { init_condition } from "./conditionManager"
import { s1 } from "./views/introView.js"
//import initializeMicrophone from '@jspsych/plugin-initialize-microphone';



/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */

export async function run({ assetPaths, input = {}, environment, title, version }) {
    //set up experiment conditions
    const ui = { "bank": "corner" };
    const para = {"similarity":"variant"}
    init_condition(ui, para);

    const timeline = [];
    timeline.push(s1);


    await jsPsych.run(timeline);

    return jsPsych;
}
