import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

export const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});
export function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}
export function readBody(req) { return req.body && typeof req.body === 'object' ? req.body : {}; }
export function makeToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, process.env.AUTH_SECRET, { expiresIn: '7d', issuer: 'storan-dashboard' });
}
export async function authUser(req) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET, { issuer: 'storan-dashboard' });
    const { data, error } = await db.from('app_users').select('id,username,display_name,is_admin,created_at').eq('id', payload.sub).maybeSingle();
    if (error || !data) return null;
    return data;
  } catch { return null; }
}
export function method(req, res, expected='POST') {
  if (req.method !== expected) { json(res, 405, { error: 'Metode tidak diizinkan' }); return false; }
  return true;
}
