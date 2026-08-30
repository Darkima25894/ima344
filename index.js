const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { handleCommand } = require('./arslan');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        browser: ['Chrome (Linux)', '', '']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log('✅ Bot connected!');
            console.log(`Logged in as: ${sock.user.name} (${sock.user.id})`);
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Reconnecting...');
                startBot();
            } else {
                console.log('Logged out. Delete auth_info folder and restart.');
            }
        }
    });

    // Request pairing code if not registered
    if (!sock.authState.creds.registered) {
        rl.question('Enter your phone number (with country code, e.g., 947xxxxxxxx): ', async (number) => {
            rl.close();
            try {
                const code = await sock.requestPairingCode(number);
                console.log(`🔑 Pairing Code: ${code}`);
                console.log('Enter this code in WhatsApp → Linked Devices → Link a Device');
            } catch (err) {
                console.error('Failed to get pairing code:', err);
                process.exit(1);
            }
        });
    }

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        if (msg.key.fromMe) return;
        await handleCommand(sock, msg);
    });
}

startBot().catch(console.error);