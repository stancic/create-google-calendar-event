import * as core from '@actions/core';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const name: string = core.getInput('name');
    if (!name.length) {
      throw new Error('You must provide a name');
    }
    core.debug(`DEBUG MESSAGE for ${name}`);
    core.setOutput('name', `OUTPUT - ${name} started this action`);
    core.info(`This is INFO MESSAGE for ${name}`);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
