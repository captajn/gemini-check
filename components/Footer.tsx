
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
      </div>
    </footer>
  );
};
