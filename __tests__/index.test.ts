/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import * as main from '../src/main';

// Mock the action's entrypoint
const runMock = jest.spyOn(main, 'run').mockImplementation();

describe('index', () => {
  it('calls run when imported', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/index');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/models/index');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/services/index');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/types/index');

    expect(runMock).toHaveBeenCalled();
  });
});
