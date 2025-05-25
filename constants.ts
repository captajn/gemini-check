import { LanguageOption } from './types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'rust', label: 'Rust' },
  { value: 'cpp', label: 'C++' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'shell', label: 'Shell Script' },
];

export const DEFAULT_LANGUAGE: string = 'javascript';
export const GEMINI_MODEL_NAME: string = 'gemini-2.5-flash-preview-04-17';

// Hàm để lấy các API key từ biến môi trường
const getEnvironmentApiKeys = (): string[] => {
  // Đọc key từ biến môi trường chính
  const mainApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  
  // Đọc các key bổ sung từ biến môi trường (nếu có)
  const additionalKeys: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const keyName = `GEMINI_API_KEY_${i}`;
    const key = process.env[keyName];
    if (key) {
      additionalKeys.push(key);
    }
  }
  
  // Kết hợp key chính và các key bổ sung, loại bỏ các key trống
  return [mainApiKey, ...additionalKeys].filter(key => key && key.trim() !== '');
};

// Các API key mặc định của server - Kết hợp từ biến môi trường và các key cứng
export const SERVER_API_KEYS: string[] = [
  ...getEnvironmentApiKeys(),
  // Thêm các API key cứng của bạn ở đây (nếu cần)
  // "YOUR_SERVER_API_KEY_1",
  // "YOUR_SERVER_API_KEY_2"
];

// Khóa lưu trữ trong localStorage
export const STORAGE_KEY_NAME: string = 'geminiUserApiKey';
export const SERVER_KEY_IDENTIFIER: string = 'USE_SERVER_KEY';