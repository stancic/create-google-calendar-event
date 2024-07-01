import * as core from '@actions/core';
import { run } from '../src/main';
import { GoogleApiAuthService } from '../src/services';

jest.mock('@actions/core');
jest.mock('../src/services');

describe('api consuming', () => {
  const mockGetInput = core.getInput as jest.MockedFunction<
    typeof core.getInput
  >;
  const mockSetFailed = core.setFailed as jest.MockedFunction<
    typeof core.setFailed
  >;
  const mockSetOutput = core.setOutput as jest.MockedFunction<
    typeof core.setOutput
  >;
  const mockDebug = core.debug as jest.MockedFunction<typeof core.debug>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should run the action successfully with valid inputs', async () => {
    mockGetInput.mockImplementation((name: string) => {
      switch (name) {
        case 'service_account_client_email':
          return 'test@example.com';
        case 'service_account_client_private_key':
          return 'private_key';
        case 'calendar_id':
          return 'calendar_id';
        case 'summary':
          return 'Release v1.0.0';
        case 'description':
          return 'Description of the event';
        default:
          return '';
      }
    });

    const mockInsertEvent = jest.fn().mockResolvedValue({
      data: { htmlLink: 'https://www.google.com/calendar/event?eid=123' }
    });
    (GoogleApiAuthService as jest.Mock).mockImplementation(() => ({
      insertEvent: mockInsertEvent
    }));

    await run();

    expect(mockDebug).toHaveBeenCalledWith(
      'Service Account Client Email: test@example.com'
    );
    expect(mockDebug).toHaveBeenCalledWith(
      'Service Account Client Private Key: private_key'
    );
    expect(mockDebug).toHaveBeenCalledWith('Calendar ID: calendar_id');
    expect(mockDebug).toHaveBeenCalledWith(
      'Creating Google Calendar Auth Client'
    );
    expect(mockSetOutput).toHaveBeenCalledWith(
      'event_link',
      'You can see your event here: https://www.google.com/calendar/event?eid=123'
    );
    expect(mockSetFailed).not.toHaveBeenCalled();
  });

  it('should throw and handle error when response is an instance of Error', async () => {
    mockGetInput.mockImplementation((name: string) => {
      switch (name) {
        case 'service_account_client_email':
          return 'test@example.com';
        case 'service_account_client_private_key':
          return 'private_key';
        case 'calendar_id':
          return 'calendar_id';
        case 'summary':
          return 'Release v1.0.0';
        case 'description':
          return 'Description of the event';
        default:
          return '';
      }
    });

    const mockInsertEvent = jest
      .fn()
      .mockRejectedValue(new Error('Test error'));
    (GoogleApiAuthService as jest.Mock).mockImplementation(() => ({
      insertEvent: mockInsertEvent
    }));

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith('Test error');
  });

  it('should fail if service_account_client_private_key is missing', async () => {
    mockGetInput.mockImplementation((name: string) => {
      switch (name) {
        case 'service_account_client_email':
          return 'test@example.com';
        case 'service_account_client_private_key':
          return '';
        case 'calendar_id':
          return 'calendar_id';
        default:
          return '';
      }
    });

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith(
      'You must provide a service account client private key.'
    );
  });

  it('should fail if calendar_id is missing', async () => {
    mockGetInput.mockImplementation((name: string) => {
      switch (name) {
        case 'service_account_client_email':
          return 'test@example.com';
        case 'service_account_client_private_key':
          return 'private_key';
        case 'calendar_id':
          return '';
        default:
          return '';
      }
    });

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith(
      'You must provide Google Calendar ID.'
    );
  });
});
