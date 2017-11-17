var browser = browser || chrome;
console.log("Popup JS loaded");

function onError(error) {
	console.error(`Error: ${error}`);
}

function handleResponse(response) {
	console.log("Response Received");
	console.log(response.farewell);
}

document.getElementById("extract-labs").addEventListener("click", (e) => {
	console.log("Starting Lab Extraction");
	browser.tabs.query({
		active: true, 
		currentWindow: true
	}).then((tabs) => {
			// Testing Extraction Script
			// Cycles through every tab and sends message
			// Logs the response from the content script
			for (let tab of tabs) {
				browser.tabs.sendMessage(
					tab.id,
					{
						content: "labs",
						output: "json"
					}
				).then(response => {
					console.log("Lab JSON: " + response.lab_json);
					
					// When appropriate response received, update the popup
					
					/*
					// Copy result to clipboard
					let responseInput = document.getElementById("Response");
					
					responseInput.value = response.dom_content;
					responseInput.select();
					document.execCommand("Copy");
					*/
				}).catch(onError);
		}
	});
});

document.getElementById("extract-medications").addEventListener("click", (e) => {
	console.log("Starting Extract Medications");
});