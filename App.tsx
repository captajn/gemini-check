import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeInputForm } from './components/CodeInputForm';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { Footer } from './components/Footer';
import { reviewCode, optimizeCode } from './services/geminiService';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './constants';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const [optimizedCode, setOptimizedCode] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationError, setOptimizationError] = useState<string | null>(null);

  // Thêm state mới cho API key do người dùng nhập
  const [userApiKey, setUserApiKey] = useState<string>('');
  const storedKeyName = 'geminiUserApiKey';

  useEffect(() => {
    // Kiểm tra API key khi component được mount
    const checkApiKey = () => {
      // Kiểm tra nếu có API key đã lưu trong localStorage
      const savedApiKey = localStorage.getItem(storedKeyName);
      if (savedApiKey) {
        setUserApiKey(savedApiKey);
        return true;
      }

      // Kiểm tra nếu có API key từ biến môi trường
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === '' || apiKey === 'PLACEHOLDER_API_KEY') {
        setApiKeyError("Vui lòng nhập khóa API Gemini của bạn vào ô bên dưới để sử dụng ứng dụng.");
        return false;
      }
      return true;
    };
    
    checkApiKey();
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userApiKey.trim()) {
      // Lưu API key vào localStorage để sử dụng cho những lần sau
      localStorage.setItem(storedKeyName, userApiKey);
      setApiKeyError(null);
    } else {
      setApiKeyError("Vui lòng nhập một khóa API hợp lệ.");
    }
  };

  const handleReviewSubmit = useCallback(async () => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã hoặc tải lên một tệp để đánh giá.");
      return;
    }
    
    // Kiểm tra nếu không có API key từ biến môi trường và người dùng chưa nhập
    if (apiKeyError && !userApiKey) {
      setError("Vui lòng nhập khóa API Gemini trước khi tiếp tục.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeedback(null);
    setOptimizedCode(null);
    setOptimizationError(null);
    setIsOptimizing(false);

    try {
      // Truyền API key do người dùng nhập nếu có
      const reviewResult = await reviewCode(code, language, userApiKey);
      setFeedback(reviewResult);
    } catch (e: any) {
      setError(e.message || "Đã xảy ra lỗi không mong muốn.");
      console.error("Lỗi khi gửi yêu cầu đánh giá:", e);
    } finally {
      setIsLoading(false);
    }
  }, [code, language, apiKeyError, userApiKey]);

  const handleOptimizeCode = useCallback(async () => {
    if (!code.trim()) {
      setOptimizationError("Không có mã nguồn để tối ưu hóa.");
      return;
    }
    
    // Kiểm tra nếu không có API key từ biến môi trường và người dùng chưa nhập
    if (apiKeyError && !userApiKey) {
      setOptimizationError("Vui lòng nhập khóa API Gemini trước khi tiếp tục.");
      return;
    }

    setIsOptimizing(true);
    setOptimizationError(null);
    setOptimizedCode(null);

    try {
      // Truyền API key do người dùng nhập nếu có
      const optimizedResult = await optimizeCode(code, language, userApiKey);
      setOptimizedCode(optimizedResult);
    } catch (e: any) {
      setOptimizationError(e.message || "Đã xảy ra lỗi không mong muốn trong quá trình tối ưu hóa.");
      console.error("Lỗi khi tối ưu hóa mã:", e);
    } finally {
      setIsOptimizing(false);
    }
  }, [code, language, apiKeyError, userApiKey]);


  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {apiKeyError && (
          <div className="bg-red-700 border border-red-500 text-white px-4 py-3 rounded-md relative shadow-lg" role="alert">
            <strong className="font-bold">Cấu Hình API Key!</strong>
            <span className="block sm:inline ml-2">{apiKeyError}</span>
            
            <form onSubmit={handleApiKeySubmit} className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="flex-grow p-2 rounded text-black"
                placeholder="Nhập khóa API Gemini của bạn ở đây"
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Lưu Key
              </button>
            </form>
            <div className="mt-2 text-sm">
              <p>Chưa có API key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Lấy key miễn phí từ Google AI Studio</a></p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CodeInputForm
            code={code}
            onCodeChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            onSubmit={handleReviewSubmit}
            isLoading={isLoading}
            supportedLanguages={SUPPORTED_LANGUAGES}
            defaultLanguage={DEFAULT_LANGUAGE}
            isSubmitDisabled={(!!apiKeyError && !userApiKey) || isLoading || isOptimizing}
          />
          <FeedbackDisplay
            feedback={feedback}
            isLoading={isLoading}
            error={error}
            originalCode={code} 
            language={language} 
            onOptimizeCode={handleOptimizeCode}
            optimizedCode={optimizedCode}
            isOptimizing={isOptimizing}
            optimizationError={optimizationError}
            isApiKeyConfigured={!apiKeyError || !!userApiKey}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
