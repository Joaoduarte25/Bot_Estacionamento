const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const qrcode = require('qrcode-terminal')
const pino = require('pino')
const Message = require('./messages')

const userState = {}

async function startBot() {
    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['Mendes Estacionamento', 'Chrome', '1.0.0']
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update

        if(qr) {
            console.log('Escaneia o QR Code:')
            qrcode.generate(qr, { small: true })
        }

        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode!== DisconnectReason.loggedOut
            console.log('Conexão fechada. Reconectando:', shouldReconnect)
            if (shouldReconnect) {
                startBot()
            } else {
                console.log('Deslogado. Deleta a pasta auth_info e reinicia.')
            }
        }

        if(connection === 'open') {
            console.log('Bot está pronto!')
        }
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const chatId = msg.key.remoteJid
        if (chatId.endsWith('@g.us')) return // ignora grupo

        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
        const texto = body.trim().toLowerCase()

        // 1. MENU OU PRIMEIRA MSG - sempre reseta
        if (texto === 'menu' ||!userState[chatId]) {
            userState[chatId] = 'menu'
            return await sock.sendMessage(chatId, { text: Message.getMessage(10) })
        }

        // 2. SE TÁ PAUSADO: reativa se for número válido ou menu
        if (userState[chatId] === 'attendant') {
            if (/^[1-8]$/.test(texto) || texto === 'menu') {
                userState[chatId] = 'menu' // reativa e continua
            } else {
                return // ignora texto aleatório
            }
        }

        // 3. MENU PRINCIPAL
        if (userState[chatId] === 'menu') {
            if (texto === '2') {
                userState[chatId] = 'attendant'
                return await sock.sendMessage(chatId, { text: Message.getMessage(2) })
            }

            if (texto === '8') {
                userState[chatId] = 'attendant'
                return await sock.sendMessage(chatId, { text: Message.getMessage(8) })
            }

            // 1,3,4,5,6,7 usa seu messages.js
            return await sock.sendMessage(chatId, { text: Message.getMessage(texto) })
        }
    })
}

startBot()
