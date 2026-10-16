import bcrypt from 'bcryptjs';
import { db, json, readBody, makeToken, method } from '../_lib.js';

export default async function handler(req, res) {
  if (!method(req, res)) return;
  const { username, password } = readBody(req);
  const u = String(username || '').trim().toLowerCase();
  const p = String(password || '');
  if (!u || !p) return json(res, 400, { error: 'Username dan password wajib diisi.' });
  const { data, error } = await db.from('app_users').select('id,username,display_name,password_hash,is_admin,created_at').eq('username', u).maybeSingle();
  if (error) { console.error('login query error', error.code); return json(res, 500, { error: 'Tidak dapat menghubungi database.' }); }
  if (!data || !(await bcrypt.compare(p, data.password_hash))) return json(res, 401, { error: 'Username atau password salah.' });
  const user = { id: data.id, username: data.username, display_name: data.display_name, is_admin: data.is_admin, created_at: data.created_at };
  return json(res, 200, { token: makeToken(user), user });
}
