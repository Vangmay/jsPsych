/**
 * @title demo_design1_corner_variant
 * @description 
 * Current demo: 
 *  - similar title search,design 2,
 *  - title bank at corner,
 *  -use slider to change similarity,
 *  - doesn't calculate similarity in real-time
 * To choose between demo:change the stimuliView to jump to in 'introView'.
 * 
 * @author Yawen D
 * @version 0.3.0
 *
 * @assets assets/pyModel-0.1-py3-none-any.whl,assets/sample.txt,assets/img.png,assets/sample.csv
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import { jsPsych } from "./models/jsPsychModel.js"
import { init_condition } from "./models/conditionManager"
import { s1_0 } from "./views/introView.js"
//import initializeMicrophone from '@jspsych/plugin-initialize-microphone';



/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */

export async function run({ assetPaths, input = {}, environment, title, version }) {
    //set up experiment conditions
    const ui = { "bank": "corner", "isSlider": true };//corner,center
    const para = { "similarity": "variant" };//similar,different,variant
    const algo = { "useTable": true };

    init_condition(ui, para,algo);

    const timeline = [];
    timeline.push(s1_0);//s1_0 begin with fullscreen, s1 begin with consent form


    await jsPsych.run(timeline);

    return jsPsych;
}
