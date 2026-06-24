export const MOCK_VOCABS = [
  { id: '1',  word: 'love',    pronunciation: '/lʌv/',      meaning: 'yêu thương',  category: 'feelings', example: 'I love you.' },
  { id: '2',  word: 'sad',     pronunciation: '/sæd/',      meaning: 'buồn',         category: 'feelings', example: 'She looks sad.' },
  { id: '3',  word: 'happy',   pronunciation: '/hæp.i/',    meaning: 'vui vẻ',       category: 'feelings', example: 'I am happy today.' },
  { id: '4',  word: 'three',   pronunciation: '/θriː/',     meaning: 'số ba',        category: 'numbers',  example: 'I have three cats.' },
  { id: '5',  word: 'two',     pronunciation: '/tuː/',      meaning: 'số hai',       category: 'numbers',  example: 'Two plus two is four.' },
  { id: '6',  word: 'one',     pronunciation: '/wʌn/',      meaning: 'số một',       category: 'numbers',  example: 'One step at a time.' },
  { id: '7',  word: 'green',   pronunciation: '/ɡriːn/',    meaning: 'màu xanh lá', category: 'colors',   example: 'The grass is green.' },
  { id: '8',  word: 'yellow',  pronunciation: '/ˈjel.oʊ/', meaning: 'màu vàng',    category: 'colors',   example: 'The sun is yellow.' },
  { id: '9',  word: 'red',     pronunciation: '/red/',      meaning: 'màu đỏ',      category: 'colors',   example: 'Roses are red.' },
  { id: '10', word: 'baby',    pronunciation: '/ˈbeɪ.bi/', meaning: 'em bé',       category: 'family',   example: 'The baby is sleeping.' },
  { id: '11', word: 'brother', pronunciation: '/ˈbrʌð.ər/',meaning: 'anh/em trai', category: 'family',   example: 'My brother is tall.' },
  { id: '12', word: 'cat',     pronunciation: '/kæt/',      meaning: 'con mèo',     category: 'animals',  example: 'The cat is cute.' },
]

export const MOCK_CATEGORIES = [
  { id: '1', name: 'feelings', label: 'Cảm xúc',  color: 'pink',   count: 3 },
  { id: '2', name: 'numbers',  label: 'Số đếm',   color: 'yellow', count: 3 },
  { id: '3', name: 'colors',   label: 'Màu sắc',  color: 'purple', count: 3 },
  { id: '4', name: 'family',   label: 'Gia đình', color: 'blue',   count: 2 },
  { id: '5', name: 'animals',  label: 'Động vật', color: 'green',  count: 1 },
]

export const MOCK_QUOTES = [
  { id: '1', text: 'The more you learn, the more you grow.',                                       trans: 'Càng học nhiều, bạn càng trưởng thành.',                                     author: 'Unknown',            tag: 'study',      isToday: true  },
  { id: '2', text: 'Walking with a friend in the dark is better than walking alone in the light.', trans: 'Đi cùng bạn trong bóng tối tốt hơn đi một mình trong ánh sáng.',           author: 'Helen Keller',       tag: 'friendship', isToday: false },
  { id: '3', text: 'Kindness is a language which the deaf can hear and the blind can see.',        trans: 'Lòng tốt là ngôn ngữ mà người điếc có thể nghe và người mù có thể thấy.', author: 'Mark Twain',         tag: 'motivation', isToday: false },
  { id: '4', text: 'Today a reader, tomorrow a leader.',                                           trans: 'Hôm nay là người đọc, ngày mai là người lãnh đạo.',                         author: 'Margaret Fuller',    tag: 'study',      isToday: false },
  { id: '5', text: "Believe you can and you're halfway there.",                                    trans: 'Tin rằng bạn có thể và bạn đã đi được nửa đường rồi.',                     author: 'Theodore Roosevelt', tag: 'motivation', isToday: false },
]

export const MOCK_ADMINS = [
  { id: '1', name: 'Nguyễn Văn A', email: 'admin@kidenglish.com', role: 'Super Admin',      status: 'active'   },
  { id: '2', name: 'Trần Thị B',   email: 'b@kidenglish.com',     role: 'Content Manager', status: 'active'   },
  { id: '3', name: 'Lê Văn C',     email: 'c@kidenglish.com',     role: 'Moderator',       status: 'inactive' },
]

export const MOCK_USERS = [
  { id: '1', name: 'Phạm Thị Lan',     email: 'lan@gmail.com',  joined: '12/01/2025', words: 45,  streak: 7,  status: 'active'   },
  { id: '2', name: 'Nguyễn Minh Tuấn', email: 'tuan@gmail.com', joined: '05/02/2025', words: 120, streak: 30, status: 'active'   },
  { id: '3', name: 'Lê Thị Hoa',       email: 'hoa@gmail.com',  joined: '20/03/2025', words: 8,   streak: 0,  status: 'inactive' },
]

export const MOCK_ROLES = [
  { id: '1', name: 'Super Admin',      desc: 'Toàn quyền hệ thống', users: 1 },
  { id: '2', name: 'Content Manager', desc: 'Quản lý nội dung',     users: 2 },
  { id: '3', name: 'Moderator',       desc: 'Kiểm duyệt & hỗ trợ', users: 1 },
]

export const MOCK_RESOURCES = ['Từ vựng', 'Câu nói', 'Danh mục', 'Admin', 'Người dùng', 'Nhóm quyền', 'Phân quyền']
export const MOCK_ACTIONS   = ['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa']