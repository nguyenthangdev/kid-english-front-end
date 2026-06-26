import { z } from 'zod'

// Schema đăng nhập cho người dùng
export const userLoginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'Vui lòng nhập email!')
    .email('Email không đúng định dạng!'),
  password: z.string()
    .min(1, 'Vui lòng nhập mật khẩu!')
    .min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự!'),
})

// Schema đăng ký tài khoản người dùng
export const userRegisterSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Vui lòng nhập họ và tên!'),
  email: z.string()
    .trim()
    .min(1, 'Vui lòng nhập email!')
    .email('Email không đúng định dạng!'),
  password: z.string()
    .min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự!'),
  confirmPassword: z.string()
    .min(1, 'Vui lòng xác nhận mật khẩu!'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp!',
  path: ['confirmPassword'],
})
