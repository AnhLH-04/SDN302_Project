// src/utils/auth.js
export function getToken() {
  return localStorage.getItem('token');
}

export function getUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role || 'guest';
  } catch {
    return 'guest';
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function isAdmin() {
  return getUserRole() === 'admin';
}

export function isMember() {
  return getUserRole() === 'member';
}

// Centralized logout to keep app state in sync
export function logout() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } finally {
    // Notify app so contexts can react immediately without full reload
    window.dispatchEvent(new Event('auth:logout'));
  }
}

// Optional helper if you want to set auth and notify
export function notifyLogin() {
  window.dispatchEvent(new Event('auth:login'));
}
