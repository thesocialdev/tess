const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const request = require('request');
const qs = require("querystring");
const fs = require('fs');

const initApp = async options => {
  let session;
  if(fs.existsSync(options.config.session)) {
    session = require(options.config.session);
  }
  const app = await new Client({
    session,
    restartOnAuthFail: true, // related problem solution
  });
  console.log("init whatsapp")
  app.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
  });

  app.on('authenticated', (session) => {
    fs.writeFile(options.config.session, JSON.stringify(session), function (err) {
      if (err) {
        options.logger.log('error', err);
      }
    });
  })

  app.on('message', msg => {
    console.log(msg)
    if (msg.from === '393477955032@c.us') {
      console.log(msg.from)
      // const res = request.get('http://localhost:3000/notification?' + qs.stringify({msg: "Senhor, sua esposa está chamando você"}));
      msg.reply('No momento estou ocupado');
      console.log(res);
    }
    if (msg.body == 'ping') {
      msg.reply('pong');
    }
  });

  app.serviceName = options.name; // this app's config options
  app.config = options.config; // this app's config options
  app.logger = options.logger; // the logging device
  app.metrics = options.metrics; // the metrics

  return app;
};

module.exports = async options => {
  console.log("boot whatsapp")
  const app = await initApp(options);
  try {
    await app.initialize();
    app.logger.log(
      "info",
      `${app.serviceName} with PID ${process.pid} is ready`
    );
  } catch (err) {
    app.logger.log("error", `${app.serviceName} failed to load`);
    app.logger.log("error", err);
  }
  return app;
};
