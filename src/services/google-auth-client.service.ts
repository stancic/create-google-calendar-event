import { google } from 'googleapis';
import { GoogleCalendarEvent } from 'src/models';
import { AuthClientReturn, GaxiosPromise, InsertEventReturn } from 'src/types';

interface GoogleClientProps {
  serviceAccountClientEmail?: string;
  serviceAccountClientPrivateKey?: string;
  calendarId?: string;
}

export class GoogleApiAuthService {
  private calendar;
  private authClient;
  private calendarId?: string;

  constructor({
    serviceAccountClientEmail,
    serviceAccountClientPrivateKey,
    calendarId
  }: GoogleClientProps) {
    this.authClient = this.makeAuthClient({
      serviceAccountClientEmail,
      serviceAccountClientPrivateKey
    });
    this.calendarId = calendarId;
    this.calendar = google.calendar({ version: 'v3' });
  }

  private makeAuthClient({
    serviceAccountClientEmail,
    serviceAccountClientPrivateKey
  }: GoogleClientProps): AuthClientReturn | null {
    const authScope = 'https://www.googleapis.com/auth/calendar';
    if (!serviceAccountClientEmail || !serviceAccountClientPrivateKey)
      return null;
    return new google.auth.JWT(
      serviceAccountClientEmail,
      undefined,
      serviceAccountClientPrivateKey,
      authScope
    );
  }

  async insertEvent(
    summary: string,
    description: string
  ): Promise<Error | GaxiosPromise<InsertEventReturn>> {
    try {
      if (!this.calendarId) throw new Error('Calendar ID is required');
      if (!this.authClient) throw new Error('Auth client is required');

      const event = new GoogleCalendarEvent(summary, description);

      const response = await this.calendar.events.insert({
        auth: this.authClient,
        calendarId: this.calendarId,
        requestBody: event
      });

      return response;
    } catch (e) {
      if (!(e instanceof Error)) return new Error('An error occurred');
      return e;
    }
  }
}
