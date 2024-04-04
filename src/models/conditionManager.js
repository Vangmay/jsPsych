// manage the experiment conditions, such as UI, parameters, timeline, ect
// UI condition:design 1 title bank at the corner/center
// Parameter condition:similarity of next title (similar,different, variant)
// algorithm condition:use pre-calculated similarity table, or calculate similarity in real time

import { runPython, init_py } from "./jsPyModel.js"
import { loadFile } from "../utilities"

var bank_position = "";//UI condition
var similarity = [];//parameter condition
var simType = "";//similarity type
var isSlider = false;//UI condition, whether it's the slider trial or image-response trial
var useTable = true;//algorithm condition, use similarity table or real-time calculation

var max_gen = 3;//maximum times of generate new stimulus

function init_condition(ui, para,algo) {
    bank_position = ui.bank;
    simType = para.similarity;
    isSlider = ui.isSlider;
    useTable = algo.useTable;
    if (!isSlider) {
        switch (simType) {
            case "similar":
                similarity = new Array(max_gen).fill(0.6);
                break;
            case "different":
                similarity = new Array(max_gen).fill(0.01);
                break;
            case "variant":
                //80% similar,20% different
                var sim_num = Math.floor(max_gen * 0.8);
                var dif_num = max_gen - sim_num;
                var variant = new Array(dif_num).fill(0.01).concat(new Array(sim_num).fill(0.6));
                similarity = variant.sort(() => Math.random() - 0.5);//shuffle
                break;
            default:
                console.error(`${para.similarity} is not a valid similarity.`);
        }
    }
    console.log("similarity set to be ", similarity);
}

//unfinished:read similarity table
async function prepare_data() {
    //if real-time calculation needed,initial the python packages
    if (!useTable) {
        await init_py();
        await runPython(`
            from pyModel import nlpModel
            nlpModel.find_similar("apple",["orange","apple banana"],0.1)
        `);
    }

    //load the database of titles
    let text = loadFile('assets/sample.txt');
    const myArray = text.split("\r\n");//each sample ends with this flag

    sim_table = [];
    if (useTable) {
        let table = loadFile('assets/sample.txt');
    }

    globalThis.myResultMoodel = new ResultModel(myArray,sim_table);//initialize the model with database


}

function get_condition() {
    return {
        "bank_position": bank_position,
        "similarity": similarity,
        "sim_type": simType,
        "isSlider": isSlider,
        "use_table": useTable,
    };
}

//function used under the condition that slider is used to change the similarity
function appendSimilarity(sim) {
    similarity.push(sim);
}

export {
    init_condition, get_condition, appendSimilarity, prepare_data
}