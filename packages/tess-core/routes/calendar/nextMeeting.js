'use strict';
const path = require('path');
// const authenticate = require('tess-functions/lib/auth');
// const calendar = require("tess-functions/lib/calendar/say.js");

let app;

/**
 * The main router object
 */
const router = require('../../lib/util').router();

/**
 * GET {domain}/calendar/next/meeting
 */
router.get('/next/meeting', async (req, res) => {
    // const auth = await authenticate(app.google.credentials, app.google.token);
    // const meetingLink = await calendar.nextMeetingLink(auth);
    res.writeHead(200);
    res.end(JSON.stringify(meetingLink));
});

module.exports = function(appObj) {
    app = appObj;
    return {
        path: '/calendar',
        api_version: 1,
        router
    };
};
