import { z } from 'zod'

export const vocabSchema = z.object({
  word: z.string().trim().min(1, 'Vui lòng nhập từ vựng tiếng Anh'),
  pronunciation: z.string().trim().optional(), // Phiên âm có thể bỏ trống
  meaning: z.string().trim().min(1, 'Vui lòng nhập nghĩa tiếng Việt'),
  tagId: z.string().min(1, 'Vui lòng chọn danh mục (thẻ)'),
  imageUrl: z.string().optional()
  // example: z.string().trim().optional(), // Ví dụ có thể bỏ trống
})