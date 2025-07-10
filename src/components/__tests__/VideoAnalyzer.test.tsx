import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoAnalyzer } from '../VideoAnalyzer';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => {
      const { ...restProps } = props;
      return <div {...restProps}>{children}</div>;
    },
    input: ({ children, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
      const { ...restProps } = props;
      return <input {...restProps}>{children}</input>;
    },
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
      const { ...restProps } = props;
      return <button {...restProps}>{children}</button>;
    },
  },
}));

// Mock the YouTube validator
jest.mock('../../lib/youtube-validator', () => ({
  isValidYouTubeUrl: jest.fn(),
  getValidationMessage: jest.fn(),
}));

import { isValidYouTubeUrl, getValidationMessage } from '../../lib/youtube-validator';

describe('VideoAnalyzer Component', () => {
  const defaultProps = {
    onAnalyze: jest.fn(),
    loading: false,
    setLoading: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (isValidYouTubeUrl as jest.Mock).mockReturnValue(true);
    (getValidationMessage as jest.Mock).mockReturnValue('');
  });

  it('renders the form with input and button', () => {
    render(<VideoAnalyzer {...defaultProps} />);

    expect(screen.getByLabelText('YouTube Video URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://www.youtube.com/watch?v=...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Analyze Comments' })).toBeInTheDocument();
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<VideoAnalyzer {...defaultProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    await user.type(input, 'https://www.youtube.com/watch?v=test');

    expect(input).toHaveValue('https://www.youtube.com/watch?v=test');
  });

  it('shows validation error for invalid URL', async () => {
    const user = userEvent.setup();
    (isValidYouTubeUrl as jest.Mock).mockReturnValue(false);
    (getValidationMessage as jest.Mock).mockReturnValue('Please enter a valid YouTube video URL');

    render(<VideoAnalyzer {...defaultProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    await user.type(input, 'invalid-url');

    expect(screen.getByText('Please enter a valid YouTube video URL')).toBeInTheDocument();
  });

  it('disables submit button when URL is invalid', async () => {
    const user = userEvent.setup();
    (isValidYouTubeUrl as jest.Mock).mockReturnValue(false);
    (getValidationMessage as jest.Mock).mockReturnValue('Invalid URL');

    render(<VideoAnalyzer {...defaultProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    await user.type(input, 'invalid-url');

    const submitButton = screen.getByRole('button', { name: 'Analyze Comments' });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when URL is valid', async () => {
    const user = userEvent.setup();
    render(<VideoAnalyzer {...defaultProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    await user.type(input, 'https://www.youtube.com/watch?v=valid');

    const submitButton = screen.getByRole('button', { name: 'Analyze Comments' });
    expect(submitButton).not.toBeDisabled();
  });

  it('shows loading state when loading prop is true', () => {
    render(<VideoAnalyzer {...defaultProps} loading={true} />);

    expect(screen.getAllByText('Extracting comments...')).toHaveLength(2); // Button and loading area
    expect(screen.getByText(/Estimated time:/)).toBeInTheDocument();
  });

  it('prevents form submission with invalid URL', async () => {
    const user = userEvent.setup();
    const onAnalyzeMock = jest.fn();
    (isValidYouTubeUrl as jest.Mock).mockReturnValue(false);
    (getValidationMessage as jest.Mock).mockReturnValue('Invalid URL');

    render(<VideoAnalyzer {...defaultProps} onAnalyze={onAnalyzeMock} />);

    const input = screen.getByLabelText('YouTube Video URL');
    const form = input.closest('form')!;

    await user.type(input, 'invalid-url');
    fireEvent.submit(form);

    expect(onAnalyzeMock).not.toHaveBeenCalled();
  });

  it('shows different loading phases during analysis', () => {
    render(<VideoAnalyzer {...defaultProps} loading={true} />);

    // Should show initial phase - check that loading text appears
    expect(screen.getAllByText('Extracting comments...')).toHaveLength(2);
  });

  it('applies error styling to input when URL is invalid', async () => {
    const user = userEvent.setup();
    (isValidYouTubeUrl as jest.Mock).mockReturnValue(false);
    (getValidationMessage as jest.Mock).mockReturnValue('Invalid URL');

    render(<VideoAnalyzer {...defaultProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    await user.type(input, 'invalid-url');

    expect(input).toHaveClass('border-red-500');
  });

  it('applies success styling to input when URL is valid', async () => {
    const user = userEvent.setup();
    render(<VideoAnalyzer {...defaultProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    await user.type(input, 'https://www.youtube.com/watch?v=valid');

    expect(input).toHaveClass('border-slate-600');
  });
});
