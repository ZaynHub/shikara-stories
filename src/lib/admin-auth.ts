export const ADMIN_EMAIL = "admin@talibs.com";
export const ADMIN_PASSWORD = "Talib@2024";
export const AUTH_KEY = "talibs_admin_auth";

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "1";
}

export function loginAdmin(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    window.localStorage.setItem(AUTH_KEY, "1");
    return true;
  }
  return false;
}

export function logoutAdmin() {
  window.localStorage.removeItem(AUTH_KEY);
}
