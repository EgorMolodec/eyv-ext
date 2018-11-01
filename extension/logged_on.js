// здесь по идее что-то ещё должно быть. пока это вкл/выкл расширения
chrome.storage.local.get("running", function(app) {
    if (!app.running) {
        chrome.storage.local.set({
            running: true
        });
        chrome.browserAction.setIcon({
            path: "running.png"
        });
    } else {
        chrome.storage.local.set({
            running: false
        });
        chrome.browserAction.setIcon({
            path: "icon16.png"
        });
    }
});
