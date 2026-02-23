const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");
const messages = require("./messages");

// ================== CONFIG ==================
const TOKEN = "8533109904:AAHfGmuOt8IC1ZaoJXstkXi7-3mx9qiBDxs";
const CHAT_IDS = [
  6608979091, // Hidika
  5103036372  // You
];
const TIMEZONE = "Asia/Tehran";
// ============================================

// Bot (private, no polling)
const bot = new TelegramBot(TOKEN, { polling: true });

function sendMessage(text) {
  CHAT_IDS.forEach(id => {
    bot.sendMessage(id, text);
  });
}

// ---------- Start Message ----------
sendMessage(messages.start);
console.log("✅ Bot connected to Telegram (private mode)");

// ---------- Morning Message (08:00) ----------
cron.schedule(
  "0 8 * * *",
  () => sendMessage(messages.morning),
  { timezone: TIMEZONE }
);

// ---------- Night Message (23:30) ----------
cron.schedule(
  "30 23 * * *",
  () => sendMessage(messages.night),
  { timezone: TIMEZONE }
);

// ---------- Random Love Messages ----------
const luckyTimes = [
  "09:09","10:10","11:11","12:12",
  "13:13","14:14","15:15","16:16",
  "17:17","18:18","19:19","20:20",
  "21:21","22:22","23:23"
];

luckyTimes.forEach(time => {
  const [hour, minute] = time.split(":");

  cron.schedule(
    `${minute} ${hour} * * *`,
    () => {
      const random =
        messages.random[
          Math.floor(Math.random() * messages.random.length)
        ];
      sendMessage(random);
    },
    { timezone: TIMEZONE }
  );
});

