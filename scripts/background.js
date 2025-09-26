// scripts/background.js
chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: 'popup.html',
    type: 'popup',
    width: 370,  // Ajustado ligeiramente para mais compacto
    height: 600  // Pode ser o ideal, ajuste se houver scroll
  });
});