const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const app = express();

app.get('/', (req, res) => {
  res.send('Love Time Bot is running ❤️');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});

// =====================
// 🎛️ منوی بات
// =====================
const menuKeyboard = {
  reply_markup: {
    keyboard: [
      ['💌 پیام عاشقانه', '💖 درصد عشق'],
      ['⏰ یادآوری امروز'],
      ['ℹ️ درباره بات']
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

// =====================
// ▶️ /start
// =====================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    'سلاممم ❤️\nاز منو یکی رو انتخاب کن 👇',
    menuKeyboard
  );
});

// =====================
// 🧠 هندل دکمه‌ها
// =====================
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/')) return;

  if (text === '💌 پیام عاشقانه') {
    bot.sendMessage(chatId, 'دوستت دارم، بیشتر از دیروز ❤️');
  } else if (text === '💖 درصد عشق') {
    const percent = Math.floor(Math.random() * 100) + 1;
    bot.sendMessage(chatId, `امروز ${percent}% عاشقتم 😍`);
  } else if (text === '⏰ یادآوری امروز') {
    bot.sendMessage(chatId, 'یادت نره امروز بهش بگی دوستت دارم ❤️');
  } else if (text === 'ℹ️ درباره بات') {
    bot.sendMessage(
      chatId,
      '💖 Love Time Bot\nساخته شده با عشق ❤️'
    );
  }
});
