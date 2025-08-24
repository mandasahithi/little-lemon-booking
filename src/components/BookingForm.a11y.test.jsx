import React from 'react';
import { render } from '@testing-library/react';
import BookingForm from './BookingForm';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock context and toast so BookingForm can render in tests
jest.mock('@/context/BookingContext', () => ({
  useBooking: () => ({ addBooking: jest.fn() })
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() })
}));

test('BookingForm should have no basic accessibility violations', async () => {
  const { container } = render(<BookingForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
