import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeInputForm } from './components/CodeInputForm';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { Footer } from './components/Footer';
import { ApiKeyForm } from './components/ApiKeyForm';
import { reviewCode, optimizeCode } from './services/geminiService';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, STORAGE_KEY_NAME, SERVER_KEY_IDENTIFIER } from './constants';

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
  const [showApiKeyForm, setShowApiKeyForm] = useState<boolean>(false);

  useEffect(() => {
    // Kiểm tra API key khi component được mount
    const checkApiKey = () => {
      // Kiểm tra nếu có API key đã lưu trong localStorage
      const savedApiKey = localStorage.getItem(STORAGE_KEY_NAME);
      if (savedApiKey) {
        setUserApiKey(savedApiKey);
        setShowApiKeyForm(false);
        return true;
      }

      // Nếu không có key trong localStorage, hiển thị form nhập key
      setShowApiKeyForm(true);
      setApiKeyError("Vui lòng nhập khóa API Gemini của bạn hoặc sử dụng key của server để tiếp tục.");
      return false;
    };
    
    checkApiKey();
  }, []);

  const handleApiKeyChange = (key: string) => {
    setUserApiKey(key);
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userApiKey.trim() || userApiKey === SERVER_KEY_IDENTIFIER) {
      // Lưu API key vào localStorage để sử dụng cho những lần sau
      // Chỉ lưu key của người dùng, không lưu identifier của server
      if (userApiKey !== SERVER_KEY_IDENTIFIER) {
        localStorage.setItem(STORAGE_KEY_NAME, userApiKey);
      } else {
        // Nếu dùng key server, xóa key trong localStorage nếu có
        localStorage.removeItem(STORAGE_KEY_NAME);
      }
      setApiKeyError(null);
      setShowApiKeyForm(false);
    } else {
      setApiKeyError("Vui lòng nhập một khóa API hợp lệ hoặc sử dụng key của server.");
    }
  };

  const toggleApiKeyForm = () => {
    setShowApiKeyForm(!showApiKeyForm);
  };

  const handleReviewSubmit = useCallback(async () => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã hoặc tải lên một tệp để đánh giá.");
      return;
    }
    
    // Kiểm tra nếu không có API key và form đang hiển thị
    if (showApiKeyForm) {
      setError("Vui lòng nhập khóa API Gemini hoặc sử dụng key của server trước khi tiếp tục.");
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
      
      // Nếu lỗi liên quan đến API key, hiển thị form
      if (e.message && (e.message.includes("API key") || e.message.includes("quota"))) {
        setShowApiKeyForm(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [code, language, userApiKey, showApiKeyForm]);

  const handleOptimizeCode = useCallback(async () => {
    if (!code.trim()) {
      setOptimizationError("Không có mã nguồn để tối ưu hóa.");
      return;
    }
    
    // Kiểm tra nếu form đang hiển thị
    if (showApiKeyForm) {
      setOptimizationError("Vui lòng nhập khóa API Gemini hoặc sử dụng key của server trước khi tiếp tục.");
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
      
      // Nếu lỗi liên quan đến API key, hiển thị form
      if (e.message && (e.message.includes("API key") || e.message.includes("quota"))) {
        setShowApiKeyForm(true);
      }
    } finally {
      setIsOptimizing(false);
    }
  }, [code, language, userApiKey, showApiKeyForm]);


  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {showApiKeyForm ? (
          <ApiKeyForm
            userApiKey={userApiKey}
            onApiKeyChange={handleApiKeyChange}
            onApiKeySubmit={handleApiKeySubmit}
            apiKeyError={apiKeyError}
          />
        ) : (
          <div className="flex justify-between items-center bg-gray-800 p-3 rounded-md">
            <div>
              <span className="text-green-400">API Key:</span> {userApiKey === SERVER_KEY_IDENTIFIER ? 
                <span className="text-yellow-400">Đang sử dụng key của server</span> : 
                <span className="text-green-400">✓ Đã cấu hình</span>
              }
            </div>
            <button
              onClick={toggleApiKeyForm}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
            >
              Thay đổi API Key
            </button>
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
            isSubmitDisabled={showApiKeyForm || isLoading || isOptimizing}
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
            isApiKeyConfigured={!showApiKeyForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
