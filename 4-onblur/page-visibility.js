/*
    Besides the addEventListener() a different way can be used to add event listeners.
    In this case, the onevent interface which allows to add events via object attributes.
    Specifically we are interested in the the document.onblur and window.onblur attributes.

    This time we'll make use of the gist:
    https://gist.github.com/eligrey/384583

    I included object-watch.js in the index.html file.
*/

// Whenever something writes to the attribute, the attribute will be set back to null.

/*
window.watch("onblur", () => null);
*/

var hidden;
if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
} else if (typeof document.mozHidden !== "undefined") { 
    hidden = "mozHidden";
} else if (typeof document.webkitHidden !== "undefined") { 
    hidden = "webkitHidden";
}

var videoElement = document.getElementById("videoElement")

function hiddenAddedToDocument(waitFor) {
    return new Promise(
        resolve => setTimeout(() => resolve('resolved'), waitFor)
    );
}

async function handleVisibilityChange() {
    await hiddenAddedToDocument(10); 

    if (document[hidden]) {
        videoElement.pause();
    } else {
        videoElement.play();
    }
}

if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
    alert("This demo requires a modern browser that supports the Page Visibility API.");
} else {
    
    //Here, I change the addEventListener call to .onblur...
    window.onblur = handleVisibilityChange;
    window.addEventListener("focus", handleVisibilityChange);

    videoElement.addEventListener("pause", function(){
        document.title = 'Paused';
    }, false);
    
    videoElement.addEventListener("play", function(){
        document.title = 'Playing'
    }, false);
}