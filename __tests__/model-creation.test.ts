import { GoogleCalendarEvent } from '../src/models';

jest.mock('../src/services');

describe('model-creation', () => {
  it('should create GoogleCalendarEvent with the correct values', async () => {
    const summary = 'Test Event';
    const description = 'This is a test event';

    const event = new GoogleCalendarEvent(summary, description);

    expect(event).toBeInstanceOf(GoogleCalendarEvent);
    expect(event.summary).toBe(summary);
    expect(event.description).toBe(description);
    expect(event.start.dateTime).toBeDefined();
    expect(event.end.dateTime).toBeDefined();
  });
});
