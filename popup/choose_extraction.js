var browser = browser || chrome;

// Sends message to browser tab to extract lab values
document.getElementById("extract-labs").addEventListener("click", (e) => {
	browser.tabs.query({
		active: true, 
		currentWindow: true
	}).then((tabs) => {
		for (let tab of tabs) {
            browser.tabs.sendMessage(tab.id, { content: "labs" });
		}
	});
    
    // Close the popup
    window.close();
});

// Sends message to browser tab to extract medications
document.getElementById("extract-medications").addEventListener("click", (e) => {
    browser.tabs.query({
        active: true,
        currentWindow: true
    }).then((tabs) => {
        for (let tab of tabs) {
            browser.tabs.sendMessage(tab.id, { content: "medications" });
        }
    });

    // Close the popup
    window.close();
});