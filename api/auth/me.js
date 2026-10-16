import { authUser, json, method } from '../_lib.js';
export default async function handler(req, res) {
  if (!method(req, res, 'GET')) return;
  const user = await authUser(req);
  if (!user) return json(res, 401, { error: 'Sesi tidak valid atau sudah kedaluwarsa.' });
  return json(res, 200, { user });
}
