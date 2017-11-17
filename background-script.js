var browser = browser || chrome;

function notify(e) {
	let message = "Testing";
    browser.notifications.create({
        "type": "basic",
		"iconUrl": "icons/icon-48.png",
        "title": "You clicked a link!",
        "message": message
    });
	
	console.log("Testing");
}

browser.browserAction.onClicked.addListener(notify);