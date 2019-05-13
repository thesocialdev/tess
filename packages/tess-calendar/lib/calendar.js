const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const domino = require('domino');
const moment = require('moment');

moment.locale('pt-BR');
const readFile = promisify(fs.readFile);

const getWeekHtml = async (events) => {
    events = await _parseEvents(events);
    const html = await readFile(`${path.join(__dirname, '../','assets/nextWeekCalendar.html')}`, {encoding: 'utf8'});
    const css = await readFile(`${path.join(__dirname, '../','assets/nextWeekCalendar.css')}`, {encoding: 'utf8'});

    let doc = domino.createDocument(html);
    let style = doc.createElement('style');
    style.innerHTML = css;
    let head = doc.querySelector('head');
    head.appendChild(style)

    let calendar = doc.querySelector('.calendar');
    events.map((day, key) => {
        let column = doc.createElement('div');
        column.classList.add('day-column');
        let header = doc.createElement('div');
        column.appendChild(header);
        header.classList.add('day-header');
        header.innerHTML =`<div>${day.weekday}</div><div>${key}</div>`;
        day.events.map((event) => {
            let eventDiv = doc.createElement('div');
            eventDiv.classList.add('event');
            // Add Title
            let eventTitle = doc.createElement('div');
            eventTitle.classList.add('event-title');
            eventDiv.appendChild(eventTitle);
            eventTitle.innerHTML = event.title;
            // Add date
            let eventDate = doc.createElement('div');
            eventDate.classList.add('event-date');
            eventDiv.appendChild(eventDate);
            eventDate.innerHTML = event.date;
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
