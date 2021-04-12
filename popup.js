//Wire up event event handlers
document.addEventListener("DOMContentLoaded", function(event) {
    var configBtn = document.getElementById("configureShortCuts");
    configBtn.onclick = openShortcuts;
});

function openShortcuts(){ 
    chrome.runtime.sendMessage({action: 'openConfig'}); 
}