const conf = require("./config.json");

const loadActions = scriptsDir => {
  scriptsDir = scriptsDir || __dirname;
  actions = [];
  conf.actions.forEach(action => {
    const params = Object.keys(action.params).map(key => {
      switch (key) {
        case "script":
          return require(`${scriptsDir}/${action.params[key]}`);
        case "reply":
          const reply = require(`${scriptsDir}/command-reply`);
          return reply(action.params.reply);
        default:
          return action.params[key];
      }
    });
    actions.push({
      type: action.type,
      params
    });
  });
  return actions;
};

const actions = loadActions("../functions/actions");
module.exports = {
  actions
};
