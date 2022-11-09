module.exports = {

    gameOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '1', callback_data: '1' }, { text: '2', callback_data: '2' }, { text: '3', callback_data: '3' }],
                [{ text: '4', callback_data: '4' }, { text: '5', callback_data: '5' }, { text: '6', callback_data: '6' }],
                [{ text: '7', callback_data: '7' }, { text: '8', callback_data: '8' }, { text: '9', callback_data: '9' }],
                [{ text: '0', callback_data: '0' }]

            ]
        })
    },
    againOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: `Let's play again!`, callback_data: '/again' }]
            ]
        })
    },
    countLensesOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: '-', callback_data: '/decrease' },
                    { text: '+', callback_data: '/increase' }
                ]
            ]
        })
    },
    maxCapacityOptions:{
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'wear new one', callback_data: '/resetCounter'}]
            ]
        })
    },
    registerOptions:{
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: `Let's begin!`, callback_data: '/register'}]
            ]
        })
    },
    comeBackOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: 'reset', callback_data: '/resetCounter'},
                    {text: 'keep counter',  callback_data: '/keep'}
                ]
            ]
        })
    }


}