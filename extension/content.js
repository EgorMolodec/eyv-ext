/* Экземпляр этого скрипта работает в каждой вкладке. Его задачи:
1) Получить выделение со странички и обработать его(найти предложение содержащее слово).
2) Отобразить подсказку, содержащую информацию о выделенных словах, (пока показываться перевод на русский).
3) Обрабатывать взаимодействие с карточкой (пока не реализованно)
*/

//создаём элемент в который будем воводить карточку на страничке.
//пока это просто текст.
var hint = document.createElement("object");
hint.setAttribute("class", "hint");
document.body.appendChild(hint);

//функция обработчик события mouseup
document.addEventListener("mouseup", function(e) {
    chrome.storage.local.get("running", function(app) {
        //если расширение работает(ораньжевый значок) то получаем выделение со страницы.
        if (app.running) {
            //в word будет храниться выделение, в sentence предложение которое содержит выделенное слово.
            var word, sentence;
            sel = window.getSelection();
            word = sel.toString();
            console.log("word: ", word);
            //Если выделение не пустое то
            if (!sel.isCollapsed) {
                //Дальше идёт тёмная магия, необходимая для извлечения всего предложения.
                var range = document.createRange()
                rng = document.createRange();

                range.setStart(sel.anchorNode, sel.anchorOffset);
                range.setEnd(sel.focusNode, sel.focusOffset);
                rng.setStart(sel.focusNode, sel.focusOffset);
                rng.setEnd(sel.anchorNode, sel.anchorOffset);
                var backwards = range.collapsed;

                var endNode = sel.focusNode,
                    endOffset = sel.focusOffset;
                sel.collapse(sel.anchorNode, sel.anchorOffset);

                var direction = [];
                if (backwards) {
                    direction = ["backward", "forward"];
                    range = rng;
                } else {
                    direction = ["forward", "backward"];
                }

                sel.modify("move", direction[1], "sentenceboundary");
                sel.extend(endNode, endOffset);
                sel.modify("extend", direction[0], "sentenceboundary");

                sentence = sel.toString();
                // в отладочных целях выводим предложение на консоль
                console.log("sentence: ", sentence);

                window.getSelection().removeAllRanges();
                sel.addRange(range);
                //Отправляем инфу на background скрипт.
                chrome.runtime.sendMessage({
                    type: "translate",
                    word: word,
                    sentence: sentence,
                    mX: e.clientX,
                    mY: e.clientY
                });
            }
        }
    });

}, false);
//Убираем карточку по клику
document.addEventListener('click', function(e) {
    hint.style.visibility = 'hidden';
}, false);
//функция отображения карточки (ну или подсказки)
function renderhint(mouseX, mouseY, text) {
    hint.innerHTML = text;
    //Позиционирование карточки на страничке работает плохо
    hint.style.top = mouseY + 'px';
    hint.style.left = mouseX + 'px';
    hint.style.visibility = 'visible';
}
//Принимаем сообщения от бэкграунда
chrome.runtime.onMessage.addListener(function(inf) {
    renderhint(inf.mX, inf.mY, inf.text.text[0]);
});