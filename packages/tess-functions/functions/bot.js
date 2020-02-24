const Telegraf = require("telegraf");
const { actions } = require("./lib/telegraf.js");

const initBot = async options => {
  const bot = new Telegraf(options.token);

  // Load actions from options
  actions.map(action => {
    bot[action.type](...action.params);
  });

  return bot;
};

const bot = initBot({ token: process.env.TELEGRAM_BOT_TOKEN });

exports.handler = async event => {
  console.log("functions starts");
  await bot.handleUpdate(JSON.parse(event.body));
  console.log("handleUpdate ends");
  return { statusCode: 200, body: "" };
};
