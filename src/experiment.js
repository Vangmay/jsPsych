/**
 * @title demo
 * @description 
 * demo for HCI interview, 
 * please wait approx 3 second after pressing each button so that the API response is fetched
 * do not use/copy the API key any other purpose but trying this demo, as it's my personal billing
 * @author Yawen D
 * @version 0.1.0
 *
 * @assets assets/
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import { jsPsych } from "./models/jsPsychModel.js"
import { s1 } from "./views/introView.js"
import { s_py } from "./views/tV_py"
//import initializeMicrophone from '@jspsych/plugin-initialize-microphone';



/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */

export async function run({ assetPaths, input = {}, environment, title, version }) {
    //var trial = {
    //    type: initializeMicrophone
    //};


    const timeline = [];
    timeline.push(s_py);
    //timeline.push(trial);
    //timeline.push(record);


    await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
    return jsPsych;
}
