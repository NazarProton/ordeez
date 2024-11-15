const { Telegram } = require('telegraf');
const config = require('../config');

async function sendMessage(msg) {
  const telegram = new Telegram(config.tgBot.token);
  //await telegram.sendMessage(config.tgBot.channel, msg);
}

exports.notice = async (msg) => {
  await sendMessage(`[INFO] ${msg}`);
};

exports.warn = async (msg) => {
  await sendMessage(`[WARN] ${msg}`);
};

exports.error = async (msg) => {
  await sendMessage(`[ERROR] ${msg}`);
};
