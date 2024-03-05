/**
 * model that contain results from user and API:
 * - haiku,reaction time
 *
 */

var result = [];
var next_haiku = "";
var count = 0;
var database = [];

function setHaiku(haiku) {
    next_haiku = haiku;
}

function getHaiku() {
    return next_haiku;
}

function setData(data) {
    database = data;
}

function getData() {
    return database;
}

function addCount() {
    count += 1;
}

function getCount() {
    return count;
}


function appendResult(r) {
    result.push(r);
}

function getResult() {
    return result;
}

export {
    appendResult,
    getResult,
    setHaiku,
    getHaiku,
    getCount,
    addCount,
    setData,
    getData,
}