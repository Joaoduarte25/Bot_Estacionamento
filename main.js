const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Message = require('./messages');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true});
});

client.once('ready', () => {
    console.log('Bot está pronto!');
});

const userState = {};

client.on('message', async (msg) => {
    const chatId = msg.from;
    const body = msg.body.trim().toLocaleLowerCase();

    if (body === 'menu' || !userState[chatId]) {
        userState[chatId] = 'menu';
        return client.sendMessage(chatId, Message.getMessage(10));
    }

    if (userState[chatId] === 'menu') {
        if (body === '2') {
            userState[chatId] = 'attendent';
        }
        return client.sendMessage(chatId, Message.getMessage(body));
    }
});

client.on('message_create', async (msg) => {
    const chatId = msg.to;
    const body = msg.body.trim().toLocaleLowerCase();

    if (msg.fromMe && body == 'encerrar atendimento') {
        userState[chatId] = 'menu';
        await client.sendMessage(chatId, Message.getMessage(7));
        await sleep(3000);
        return client.sendMessage(chatId, Message.getMessage(10)); 
    }
});

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

client.initialize();