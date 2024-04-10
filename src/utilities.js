/**
 * Repetitively used functions
 * 
 */

// load local file
function loadFile(name) {
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("text/html;charset=utf-8");
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}

// search closest similarity title
function getSimilar(para) {
    var target = para.s1;
    var table = para.database;
    var sim = para.distance;
    var pool = para.pool;

    // find the closest via iterations
    var newTitle = "";
    var minDistance = 100;
    table.forEach((tt) => {
        if (tt[0].includes(target)) {
            //pick the other title from the pair
            var other_title = tt[0].replace(target, "");
            other_title=other_title.replace(",", "");
            //mark the title with closest similarity
            if (Math.abs(tt[1] - sim) < minDistance) {
                //if title has not been shown before
                if (pool.indexOf(other_title) < 0) {
                    newTitle = other_title;
                    minDistance = Math.abs(tt[1] - sim);
                    
                }
            }
        }
    });
    console.log("the distance between required similarity and actual similarity: ", minDistance);
    return newTitle;
}

export {
    loadFile, getSimilar

};