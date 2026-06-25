import { z } from 'zod'

export const roleSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên nhóm quyền.'),
  code: z.string().min(1, 'Vui lòng nhập mã code.').regex(/^[A-Z_]+$/, 'Mã code chỉ gồm chữ IN HOA và dấu gạch dưới (VD: ADMIN).'),
  description: z.string().optional(),
})