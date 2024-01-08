/**
 * model that contain results from user and API:
 * - haiku,reaction time
 *
 */

var result = "";
var next_haiku = "";
var count = 0;

function setHaiku(haiku) {
    next_haiku = haiku;
}

function getHaiku() {
    return next_haiku;
}

function addCount() {
    count += 1;
}

function getCount() {
    return count;
}


function setResult(r) {
    result = r;
}

function getResult() {
    return result;
}

export {
    setResult,
    getResult,
    setHaiku,
    getHaiku,
    getCount,
    addCount
}