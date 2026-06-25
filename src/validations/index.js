export const validateVocab = (form) => {
  const errors = {}
  if (!form.word?.trim())    errors.word    = 'Vui lòng nhập từ vựng'
  if (!form.meaning?.trim()) errors.meaning = 'Vui lòng nhập nghĩa'
  if (!form.category)        errors.category = 'Vui lòng chọn thẻ'
  return errors
}

export const validateQuote = (form) => {
  const errors = {}
  if (!form.text?.trim())   errors.text   = 'Vui lòng nhập câu nói'
  if (!form.author?.trim()) errors.author = 'Vui lòng nhập tác giả'
  return errors
}

export const validateLogin = (form) => {
  const errors = {}
  if (!form.email?.trim())    errors.email    = 'Vui lòng nhập email'
  if (!form.password?.trim()) errors.password = 'Vui lòng nhập mật khẩu'
  return errors
}