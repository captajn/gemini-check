
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LoadingSpinner } from './LoadingSpinner';

interface FeedbackDisplayProps {
  feedback: string | null;
  isLoading: boolean;
  error: string | null;
  originalCode: string;
  language: string;
  onOptimizeCode: () => void;
  optimizedCode: string | null;
  isOptimizing: boolean;
  optimizationError: string | null;
  isApiKeyConfigured: boolean;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  feedback,
  isLoading,
  error,
  originalCode,
  language,
  onOptimizeCode,
  optimizedCode,
  isOptimizing,
  optimizationError,
  isApiKeyConfigured
}) => {

  const [copied, setCopied] = useState(false);
  const canOptimize = feedback && !isLoading && !error && originalCode.trim() !== '' && isApiKeyConfigured;

  const handleCopyOptimizedCode = async () => {
    if (optimizedCode) {
      try {
        await navigator.clipboard.writeText(optimizedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      } catch (err) {
        console.error("Không thể sao chép mã:", err);
        // TODO: Hiển thị thông báo lỗi cho người dùng nếu không sao chép được
      }
    }
  };

  return (
    <div className="bg-neutral-900 p-6 rounded-lg shadow-xl flex flex-col min-h-[300px] lg:min-h-full gap-4">
      <div>
        <h2 className="text-xl font-semibold text-white mb-3 border-b border-neutral-700 pb-2">
          Phản Hồi Đánh Giá Mã từ AI
        </h2>
        
        {isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-300 py-10">
            <LoadingSpinner size="large" />
            <p className="mt-3 text-lg">Đang tạo phản hồi, vui lòng đợi...</p>
            <p className="text-sm text-slate-400">Việc này có thể mất chút thời gian đối với mã phức tạp.</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center p-4 bg-red-900/30 border border-red-700 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-400 mb-3" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-red-300 font-semibold text-lg">Đã xảy ra lỗi</p>
            <p className="text-red-200 text-center text-sm mt-1">{error}</p>
          </div>
        )}

        {feedback && !isLoading && !error && (
          <div className="prose prose-sm max-w-none text-slate-200 overflow-y-auto flex-grow h-auto max-h-[400px] lg:max-h-[calc(500px-10rem)] pretty-scrollbar pr-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {feedback}
            </ReactMarkdown>
          </div>
        )}

        {!isLoading && !error && !feedback && (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-400 py-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 text-slate-500" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-6.375 3h9M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
            <p className="text-lg">Đánh giá mã của bạn sẽ xuất hiện ở đây.</p>
            <p className="text-sm">Nhập mã của bạn hoặc tải tệp và nhấp "Nhận Đánh Giá AI" để bắt đầu.</p>
          </div>
        )}
      </div>

      {canOptimize && (
        <div className="border-t border-neutral-700 pt-4">
          <button
            onClick={onOptimizeCode}
            disabled={isOptimizing || isLoading || !isApiKeyConfigured}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-700 disabled:text-slate-400 disabled:cursor-not-allowed text-black font-semibold py-2.5 px-5 rounded-md transition duration-150 ease-in-out flex items-center justify-center gap-2 text-md mb-3"
            aria-live="polite"
          >
            {isOptimizing && <LoadingSpinner />}
            {isOptimizing ? 'Đang tối ưu hóa...' : 'Tối ưu hóa mã này'}
          </button>
        </div>
      )}

      {isOptimizing && (
        <div className="flex-grow flex flex-col items-center justify-center text-slate-300 py-6">
          <LoadingSpinner size="medium" />
          <p className="mt-2 text-md">Đang tối ưu hóa mã, vui lòng đợi...</p>
        </div>
      )}

      {optimizationError && !isOptimizing && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-md mt-2">
          <p className="text-red-300 font-semibold">Lỗi Tối ưu hóa</p>
          <p className="text-red-200 text-sm mt-1">{optimizationError}</p>
        </div>
      )}

      {optimizedCode && !isOptimizing && !optimizationError && (
        <div className="mt-2">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Mã đã được tối ưu hóa:</h3>
          <pre className="bg-black p-3 rounded-md overflow-x-auto text-sm text-slate-100 max-h-[300px] pretty-scrollbar border border-neutral-700">
            <code className={`language-${language}`}>{optimizedCode}</code>
          </pre>
           <button
            onClick={handleCopyOptimizedCode}
            className="mt-3 bg-amber-600 hover:bg-amber-700 text-black text-xs font-semibold py-1.5 px-3 rounded-md transition duration-150 disabled:opacity-75"
            title="Sao chép mã tối ưu"
            disabled={copied}
          >
            {copied ? 'Đã sao chép!' : 'Sao chép mã'}
          </button>
        </div>
      )}
      <style>{`
        .pretty-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .pretty-scrollbar::-webkit-scrollbar-track {
          background: #0a0a0a; /* neutral-950 or very dark gray */
          border-radius: 4px;
        }
        .pretty-scrollbar::-webkit-scrollbar-thumb {
          background: #f59e0b; /* amber-500 */
          border-radius: 4px;
        }
        .pretty-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d97706; /* amber-600 */
        }
        /* Ensure prose styles are white/light on dark background */
        .prose {
          color: #d1d5db; /* gray-300 */
        }
        .prose p {
          margin-bottom: 1em; 
          line-height: 1.7; 
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #f9fafb; /* gray-50 */
          margin-top: 1.6em; 
          margin-bottom: 0.6em; 
        }
        .prose h1 { font-size: 1.5em; } /* Tailwind prose-sm h1 is 1.25em, make it slightly larger */
        .prose h2 { font-size: 1.3em; } /* Tailwind prose-sm h2 is 1.125em */
        .prose h3 { font-size: 1.15em; }

        .prose ul, .prose ol {
          margin-bottom: 1em; 
          padding-left: 1.25em; /* Ensure enough indent */
        }
        .prose li {
          margin-bottom: 0.3em; 
        }
        .prose li > p { /* Paragraphs inside list items */
            margin-bottom: 0.25em;
        }
        .prose ul > li::before {
            background-color: #f59e0b; /* amber-500 for bullet points */
            /* Adjust position if necessary */
        }
        .prose blockquote {
          color: #a1a1aa; /* neutral-400 */
          border-left-color: #f59e0b; /* amber-500 */
          margin-top: 1.5em;
          margin-bottom: 1.5em;
          padding-left: 0.8em;
        }
        .prose code {
          color: #fde68a; /* amber-200 for inline code */
          background-color: #262626; /* neutral-800 for inline code background */
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .prose pre {
          background-color: #000000; /* black for code block background */
          color: #e5e7eb; /* gray-200 */
          border: 1px solid #404040; /* neutral-700 */
          border-radius: 0.375rem;
          padding: 1em;
          margin-top: 1.5em;
          margin-bottom: 1.5em;
        }
        .prose pre code {
           background-color: transparent; /* Reset for code block content */
           color: inherit; /* Inherit from pre */
           padding: 0;
           font-size: inherit;
        }
        .prose a {
          color: #fbbf24; /* amber-400 for links */
          text-decoration: underline;
        }
        .prose a:hover {
          color: #f59e0b; /* amber-500 for link hover */
        }
      `}</style>
    </div>
  );
};
