const fs = require('fs');
const path = require('path');

global.commands = new Map();

global.cmd = (opts, func) => {
    if (!opts.pattern) return;
    const patterns = Array.isArray(opts.pattern) ? opts.pattern : [opts.pattern];
    const aliases = opts.alias ? (Array.isArray(opts.alias) ? opts.alias : [opts.alias]) : [];
    const allNames = [...patterns, ...aliases];
    allNames.forEach(name => {
        global.commands.set(name.toLowerCase(), { func, opts, patterns: allNames });
    });
};

// Load plugins from ./plugins folder
const loadPlugins = () => {
    const pluginDir = path.join(__dirname, 'plugins');
    if (fs.existsSync(pluginDir)) {
        const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));
        for (const file of files) {
            require(path.join(pluginDir, file));
        }
    }
};
loadPlugins();

module.exports = {
    handleCommand: async (conn, msg) => {
        if (!msg.message) return;
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        if (!body) return;
        const prefix = require('./config').PREFIX || '.';
        if (!body.startsWith(prefix)) return;
        const args = body.slice(prefix.length).trim().split(/\s+/);
        const cmdName = args.shift().toLowerCase();
        const command = global.commands.get(cmdName);
        if (!command) return;

        const reply = async (text) => {
            await conn.sendMessage(from, { text });
        };

        const ctx = {
            from,
            sender,
            args,
            reply,
            conn,
            msg,
            isOwner: sender.split('@')[0] === require('./config').OWNER_NUMBER,
            botNumber: conn.user?.id?.split(':')[0] || ''
        };

        try {
            await command.func(conn, msg, ctx);
        } catch (e) {
            console.error('Command error:', e);
            await reply('❌ Error: ' + e.message);
        }
    }
};