// Chỉ lớp mock này truy cập localStorage. Không dùng để phân quyền thật.
export function readStorage<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Trình duyệt chặn lưu trữ: vẫn cho phép dùng bản mẫu trong bộ nhớ.
  }
}
