var browser = browser || chrome;
console.log("extraction.js loaded");

function checkForEndOfReport(table) {
    let returnValue = false;

    let td = table.getElementsByTagName("td");

    if (td.length) {
        tdText = td[0].innerText.trim().toUpperCase();

        if (tdText === "- END OF REPORT -") {
            returnValue = true;
        }
    }

    return returnValue
}
/*
    Tracking the code to prescription medications
    <table>
        <thead></thead>     NOT NEEDED
        <tbody>             MEDICATIONS IN HERE
            <tr>
                <td>
                    <table></table>     ALLERGIES - NOT NEEDED
                    <table>
                        <tbody>
                            <tr></tr> - FIRST TR = CAPTION - NOT NEEDED

                            ...
                            <tr>            PIN PRESCRIPTION
                                <td>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        <span>
                                                            DRUG NAME STRENGTH DOSAGE FORM (GENERIC)
                                                        </span>
                                                    </strong>
                                                </td>
                                            </tr>
                                            <tr>        ERRANT TR HERE (will this screw up DOM traversal?)
                                            <tr></tr>           APPEARS BLANK?
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr></tr>           EMPTY LINE (appears intentional design)
                            <tr>                LABEL TEXT FOR "Dispenses:"
                                <td></td>       EMPTY
                                <td>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Dispenses:</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td></td>       EMPTY
                            </tr>
                            <tr>                DISPENSING INFORMATION
                                <td></td>           EMPTY
                                <td>DISPENSE DATE</td>
                                <td>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        DRUG NAME STRENGTH DOSAGE FORM
                                                    </strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>QUANTITY</td>
                                                            <td>DAY SUPPLY</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div>
                                                        INSTRUCTIONS
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        DISPENSING PHARMACY
                                                    </strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>PHARMACY PHONE NUMBER</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            ...
                            ABOVE TR element repeats for each dispense
                            ...
                            <tr>        HR ELEMENT AT THE END OF THE MEDICATION
                                <td>
                                    <hr>
                                <td>
                            </tr>
                            ...
                            ABOVE SEQUENCE OF TR ELEMENTS REPEATS FOR EACH MEDICATION
                            ...
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <table></table>     END OF REPORT - NOT NEEDED
*/

function getChildren(el, tag, multiple) {
    if (multiple) {
        let children = el.children;
        let elArray = [];

        for (child of children) {
            if (child.tagName === tag.toUpperCase()) {
                elArray.push(child);
            }
        }

        return elArray;
    } else {
        let children = el.children;

        for (child of children) {
            if (child.tagName === tag.toUpperCase()) {
                return child;
            }
        }
    }
}

function extractMedications(data) {
    // Get all the direct child tables
    let dataChildren = data.children;
    let tables = getChildren(data, "TABLE", true);
    
    // Last table in the data contains the medications
    let table = tables[tables.length - 1];
    
    // Get the direct body element
    let tbody = getChildren(table, "TBODY", false);

    // Collect all the direct rows of tbody (these contain the data)
    let rows = getChildren(tbody, "TR", true);
    
    for (row of rows) {
        console.log(row);
    }
    
}

/* Queries to determine what type of TR this is
├└

tr > td > table > tbody > tr > td > strong > span       MEDICATION
│
└ > td > table > tbody > tr > td > strong > div         PHYSICIAN
                 |
                 └ > tr > td                            PHYSICIAN PHONE
note: there is an errant tr element in this TR element


tr > td                                                 DISPENSING DATE
│
├ > td > table > tbody > tr > td > strong
|                |
|                ├ > tr > td > table > tbody > tr > td  QUANTITY DISPENSED
|                |                             |
|                |                             └ > td   DAY SUPPLY
|                |
|                └ > tr > td > div                      INSTRUCTIONS
|
└ > td > table > tbody > tr > td > strong               DISPENSING PHARMACY
                 |
                 └ > tr > td                            PHARMACY PHONE

tr > td > hr                                            DIVIDER BETWEEN GROUPS OF RX

*/
function receiveMedications(sendResponse) {
    // Get the medication content
    let medications = document.getElementById("netcare_extraction_div");

    // Check if the require content is present, otherwise display warning
    let validation = true;
    let errorMessage = "";

    // Get all the children of medications
    let primaryTables = document.querySelectorAll("#netcare_extraction_div > table");
    
    // Check how many tables there are (2 is expected)
    if (primaryTables.length === 2) {
        // 2 Tables = Content + "End of Report"
        // Check for end of report tag
        if (checkForEndOfReport(primaryTables[1]) === false) {
            validation = false;
            errorMessage =
                "Cannot detect end of report - please retry copying and pasting "
                + "the entire medication profile report";
        }

        // Extract the tbody of the first table to extract medication data
        let primaryBody = getChildren(primaryTables[0], "TBODY", false);

        // Extract the first table row element
        let primaryRow = getChildren(primaryBody, "TR", false);
        
        // Extract the first table data
        let primaryCell = getChildren(primaryRow, "TD", false);
        
        // Pass the table data and extract medications
        medications = extractMedications(primaryCell);
    } else if (primaryTables.length === 1) {
        // Only "End of Report"
        validation = false;
    } else {
        validation = false;
    }

    if (validation) {
        // Remove the veil
        let veil = document.getElementById("netcare_extraction_veil");
        document.body.removeChild(veil);

        // Send the response back to the extension
        sendResponse({ message: medications.innerHTML });
    } else {
        // Clear the editableDiv
        medications.innerHTML = "";

        // Send error message to user
        errorMessage =
            "Cannot extract medications from pasted text, "
            + "please retry copying and pasting text";

        let errorDiv = document.getElementById("netcare_extraction_errors");
        errorDiv.innerHTML = errorMessage;
    }
}

function cancelExtraction(e, sendResponse) {
    // Get the veil and cancel button
    let veil = document.getElementById("netcare_extraction_veil");
    let container = document.getElementById("netcare_extraction_container");
    let cancel = document.getElementById("netcare_extraction_cancel");

    // Checks if appropriate element clicked
    if (e.target === veil || e.target === cancel || e.target === container) {
        // Remove the veil
        document.body.removeChild(veil);

        // Send the response back to the extension
        sendResponse({ message: medications });
    }
}

function createLi(txt) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(txt));

    return li;
}

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
        veil.addEventListener("click", function (e) {
            cancelExtraction(e, sendResponse);
        });
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
            "Make sure to copy and paste all the text in the Netcare report "
            + "(from patient name to '- End of Report -'"
        ));
        instructions.appendChild(instructionsList);

        // Add a div to hold any error messages
        let errors = document.createElement("div");
        errors.id = "netcare_extraction_errors";
        content.appendChild(errors);

        // Add an editable div to collect the copied content
        // Editable div used to preserve as much HTML content as 
        // possible to ease data extraction
        let editableDiv = document.createElement("div");
        editableDiv.id = "netcare_extraction_div";
        editableDiv.contentEditable = "true";
        content.append(editableDiv);

        // Add a cancel button
        let cancelButton = document.createElement("input");
        cancelButton.type = "button";
        cancelButton.id = "netcare_extraction_cancel";
        cancelButton.value = "Cancel";
        cancelButton.addEventListener("click", function (e) {
            cancelExtraction(e, sendResponse);
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