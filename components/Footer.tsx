import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black p-4 text-center mt-auto">
      <div className="container mx-auto">
        <p className="text-sm text-slate-400">
          Được cung cấp bởi Google Gemini API. 
          &copy; {new Date().getFullYear()} Trình Đánh Giá Code Gemini. 
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Vì mục đích giáo dục và minh họa. Không đảm bảo tính chính xác tuyệt đối của phản hồi.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-400"
          >
            Lấy API key Gemini miễn phí
          </a> | 
          <a 
            href="https://github.com/username/gemini-check" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-400 ml-2"
          >
            Mã nguồn trên GitHub
          </a>
        </p>
      </div>
    </footer>
  );
};
