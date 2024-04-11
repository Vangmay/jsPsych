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

function fullscreenListener(event){
    //different browser has different ways of detecting fullscreen
    var userAgent = navigator.userAgent;
    var notFull = (window.screenTop + window.screenLeft) || (window.screenY + window.screeX);//ensure the functionality in old versions
    //console.log("top screen: " + window.screenTop + " left screen: " + window.screenLeft);

    if (userAgent.indexOf('Chrome') != -1)
        notFull = (window.screenTop + window.screenLeft) <= 0 || (window.screenY + window.screeX) <= 0;
    //var isFull = window.innerWidth == screen.width && window.innerHeight == screen.height;//it will fire every time resized
    if (notFull) {
        globalThis.myResultMoodel.confirmDistracted();//"this" serves the same as window; but the listener can't recognize when it's an arrow function
        alert("Please press Fn+F11 to enter fullscreen mode!");
    }
}

export {
    loadFile, getSimilar, fullscreenListener

};