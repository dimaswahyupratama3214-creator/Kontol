import bcrypt from 'bcryptjs';
import { db, json, readBody, makeToken, method } from '../_lib.js';

export default async function handler(req, res) {
  if (!method(req, res)) return;
  const { username, password, name, referral } = readBody(req);
  const u = String(username || '').trim().toLowerCase();
  const p = String(password || '');
  const n = String(name || '').trim();
  if (!/^[a-z0-9_]{3,24}$/.test(u)) return json(res, 400, { error: 'Username 3–24 karakter: huruf kecil, angka, atau garis bawah.' });
  if (p.length < 8 || p.length > 72) return json(res, 400, { error: 'Password harus 8–72 karakter.' });
  if (n.length < 2 || n.length > 60) return json(res, 400, { error: 'Nama harus 2–60 karakter.' });
  const password_hash = await bcrypt.hash(p, 12);
  const { data, error } = await db.from('app_users').insert({ username: u, display_name: n, password_hash, referral_code: String(referral || '').trim().toUpperCase() || null, is_admin: false }).select('id,username,display_name,is_admin,created_at').single();
  if (error) {
    if (error.code === '23505') return json(res, 409, { error: 'Username sudah digunakan.' });
    console.error('signup error', error.code);
    return json(res, 500, { error: 'Pendaftaran gagal. Periksa konfigurasi database.' });
  }
  return json(res, 201, { token: makeToken(data), user: data });
}
