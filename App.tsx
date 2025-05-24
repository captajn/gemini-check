
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


  useEffect(() => {
    if (typeof process.env.API_KEY !== 'string' || process.env.API_KEY === '') {
      setApiKeyError("QUAN TRỌNG: Khóa API Gemini (process.env.API_KEY) chưa được cấu hình. Ứng dụng sẽ không hoạt động chính xác. Vui lòng đảm bảo nó đã được thiết lập trong môi trường của bạn.");
    }
  }, []);

  const handleReviewSubmit = useCallback(async () => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã hoặc tải lên một tệp để đánh giá.");
      return;
    }
    if (apiKeyError) {
      setError(apiKeyError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeedback(null);
    setOptimizedCode(null);
    setOptimizationError(null);
    setIsOptimizing(false);

    try {
      const reviewResult = await reviewCode(code, language);
      setFeedback(reviewResult);
    } catch (e: any) {
      setError(e.message || "Đã xảy ra lỗi không mong muốn.");
      console.error("Lỗi khi gửi yêu cầu đánh giá:", e);
    } finally {
      setIsLoading(false);
    }
  }, [code, language, apiKeyError]);

  const handleOptimizeCode = useCallback(async () => {
    if (!code.trim()) {
      setOptimizationError("Không có mã nguồn để tối ưu hóa.");
      return;
    }
     if (apiKeyError) {
      setOptimizationError(apiKeyError); 
      return;
    }

    setIsOptimizing(true);
    setOptimizationError(null);
    setOptimizedCode(null);

    try {
      const optimizedResult = await optimizeCode(code, language);
      setOptimizedCode(optimizedResult);
    } catch (e: any) {
      setOptimizationError(e.message || "Đã xảy ra lỗi không mong muốn trong quá trình tối ưu hóa.");
      console.error("Lỗi khi tối ưu hóa mã:", e);
    } finally {
      setIsOptimizing(false);
    }
  }, [code, language, apiKeyError]);


  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {apiKeyError && (
          <div className="bg-red-700 border border-red-500 text-white px-4 py-3 rounded-md relative shadow-lg" role="alert">
            <strong className="font-bold">Lỗi Cấu Hình API Key!</strong>
            <span className="block sm:inline ml-2">{apiKeyError}</span>
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
            isSubmitDisabled={!!apiKeyError || isLoading || isOptimizing}
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
            isApiKeyConfigured={!apiKeyError}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
