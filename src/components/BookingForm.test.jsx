import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingForm from './BookingForm';

// Mock context and toast
const mockAddBooking = jest.fn();
const mockToast = jest.fn();

jest.mock('@/context/BookingContext', () => ({
  useBooking: () => ({ addBooking: mockAddBooking })
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast })
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('submits form with valid data and calls addBooking and toast', async () => {
  jest.useFakeTimers();
  render(<BookingForm />);

  const dateInput = screen.getByLabelText(/Date \*/i);
  const timeSelect = screen.getByLabelText(/Time \*/i);
  const guestsSelect = screen.getByLabelText(/Number of Guests \*/i);
  const submitButton = screen.getByRole('button', { name: /Confirm Reservation/i });

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  fireEvent.change(dateInput, { target: { value: tomorrow } });
  fireEvent.change(timeSelect, { target: { value: '18:00' } });
  fireEvent.change(guestsSelect, { target: { value: '3' } });

  fireEvent.click(submitButton);

  // advance timers to resolve the simulated API delay
  jest.advanceTimersByTime(1000);

  await waitFor(() => expect(mockAddBooking).toHaveBeenCalled());
  expect(mockToast).toHaveBeenCalled();

  jest.useRealTimers();
});

test('shows validation error for past date', async () => {
  const { container } = render(<BookingForm />);
  const dateInput = screen.getByLabelText(/Date \*/i);
  const submitButton = screen.getByRole('button', { name: /Confirm Reservation/i });

  fireEvent.change(dateInput, { target: { value: '2000-01-01' } });
  // wait for controlled input value to update
  await waitFor(() => expect(dateInput.value).toBe('2000-01-01'));
  fireEvent.click(submitButton);

  // addBooking should not be called for invalid past date
  await waitFor(() => expect(mockAddBooking).not.toHaveBeenCalled());
});
