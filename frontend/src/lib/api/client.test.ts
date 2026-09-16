import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { api, apiFetch } from './client';
import { useAuthStore } from '../store/auth.store';
import { logout } from '../store/auth.store';
import { queryClient } from '../store/query';

const originalFetch = global.fetch;

describe('API Interceptor & Auth Store', () => {
  let assignMock: ReturnType<typeof vi.fn>;
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().clearAuth();
    queryClient.clear();
    
    assignMock = vi.fn();
    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { assign: assignMock },
      writable: true,
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('enforces retry cap: a second 401 after retry hard-fails to /login', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: { accessToken: 'new' } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }));

    // @ts-ignore
    await apiFetch.GET('/some-endpoint');

    expect(useAuthStore.getState().status).toBe('unauthenticated');
    expect(assignMock).toHaveBeenCalledWith('/login');
  });

  it('Atomic logout: queryClient.clear() actually empties the cache', async () => {
    queryClient.setQueryData(['test'], { data: 'test' });
    expect(queryClient.getQueryData(['test'])).toBeDefined();

    global.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    
    await logout();

    expect(queryClient.getQueryData(['test'])).toBeUndefined();
    expect(useAuthStore.getState().status).toBe('unauthenticated');
    expect(assignMock).toHaveBeenCalledWith('/login');
  });
});
