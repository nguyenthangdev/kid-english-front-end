import { z } from 'zod'

export const quoteSchema = z.object({
  contentEn: z.string().min(1, 'Vui lòng nhập câu nói tiếng Anh.'),
  contentVn: z.string().min(1, 'Vui lòng nhập dịch nghĩa tiếng Việt.'),
  author: z.string().max(200, 'Tên tác giả không được vượt quá 200 ký tự.').optional(),
  tagId: z.string().min(1, 'Vui lòng chọn thẻ chủ đề.'),
})