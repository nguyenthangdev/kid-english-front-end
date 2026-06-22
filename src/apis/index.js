// TODO: thay BASE_URL bằng URL thực tế khi có backend
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const request = async (method, path, body) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// ─── Vocab ───────────────────────────────────────────────
export const vocabApi = {
  getAll:  ()         => request('GET',    '/vocabs'),
  getOne:  (id)       => request('GET',    `/vocabs/${id}`),
  create:  (data)     => request('POST',   '/vocabs', data),
  update:  (id, data) => request('PATCH',  `/vocabs/${id}`, data),
  remove:  (id)       => request('DELETE', `/vocabs/${id}`),
}

// ─── Quote ───────────────────────────────────────────────
export const quoteApi = {
  getAll:  ()         => request('GET',    '/quotes'),
  getOne:  (id)       => request('GET',    `/quotes/${id}`),
  create:  (data)     => request('POST',   '/quotes', data),
  update:  (id, data) => request('PATCH',  `/quotes/${id}`, data),
  remove:  (id)       => request('DELETE', `/quotes/${id}`),
}

// ─── Vocab-Category ────────────────────────────────────────────
export const vocabCategoryApi = {
  getAll:  ()         => request('GET',    '/vocab-category'),
  create:  (data)     => request('POST',   '/vocab-category', data),
  update:  (id, data) => request('PATCH',  `/vocab-category/${id}`, data),
  remove:  (id)       => request('DELETE', `/vocab-category/${id}`),
}

// ─── Quote-Category ────────────────────────────────────────────
export const quoteCategoryApi = {
  getAll:  ()         => request('GET',    '/quote-category'),
  create:  (data)     => request('POST',   '/quote-category', data),
  update:  (id, data) => request('PATCH',  `/quote-category/${id}`, data),
  remove:  (id)       => request('DELETE', `/quote-category/${id}`),
}

// ─── Auth ────────────────────────────────────────────────
export const authApi = {
  login:    (data) => request('POST', '/auth/login', data),
  register: (data) => request('POST', '/auth/register', data),
  me:       ()     => request('GET',  '/auth/me'),
}

// ─── Admin ───────────────────────────────────────────────
export const adminApi = {
  getAll:  ()         => request('GET',    '/admins'),
  create:  (data)     => request('POST',   '/admins', data),
  update:  (id, data) => request('PATCH',  `/admins/${id}`, data),
  remove:  (id)       => request('DELETE', `/admins/${id}`),
}

// ─── User ─────────────────────────────────────────────────
export const userApi = {
  getAll:  ()         => request('GET',   '/users'),
  update:  (id, data) => request('PATCH', `/users/${id}`, data),
}

// ─── Role ─────────────────────────────────────────────────
export const roleApi = {
  getAll:  ()         => request('GET',    '/roles'),
  create:  (data)     => request('POST',   '/roles', data),
  update:  (id, data) => request('PATCH',  `/roles/${id}`, data),
  remove:  (id)       => request('DELETE', `/roles/${id}`),
}

// ─── Permission ───────────────────────────────────────────
export const permissionApi = {
  getMatrix: ()     => request('GET',  '/permissions/matrix'),
  save:      (data) => request('POST', '/permissions/matrix', data),
}