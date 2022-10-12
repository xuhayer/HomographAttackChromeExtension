chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  var visited=0;
  if (changeInfo.status == 'complete'){
    var url = new URL(tab.url);
    console.log(url.hostname);
    chrome.history.search({text: url.hostname}, function(data) {
    data.forEach(function(page) {
        visited=visited + 1;
    });
    if(visited<5){
      chrome.action.setPopup({
        popup: 'unsafe.html'
      });
      chrome.action.setIcon({ path: "unsafe.png" });
    }
    else{
      chrome.action.setIcon({ path: "safe.png" });
      chrome.action.setPopup({
        popup: 'safe.html'
      });

    }
  });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id:"Homograph?",
    "title": "Check link for homograph attack",
    type:"normal",
    contexts:["selection"]

  });
});
//perform function if clicked
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
