const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions, countLensesOptions, maxCapacityOptions, registerOptions, comeBackOptions} = require('./options')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {User} = require("./userModel");

const token = '5505218556:AAGkI1db0ba9Vws9Wjrj-6d_lyBr7m8ycbc'

const mongopass='qwerty123'
const mongouser = 'bot'

mongoose.connect('mongodb+srv://bot:qwerty123@cluster0.gibn6kv.mongodb.net/lenses_bot_db').then(() => {
    console.log('db is ok')
}).catch((err) => {console.log('error is:  ' + err)});

const bot = new TelegramApi(token, { polling: true })



let lensesCount ;

const register = async (msg) => {
    try{
    const name = `${msg.from.first_name}`

    const doc = new User({
         name: name,
         chatId: msg.message.chat.id,
         currentValue: 0,
         prevValue: 0
        })
        const user = await doc.save((err, doc) => {
            if(err){
                console.log(err)
            }
            console.log('saved data ' + doc)
        });
        console.log(user)
    }catch (error){
        console.log(error)
    }
}

const getCounter = async (chatId) => {

    if(lensesCount === undefined){
        await bot.sendMessage(chatId, `I'll help you to count how many times U R wearing your contact lenses! Let's get started!`);
        await bot.sendMessage( chatId, `Well, now you are wearing your lenses ${lensesCount} times. Let's change it!`, countLensesOptions )
    }
    if(lensesCount >= 0 && lensesCount < 14){
        await bot.sendMessage( chatId, `Well, now you are wearing your lenses ${lensesCount} times. Let's change it!`, countLensesOptions )
    }

   
}

// const startGame = async (chatId) => {
//     await bot.sendMessage(chatId, 'Now i will guess the number from 0 to 9,  will U try to guess it?')
//     const randomNumber = Math.floor(Math.random() * 10);
//     chats[chatId] = randomNumber;
//     await bot.sendMessage(chatId, `Let's try to guess this one`, gameOptions)
// }

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Start bot' },
        { command: '/info', description: 'Get all comands that allowed' },
        // { command: '/game', description: `Start game - 'Guess the number' ` },
        {command: '/count', description: 'Count how many times U R wearing youre contact lenses already'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
        if (text === '/start') {
            try {
                const user = await User.findOne({chatId: chatId})
            if(!user){
                return bot.sendMessage(chatId, `Welcome ${msg.from.first_name} ${msg.from.last_name}. You are such a newby here? To continue press the button bellow`, registerOptions)
            }else{
                console.log(user)
                return bot.sendMessage(chatId, `Welcome back ${msg.from.first_name} ${msg.from.last_name}! It seems like you are already have a lenses counter. What you wanna do with?`, comeBackOptions)
            }
              
            } catch (error) {
                console.log(error)
                return bot.sendMessage(chatId, 'somthing went wrong')
            }
          
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, 'there will be commands list')
        }
        // if (text === '/game') {
        //     return startGame(chatId)
        // }
        if (text === '/count'){
            return getCounter(chatId)
        }
        return bot.sendMessage(chatId, `hello :) U R just send me ${text}, but I don't know what does it means :(`)
    })

    bot.on('callback_query' , async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const user = await User.findOne({chatId: chatId})

        if(data === '/resetCounter'){
            const prev = user.currentValue;
            user.updateOne({prevValue: prev, currentValue: 0}).then(bot.sendMessage(chatId, `Your lenses counter reseted. Enjoy with new one pair of lenses!`, countLensesOptions))
            
        }
        if(data === '/keep'){
            return bot.sendMessage(chatId, `Your counter was kept, your current count = ${user.currentValue}`, countLensesOptions)
        }
        
        if(data === '/decrease'){
            const prev = user.currentValue;
            const current = prev - 1;
            
            if(prev > 0){
               await user.updateOne({prevValue: prev, currentValue: current})
            }else{
               await user.updateOne({prevValue: prev, currentValue: 0})
            }
            return await bot.sendMessage(chatId, `Your current count = ${current}. Do U wanna change it?`, countLensesOptions)
        }
        if(data === '/increase'){
            const prev = user.currentValue;
            const current = prev + 1;

            if(prev >= 0 && prev < 11){
                await user.updateOne({prevValue: prev, currentValue: current})
                await bot.sendMessage(chatId, `Your current count = ${current}. Do U wanna change it?`,countLensesOptions)
            }
            if(prev >= 11 && prev < 14){
                await user.updateOne({prevValue: prev, currentValue: current})
                await bot.sendMessage({})
            }
            if(prev == 14){
                bot.sendMessage(chatId, `U R have already wearing your lenses 14 times! U should wear another one this time!`, maxCapacityOptions)
            }
            
          
        }
        if(data === '/register'){
            register(msg);
            return bot.sendMessage(chatId, 'It might takes few second..')
        }
    })
}
start()
//     bot.on('callback_query', msg => {
//         const data = msg.data;
//         const chatId = msg.message.chat.id
//         console.log(`${data}, ${chats[chatId]}`)

//         if (data === '/again') {
//             return startGame(chatId)
//         }

//         if (data == chats[chatId]) {
//             return bot.sendMessage(chatId, `WOW U R amazing! You're right, i guessed the number ${chats[chatId]} `, againOptions)
//         } 

//         if (data !== chats[chatId]) {
//             return bot.sendMessage(chatId, `So you chose the number ${data} and it's wrong, but next time you will be lucky! I guessed the number ${chats[chatId]} `, againOptions)
//         }

        
//     })
// }

