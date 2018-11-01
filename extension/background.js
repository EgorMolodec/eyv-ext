/*Этот скрипт работает в браузере постоянно. Через него будет производиться обмен сообщениями между нашим сервером и расширением,
а так же обрабатываться взаимодействие с другими скриптами*/

//При установке расширения устанавливаем флаг не активности
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({
        running: false
    });
});

var urls = [
    "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20180910T172340Z.3292a5181cd4fa28.2bf15bfc6d6270551ad0326d8f08335b8f1687f1&lang=en-ru&text="
]

//функция приёма и оработки  сообщений от других скриптов.
chrome.runtime.onMessage.addListener(function(request, sender) {

    switch (request.type) {
        //что-то не пустое было выделено в content скрипте
        case "translate":
            request.url = urls[0];
            //запоминаем от какой вкладки пришёл запрос.
            request.tabid = sender.tab.id
            //отправляем на удалённый сервер.
            send(request, makehint);
            break;
            //сообщение от login скрипта
        case "login":
            //елси авторизация успешная то меняем картинку и попап.(пока считаем её успешной)
            chrome.browserAction.setIcon({
                path: "running.png"
            });
            chrome.storage.local.set({
                login: true
            });
            chrome.storage.local.set({
                running: true
            });
            chrome.browserAction.setPopup({
                popup: "logged_on.html"
            });

            break;
        default:
            break;
    }
});

//Функция оправки сообщений на сервер.
//request - инфа по запросу, callback - функция обработчик ответа от сервера.
function send(request, callback) {

    var req = new XMLHttpRequest();
    //отправляем запрос.
    req.open(
        "GET",
        request.url + request.word,
        true
    );

    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var data = JSON.parse(req.responseText);
                //Если получили успешный ответ, то вызываем callback
                callback(data, request);

            } else {
                console.log("send error");
            }
        }
    }
    req.send();
}
//Функция отправляет инфу, полученную от удалённого сервера, обратно на content скрипт.
function makehint(data, req) {

    chrome.tabs.sendMessage(req.tabid, {
        text: data,
        mX: req.mX,
        mY: req.mY
    });
}