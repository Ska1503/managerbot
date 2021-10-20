const start = ` приветствую тебя  &#128587
Как твои дела?
Я, Task Manager Bot
Воспользуйся командой /help что-бы узнать, что я умею &#128522
`
const help = `Я умею хранить твои задачи, просто напиши её и отправь мне. 
У меня ты можешь узнать точное время и дату &#128343 , я подскажу тебе какая сейчас погода &#9925 , смотивирую тебя &#128170 ,
также ты можешь узнать статистику по Covid-19`

const task = '<b>Ты не добавил ни одной задачи</b> &#128581\n\n' + 'Что-бы добавить задачу, просто напиши и отправь мне &#128071'

const deleteTask ='Введи <i> «Удалить "порядковый номер задачи"» </i>, чтобы удалить сообщение, ' +
' например, <b> «Удалить 3»</b>:'

const covid = 'Узнай статистику по Covid-19. Выбери название страны и получи статистику '


module.exports.start = start
module.exports.help = help
module.exports.task = task
module.exports.deleteTask = deleteTask
module.exports.covid = covid

