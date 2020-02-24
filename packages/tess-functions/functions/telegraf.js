const Telegraf = require("telegraf");
const helpAction = require("./actions/help");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.help(ctx => {
  return helpAction(ctx);
});

exports.handler = async event => {
  await bot.handleUpdate(JSON.parse(event.body));
  return { statusCode: 200, body: "" };
};
