const telegraf = require("./bot");
const fs = require('fs');
const yaml = require("js-yaml");
const scripts = require('tess-functions')

const initApp = async options => {
  const conf = yaml.load(fs.readFileSync(options.config.telegraf_config, "utf8"));
  const app = await telegraf(options, scripts, conf);

  app.serviceName = options.name; // this app's config options
  app.config = options.config; // this app's config options
  app.logger = options.logger; // the logging device
  app.metrics = options.metrics; // the metrics

  return app;
};

module.exports = async options => {
  const app = await initApp(options);
  try {
    await app.launch();
    app.logger.log(
      "info",
      `${app.serviceName} with PID ${process.pid} is listening on Telegram API`
    );
  } catch (err) {
    app.logger.log("error", `${app.serviceName} failed to load`);
    app.logger.log("error", err);
  }
  return app;
};
