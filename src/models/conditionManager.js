// manage the experiment conditions, such as UI, parameters, timeline, ect
// UI condition:design 1 title bank at the corner/center, whether to show remaining scores
// Parameter condition:similarity of next title (similar,different, variant)
// algorithm condition:use pre-calculated similarity table, or calculate similarity in real time

import { runPython, init_py } from "./jsPyModel.js"
import { getHaiku_API, getTitle_API } from "../APIs/openAI.js"
import { loadFile } from "../utilities"
import ResultModel from "./ResultModel.js"

var bank_position = "";//UI condition
var similarity = [];//parameter condition
var simType = "";//similarity type
var isSlider = false;//UI condition, whether it's the slider trial or image-response trial
var useTable = true;//algorithm condition, use similarity table or real-time calculation
var showScore = true;//UI condition:if the remaining score will be shown

var max_gen = 24;//maximum times of generate new stimulus

function init_condition(ui, para,algo) {
    bank_position = ui.bank;
    simType = para.similarity;
    isSlider = ui.isSlider;
    useTable = algo.useTable;
    showScore = ui.showScore;

    if (!isSlider) {
        switch (simType) {
            case "similar":
                similarity = new Array(max_gen).fill(0.5);
                break;
            case "different":
                similarity = new Array(max_gen).fill(0.1);
                break;
            case "variant":
                //80% similar,20% different
                var sim_num = Math.floor(max_gen * 0.8);
                var dif_num = max_gen - sim_num;
                var variant = new Array(dif_num).fill(0.1).concat(new Array(sim_num).fill(0.5));
                similarity = variant.sort(() => Math.random() - 0.5);//shuffle
                break;
            default:
                console.error(`${para.similarity} is not a valid similarity.`);
        }
    }
    console.log("similarity set to be ", similarity);
}

async function prepare_data() {
    //load the database of titles
    let text = loadFile('assets/sample.txt');
    var myArray = text.split("\r\n");//each sample ends with this flag
    var sim_table = [];

    //if real-time calculation needed,initial the python packages
    if (!useTable) {
        globalThis.myResultModel = new ResultModel(myArray, sim_table);//initialize the model with data

        ////load the database of titles
        //getTitle_API('assets/img.png').then((myArray) => {
        //    console.log("titles:", myArray);
        //    globalThis.myResultModel = new ResultModel(myArray, sim_table);//initialize the model with data
        //    console.log("my model is built!", globalThis.myResultModel);
        //});
        ////init python packages
        //await init_py();
        //await runPython(`
        //        from pyModel import nlpModel
        //        nlpModel.find_similar("apple",["orange","apple banana","orange apple"],0.1,["orange apple"])
        //    `);
    }
    else {//load similarity table
        let table = loadFile('assets/sample.csv');
        var tableArray = table.split("\r\n"); 
        tableArray.shift();//delete the column names
        //seperate to a list of title pairs and similarity
        sim_table = tableArray.map((tt) => {
            var temp = tt.split(",")
            return [temp[0] ,temp[1], parseFloat(temp[2])];
        });
        globalThis.myResultModel = new ResultModel(myArray, sim_table);//initialize the model with data
    }






}

function get_condition() {
    return {
        "bank_position": bank_position,
        "similarity": similarity,
        "sim_type": simType,
        "isSlider": isSlider,
        "use_table": useTable,
        "show_score": showScore,
    };
}

//function used under the condition that slider is used to change the similarity
function appendSimilarity(sim) {
    similarity.push(sim);
}

export {
    init_condition, get_condition, appendSimilarity, prepare_data
}