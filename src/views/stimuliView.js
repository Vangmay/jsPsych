/**
 * Stimuli page of the exp
 * - show haiku and choose accept or not
 */

import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import imageButtonResponse from '@jspsych/plugin-image-button-response';
import surveyMultiChoice from '@jspsych/plugin-survey-multi-choice';

import { getHaiku_API, getTitle_API } from "../APIs/openAI.js"
import { s3 } from "./surveyView"
import { jsPsych } from "../models/jsPsychModel.js"
import { runPython, passPara, destroyPara } from "../models/jsPyModel.js"
import { get_condition, appendSimilarity } from "../models/conditionManager"
import { getSimilar } from "../utilities"

var startTime;
var div = document.createElement("div");//div for additional components

// haiku-acceptance interaction
var s2 = {
    type: htmlButtonResponse,
    choices: ['Accept', 'Re-generate'],
    stimulus: '<p id="stimulus" style="font-size:24px;">loading...</p>',
    on_start: async function getStimuli() {
        var next_haiku = await getHaiku_API();
        setHaiku(next_haiku);

        //enable button and s
        document.getElementById("stimulus").innerText = next_haiku;
        document.querySelector('#jspsych-html-button-response-button-0 button').disabled = false;
        document.querySelector('#jspsych-html-button-response-button-1 button').disabled = false;

        startTime = Date.now();//start timing after the haiku is presented
        //console.log(startTime);
        console.log(next_haiku);

        addCount();
    },

    on_load: function () {
        //idk why it should be on_load to disable the button, but don't move to on_start as it will report undefined!
        document.querySelector('#jspsych-html-button-response-button-0 button').disabled = true;
        document.querySelector('#jspsych-html-button-response-button-1 button').disabled = true;
    },

    on_finish: function (data) {
        addRespFromButton(data, Date.now() - startTime);
        if (data.response == 0) {
            jsPsych.addNodeToEndOfTimeline(s4);
        }
        else {
            if (getCount() >= 3)
                jsPsych.addNodeToEndOfTimeline(s4)
            else
                jsPsych.addNodeToEndOfTimeline(s2)

        }
    }
};

function addRespFromButton(data,rt) {
    var accept = "rejected";
    if (data.response == 0)
        accept = "accepted";
    data.stimulus = getHaiku();//otherwise it will be the initial stimuli somehow....
    var result = {
        stimulus: data.stimulus,
        acceptance: accept,
        rspTime:rt
    };
    appendResult(result);
    data.myResult = getResult();
    //console.log(data.myResult);
}

// image-title match



function printResult(result) {
    globalThis.myResultModel.appendPool(result);//save this title in stimulus pool
    document.getElementById('title').innerHTML = "&#91;" + result + "&#93;";
    document.getElementById('title_container').style.backgroundImage = "url(/style/blank.png)";
    startTime = Date.now();//start timing after the stimuli presented
}


// show image and title
var s2_img = {
    type: imageButtonResponse,
    stimulus: 'assets/img.png',
    stimulus_height: 0.6 * window.innerHeight,
    button_html: () => {
        var html_btn0 = '<div class="btn-img"><button class="my-jspsych-btn">%choice%</button>';
        //whether the hint about scores will be shown
        if (get_condition().show_score)
            html_btn0 += '<div class="div-hint" id="hint_gen">Price: 2 scores.</div>';
        else
            html_btn0 += '<div class="div-hint" id="hint_gen">It takes a few seconds for the Gen AI to create a new name. Thank you for your patience.</div>';
        html_btn0 += '</div>';

        var html_btn1 = '<div class="btn-img"><button class="my-jspsych-btn">%choice%</button>';
        html_btn1 += '<div class="div-hint" id="hint_stop">I have made up my mind.</div></div>'

        return [html_btn0, html_btn1];

    },
    choices: ['Generate New Title', 'STOP'],
    prompt: '<div id="title_container" class="div-title"><p id="title" class="p-title">\t\t\t\t</p></div >',

    //render some additional components <img id="img-buff" src="assets/buffering.gif">
    on_start: function () {
        //register template for components
        var html1 = '<div class="div-score" id="remain"></div>';//html for the remaining points
        html1 += '<div class="div-pool" id="pool"></div>';//html for title pools

        //slider
        if (get_condition().isSlider) {
            html1 += `<div class="div-slider">
                        <input type="range" min="1" max="100" value="50" class="input-slider"id="user_similarity">
                        <div class="div-scale">
                            <br>   100% Similar</br>
                            <br>-  </br>
                            <br>-  80%</br>
                            <br>-  </br>
                            <br>-  60%</br>
                            <br>-  </br>
                            <br>-  40%</br>
                            <br>-  </br>
                            <br>-  20%</br>
                            <br>-  </br>
                            <br>   0% Similar</br>
                        </div>`
            ////if it's the first time the slider is shown
            //if (globalThis.myResultModel.getPool().length <= 0)
            //    html1 += '<p class="p-drag"><- drag me!</p>';
            html1+='</div > ';

        }

        div.innerHTML = html1;
        document.getElementsByClassName("jspsych-display-element")[0].appendChild(div);//put the template on display

        // get actual data of components

        //score component
        var html_score = "Remaining points: " + globalThis.myResultModel.getCount()+"\n";
        document.getElementById('remain').innerHTML = html_score;
        // if the score is set to be hidden
        if (!get_condition().show_score) 
            document.getElementById('remain').style.visibility = "hidden";

        //title pool
        if (get_condition().bank_position == "corner") {
            var pool = globalThis.myResultModel.getPool();
            var html_pool = pool.map((tt) => '<br>' + tt + '</br>');//put the pool list into seperate lines
            html_pool = '<p align="center"><b>Title Bank</b></p>'+html_pool.join("");
            document.getElementById('pool').innerHTML = html_pool;
        }

    },

    on_load: async function () {
        globalThis.myResultModel.calTitle(5).then((result) => printResult(result));//get or calculate title
        //hint below button
        //hint_hover();
        //display the most recent titles as prompt
        if (get_condition().bank_position == "center") {
            var pool = globalThis.myResultModel.getPool();
            var last_titles = pool.slice(-3);//latest 3 titles
            var html_titles = last_titles.map((tt) => tt + '\t');
            html_titles = "..."+html_titles.join(",")+"...";
            document.getElementById('above_title').innerHTML = html_titles;
        }

    },

    on_finish: function (data) {
        //get similarity from slider
        if (get_condition().isSlider)
            var user_sim = document.getElementById("user_similarity").value;

        // remove the additional components
        document.getElementsByClassName("jspsych-display-element")[0].removeChild(div);

        //save responses:don't use the data.stimulus,use startTime
        globalThis.myResultModel.saveResult(
            "", data.response, data.rt, startTime
        );

        //jump to current page or choosing page
        if (globalThis.myResultModel.getCount() <= 0)
            jsPsych.addNodeToEndOfTimeline(s2_choose);
        else {
            if (data.response == 1) {//if subject choose to stop
                jsPsych.addNodeToEndOfTimeline(s2_choose);
            }
            else {//if subject choose to generate
                globalThis.myResultModel.addCount();//add the times of generation, in this case, minus 2 score

                if (get_condition().isSlider) //update similarity if user wants new
                    appendSimilarity(Number(user_sim) / 100.0);//transfer into a float 0-1
                
                jsPsych.addNodeToEndOfTimeline(s2_img);
            }
        }
    },
}

// make hint appear when mouse hovers
function hint_hover() {
    document.querySelector('#jspsych-image-button-response-button-0 button').addEventListener("mouseover", () => {
        document.getElementById('hint_stop').style.visibility = "visible";
    });
    document.querySelector('#jspsych-image-button-response-button-0 button').addEventListener("mouseout", () => {
        document.getElementById('hint_stop').style.visibility = "hidden";
    });
    document.querySelector('#jspsych-image-button-response-button-1 button').addEventListener("mouseover", () => {
        document.getElementById('hint_gen').style.visibility = "visible";
    });
    document.querySelector('#jspsych-image-button-response-button-1 button').addEventListener("mouseout", () => {
        document.getElementById('hint_gen').style.visibility = "hidden";
    });
}

// choose the ideal title
var s2_choose = {
    type: surveyMultiChoice,
    css_classes: ['questions'],
    button_html: ['<button class="jspsych-btn" style = "position:fixed; bottom: 20px;right:60px;">%choice%</button>'],
    questions: 
        [
            {
                prompt: 'Select the painting title you think that is the most creative',
                name: 'choice_title',
                options: function () {
                    return globalThis.myResultModel.getPool();
                },
                required: true
            }
        ],

    //render some additional components
    on_start: function () {
        var html1 = '<img src="assets/img.png" class="img-choice">';//html for the image
        div.innerHTML = html1;
        document.getElementsByClassName("jspsych-display-element")[0].appendChild(div);//put the template on display

    },

    on_finish: function (data) {
        // remove the additional components
        document.getElementsByClassName("jspsych-display-element")[0].removeChild(div);
        //save results,don't use start time
        globalThis.myResultModel.saveResult(
            data.trial_type, data.response.choice_title, data.rt, -1
        );
        jsPsych.addNodeToEndOfTimeline(s3);
    }
};

export {
    s2,
    s2_img
}


