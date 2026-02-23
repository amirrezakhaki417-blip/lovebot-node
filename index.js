const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs'); // برای ذخیره یوزرها

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const app = express();
const USERS_FILE = './users.json';

// --- مدیریت فایل یوزرها ---
function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    try {
        const data = fs.readFileSync(USERS_FILE);
        return JSON.parse(data);
    } catch (e) { return []; }
}

function saveUser(chatId) {
    let users = loadUsers();
    if (!users.includes(chatId)) {
        users.push(chatId);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users));
    }
}

// --- تنظیمات وب‌سرور برای زنده ماندن ---
app.get('/', (req, res) => {
    res.send('Love Bot is Awake and Running! ❤️');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} ✅`);
});

// --- منوی بات ---
const menuKeyboard = {
    reply_markup: {
        keyboard: [
            ['💌 پیام عاشقانه', '💖 درصد عشق'],
            ['⏰ یادآوری امروز'],
            ['ℹ️ درباره بات']
        ],
        resize_keyboard: true
    }
};

// --- هندل کردن دستور /start ---
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    saveUser(chatId); // ذخیره آیدی کاربر برای ارسال خودکار
    bot.sendMessage(chatId, 'سلاممم 🫠❤️\nمن اینجام که سرِ وقت یادت بندازم چقدر دوستت دارم.\nاز منو انتخاب کن 👇', menuKeyboard);
});

// --- هندل کردن دکمه‌های منو ---
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
        bot.sendMessage(chatId, '💖 Love Time Bot\nساخته شده با عشق ❤️');
    }
});

// ==========================================
// 🕒 سیستم ارسال خودکار (Scheduler)
// ==========================================

const ROUND_MESSAGES = [
    "خیلی دوستت دارمم زندگیم❤️🍒",
    "همیشه تو دلمی قشنگم 🫀✨",
    "یه عالمه دوستت دارم 😘💞",
    "با تو همه چی قشنگ‌تره 💖🌸",
    "فقط مال منی ها 😌❤️",
    "بودنت آرامشه 🫶🌊",
];

setInterval(() => {
    // گرفتن زمان به وقت تهران
    const tehranTime = new Intl.DateTimeFormat('fa-IR', {
        timeZone: 'Asia/Tehran',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    }).format(new Date());

    // تبدیل اعداد فارسی به انگلیسی برای چک کردن
    const englishTime = tehranTime.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    const [hour, minute] = englishTime.split(':').map(Number);

    const users = loadUsers();

    // ۱. چک کردن ساعت رند (مثلاً ۱۱:۱۱ یا ۲۲:۲۲)
    if (hour === minute && minute !== 0) {
        const randomMsg = ROUND_MESSAGES[Math.floor(Math.random() * ROUND_MESSAGES.length)];
        users.forEach(id => {
            bot.sendMessage(id, `ساعت رنده! 😍\n${hour}:${minute}\n${randomMsg}`).catch(e => console.log("Error sending: ", e));
        });
    }

    // ۲. پیام صبح بخیر (ساعت ۸:۰۰)
    if (hour === 8 && minute === 0) {
        users.forEach(id => {
            bot.sendMessage(id, "صبح ات بخیرر جون دلمم🥹🫠🐣👧🏻🫀💋😘").catch(e => console.log("Error sending: ", e));
        });
    }

    // ۳. پیام شب بخیر (ساعت ۲۳:۳۰)
    if (hour === 23 && minute === 30) {
        users.forEach(id => {
            bot.sendMessage(id, "خیلییی دوستت دارمم ، شب ات بخیر خوشگلمم🙃🌒💋😘\nخوب بخوابی💙🌊").catch(e => console.log("Error sending: ", e));
        });
    }

}, 60000); // هر ۶۰ ثانیه یکبار چک کن
