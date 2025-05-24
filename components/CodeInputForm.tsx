
import React, { useState, useRef } from 'react';
import { LanguageOption } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface CodeInputFormProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  supportedLanguages: LanguageOption[];
  defaultLanguage: string;
  isSubmitDisabled?: boolean;
}

export const CodeInputForm: React.FC<CodeInputFormProps> = ({
  code,
  onCodeChange,
  language,
  onLanguageChange,
  onSubmit,
  isLoading,
  supportedLanguages,
  isSubmitDisabled
}) => {
  const currentLanguageLabel = supportedLanguages.find(l => l.value === language)?.label || language;
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        onCodeChange(fileContent);
        setUploadedFileName(file.name);
      };
      reader.onerror = () => {
        console.error("Lỗi đọc tệp");
        // TODO: Cân nhắc hiển thị lỗi này cho người dùng một cách rõ ràng hơn
        setUploadedFileName(null);
        onCodeChange(""); 
      }
      reader.readAsText(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleClearFile = () => {
    onCodeChange('');
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const placeholderText = uploadedFileName 
    ? `Nội dung tệp: ${uploadedFileName}` 
    : `Nhập mã ${currentLanguageLabel} của bạn tại đây hoặc tải lên một tệp...`;

  return (
    <div className="bg-neutral-900 p-6 rounded-lg shadow-xl flex flex-col gap-y-5">
      <div>
        <label htmlFor="language-select" className="block text-sm font-medium text-slate-100 mb-1">
          Ngôn ngữ lập trình
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-md p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          disabled={isLoading || isSubmitDisabled}
          aria-label="Chọn ngôn ngữ lập trình"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="code-input" className="block text-sm font-medium text-slate-100">
            {uploadedFileName ? `Tệp đã tải lên: ${uploadedFileName}` : "Dán mã của bạn hoặc tải tệp lên"}
          </label>
          {!uploadedFileName && (
            <button
              type="button"
              onClick={triggerFileInput}
              className="text-sm text-amber-500 hover:text-amber-400 font-medium disabled:opacity-70"
              disabled={isLoading || isSubmitDisabled}
              aria-label="Tải lên tệp mã nguồn"
            >
              Tải lên tệp
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cs,.go,.rb,.php,.swift,.kt,.rs,.c,.cpp,.h,.hpp,.html,.css,.sql,.sh,.txt,application/json,text/plain,text/markdown"
          aria-hidden="true"
        />
        
        <textarea
          id="code-input"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={placeholderText}
          className="w-full bg-black border border-neutral-700 text-slate-100 rounded-md p-3 text-sm font-mono h-80 md:h-96 lg:h-[calc(500px-10rem)] resize-y focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          disabled={isLoading || isSubmitDisabled || !!uploadedFileName}
          readOnly={!!uploadedFileName}
          aria-label={uploadedFileName ? `Nội dung của tệp ${uploadedFileName}` : "Nhập mã để đánh giá"}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-slate-400">
            {uploadedFileName 
              ? "Nội dung tệp được hiển thị ở trên. Xóa tệp để nhập mã thủ công." 
              : "Đảm bảo mã của bạn đủ hoàn chỉnh để có một đánh giá ý nghĩa."}
          </p>
          {uploadedFileName && (
            <button
              type="button"
              onClick={handleClearFile}
              className="text-sm text-red-500 hover:text-red-400 font-medium disabled:opacity-70"
              disabled={isLoading || isSubmitDisabled}
              aria-label={`Xóa tệp đã tải lên: ${uploadedFileName}`}
            >
              Xóa tệp
            </button>
          )}
        </div>
      </div>
      
      <button
        onClick={onSubmit}
        disabled={isLoading || isSubmitDisabled || !code.trim()}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:text-slate-400 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-md transition duration-150 ease-in-out flex items-center justify-center gap-2 text-lg"
        aria-live="polite"
      >
        {isLoading && <LoadingSpinner />}
        {isLoading ? 'Đang đánh giá...' : 'Nhận Đánh Giá AI'}
      </button>
    </div>
  );
};
