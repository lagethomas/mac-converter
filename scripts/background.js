let popupWindowId = null;

chrome.action.onClicked.addListener(() => {
  if (popupWindowId !== null) {
    chrome.windows.get(popupWindowId, (window) => {
      if (chrome.runtime.lastError || !window) {
        createWindow();
      } else {
        chrome.windows.update(popupWindowId, { focused: true });
      }
    });
  } else {
    createWindow();
  }
});

function createWindow() {
  chrome.windows.create({
    url: 'popup.html',
    type: 'popup',
    width: 400,
    height: 650
  }, (window) => {
    popupWindowId = window.id;
  });
}

// Reset window ID when closed
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    popupWindowId = null;
  }
});