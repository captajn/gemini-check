
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleGeminiError = (error: any, context: string): Error => {
    console.error(`Lỗi khi gọi Gemini API (${context}):`, error);
    if (error.message && error.message.includes("API key not valid")) {
         return new Error("Khóa API Gemini không hợp lệ hoặc bị thiếu. Vui lòng đảm bảo `process.env.API_KEY` được cấu hình chính xác và hợp lệ.");
    }
    if (error.message && error.message.toLowerCase().includes("quota")) {
        return new Error("Đã vượt quá hạn ngạch API Gemini. Vui lòng kiểm tra hạn ngạch của bạn hoặc thử lại sau.");
    }
    
    const generationResponse = error.response as GenerateContentResponse;
    if (generationResponse?.candidates?.[0]?.finishReason === 'SAFETY') {
        return new Error(`Không thể hoàn thành ${context === 'review' ? 'việc đánh giá mã' : 'việc tối ưu hóa mã'} vì lý do an toàn do AI xác định. Vui lòng sửa đổi mã đầu vào.`);
    }
    if (!generationResponse?.candidates?.length && !generationResponse?.text ) { // Also check for direct text in some error cases
         return new Error(`AI không cung cấp phản hồi cho ${context === 'review' ? 'đánh giá' : 'tối ưu hóa'}. Điều này có thể do đầu vào hoặc sự cố tạm thời. Vui lòng thử lại.`);
    }

    return new Error(error.message || `Đã xảy ra lỗi không xác định khi ${context === 'review' ? 'tìm nạp đánh giá mã' : 'tối ưu hóa mã'} từ API Gemini.`);
};

export const reviewCode = async (code: string, language: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("Khóa API Gemini (process.env.API_KEY) chưa được cấu hình. Vui lòng đảm bảo nó đã được thiết lập trong môi trường của bạn.");
  }

  const systemInstruction = `Bạn là một AI chuyên gia đánh giá mã. Mục tiêu chính của bạn là cung cấp phản hồi toàn diện, mang tính xây dựng và có thể hành động để giúp các nhà phát triển cải thiện mã của họ.
Phân tích đoạn mã được cung cấp trong ngữ cảnh của ngôn ngữ lập trình được chỉ định (${language}).

Tập trung vào các khía cạnh sau:
1.  **Chất lượng & Khả năng đọc mã**: Đánh giá các khía cạnh như tính nhất quán về kiểu dáng, sự rõ ràng, độ phức tạp, nhận xét (sự hiện diện, chất lượng, sự cần thiết) và quy ước đặt tên.
2.  **Lỗi tiềm ẩn & Trường hợp biên**: Xác định các lỗi logic, ngoại lệ thời gian chạy tiềm ẩn, lỗi off-by-one, vấn đề con trỏ null, các trường hợp biên chưa được xử lý và điều kiện tranh chấp (nếu có).
3.  **Cân nhắc về hiệu suất**: Chỉ ra bất kỳ tắc nghẽn hiệu suất rõ ràng nào, thuật toán hoặc cấu trúc dữ liệu không hiệu quả, hoặc các hoạt động sử dụng nhiều tài nguyên. Đề xuất các tối ưu hóa cụ thể nếu có thể.
4.  **Lỗ hổng bảo mật**: Tìm kiếm các rủi ro bảo mật phổ biến liên quan đến ngôn ngữ và ngữ cảnh (ví dụ: XSS, SQL injection, command injection, xử lý bí mật không an toàn, xác thực đầu vào không đúng cách, CORS headers quá thoải mái, v.v.).
5.  **Thực tiễn tốt nhất & Mã theo đặc ngữ**: Nhận xét về việc tuân thủ các đặc ngữ của ngôn ngữ ${language}, các thực tiễn tốt nhất và các mẫu thiết kế có liên quan. Đề xuất các giải pháp thay thế nếu có thể sử dụng một mẫu hoặc phương pháp tiếp cận đặc ngữ phù hợp hơn.
6.  **Đề xuất cải tiến & Tái cấu trúc**: Đưa ra lời khuyên cụ thể, có thể hành động để tái cấu trúc hoặc cải thiện mã. Khi thích hợp, cung cấp các đoạn mã ngắn gọn để minh họa các đề xuất của bạn. Hãy lịch sự, khuyến khích và mang tính giáo dục trong giọng điệu của bạn.

Cấu trúc phản hồi của bạn một cách rõ ràng. Sử dụng Markdown để định dạng, bao gồm:
- Tiêu đề (ví dụ: \`## Lỗi tiềm ẩn\`) cho các loại phản hồi khác nhau.
- Dấu đầu dòng cho các mục riêng lẻ.
- Khối mã (sử dụng \`\`\`${language} ... \`\`\`) cho các ví dụ mã hoặc để tham chiếu các phần của mã đã gửi.

Hãy đảm bảo toàn bộ phản hồi của bạn bằng tiếng Việt.`;

  const userPrompt = `Vui lòng đánh giá đoạn mã ${language} sau đây. Cung cấp phản hồi chi tiết bằng tiếng Việt dựa trên các hướng dẫn đã được cung cấp:

\`\`\`${language}
${code}
\`\`\`

`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.5,
        }
    });
    
    const feedbackText = response.text;

    if (typeof feedbackText !== 'string') {
        console.error("Định dạng phản hồi không mong muốn từ Gemini API. Mong đợi một chuỗi.", response);
        throw new Error("Đã nhận được định dạng phản hồi không mong muốn từ AI. Phản hồi có thể không đầy đủ.");
    }
    return feedbackText;
  } catch (error: any) {
    throw handleGeminiError(error, 'review');
  }
};

export const optimizeCode = async (code: string, language: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("Khóa API Gemini (process.env.API_KEY) chưa được cấu hình. Vui lòng đảm bảo nó đã được thiết lập trong môi trường của bạn.");
  }

  const systemInstruction = `You are an expert code optimization AI. Your primary goal is to refactor the provided code to improve performance, readability, and maintainability. Apply clean code principles and language-specific best practices for ${language}. If the code is markup (like HTML, XML), also ensure its structure is well-formed and semantic.
Return ONLY the optimized code block itself. Do not include any explanatory text, markdown formatting (like \`\`\`language ... \`\`\`), or any other text outside of the optimized code. The output should be suitable for direct use as source code. Comments within the code are acceptable and encouraged if they clarify complex parts. For ${language} code, ensure the optimized version is fully functional and syntactically correct.`;

  const userPrompt = `Please optimize the following ${language} code. Adhere strictly to the system instruction to return only the raw, optimized code:\n\n\`\`\`${language}\n${code}\n\`\`\``;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // More deterministic for code generation
      }
    });

    const optimizedCodeText = response.text;

    if (typeof optimizedCodeText !== 'string') {
      console.error("Định dạng phản hồi không mong muốn từ Gemini API khi tối ưu hóa. Mong đợi một chuỗi.", response);
      throw new Error("Đã nhận được định dạng phản hồi không mong muốn từ AI khi tối ưu hóa. Mã tối ưu có thể không đầy đủ.");
    }
    // Simple check to remove markdown fences if Gemini still adds them despite the prompt
    let finalCode = optimizedCodeText.trim();
    const fenceRegex = new RegExp(`^\`\`\`(${language}|\\w*)?\\s*\\n?([\\s\\S]*?)\\n?\\s*\`\`\`$`, 's');
    const match = finalCode.match(fenceRegex);
    if (match && match[2]) {
      finalCode = match[2].trim();
    }

    return finalCode;
  } catch (error: any) {
    throw handleGeminiError(error, 'optimization');
  }
};
