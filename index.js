const TelegramApi = require('node-telegram-bot-api')
const { continueOptions, countLensesOptions, maxCapacityOptions, registerOptions, comeBackOptions, maxAmountOtions, increaseOptions, setAmountOptionsFirst, resetCounter } = require('./options')
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require("./userModel");

const token = '5505218556:AAGkI1db0ba9Vws9Wjrj-6d_lyBr7m8ycbc'

// const mongopass = 'qwerty123'
// const mongouser = 'bot'

mongoose.connect('mongodb+srv://bot:qwerty123@cluster0.gibn6kv.mongodb.net/lenses_bot_db').then(() => {
    console.log('db is ok')
}).catch((err) => { console.log('error is:  ' + err) });

const bot = new TelegramApi(token, { polling: true })

const info = [
    '/start ==> Get started with bot, bot allow you check out how many times U R already wear your lenses',
    '/setMaxAmount ==> Set max amount of uses your lenses (you can check it on the package). Type your number of uses',
    '/reset ==> Reset your counter'
]


let setAmountBool = false

const register = async (msg) => {
    try {
        const name = `${msg.from.first_name}`

        const doc = new User({
            name: name,
            chatId: msg.message.chat.id,
            currentValue: 0,
            prevValue: 0
        })
        const user = doc.save((err, doc) => {
            if (err) {
                console.log(err)
            }
            console.log('saved data ' + doc)
        });
        console.log(user)
    } catch (error) {
        console.log(error)
    }
}

const getCounter = async (chatId, current) => {
    const counterMessages = [
        `Your current count = ${current}. Do U wanna change it?`,
        `Well, now your counter = ${current}. Wanna change it, huh?`,
        `You're wear you lenses ${current} times. Enjoy with new one pair!`,
        `Great! You put your lenses on ${current} times. Let me know if you wanna change it`,
        `Glad we got along! Your count equal ${current}. Do U wanna change it?`,
    ];

    const randomNumber = Math.floor(Math.random() * 5);


    return bot.sendMessage(chatId, counterMessages[randomNumber], countLensesOptions);
}
const getMaxCounter = (chatId, current, maxAmount) => {
    const counterMessages = [
        `You're wear you lenses ${current} times. Keep in mind,  you have only ${maxAmount - current} times to use your lenses. Sounds like a time to get a new one pack :)`,
        `You're already wear you lenses ${current} times,  you have only ${maxAmount - current} times to use it. It's time to get another one packege of leanses!`,
        `You're already wear you lenses ${current} times, after ${maxAmount - current} uses you should to wear another one. Buy new pack ASAP! Your eyes will thank you!`
    ]

    const randomNumber = Math.floor(Math.random() * 3);


    return bot.sendMessage(chatId, counterMessages[randomNumber], countLensesOptions);
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Start bot' },
        { command: '/info', description: 'Get all comands that allowed' },
        { command: '/reset', description: 'Reset your counter' },
        { command: '/max', description: 'Set up your max amount of uses' }

    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
        if (text === '/start') {
            try {
                const user = await User.findOne({ chatId: chatId })
                if (!user) {
                    return bot.sendMessage(chatId, `Welcome ${msg.from.first_name}. You are such a newby here? To continue press the button bellow`, registerOptions)
                } else {
                    console.log(user)
                    return bot.sendMessage(chatId, `Welcome back ${msg.from.first_name}! It seems like you already have a lenses counter. What you wanna do with?`, comeBackOptions)
                }

            } catch (error) {
                console.log(error)
                return bot.sendMessage(chatId, 'somthing went wrong')
            }

        }
        if (text === '/info') {
            {
                info.map((item) => {
                    return bot.sendMessage(chatId, item)
                })
            }
            return
        }
        if (text === '/setMaxAmount') {
            const txt = 'Please set max amount of uses. You can check it on the packege of your contact lenses! Keep in mind by default max amount would be equal 14 times! P.S. counter would be reseted'
            return bot.sendMessage(chatId, txt, maxAmountOtions)
        }
        if (text === '/reset') {
            return bot.sendMessage(chatId, 'To reset counter type button bellow', resetCounter)
        }
        if (text === '/max') {
            return bot.sendMessage(chatId, 'Please set max amount of uses. You can check it on the packege of your contact lenses! Keep it mind by default max amount would be equal 14 times! P.S. counter would be reseted', maxAmountOtions)
        }

        if (setAmountBool) {
            if (parseInt(text)) {
                console.log(text + setAmountBool)
                const user = await User.findOne({ chatId: chatId })
                if (parseInt(text) === user.maxAmount) {
                    setAmountBool = false;
                    return bot.sendMessage(chatId, 'It seems like the value you entered is equal to the value you set earlier. Would you like to continue with? ', continueOptions)
                } else {
                    await user.updateOne({ maxAmount: parseInt(text), currentValue: 0 })
                    setAmountBool = false
                    console.log(setAmountBool)
                    return bot.sendMessage(chatId, `Your amount = ${text}, to continue press the button bellow`, continueOptions)
                }
            } else {
                return bot.sendMessage(chatId, 'Please type the number!')
            }

        } else {
            return bot.sendMessage(chatId, `hello :) U R just send me ${text}, but I don't know what does it means :(`)
        }


    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/register') {
            register(msg);
            await bot.sendMessage(chatId, `It might take a few second..`)
            return bot.sendMessage(chatId, `Great! Let's set up the number of uses of your lenses. You can check it on the packege of your contact lenses! Keep it mind by default max amount would be equal 14 times! `, setAmountOptionsFirst)
        }
        const user = await User.findOne({ chatId: chatId })

        if (data === '/resetCounter') {
            const prev = user.currentValue;
            user.updateOne({ prevValue: prev, currentValue: 0 }).then(bot.sendMessage(chatId, `Your lenses counter reseted. Enjoy with new one pair of lenses!`, countLensesOptions))

        }
        if (data === '/keep') {
            return bot.sendMessage(chatId, `Your counter was kept, your current count = ${user.currentValue}`, countLensesOptions)
        }

        if (data === '/decrease') {
            const prev = user.currentValue;
            const current = prev - 1;
            const maxAmount = user.maxAmount;

            if (current > 0) {
                await user.updateOne({ prevValue: prev, currentValue: current })
                const message = getCounter(chatId, current)
                return message;
            } else {
                await user.updateOne({ prevValue: prev, currentValue: 0 })
                return await bot.sendMessage(chatId, `Your current count = 0. Do U wanna change it?`, increaseOptions)
            }

        }
        if (data === '/increase') {
            const prev = user.currentValue;
            const current = prev + 1;
            const maxAmount = user.maxAmount;

            if (current >= 0 && current < maxAmount - 5) {
                await user.updateOne({ prevValue: prev, currentValue: current })
                const message = getCounter(chatId, current);
                return message
            }
            if (current >= maxAmount - 5 && current < maxAmount) {
                await user.updateOne({ prevValue: prev, currentValue: current })
                const message = getMaxCounter(chatId, current, maxAmount)
                return message
            }
            if (current == maxAmount) {
                bot.sendMessage(chatId, `U R have already wearing your lenses ${maxAmount} times! U should wear another one this time!`, maxCapacityOptions)
            }
        }
        if (data === '/setAmount') {

            setAmountBool = true
            return bot.sendMessage(chatId, 'Please type your max amount as number')
        }

        if (data === '/continue') {
            return bot.sendMessage(chatId, `Great! Let's continue`, countLensesOptions)
        }
        if (data === '/continueByDefault') {
            await user.updateOne({ maxAmount: 14, currentValue: 0 })
            return bot.sendMessage(chatId, `Great! Let's continue`, countLensesOptions)
        }

    })
}
start()

