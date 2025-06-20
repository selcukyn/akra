import { format } from 'date-fns';

interface CalendarEventDetails {
  startDate: Date;
  endDate: Date;
  summary: string;
  description: string;
  location: string;
  uid?: string;
  sequence?: number;
}

// Function to format date to ICS format (YYYYMMDDTHHmmssZ)
const formatDateToICS = (date: Date): string => {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
};

// Function to format date for all-day events (YYYYMMDD)
const formatDateToICSAllDay = (date: Date): string => {
  return format(date, "yyyyMMdd");
};

export function generateICSFile(details: CalendarEventDetails): string {
  const { startDate, endDate, summary, description, location } = details;
  const uid = details.uid || `${Date.now()}@gulegule.app`;
  const sequence = details.sequence || 0;
  const now = new Date();

  // For all-day events, DTEND is typically the day after the last day of the event.
  // We assume startDate and endDate are inclusive.
  const allDayEndDate = new Date(endDate);
  allDayEndDate.setDate(allDayEndDate.getDate() + 1);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GuleGuleApp//PersonalizedItinerary//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTAMP:${formatDateToICS(now)}`,
    `UID:${uid}`,
    `SEQUENCE:${sequence}`,
    `DTSTART;VALUE=DATE:${formatDateToICSAllDay(startDate)}`,
    `DTEND;VALUE=DATE:${formatDateToICSAllDay(allDayEndDate)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`, // Escape newlines
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE', // Or TRANSPARENT if it's more like a reminder
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}
