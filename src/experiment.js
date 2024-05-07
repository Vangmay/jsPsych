/**
 * @title demo_design1
 * @description 
 * Current demo: 
 *  - similar title search,design 1,
 *  - title bank at corner,
 *  - similarity set to 0.1,
 *  - NOT calculate similarity in real-time
 *  - without piggy bank.
 * 
 * @author Yawen D
 * @version 0.7.1
 *
 * @assets assets/pyModel-0.1-py3-none-any.whl,assets/sample.txt,assets/img.png,assets/sample.csv,assets/screen.png,assets/screen_slider.png,assets/example.png
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import { initJsp, jsPsych } from "./models/jsPsychModel.js"
import { init_condition } from "./models/conditionManager"
import { s1_0 } from "./views/introView.js"
//import initializeMicrophone from '@jspsych/plugin-initialize-microphone';



/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */

export async function run({ assetPaths, input = {}, environment, title, version }) {
    //init Jspsych model
    var user_batch = 'C2NSO5P8'
    initJsp(user_batch);

    //set up experiment conditions
    const ui = { "bank": "corner", "isSlider": false, "showScore": false };//corner,center
    const para = { "similarity": "different", "user_batch": user_batch};//similarity:similar,different,variant
    const algo = { "useTable": true };

    init_condition(ui, para,algo);

    const timeline = [];
    timeline.push(s1_0);//s1_0 begin with fullscreen, s1 begin with consent form


    await jsPsych.run(timeline);

    return jsPsych;
}
