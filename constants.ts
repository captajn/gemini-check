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

// Các API key mặc định của server - Trong môi trường thực tế, nên lưu trữ ở phía server
export const SERVER_API_KEYS: string[] = [
  // Thêm các API key của bạn ở đây
  "AIzaSyBcA34-f5WV7-eESM0kzdfEdVDvVv4ZA5A",
  "AIzaSyDCkzMJdb1uDP46-GE_xuWa-cBwZWdhY68"
];

// Khóa lưu trữ trong localStorage
export const STORAGE_KEY_NAME: string = 'geminiUserApiKey';
export const SERVER_KEY_IDENTIFIER: string = 'USE_SERVER_KEY';