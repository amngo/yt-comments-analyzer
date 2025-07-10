import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toast } from '../Toast';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren<Record<string, unknown>>) => children,
}));

describe('Toast Component', () => {
  const defaultProps = {
    message: 'Test message',
    isVisible: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders toast message when visible', () => {
    render(<Toast {...defaultProps} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(<Toast {...defaultProps} isVisible={false} />);

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('calls onClose after default duration', async () => {
    const onCloseMock = jest.fn();
    render(<Toast {...defaultProps} onClose={onCloseMock} />);

    // Fast forward time by 3 seconds (default duration)
    jest.advanceTimersByTime(3000);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClose after custom duration', async () => {
    const onCloseMock = jest.fn();
    render(<Toast {...defaultProps} onClose={onCloseMock} duration={5000} />);

    // Fast forward time by 5 seconds (custom duration)
    jest.advanceTimersByTime(5000);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when not visible', async () => {
    const onCloseMock = jest.fn();
    render(<Toast {...defaultProps} isVisible={false} onClose={onCloseMock} />);

    jest.advanceTimersByTime(3000);

    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('clears timer when component unmounts', () => {
    const onCloseMock = jest.fn();
    const { unmount } = render(<Toast {...defaultProps} onClose={onCloseMock} />);

    // Unmount before timer completes
    unmount();
    jest.advanceTimersByTime(3000);

    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('renders with checkmark icon', () => {
    render(<Toast {...defaultProps} />);

    // Check for SVG checkmark by looking for the SVG element
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<Toast {...defaultProps} />);

    // Find the actual toast container with the correct classes
    const toastContainer = document.querySelector('.bg-slate-800');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass('bg-slate-800', 'border-slate-700');
  });
});
