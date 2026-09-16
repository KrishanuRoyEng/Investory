import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import LoginPage from './page';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { apiFetch } from '@/lib/api/client';

// Mock Next router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock API client
vi.mock('@/lib/api/client', () => ({
  apiFetch: {
    POST: vi.fn(),
  },
}));

describe('Login 429 Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "Too many attempts" message when API returns 429', async () => {
    // Mock 429 response
    (apiFetch.POST as any).mockResolvedValueOnce({
      error: null,
      response: new Response(null, { status: 429 }),
    });

    render(<LoginPage />);

    // Fill form using placeholders
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

    // Submit
    // Using getAllByRole because there's a button and potentially an a tag, or just getByText
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Verify 429 error message appears
    await waitFor(() => {
      expect(screen.getByText('Too many attempts. Please try again shortly.')).not.toBeNull();
    });
  });
});
