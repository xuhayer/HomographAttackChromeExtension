//Creates an event listener to check status of tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	var visited=0; //variable to store pages visited on a domain
	if (changeInfo.status == 'complete') { //Check if the tab is loaded
		var url = new URL(tab.url); //get domain name from url
		console.log(url.hostname); //debug output to console
		chrome.history.search({maxResults: 0, startTime: 0, text: url.hostname}, function(data) { //search from history if domain was visited before by user
			console.log(data);
			data.forEach(function(page) { //loop through results and increment count
				visited += page.visitCount;
			});
			if (visited<5) { //if user hasn't visited this site at least 5 times, alert user
				chrome.action.setPopup({ popup: 'unsafe.html' }); //Set popup to unsafe
				chrome.action.setIcon({ path: "question.png" });
			}
			else { //set popup to safe
				chrome.action.setIcon({ path: "check.png" });
				chrome.action.setPopup({ popup: 'safe.html' });
			}
		});
	}
});

//Creates an option in the right-click context menu
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id:"Homograph?",
		"title": "Check link for homograph attack",
		type:"normal",
		contexts:["selection"]
	});
});

//Check a link for if it has any suspicious characters
chrome.contextMenus.onClicked.addListener((info) => { //if clicked on the right-click context menu
	var input = info.selectionText; //the text that was selected when clicked
	var unicode;
	var safe = new Boolean(true); //flags if the text is safe or not

	//Initialise the desktop notifications
	let m1 = {
		type:"basic",
		title:"Possible Homograph Attack Detected",
		message:"The link was identified as suspicious.",
		iconUrl:"question.png"
	}
	let m2 = {
		type:"basic",
		title:"Link Safe",
		message:"The link does not appear to contain suspicious characters.",
		iconUrl:"check.png"
	}

	//Test and create a notification if suspicious or not
	for (var char = 0; char < input.length; char++) { //Check each individual letter
		console.log(input[char]);
		if (!input[char].match(/^[\w;,\/?:@&=+$\-_.!~*'()#]+$/)) { //tests if the letters aren't in alphanumeric characters and URL-regular symbols
			console.log("Match");
			safe = false;
			break;
		}
	}
	if (safe==false) { 
		chrome.notifications.create(m1);
	}
	else {
		chrome.notifications.create(m2);
	}
});
