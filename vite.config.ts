import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Tải biến môi trường từ các file .env
    const env = loadEnv(mode, '.', ['', 'GEMINI_']);
    
    console.log(`[Vite Config] Mode: ${mode}`);
    console.log(`[Vite Config] API key available: ${!!env.GEMINI_API_KEY}`);
    
    // Lấy API key từ biến môi trường, với giá trị mặc định là chuỗi rỗng
    // Chuỗi rỗng sẽ kích hoạt giao diện nhập key thủ công
    const apiKey = env.GEMINI_API_KEY || '';
    
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        port: 5173,
        host: true,
        open: true
      }
    };
});
