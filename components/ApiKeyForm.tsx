import React, { useState } from 'react';

interface ApiKeyFormProps {
  userApiKey: string;
  onApiKeyChange: (key: string) => void;
  onApiKeySubmit: (e: React.FormEvent) => void;
  apiKeyError: string | null;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  userApiKey,
  onApiKeyChange,
  onApiKeySubmit,
  apiKeyError
}) => {
  const [showKey, setShowKey] = useState<boolean>(false);

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700 text-white px-4 py-3 rounded-md relative shadow-lg" role="alert">
      <strong className="font-bold">Cấu Hình API Key</strong>
      <span className="block sm:inline ml-2">
        {apiKeyError || "Nhập API key để sử dụng dịch vụ Gemini"}
      </span>
      
      <form onSubmit={onApiKeySubmit} className="mt-3 flex flex-col sm:flex-row gap-2">
        <div className="flex-grow relative">
          <input
            type={showKey ? "text" : "password"}
            className="w-full p-2 rounded text-black pr-10"
            placeholder="Nhập khóa API Gemini của bạn ở đây"
            value={userApiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-700"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Lưu Key
        </button>
      </form>
      <div className="mt-2 text-sm">
        <p>Chưa có API key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Lấy key miễn phí từ Google AI Studio</a></p>
        <p className="mt-1">Hoặc sử dụng key mặc định của server (có giới hạn sử dụng)</p>
        <button
          type="button"
          className="mt-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
          onClick={() => onApiKeyChange("USE_SERVER_KEY")}
        >
          Dùng key mặc định của server
        </button>
      </div>
    </div>
  );
}; 