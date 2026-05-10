// Simple admin credentials — move to .env in production
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';
export const SESSION_COOKIE = 'admin_session';
export const SESSION_SECRET = process.env.SESSION_SECRET ?? 'super-secret-key-change-me';
