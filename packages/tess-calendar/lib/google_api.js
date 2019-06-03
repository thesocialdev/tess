const {google} = require('googleapis');

const getNextWeek = async (auth) => {
    const calendar = google.calendar({version: 'v3', auth});

    try {
        var today     = new Date;
        var first     = today.getDate() - today.getDay();
        var last      = first + 6;
        var weekStart = new Date(today.setDate(first));
        var weekEnd   = new Date(today.setDate(last));

        const res = await calendar.events.list({
            calendarId: 'tesseractgrupo@gmail.com',
            timeMin: weekStart,
            timeMax: weekEnd,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = res.data.items;

        if (events.length) {
            return events;
        } else {
            console.log('No upcoming events found.');
        }
    } catch (err) {
        if (err) return console.log('The API returned an error: ' + err);
    }
}

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

module.exports = {
    getNextWeek,
    getNextMeetingLink,
}
