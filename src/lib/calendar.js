// src/lib/calendar.js
import ical from 'ical.js';

export async function fetchCalendarData(url) {
    const response = await fetch(url);
    const data = await response.text();
    const jcalData = ical.parse(data);
    const component = new ical.Component(jcalData);

    const events = component.getAllSubcomponents('vevent').map(event => {
        return {
            summary: event.getFirstPropertyValue('summary'),
            startDate: event.getFirstPropertyValue('dtstart'),
            endDate: event.getFirstPropertyValue('dtend')
        };
    });

    return events;
}
