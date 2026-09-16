import { render, screen, waitFor } from '@testing-library/react';
import { RoleGuard } from './RoleGuard';
import { useAuthStore } from '@/lib/store/auth.store';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Next router
const mockReplace = vi.fn();
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

// Mock API client
vi.mock('@/lib/api/client', () => ({
  apiFetch: {
    POST: vi.fn(),
  },
}));

import { apiFetch } from '@/lib/api/client';

describe('RoleGuard Bootstrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().clearAuth(); // start clean
    useAuthStore.setState({ status: 'idle' });
  });

  it('fails bootstrap when no/expired refresh cookie and redirects to /login', async () => {
    // Mock the POST /auth/refresh to resolve with error or reject (simulate no refresh cookie)
    (apiFetch.POST as any).mockRejectedValueOnce(new Error('Unauthorized'));

    // To prevent React warning about unmounting during state update, wrap in act or await waitFor
    render(<RoleGuard><div data-testid="child">Protected</div></RoleGuard>);
    
    // initially it should show loading spinner, not the child
    expect(screen.queryByTestId('child')).toBeNull();

    await waitFor(() => {
      // should transition to unauthenticated and call router.replace
      expect(useAuthStore.getState().status).toBe('unauthenticated');
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });
});
