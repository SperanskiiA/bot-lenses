const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '5505218556:AAGkI1db0ba9Vws9Wjrj-6d_lyBr7m8ycbc'

const bot = new TelegramApi(token, { polling: true })

const chats = {

}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Now i will guess the number from 0 to 9,  will U try to guess it?')
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Let's try to guess this one`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Start bot' },
        { command: '/info', description: 'Get all comands that allowed' },
        { command: '/game', description: `Start game - 'Guess the number' ` }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
        if (text === '/start') {

            await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/Happy_alpaca/png/21.png')
            return bot.sendMessage(chatId, `Welcome ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, 'there will be commands list')
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, `hello :) U R just send me ${text}, but I don't know what does it means :(`)
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id

        if (data === '/again') {
            return startGame(chatId)
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `WOW U R amazing! You're right, i guessed the number ${chats[chatId]} `, againOptions)
        } 

        if (data !== chats[chatId]) {
            return bot.sendMessage(chatId, `So you chose the number ${data} and it's wrong, but next time you will be lucky! I guessed the number ${chats[chatId]} `, againOptions)
        }

        console.log(`${data}, ${chats[chatId]}`)
    })
}

start()