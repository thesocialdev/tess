const Telegraf = require("telegraf");
const loadActions = async (scripts, conf) => {
  actions = [];
  conf.actions.forEach(action => {
    const params = Object.keys(action.params).map(key => {
      switch (key) {
        case "script":
          return scripts[action.params[key]];
          break;
        case "reply":
          const reply = scripts.commandReply;
          return reply(action.params.reply);
          break;
        default:
          return action.params[key];
          break;
      }
    });
    actions.push({
      type: action.type,
      params
    });
  });
  return actions;
};

const initBot = async config => {
  const bot = new Telegraf(config.token);

  bot.use((ctx, next) => {
    ctx.distPath = config.dist_path;
    ctx.google = config.google;
    return next();
  })
  // Load actions from config
  config.actions.map(action => {
    bot[action.type](...action.params);
  });

  return bot;
};

module.exports = async (options, scripts, conf) => {
  options.config.actions = await loadActions(scripts, conf);

  return initBot(options.config);
};
