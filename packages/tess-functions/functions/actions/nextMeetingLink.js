const authenticate = require('../../lib/auth');
const {google} = require('googleapis');

const getNextMeetingLink = async (auth) => {
  const calendar = google.calendar({version: 'v3', auth});
  try {
    const res = await calendar.events.list({
      calendarId: 'tesseractgrupo@gmail.com',
      timeMin: (new Date()).toISOString(),
      maxResults: 1,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const event = res.data.items && res.data.items[0];
    if (event) {
      return {
        hangoutLink: event.hangoutLink,
        summary: event.summary,
        confirmedAttendees: event.attendees && event.attendees.filter(attendee => {
          return attendee.responseStatus === 'accepted'
        }),
      };
    } else {
      console.log('No upcoming event.');
    }
  } catch (err) {
    if (err) return console.log('The API returned an error: ' + err);
  }
}

module.exports = async (ctx) => {
    const auth = await authenticate(ctx.google.credentials, ctx.google.token);
    const meeting = await getNextMeetingLink(auth);

    if (meeting.summary){
        await ctx.reply(`Evento: ${meeting.summary}`)
    }
    if (meeting.hangoutLink){
        await ctx.reply(`Hangout: ${meeting.hangoutLink}`)
    }
    if (Array.isArray(meeting.confirmedAttendees) && meeting.confirmedAttendees.length){
        await ctx.reply(`As seguintes pessoas confirmaram presença:`)
        meeting.confirmedAttendees.map(async (attendee) => {
            await ctx.reply(`- ${attendee.displayName}`)
        });
    } else {
        await ctx.reply(`Ninguém confirmou presença até o momento.`)
    }
}
