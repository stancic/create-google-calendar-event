interface GoogleDateTimeModel {
  dateTime: string;
}

interface GoogleCalendarEventModel {
  summary: string;
  description: string;
  start: GoogleDateTimeModel;
  end: GoogleDateTimeModel;
}

export class GoogleCalendarEvent implements GoogleCalendarEventModel {
  summary: string;
  description: string;
  start: GoogleDateTimeModel = { dateTime: '' };
  end: GoogleDateTimeModel = { dateTime: '' };

  constructor(summary: string, description: string) {
    this.summary = summary;
    this.description = description;
    this.start.dateTime = new Date().toISOString();
    this.end.dateTime = new Date().toISOString();
  }
}
