// manage the experiment conditions, such as UI, parameters, timeline, ect
// UI condition:design 1 title bank at the corner/center
// Parameter condition:similarity of next title (similar,different, variant)
// timeline condition:design 1, design2

var bank_position = "";//UI condition
var similarity = [];//parameter condition
var simType = "";//similarity type

var max_gen = 3;//maximum times of generate new stimulus

function init_condition(ui, para) {
    bank_position = ui.bank;
    simType = para.similarity;
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
    console.log("similarity set to be ", similarity);
}

function get_condition() {
    return {
        "bank_position": bank_position,
        "similarity": similarity,
        "sim_type": simType,
    };
}

export {
    init_condition, get_condition,
}