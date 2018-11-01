document.addEventListener('DOMContentLoaded', function() {	
    var form = document.getElementsByTagName("form");
    var button = document.getElementsByTagName("button");
    var elements = document.getElementsByTagName("input");

    button[0].onclick = function(e){
        //отправляем запрос о логине на background скрипт.
        chrome.runtime.sendMessage({
            type: "login",
            login: elements[0].value,
            password: elements[1].value
            
        });
        window.close();
    }
})