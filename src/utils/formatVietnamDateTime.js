/**
 * Chuyển đổi chuỗi thời gian sang định dạng Giờ:Phút Ngày/Tháng/Năm theo giờ Việt Nam
 * @param {string|Date} dateString - Chuỗi thời gian (thường từ Database trả về)
 * @returns {string} Thời gian đã format (VD: 14:30 25/06/2026)
 */
export const formatVietnamDateTime = (dateString) => {
  if (!dateString) return '—';
  
  return new Date(dateString).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false, // Sử dụng định dạng 24h
  });
};

/**
 * (Tặng thêm) Chuyển đổi chỉ lấy Ngày/Tháng/Năm (không lấy giờ)
 * @param {string|Date} dateString 
 * @returns {string} (VD: 25/06/2026)
 */
export const formatVietnamDateOnly = (dateString) => {
  if (!dateString) return '—';
  
  return new Date(dateString).toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};