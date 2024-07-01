/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core';
import * as main from '../src/main';

// Mock the action's main function
const runMock = jest.spyOn(main, 'run');

// Other utilities
// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>;
let errorMock: jest.SpiedFunction<typeof core.error>;
let getInputMock: jest.SpiedFunction<typeof core.getInput>;
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    debugMock = jest.spyOn(core, 'debug').mockImplementation();
    errorMock = jest.spyOn(core, 'error').mockImplementation();
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();
  });

  it('sets the name output', async () => {
    getInputMock.mockImplementation((prop: string) => {
      switch (prop) {
        case 'service_account_client_email':
          return process.env.GOOGLE_CLIENT_EMAIL ?? '';
        case 'service_account_client_private_key':
          return process.env.GOOGLE_CLIENT_PRIVATE_KEY ?? '';
        case 'calendar_id':
          return process.env.GOOGLE_CALENDAR_ID ?? '';
        case 'summary':
          return 'Release v1.0.0';
        case 'description':
          return `
            ## What's Changed
            * Test Feature by @stancic in https://github.com/stancic/create-google-calendar-event/pull/1
            * Test Feature by @stancic in https://github.com/stancic/create-google-calendar-event/pull/1
            * Test Feature by @stancic in https://github.com/stancic/create-google-calendar-event/pull/1
            * Test Feature by @stancic in https://github.com/stancic/create-google-calendar-event/pull/1


            **Full Changelog**: https://github.com/github.com/stancic/create-google-calendar-event/compare/v1.0.0...v0.0.0
          `;
        default:
          return '';
      }
    });

    await main.run();
    expect(runMock).toHaveReturned();
    expect(debugMock).toHaveBeenCalledWith(
      'Creating Google Calendar Auth Client'
    );
    expect(errorMock).not.toHaveBeenCalled();
  });

  it('sets failed status', async () => {
    getInputMock.mockImplementation(prop => {
      switch (prop) {
        case 'service_account_client_email':
          return '';
        default:
          return '';
      }
    });

    await main.run();
    expect(runMock).toHaveReturned();
    expect(setFailedMock).toHaveBeenCalledWith(
      'You must provide a service account client email.'
    );
  });
});
