# Trình Đánh Giá Code Gemini

Một ứng dụng web giúp đánh giá và tối ưu hóa mã nguồn sử dụng Google Gemini API. Ứng dụng cho phép người dùng dán mã trực tiếp, tải tệp mã nguồn lên, chọn ngôn ngữ lập trình và nhận phản hồi chi tiết, cũng như các đề xuất cải thiện từ trí tuệ nhân tạo.

<!-- [Thêm ảnh chụp màn hình ứng dụng tại đây] -->

## Tính năng nổi bật

- **Đánh giá mã thông minh:** Nhận phân tích sâu sắc về chất lượng mã, lỗi tiềm ẩn, hiệu suất, và bảo mật từ AI Gemini.
- **Tối ưu hóa mã:** AI có thể đề xuất và tạo ra phiên bản mã đã được tối ưu hóa.
- **Hỗ trợ đa ngôn ngữ:** Chọn từ danh sách các ngôn ngữ lập trình phổ biến.
- **Nhập liệu linh hoạt:** Dán mã trực tiếp vào trình soạn thảo hoặc tải lên tệp mã nguồn.
- **Giao diện người dùng thân thiện:** Giao diện trực quan, dễ sử dụng.
- **Hiển thị phản hồi Markdown:** Phản hồi từ AI được định dạng rõ ràng bằng Markdown, bao gồm cả các khối mã.
- **Nhập API key trực tiếp:** Cho phép người dùng nhập API key Gemini riêng, không cần cấu hình trước.

## Công nghệ sử dụng

- React 19
- TypeScript
- Tailwind CSS
- Google Gemini API (`@google/genai`)
- React Markdown (`react-markdown`)
- Remark GFM (`remark-gfm`)

## Yêu cầu cài đặt

- Node.js (phiên bản LTS mới nhất được khuyến nghị)
- npm (thường đi kèm với Node.js) hoặc yarn

## Cài đặt và Khởi chạy

1.  **Clone repository về máy:**

    ```bash
    git clone <URL_REPOSITORY_CUA_BAN>
    cd <TEN_THU_MUC_DU_AN>
    ```

    Thay thế `<URL_REPOSITORY_CUA_BAN>` bằng URL GitHub repository của bạn và `<TEN_THU_MUC_DU_AN>` bằng tên thư mục dự án.

2.  **Cài đặt các dependencies (thư viện cần thiết):**
    Sử dụng npm:

    ```bash
    npm install
    ```

    Hoặc sử dụng yarn:

    ```bash
    yarn install
    ```

3.  **Cấu hình API Key cho Google Gemini:**

    Ứng dụng này yêu cầu một API Key từ Google Gemini để có thể giao tiếp với mô hình AI.

    - **Cách 1: Sử dụng giao diện người dùng (Khuyến nghị)**

      - Ứng dụng có tính năng cho phép người dùng nhập API key trực tiếp trong giao diện.
      - Chạy ứng dụng và một giao diện nhập API key sẽ hiện ra nếu không tìm thấy API key trong cấu hình.
      - API key sẽ được lưu trong localStorage của trình duyệt cho các lần sử dụng tiếp theo.
      - Lưu ý: Cách này an toàn cho người dùng cuối nhưng không phù hợp cho môi trường phát triển.

    - **Cách 2: Cho Phát triển Cục bộ (Local Development) - Sử dụng tệp `.env`**

      - Bạn có thể tạo API key miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey).
      - Tạo một tệp mới có tên là `.env` trong thư mục gốc của dự án (ngang hàng với tệp `package.json` hoặc `index.html`).
      - Sao chép nội dung từ tệp `.env.example` hoặc thêm dòng sau vào tệp `.env` vừa tạo:
        ```env
        GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
      - **QUAN TRỌNG:** Hãy thay thế `YOUR_GEMINI_API_KEY_HERE` bằng API Key thực sự mà bạn đã lấy từ Google AI Studio.
      - Tệp `.env` chứa thông tin nhạy cảm (API Key). Nó đã được thêm vào tệp `.gitignore` để đảm bảo rằng bạn không vô tình đưa API Key của mình lên GitHub. **Không bao giờ commit tệp `.env` lên repository!**

    - **Cách 3: Sử dụng file `.env.production` cho môi trường production**

      - Tạo file `.env.production` trong thư mục gốc của dự án với nội dung:

      ```env
      GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
      ```

      - File này sẽ được sử dụng khi build ứng dụng ở môi trường production

    - **Cách 4: Cấu hình Vercel hoặc dịch vụ hosting khác**
      Khi triển khai ứng dụng lên Vercel hoặc các dịch vụ hosting khác, bạn có thể cấu hình biến môi trường trong dashboard của dịch vụ đó.
      1. Đăng nhập vào Vercel (hoặc dịch vụ hosting của bạn)
      2. Chọn dự án của bạn
      3. Vào phần Settings > Environment Variables
      4. Thêm biến môi trường `GEMINI_API_KEY` với giá trị là API key của bạn

4.  **Chạy ứng dụng ở chế độ phát triển (Development Mode):**
    ```bash
    npm run dev
    ```
    Hoặc với yarn:
    ```bash
    yarn dev
    ```
    Ứng dụng sẽ chạy tại địa chỉ [http://localhost:5173](http://localhost:5173) theo mặc định.

## Cách sử dụng ứng dụng

1.  Mở ứng dụng trong trình duyệt web của bạn theo địa chỉ URL được cung cấp bởi máy chủ phát triển.
2.  **Nếu không có API key được cấu hình trước:**
    - Bạn sẽ thấy một form để nhập API key Gemini
    - Nhập API key của bạn (lấy từ Google AI Studio) và nhấn "Lưu Key"
    - API key sẽ được lưu trong localStorage của trình duyệt cho các lần sử dụng sau
3.  Từ danh sách thả xuống, **chọn ngôn ngữ lập trình** của đoạn mã bạn muốn đánh giá.
4.  **Nhập mã nguồn của bạn:**
    - **Dán trực tiếp:** Sao chép mã và dán vào vùng văn bản lớn.
    - **Tải lên tệp:** Nhấp vào nút "Tải lên tệp" và chọn tệp mã nguồn từ máy tính của bạn. Nội dung tệp sẽ được hiển thị trong vùng văn bản (ở chế độ chỉ đọc). Bạn có thể xóa tệp đã tải lên để quay lại chế độ dán mã.
5.  Nhấp vào nút **"Nhận Đánh Giá AI"**.
6.  Chờ trong giây lát để AI xử lý. Phản hồi chi tiết sẽ xuất hiện trong khung bên phải.
7.  Nếu có phản hồi và bạn muốn AI tối ưu hóa mã, nhấp vào nút **"Tối ưu hóa mã này"**. Mã đã tối ưu (nếu có) sẽ xuất hiện bên dưới. Bạn có thể sao chép mã này.

## Đóng góp

Mọi đóng góp đều được chào đón! Nếu bạn có ý tưởng cải thiện hoặc muốn sửa lỗi:

1.  Fork repository này.
2.  Tạo một branch mới cho tính năng hoặc bản sửa lỗi của bạn (`git checkout -b feature/AmazingFeature` hoặc `git checkout -b fix/BugFix`).
3.  Thực hiện các thay đổi của bạn và commit (`git commit -m 'Add some AmazingFeature'`).
4.  Push lên branch của bạn (`git push origin feature/AmazingFeature`).
5.  Mở một Pull Request.

Đối với các thay đổi lớn, vui lòng mở một issue trước để thảo luận về những gì bạn muốn thay đổi.

## Giấy phép

Dự án này hiện chưa có giấy phép cụ thể. Bạn có thể cân nhắc thêm một giấy phép mã nguồn mở phổ biến như [MIT License](https://opensource.org/licenses/MIT) nếu muốn.
