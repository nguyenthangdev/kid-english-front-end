import { z } from 'zod'

export const adminProfileSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Vui lòng nhập họ và tên!')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự!')
})

export const adminPasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Vui lòng nhập mật khẩu hiện tại!'),
  newPassword: z.string()
    .min(6, 'Mật khẩu mới phải chứa ít nhất 6 ký tự!'),
  confirmPassword: z.string()
    .min(1, 'Vui lòng xác nhận mật khẩu mới!')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Xác nhận mật khẩu mới không khớp!',
  path: ['confirmPassword']
})

export const adminAvatarSchema = z.object({
  avatar: z.any()
    .refine((files) => files?.length > 0, 'Vui lòng chọn ảnh đại diện!')
    .refine((files) => files?.[0]?.type?.startsWith('image/'), 'File tải lên phải là hình ảnh!')
    .refine((files) => files?.[0]?.size <= 2 * 1024 * 1024, 'Ảnh đại diện không được vượt quá 2MB!')
})
