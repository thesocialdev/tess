const Telegraf = require("telegraf");
const helpAction = require("./actions/help");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(ctx => {
  return helpAction(ctx);
});

exports.handler = async event => {
  console.log("functions starts");
  await bot.handleUpdate(JSON.parse(event.body));
  console.log("handleUpdate ends");
  return { statusCode: 200, body: "" };
};
