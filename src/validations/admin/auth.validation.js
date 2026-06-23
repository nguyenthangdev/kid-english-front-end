import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .lowercase()
    .min(1, 'Vui lòng nhập email!')
    .pipe(z.string().email('Email không hợp lệ!')),
  password: z.string()
    .min(1, 'Vui lòng nhập mật khẩu!')
})