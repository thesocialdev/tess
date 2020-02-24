const telegraf = require("tess-telegraf");

const initApp = async options => {
  const app = await telegraf(options);

  app.serviceName = options.name; // this app's config options
  app.config = options.config; // this app's config options
  app.logger = options.logger; // the logging device
  app.metrics = options.metrics; // the metrics

  return app;
};

module.exports = async options => {
  const app = await initApp();
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
