const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const domino = require('domino');
const moment = require('moment');

moment.locale('pt-BR');
const readFile = promisify(fs.readFile);

const getWeekHtml = async events => {
    const html = await readFile(`${path.join(__dirname, '../', 'assets/nextWeekCalendar.html')}`, {encoding: 'utf8'});
    const css = await readFile(`${path.join(__dirname, '../', 'assets/theme.css')}`, {encoding: 'utf8'});

    let doc = domino.createDocument(html);
    let head = doc.querySelector('head');
    let style = doc.createElement('style');
    let calendar = doc.querySelector('.calendar');
    style.innerHTML = css;
    head.appendChild(style);

    (await _parseEvents(events)).map(day => {
        let column = doc.createElement('div');
        column.classList.add('day-column');

        let header = doc.createElement('div');
        column.appendChild(header);
        header.classList.add('day-header');
        header.innerHTML = `
          <span class="week-day">${day.weekday}</span>
          <span class="day-number">${day.dayNumber}</span>
        `;

        day.events.map(event => {
            let eventDiv = doc.createElement('div');
            eventDiv.classList.add('event');

            // Add Title
            let eventTitle = doc.createElement('div');
            eventTitle.classList.add('event-title');
            eventDiv.appendChild(eventTitle);
            if (event.title.toLowerCase().indexOf('bekz') !== -1) {
              eventTitle.classList.add('green');
            }
            if (event.title.toLowerCase().indexOf('reunião') !== -1) {
              eventTitle.classList.add('yellow');
            }
            eventTitle.innerHTML = event.title;

            // Add time
            let eventTime = doc.createElement('div');
            eventTime.classList.add('event-time');
            eventDiv.appendChild(eventTime);
            eventTime.innerHTML = event.time;

            // Append to column
            column.appendChild(eventDiv);
        });

        calendar.appendChild(column);
    });

    return doc.innerHTML;
}

const _parseEvents = async events => {
  let parsedEvents = [];

  events.map(event => {
    const start = event.start.dateTime;
    const end = event.end.dateTime;

    const day = moment(start).format('DD');
    const month = moment(start).format('MM');
    const year = moment(start).format('Y');
    const index = `${year}${month}${day}`;

    parsedEvents[index] = parsedEvents[index] || {
      weekday: moment(start).format('ddd'),
      dayNumber: day,
      events: []
    };

    parsedEvents[index].events.push({
      title: event.summary,
      time: `${moment(start).format('HH:mm')} às ${moment(end).format('HH:mm')}`
    });
  });

  return parsedEvents;
}

module.exports = {
    getWeekHtml,
}
