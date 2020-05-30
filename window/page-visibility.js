/*
However, the trick doesn't work anymore with window,
since Node isn't a prototype of window.

    $ Node.prototype.isPrototypeOf(window)

This will return false.
*/

/*
var a = Node.prototype.addEventListener;
Node.prototype.addEventListener = function(e) {
    if (e !== 'visibilitychange' && e !== 'webkitvisibilitychange') {
        a.apply(this, arguments)
    }
}
*/

/* 
So this didn't work. 

Instead of overriding Node, a better idea is to use EventTarget.
*/

/*
var a = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(e) {
    if (e !== 'visibilitychange' && e !== 'webkitvisibilitychange') {
        a.apply(this, arguments)
    }
}
*/

/* 
This time it worked.
It's because both window and document share a common ancestor in the prototype chain.
And that is EventTarget.

    $ EventTarget.prototype.isPrototypeOf(document) && EventTarget.prototype.isPrototypeOf(window)

This will return true.
*/

// Set the name of the "hidden" property and the change event for visibility
var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") { // Firefox up to v17
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") { // Chrome up to v32, Android up to v4.4, Blackberry up to v10
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

var videoElement = document.getElementById("videoElement")
// If the page is hidden, pause the video;
// if the page is shown, play the video
function handleVisibilityChange() {
    if (document[hidden]) {
        videoElement.pause();
    } else {
        videoElement.play();
    }
}

// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
    alert("This demo requires a modern browser that supports the Page Visibility API.");
} else {
    // Handle page visibility change   
    
    //I have commented the original line and used window instead.

    //document.addEventListener(visibilityChange, handleVisibilityChange, false);
    window.addEventListener(visibilityChange, handleVisibilityChange, false);

    // When the video pauses and plays, change the title.
    videoElement.addEventListener("pause", function(){
        document.title = 'Paused';
    }, false);
    
    videoElement.addEventListener("play", function(){
        document.title = 'Playing'
    }, false);
}