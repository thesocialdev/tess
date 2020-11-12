const RendererFactory = require('../../lib/renderer');
const { getWeekHtml } = require('../../lib/calendar/weekHtml');
const authenticate = require('../../lib/auth');
const sendImage = require('../../lib/telegram/sendImage')
const {google} = require('googleapis');

const getEvents = (auth, calendarList) => {
  const calendar = google.calendar({version: 'v3', auth});
  const today = new Date();
  const first = today.getDate() - today.getDay();
  const last = first + 6;
  return Promise.all(calendarList.map(async (calendarId) => {
    return calendar.events.list({
      calendarId,
      timeMin: new Date(today.setDate(first)),
      timeMax: new Date(today.setDate(last)),
      singleEvents: true,
      orderBy: 'startTime',
    });
  }));
}

const getNextWeekImage = async (auth, calendarList = []) => {
  try {
    const res = await getEvents(auth, calendarList);
    const events = res.reduce((acc, response) => {
      const items = response.data && response.data.items || [];
      return [...acc, ...items];
    }, []);

    if (events.length) {
      const renderer = await RendererFactory.create();
      let html = await getWeekHtml(events);
      const image = await renderer.pageToPng(html, { fullPage: true });
      renderer.close();
      return image;
    } else {
      console.log('No upcoming events found.');
    }
  } catch (err) {
    if (err) return console.log('The API returned an error: ' + err);
  }
}

module.exports = async (ctx, params) => {
    const auth = await authenticate(ctx.google.credentials, ctx.google.token);
    const image = await getNextWeekImage(auth, ctx.google.calendarList);
    await sendImage(ctx, params, image);
}
