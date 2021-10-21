require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const express = require('express')
const Session = require('telegraf-session-local')
const text = require('./consts.js')
const api = require('covid19-api')
const moment = require('moment')
const axios = require('axios')
const cc = require('currency-codes')

const app = express()
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(new Session())


bot.start(ctx => {
  ctx.replyWithHTML(`<b>${ctx.message.from.first_name}</b>, ${text.start} `,getMainMenu())
})

bot.help(ctx => {
  ctx.replyWithHTML(text.help)
})

bot.hears('Мои задачи', async ctx => {
  const tasks = await getMyTask()
  let result = ''

  for (let i = 0; i < tasks.length; i++) {
    result += `[${i+1}] ${tasks[i]}\n`
  }

  if (tasks.length === 0) {
    result = result.trim()
    ctx.replyWithHTML(text.task)
  } else {
    ctx.replyWithHTML(
      `<b>Список твоих задач:</b> &#128221 \n\n  ${result}`
    )
  }
})


bot.hears('Удалить задачу', ctx => {
  ctx.replyWithHTML(text.deleteTask)
})


bot.hears(/^Удалить\s(\d+)$/, ctx => {
  const id = Number(+/\d+/.exec(ctx.message.text)) - 1
  deleteTask(id)
  ctx.reply('Задача удалена')
})


bot.hears('Смотивируй меня', ctx => {
  ctx.replyWithPhoto(randomImg(), {
    caption: randomQuotes()
  })
})


bot.hears('Время', ctx => {
  moment.locale('ru')
  ctx.replyWithHTML(moment().format('LLLL') + ' &#9200')
})


bot.hears('Погода',async ctx => {
 
const key = '95ba65247e84ad3b5fe1fa5e2c4db1c8'
let city = 'Zaporizhia'
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&units=metric&appid=${key}`


  axios.get(url).then(res => {
    try {
      ctx.replyWithHTML(`
      <i><b>Погода в ${res.data.name}</b></i>
       
<b>Температура:</b> ${res.data.main.temp}&#176
<b>Влажность:</b> ${res.data.main.humidity}%
<b>Скорость ветра:</b> ${res.data.wind.speed} м/с
    `)
    } catch (error) {
      console.log('Error');
    }
    
  })  
})


bot.hears('Covid-19', ctx => {
  ctx.replyWithHTML(text.covid, covidKeyboard())
})
addCovidKeyboard('Ukraine')
addCovidKeyboard('Russia')
addCovidKeyboard('Poland')
addCovidKeyboard('Belarus')


bot.hears('Курс валют', ctx => {
  ctx.replyWithHTML(text.curText, getCurKeyboard())
})
addCurrencyKeyboard('USD')
addCurrencyKeyboard('EUR')
addCurrencyKeyboard('RUB')
addCurrencyKeyboard('PLN')


bot.on('text', ctx => {
  ctx.session.taskText = ctx.message.text

  ctx.replyWithHTML(
    `Ты действительно хочешь добавить задачу?\n\n` +
    `<b><i>${ctx.message.text}</i></b>`, yesNoKeyboard()
  )
})


bot.action(['yes', 'no'], ctx => {
  if (ctx.callbackQuery.data === 'yes') {
    addTask(ctx.session.taskText)
    ctx.editMessageText('Задача добавлена')
  } else {
    ctx.deleteMessage()
  }
})



// RANDOM IMG, QUOTES

function randomQuotes() {
  let quotes = [
    '«Лучший способ взяться за что-то — перестать говорить и начать делать»',
    '«Мы – рабы своих привычек. Измени свои привычки, изменится твоя жизнь»',
    '«Желать и ждать – на этом далеко не уедешь. Встань и начни следовать за своей мечтой»',
  ]
  let resultQuotes = quotes[Math.floor(Math.random() * quotes.length)] // СЛУЧАЙНЫЙ ЭЛЕМЕНТ ИЗ МАССИВА

  return resultQuotes
}

function randomImg() {
  let arrImg = ['https://s0.tchkcdn.com/g-lQlYshwNFx9Nu1Z-gE_TOw/9/187322/660x0/w/0/3157c1caf18550bbf34d77f4ce2833fd_9ga91qmeq9o.jpg',
    'https://s1.tchkcdn.com/g-GZ44flA6l5s5pIo7xQXi3w/9/187324/660x0/w/0/3e4e6d1eb287c295086017701ddfa0d9_afvxh41qz_s.jpg',
    'https://www.google.com/imgres?imgurl=https%3A%2F%2Fs0.tchkcdn.com%2Fg-4USmkC_LnD9OkdFFdz6M4g%2F9%2F187334%2F660x0%2Fw%2F0%2F0799f5ce437a354a32826f4564a654fa_vpg3nqpnete.jpg&imgrefurl=https%3A%2F%2Ffun.tochka.net%2Fpictures%2F83092-motiviruyushchie-kartinki%2F&tbnid=FE9tyqbyYTS_QM&vet=10CAUQxiAoBGoXChMI-IaVzInR8wIVAAAAAB0AAAAAEAY..i&docid=UR8RO57UJYb6dM&w=550&h=334&itg=1&q=%D0%BC%D0%BE%D1%82%D0%B8%D0%B2%D0%B8%D1%80%D1%83%D1%8E%D1%89%D0%B8%D0%B5%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8&ved=0CAUQxiAoBGoXChMI-IaVzInR8wIVAAAAAB0AAAAAEAY',
  ]
  let resultImg = arrImg[Math.floor(Math.random() * arrImg.length)] // СЛУЧАЙНЫЙ ЭЛЕМЕНТ ИЗ МАССИВА

  return resultImg
}


// DATABASE

let taskList = []

function getMyTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(taskList)
    }, 500)
  })
}

function addTask(text, voice) {
  taskList.push(text)
  // taskList.push(voice)
}

function deleteTask(id) {
  taskList.splice(id, 1)
}


// KEYBOARDS

function getMainMenu() {
  return Markup.keyboard([
    ['Мои задачи','Удалить задачу'],
    ['Смотивируй меня', 'Время'],
    ['Погода', 'Covid-19'],
    ['Курс валют']
  ]).resize()
}


function yesNoKeyboard() {
  return Markup.inlineKeyboard([
    Markup.button.callback('Да','yes'),
    Markup.button.callback('Нет', 'no')
  ], {columns:2})
}


function covidKeyboard() {
  return Markup.inlineKeyboard([
    Markup.button.callback('Украина', 'Ukraine'),
    Markup.button.callback('Россия', 'Russia'),
    Markup.button.callback('Польша', 'Poland'),
    Markup.button.callback('Беларусь', 'Belarus'),
  ],{columns:2})
}


function getCurKeyboard() {
  return Markup.inlineKeyboard([
    Markup.button.callback('Доллар', 'USD'),
    Markup.button.callback('Евро', 'EUR'),
    Markup.button.callback('Рубль', 'RUB'),
    Markup.button.callback('Злотый', 'PLN')
  ], {columns:2})
}


function addCovidKeyboard(name) {
  bot.action(name, async ctx => {
    let data = {}
  
    try {
    await ctx.answerCbQuery()
    data = await api.getReportsByCountries(`${name}`)
  
    const formatData = `
<b>Страна:</b>  ${data [0][0].country} 	
<b>Случаи:</b>  ${data [0][0].cases}
<b>Смертей:</b>  ${data [0][0].deaths}
<b>Вылечились:</b>  ${data [0][0].recovered} 
    `
    ctx.replyWithHTML(formatData)
    } catch {
    console.log('Ошибка')
    ctx.reply('Ошибка, такой страны не существует.')
    }
  })
}


function addCurrencyKeyboard(currName) {
  bot.action(currName, async ctx => {
    const clientCurCode = currName
    const currencyCode = cc.code(clientCurCode)

    try {
      await ctx.answerCbQuery()
      const currencyObj = await axios.get('https://api.monobank.ua/bank/currency')

      const foundCurrency = currencyObj.data.find((cur) => {
        return cur.currencyCodeA.toString() === currencyCode.number
      })
      ctx.replyWithHTML(`
<b>Валюта:</b>   ${currencyCode.code}
<b>Покупка:</b>  ${foundCurrency.rateBuy}
<b>Продажа:</b>  ${foundCurrency.rateSell}
      `)

    } catch (error) {
       ctx.replyWithHTML('Попробуй позже &#128257')
      }
  })
}

bot.launch()
app.listen(3000, () => console.log('Start'))

