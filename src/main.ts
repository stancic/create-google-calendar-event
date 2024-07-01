import * as core from '@actions/core';

import 'dotenv/config';
import { GoogleApiAuthService } from './services';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const serviceAccountClientEmail: string = core.getInput(
      'service_account_client_email'
    );
    const serviceAccountClientPrivateKey: string = core.getInput(
      'service_account_client_private_key'
    );
    const calendarId: string = core.getInput('calendar_id');
    const summary: string = core.getInput('summary');
    const description: string = core.getInput('description');

    if (!serviceAccountClientEmail.length) {
      throw new Error('You must provide a service account client email.');
    }

    if (!serviceAccountClientPrivateKey.length) {
      throw new Error('You must provide a service account client private key.');
    }

    if (!calendarId.length) {
      throw new Error('You must provide Google Calendar ID.');
    }

    core.debug('Creating Google Calendar Auth Client');
    const googleAuthClient = new GoogleApiAuthService({
      serviceAccountClientEmail,
      serviceAccountClientPrivateKey,
      calendarId
    });

    const response = await googleAuthClient.insertEvent(summary, description);
    if (response instanceof Error) throw response;
    core.setOutput(
      'response',
      `Event created: ${JSON.stringify(response.data)}`
    );
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
