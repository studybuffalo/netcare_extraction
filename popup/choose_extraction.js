var browser = browser || chrome;
console.log("Popup JS loaded");

function onError(error) {
	console.error(`Error: ${error}`);
}

function handleResponse(response) {
	console.log("Response Received");
	console.log(response.farewell);
}

function copyResult(msg) {
    // Create element
    let responseInput = document.createElement("input");
    responseInput.type = "text";
    responseInput.value = msg;

    // Add the element to the body and copy the text
    document.body.appendChild(responseInput);
    responseInput.select();
    document.execCommand("Copy");

    // Remove the element
    document.body.removeChild(responseInput);
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
					console.log("Lab JSON: " + response.message);
					
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
    browser.tabs.query({
        active: true,
        currentWindow: true
    }).then((tabs) => {
        for (let tab of tabs) {
            browser.tabs.sendMessage(
                tab.id,
                {
                    content: "medications",
                    output: "json"
                }
            ).then(response => {
                let message = response.message;
                console.log("Medication JSON: " + message);

                copyResult(message);
            }).catch(onError);
        }
    });
});
