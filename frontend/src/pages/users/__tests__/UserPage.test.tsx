import { render, screen } from '@testing-library/react';
import UserPage from '../UserPage';

vi.mock('../../../layouts/MainLayout/MainLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

const useParamsMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => useParamsMock(),
  };
});

describe('UserPage', () => {
  it('renders user id from route params', () => {
    useParamsMock.mockReturnValue({ id: '42' });

    render(<UserPage />);

    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByText('user 42')).toBeInTheDocument();
  });
});


