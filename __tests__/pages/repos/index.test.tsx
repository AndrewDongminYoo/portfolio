import { cleanup, render, screen } from '@testing-library/react';
import Portfolio from 'pages/repos/index';
jest.mock('lib/repos');
import { readRepositories } from 'lib/repos';

describe('Portfolio component', () => {
    afterEach(cleanup);

    it('should render correctly', () => {
        const { baseElement } = render(<Portfolio repositoryData={[]} />);
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render a section element with the correct className', () => {
        render(<Portfolio repositoryData={[]} />);
        const section = screen.getByRole('region', { name: /repositories/i });
        expect(section).toHaveClass(
            'w-full p-6 mx-0 my-6 border border-gray-300 border-solid rounded-lg'
        );
    });

    it('should render the correct number of Repo components', () => {
        const repositoryData = readRepositories();
        render(<Portfolio repositoryData={repositoryData} />);
        expect(screen.getAllByRole('heading')).toHaveLength(3);
    });
});
