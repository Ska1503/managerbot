const start = ` приветствую тебя  &#128587
Как твои дела?
Я, Task Manager Bot
Воспользуйся командой /help что-бы узнать, что я умею &#128522
`
const help = `Я умею хранить твои задачи, просто напиши её и отправь мне &#128221
У меня ты можешь узнать точное время и дату &#128343
Я подскажу тебе какая сейчас погода &#9925
Смотивирую тебя &#128170
Также, я покажу тебе точную статистику по Covid-19
И ещё посмотри актуальный курс валют &#128176`

const aboutBot = `Если тебе интересно, посмотри как я был разработан 
https://github.com/Ska1503/managerbot/blob/main/bot.js
`

const task = '<b>Ты не добавил ни одной задачи</b> &#128581\n\n' + 'Что-бы добавить задачу, просто напиши и отправь мне &#128071'

const deleteTask ='Введи <i> Удалить "порядковый номер задачи" </i>, чтобы удалить сообщение, ' +
' например: <b> «Удалить 3»</b>'

const covid = 'Узнай статистику по Covid-19 &#129440 \nВыбери страну и получи статистику'

const curText = 'Актуальный курс валют &#128185\nВыбери валюту'

module.exports.start = start
module.exports.help = help
module.exports.task = task
module.exports.deleteTask = deleteTask
module.exports.covid = covid
module.exports.curText = curText
module.exports.aboutBot = aboutBot

