/*
    Still, while not a perfect solution blur can be used to tell if user has switched tabs.
    Using blur is not perfect since it doesn't actually tell if the page or tab window has lost visibility.
    What it does instead is tell whether the page or tab window has lost focus.
    So, the page or tab window might still be visibile to the user, but the video would pause.

    For example, when the user clicks the url bar, the blur event will be called since the tab window lost focus.

    This behavior can be fixed by looking at the document.hidden property, like in the previous examples.
    There is however a problem with that:
    The document.hidden property isn't intended for being used with the blur event.

    The blur event gets called before the browser sets the document.hidden property.
    So from this perspective, document.hidden appears always false.
    So it turns out that the tab switch can never get detected.

    So, at this point it would be enough to just watch for the property to change:
    https://gist.github.com/eligrey/384583

    However, the change to the property cannot be detected by overriding the set method.
    Apparently, the browser updates the document.hidden property in a different way.
    That is not via the set method.

    The best solution appears to be using the setTimeout method, waiting for a fixed amount of time
    so that the document.hidden property may get updated.
*/

// To block the blur event it is enough to add it to the addEventListener override:


var a = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(e) {
    // Also check if the element is window or document, so that blur doesn't get blocked for other elements.
    var isWindowOrDocument = this === window || this === document; 

    var isNotForbiddenEvent = ![
        'visibilitychange', 
        'webkitvisibilitychange', 
        'mozvisibilitychange', 
        'blur'
    ].includes(e);

    if (isWindowOrDocument && isNotForbiddenEvent) {
        a.apply(this, arguments)
    }
}

var hidden;
if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
} else if (typeof document.mozHidden !== "undefined") { 
    hidden = "mozHidden";
} else if (typeof document.webkitHidden !== "undefined") { 
    hidden = "webkitHidden";
}

var videoElement = document.getElementById("videoElement")

/*
    hiddenAddedToDocument() -> Waits for a number of milliseconds and then resolves.
*/

function hiddenAddedToDocument(waitFor) {
    return new Promise(
        resolve => setTimeout(() => resolve('resolved'), waitFor)
    );
}

async function handleVisibilityChange() {
    await hiddenAddedToDocument(10); //It "hopes" that 10 ms is fine for everyone. 3 ms worked fine already for me.

    if (document[hidden]) {
        videoElement.pause();
    } else {
        videoElement.play();
    }
}

if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
    alert("This demo requires a modern browser that supports the Page Visibility API.");
} else {
    
    //I use blur to detect when the user has switched tab, and focus to detect when user came back.
    window.onblur = handleVisibilityChange;
    window.addEventListener("focus", handleVisibilityChange);

    videoElement.addEventListener("pause", function(){
        document.title = 'Paused';
    }, false);
    
    videoElement.addEventListener("play", function(){
        document.title = 'Playing'
    }, false);
}