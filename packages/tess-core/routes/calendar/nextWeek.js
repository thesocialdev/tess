'use strict';
// const calendar = require('tess-functions/lib/calendar/say.js');
// const authenticate = require('tess-functions/lib/auth');

let app;

/**
 * The main router object
 */
const router = require('../../lib/util').router();

/**
 * GET {domain}/notification
 */
router.get('/',  async (req, res) => {
  console.log("whatsapp")
  app.io.emit('notification', { msg: req.query.msg });
  res.writeHead(200);
  res.end();
});


module.exports = function(appObj) {
  app = appObj;
    return {
        path: '/notification',
        api_version: 1,
        router
    };
};
