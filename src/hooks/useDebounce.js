import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Đặt bộ đếm thời gian
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy bộ đếm nếu người dùng tiếp tục gõ chữ mới trước khi hết giờ (delay)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}