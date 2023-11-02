// Existing imports
import { fetchStarredRepository } from 'lib/repos';

jest.mock('@octokit/core');

describe('fetchStarredRepository', () => {
  it('fetches starred repositories', async () => {
    // Mock octokit
    const mockOctokit = {
      request: jest.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            name: 'repo1',
          },
        ],
      }),
    };

    // Call function
    const repos = await fetchStarredRepository();

    // Assertions
    expect(mockOctokit.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/user/starred',
      }),
    );
    expect(repos).toEqual([
      {
        id: 1,
        name: 'repo1',
      },
    ]);
  });
});
