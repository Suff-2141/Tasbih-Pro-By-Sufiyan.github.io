export const APP_STORAGE_KEY = 'tasbih-pro-v1';
export const loadState = fallback => { try { return JSON.parse(localStorage.getItem(APP_STORAGE_KEY)) || fallback; } catch { return fallback; } };
export const saveState = state => localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
