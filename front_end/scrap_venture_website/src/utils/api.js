/**
 * ScrapVenture Unified API Client
 * - Handles HttpOnly Cookie authentication (credentials: 'include')
 * - Automatic CSRF token retrieval & attachment ('x-csrf-token') for all forms / mutations
 * - Automatic token refresh handling (admin-refresh, customer-refresh, collector-refresh)
 */

let cachedCsrfToken = null;

export async function getCsrfToken(forceRefresh = false) {
  if (cachedCsrfToken && !forceRefresh) {
    return cachedCsrfToken;
  }
  try {
    const res = await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      cachedCsrfToken = data.csrftoken;
      return cachedCsrfToken;
    }
  } catch (err) {
    console.warn('Failed to retrieve CSRF token:', err);
  }
  return null;
}

export function getStoredUser() {
  try {
    const data = localStorage.getItem('scrapventure_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (!user) {
    localStorage.removeItem('scrapventure_user');
  } else {
    localStorage.setItem('scrapventure_user', JSON.stringify(user));
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('authchange'));
  }
}

export function clearStoredUser() {
  localStorage.removeItem('scrapventure_user');
  cachedCsrfToken = null;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('authchange'));
  }
}

let activeRefreshPromise = null;

export async function tryRefreshToken(role) {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      let refreshUrl = '/api/customer-refresh';
      if (role === 'admin' || role === 'moderator') {
        refreshUrl = '/api/admin-refresh';
      } else if (role === 'scrap_collector' || role === 'collector') {
        refreshUrl = '/api/collector-refresh';
      }

      const csrf = await getCsrfToken();
      const res = await fetch(refreshUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(csrf ? { 'x-csrf-token': csrf } : {}),
        },
      });

      if (res.ok) {
        // Re-fetch fresh CSRF token after refresh
        await getCsrfToken(true);
        try {
          const data = await res.json();
          if (data?.user) {
            const current = getStoredUser();
            if (current) {
              setStoredUser({ ...current, ...data.user });
            }
          }
        } catch {}
        return true;
      }
    } catch (err) {
      console.warn('Token refresh error:', err);
    } finally {
      activeRefreshPromise = null;
    }
    return false;
  })();

  return activeRefreshPromise;
}

// Proactively refresh tokens every 10 minutes while user is active
if (typeof window !== 'undefined') {
  setInterval(() => {
    const user = getStoredUser();
    if (user?.role) {
      tryRefreshToken(user.role).catch(() => {});
    }
  }, 10 * 60 * 1000);
}

export async function apiRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = { ...(options.headers || {}) };

  // Always include credentials for HttpOnly cookie authentication
  const fetchOptions = {
    ...options,
    method,
    credentials: 'include',
  };

  // For state-changing operations, attach CSRF token and json header if body is present
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }
    if (fetchOptions.body && typeof fetchOptions.body === 'object' && !(fetchOptions.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(fetchOptions.body);
    }
  }

  fetchOptions.headers = headers;

  let response = await fetch(endpoint, fetchOptions);

  // If 401 Unauthorized, attempt refresh once and retry
  if (response.status === 401 && !options._retry) {
    const user = getStoredUser();
    const role = user?.role;
    const refreshed = await tryRefreshToken(role);
    if (refreshed) {
      const newCsrf = await getCsrfToken(true);
      const retryHeaders = {
        ...headers,
        ...(newCsrf ? { 'x-csrf-token': newCsrf } : {}),
      };
      response = await fetch(endpoint, {
        ...fetchOptions,
        headers: retryHeaders,
        _retry: true,
      });
    } else {
      clearStoredUser();
    }
  }

  if (response.status === 401 && options._retry) {
    clearStoredUser();
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (typeof data === 'object' && (data?.message || data?.error)) ||
      `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/* ==========================================================================
   AUTHENTICATION API WRAPPERS
   ========================================================================== */

export async function loginAdmin({ email, password }) {
  const data = await apiRequest('/api/admin-login', {
    method: 'POST',
    body: { email, password },
  });
  if (data?.user) {
    setStoredUser({ ...data.user, role: data.user.role || 'admin' });
  }
  return data;
}

export async function logoutAdmin() {
  try {
    await apiRequest('/api/admin-logout', { method: 'POST' });
  } finally {
    clearStoredUser();
  }
}

export async function loginCustomer({ email, identifier, password }) {
  const data = await apiRequest('/api/customer-login', {
    method: 'POST',
    body: { email: email || identifier, identifier: identifier || email, password },
  });
  if (data?.user) {
    setStoredUser({ ...data.user, role: 'customer' });
  }
  return data;
}

export async function logoutCustomer() {
  try {
    await apiRequest('/api/customer-logout', { method: 'POST' });
  } finally {
    clearStoredUser();
  }
}

export async function loginCollector({ email, identifier, phone_number, password }) {
  const data = await apiRequest('/api/collector-login', {
    method: 'POST',
    body: {
      email: email || identifier,
      phone_number: phone_number || identifier,
      identifier: identifier || email,
      password,
    },
  });
  if (data?.user) {
    setStoredUser({ ...data.user, role: 'scrap_collector' });
  }
  return data;
}

export async function logoutCollector() {
  try {
    await apiRequest('/api/collector-logout', { method: 'POST' });
  } finally {
    clearStoredUser();
  }
}

/* ==========================================================================
   ADMIN REGISTRATION (Only Admins can register Admins & Moderators)
   ========================================================================== */

export async function registerAdminOrModerator({ name, email, password, role }) {
  const endpoint = role === 'moderator' ? '/api/moderator-register' : '/api/admin-register';
  return await apiRequest(endpoint, {
    method: 'POST',
    body: { name, email, password, role },
  });
}

/* ==========================================================================
   PUBLIC DATA (Awards, Campaigns, Campaign Effects)
   ========================================================================== */

export async function fetchPublicAwards() {
  return await apiRequest('/api/home/awards');
}

export async function fetchPublicCampaigns() {
  return await apiRequest('/api/home/campaigns');
}

export async function fetchPublicCampaignEffects() {
  return await apiRequest('/api/home/campaign-effects');
}
