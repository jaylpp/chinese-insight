chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openOptionsPage") {
    chrome.runtime.openOptionsPage((err) => {
      if (err) {
        console.error('Error opening options page:', err);
        sendResponse({status: "Error", message: err.message});
      } else {
        sendResponse({status: "Success", message: "Options page opened"});
      }
    });
    return true; // 保持消息通道开放，以便异步发送响应
  } else if (request.action === "getConfig") {
    chrome.storage.sync.get(['apiKey', 'modelName'], function(items) {
      sendResponse(items);
    });
    return true; // 保持消息通道开放，以便异步发送响应
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { action: "tabUpdated" }, (response) => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
      }
    });
  }
});