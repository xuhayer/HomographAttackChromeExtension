//Creates an event listener to check status of tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //variable to store pages visited on a domain
  var visited=0;
  //Check if the tab is loaded
  if (changeInfo.status == 'complete'){
    //get domain name from url
    var url = new URL(tab.url);
    //debug output to console
    console.log(url.hostname);
    //search from history if domain was visited before by user
    chrome.history.search({text: url.hostname}, function(data) {
      //loop through results and increment count
    data.forEach(function(page) {
        visited=visited + 1;
    });
    //If the user has not visited the domain at least 5 times in the past
    //User will be alerted to be wary of the site
    if(visited<5){
      //Set popup to unsafe
      chrome.action.setPopup({
        popup: 'unsafe.html'
      });
      chrome.action.setIcon({ path: "unsafe.png" });
    }
    else{
      //set popup to safe
      chrome.action.setIcon({ path: "safe.png" });
      chrome.action.setPopup({
        popup: 'safe.html'
      });

    }
  });
  }
});
//create context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id:"Homograph?",
    "title": "Check link for homograph attack",
    type:"normal",
    contexts:["selection"]

  });
});
//perform function if clicked context menu item
chrome.contextMenus.onClicked.addListener((info) => {
  var inp = info.selectionText;
  var unicode;
  var safe = new Boolean(false);
  for(const s of inp){
    unicode = s.charCodeAt(0);
    if(unicode>=65 && unicode<=90){
      safe = true;
    }
    else if(unicode>=97 && unicode<=122){
      safe = true;
    }
    else{
      safe = false;
      break;
    }
  }
  if(safe==false){
    console.log("Unsafe");
  }
  else{
    console.log("Safe");
  }
});
