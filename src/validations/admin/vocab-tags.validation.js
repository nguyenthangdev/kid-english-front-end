import { z } from 'zod'

export const tagSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Tên các thẻ không được để trống!')
    .max(100, 'Tên các thẻ tối đa 100 ký tự!'),
  colorCode: z.enum(['green', 'blue', 'pink', 'yellow', 'purple', 'orange'], {
    required_error: 'Vui lòng chọn màu sắc!',
  })
})