document.addEventListener("click", (e) => {
	if (e.target.id = "Extract-JSON") {
		console.log("Testing");
		browser.tabs.executeScript(null, { 
		  file: "/content_scripts/test.js" 
		});
		
		var activeTab = browser.tabs.query({active: true, currentWindow: true});
		
		activeTab.then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, {testMessage: "Test"});
		});
  }
});