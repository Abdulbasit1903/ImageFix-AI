import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('protected-route gating', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('redirects unauthenticated users to the sign-in page', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /sign in to imagefix ai/i })
    ).toBeInTheDocument();
  });
});
