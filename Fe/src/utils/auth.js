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
