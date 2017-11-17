var browser = browser || chrome;
console.log("extraction.js loaded");

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("Message Received");
	console.log(request);
	
	let extractionType = request ? request.content.toUpperCase() : null;
	
	if (extractionType === "LABS") {
		console.log("Message received to start lab extraction");
		
		// Get the table
		let table = document.getElementById("aggregate-table");
		
		// Get the table header and row with dates
		let thead = table.getElementsByTagName("thead");
		let datesTR = thead.getElementsByTagName("tr")[0];
		
		// Get the header cells containing dates
		let datesTH = datesTR.getElementsByTagName("th");
		datesTH = datesTH.shift().shift()
		dates = 
		
		sendResponse({message: "loaded"});
	}
	
	sendResponse({lab_json: "placeholder"});
});