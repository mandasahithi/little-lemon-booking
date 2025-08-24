import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingCard from './BookingCard';

test('renders BookingCard component with booking data', () => {
  const booking = {
    id: '1',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow YYYY-MM-DD
    time: '18:30',
    guests: 2,
    seating: 'indoor',
    specialRequests: 'Window seat please',
    createdAt: new Date().toISOString(),
  };

  render(<BookingCard booking={booking} onDelete={jest.fn()} />);

  // guest count is rendered as "2 Guests"
  expect(screen.getByText(/2 Guests/)).toBeInTheDocument();
});