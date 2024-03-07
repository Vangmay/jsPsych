/**
 * @title demo
 * @description 
 * Current demo: random process evaluation, 
 * To choose between demo:change the stimuliView to jump to in 'introView'.
 * Available demos:haiku demo,similar-text-search, random process demo
 * installing and importing the Python packages takes time.
 * @author Yawen D
 * @version 0.2.0
 *
 * @assets assets/pyModel-0.1-py3-none-any.whl,assets/sample.txt
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import { jsPsych } from "./models/jsPsychModel.js"
import { init_py } from "./models/jsPyModel.js"
import { s1 } from "./views/introView.js"
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

    // initial python installation
    await init_py();

    const timeline = [];
    timeline.push(s1);
    //timeline.push(trial);
    //timeline.push(record);


    await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
    return jsPsych;
}
