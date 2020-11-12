'use strict';
// const calendar = require('tess-functions/lib/calendar/index.js');
// const authenticate = require('tess-functions/lib/auth');

let app;

/**
 * The main router object
 */
const router = require('../../lib/util').router();

/**
 * GET {domain}/calendar/next/week/html
 */
router.get('/next/week/html', async (req, res) => {
  // const auth = await authenticate(app.google_credentials, app.google_token);
  //   const html = await calendar.nextWeekHtml(auth);
    res.writeHead(200);
    res.write(html, "binary");
    res.end();
});

/**
 * GET {domain}/calendar/next/week/png
 */
router.get('/next/week/png',  async (req, res) => {
  // const auth = await authenticate(app.google.credentials, app.google.token);
  //   const image = await calendar.nextWeekImage(auth);
    res.set({
        'Content-Type': 'image/png',
        'Content-Length': image.length,
      }).send(image);
});


module.exports = function(appObj) {
  app = appObj;
    return {
        path: '/calendar',
        api_version: 1,
        router
    };
};
