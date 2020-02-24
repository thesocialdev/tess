const Telegraf = require("telegraf");
const yaml = require("js-yaml");
const fs = require("fs");

const loadActions = async scriptsDir => {
  scriptsDir = scriptsDir || __dirname;
  actions = [];
  const conf = yaml.load(fs.readFileSync(`../config.yml`, "utf8"));
  conf.actions.forEach(action => {
    const params = Object.keys(action.params).map(key => {
      switch (key) {
        case "script":
          return require(`${scriptsDir}/${action.params[key]}`);
          break;
        case "reply":
          const reply = require(`${scriptsDir}/command-reply`);
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

const initBot = async options => {
  const bot = new Telegraf(options.token);

  // Load actions from options
  options.actions.map(action => {
    bot[action.type](...action.params);
  });

  return bot;
};

module.exports = async (options, scriptsDir) => {
  options.actions = await loadActions(scriptsDir);

  return initBot(options);
};
