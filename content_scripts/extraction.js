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
        dates = ""

        sendResponse({ message: "lab values extracted" });
    } else if (extractionType === "MEDICATIONS") {
        console.log("Message received to start medication extraction");

        let body = document.body;

        // Add the screen veil to detect any clicks
        let veil = document.createElement("div");
        veil.id = "netcare_extraction_veil";
        body.appendChild(veil);

        // Add a container to hold any content
        let container = document.createElement("div");
        container.id = "netcare_extraction_container";
        veil.appendChild(container);

        // Add a content div to allow proper content positioning
        let content = document.createElement("div");
        content.id = "netcare_extraction_content";
        container.appendChild(content);

        // Add a title to the content
        let title = document.createElement("h1");
        title.appendChild(document.createTextNode(
            "Netcare Medication Extraction"
        ));
        content.appendChild(title);

        // Add instructions to the content
        let instructions = document.createElement("div");
        instructions.id = "netcare_extraction_instructions";
        instructions.appendChild(document.createTextNode(
            "Copy the Netcare medication list into the text box below. "
            + "See the notes below if you run into any problems"
        ));
        content.appendChild(instructions);

        let instructionsList = document.createElement("ul");
        instructionsList.appendChild(createLi(
            "Copy the medications from the 'Detailed Report'."
        ));
        instructionsList.appendChild(createLi(
            "Use the date range function of the Netcare report to restrict "
            + "medications to a certain timeframe."
        ));
        instructionsList.appendChild(createLi(
            "Make sure to include the 'Allergies' and 'Report End' in "
            + "the text you copy."
        ));
        instructions.appendChild(instructionsList);

        // Add a textarea to copy medication list to
        let textarea = document.createElement("textarea");
        textarea.id = "netcare_extraction_textarea";
        content.append(textarea);

        // Add a cancel button
        let cancelButton = document.createElement("input");
        cancelButton.type = "button";
        cancelButton.value = "Cancel";
        cancelButton.addEventListener("click", function () {
            cancelExtraction(sendResponse);
        });
        content.append(cancelButton);

        // Add a extract button
        let extractionButton = document.createElement("input");
        extractionButton.type = "button";
        extractionButton.value = "Extract medications";
        extractionButton.addEventListener("click", function () {
            receiveMedications(sendResponse);
        });
        content.appendChild(extractionButton);
        
        return true;
    }
	
});

function createLi(txt) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(txt));
    
    return li;
}

function receiveMedications(sendResponse) {
    // Get the medication content
    let medications = document.getElementById("netcare_extraction_textarea").value;

    // Remove the veil
    let veil = document.getElementById("netcare_extraction_veil");
    document.body.removeChild(veil);

    // Send the response back to the extension
    sendResponse({ message: medications });
}

function cancelExtraction(sendResponse) {
    // Get the medication content
    let medications = document.getElementById("netcare_extraction_textarea").value;

    // Remove the veil
    let veil = document.getElementById("netcare_extraction_veil");
    document.body.removeChild(veil);

    // Send the response back to the extension
    sendResponse({ message: "cancelled" });
}