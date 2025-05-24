# Trình Đánh Giá Code Gemini

Một ứng dụng web giúp đánh giá và tối ưu hóa mã nguồn sử dụng Google Gemini API. Ứng dụng cho phép người dùng dán mã trực tiếp, tải tệp mã nguồn lên, chọn ngôn ngữ lập trình và nhận phản hồi chi tiết, cũng như các đề xuất cải thiện từ trí tuệ nhân tạo.

<!-- [Thêm ảnh chụp màn hình ứng dụng tại đây] -->

## Tính năng nổi bật

*   **Đánh giá mã thông minh:** Nhận phân tích sâu sắc về chất lượng mã, lỗi tiềm ẩn, hiệu suất, và bảo mật từ AI Gemini.
*   **Tối ưu hóa mã:** AI có thể đề xuất và tạo ra phiên bản mã đã được tối ưu hóa.
*   **Hỗ trợ đa ngôn ngữ:** Chọn từ danh sách các ngôn ngữ lập trình phổ biến.
*   **Nhập liệu linh hoạt:** Dán mã trực tiếp vào trình soạn thảo hoặc tải lên tệp mã nguồn.
*   **Giao diện người dùng Vàng-Đen:** Giao diện trực quan, dễ sử dụng với tông màu Vàng-Đen hiện đại và chữ trắng dễ đọc.
*   **Hiển thị phản hồi Markdown:** Phản hồi từ AI được định dạng rõ ràng bằng Markdown, bao gồm cả các khối mã.

## Công nghệ sử dụng

*   React 19
*   TypeScript
*   Tailwind CSS
*   Google Gemini API (`@google/genai`)
*   React Markdown (`react-markdown`)
*   Remark GFM (`remark-gfm`)

## Yêu cầu cài đặt

*   Node.js (phiên bản LTS mới nhất được khuyến nghị)
*   npm (thường đi kèm với Node.js) hoặc yarn

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

    *   **Cách 1: Cho Phát triển Cục bộ (Local Development) - Sử dụng tệp `.env`**
        *   Bạn có thể tạo API key miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey).
        *   Tạo một tệp mới có tên là `.env` trong thư mục gốc của dự án (ngang hàng với tệp `package.json` hoặc `index.html`).
        *   Sao chép nội dung từ tệp `.env.example` hoặc thêm dòng sau vào tệp `.env` vừa tạo:
            ```env
            API_KEY=YOUR_GEMINI_API_KEY_HERE
            ```
        *   **QUAN TRỌNG:** Hãy thay thế `YOUR_GEMINI_API_KEY_HERE` bằng API Key thực sự mà bạn đã lấy từ Google AI Studio.
        *   Tệp `.env` chứa thông tin nhạy cảm (API Key). Nó đã được thêm vào tệp `.gitignore` để đảm bảo rằng bạn không vô tình đưa API Key của mình lên GitHub. **Không bao giờ commit tệp `.env` lên repository!**

    *   **Cách 2: Lưu trữ API Key an toàn trên GitHub (Khuyến nghị cho CI/CD và lưu trữ an toàn)**
        Để bảo mật API Key khi làm việc với GitHub và đặc biệt là khi sử dụng GitHub Actions (ví dụ: để tự động build hoặc deploy ứng dụng), bạn nên sử dụng GitHub Secrets.
        1.  **Truy cập Repository của bạn trên GitHub.**
        2.  Nhấp vào tab **"Settings"** (Cài đặt).
        3.  Trong menu điều hướng bên trái, tìm đến mục **"Secrets and variables"** (Bí mật và biến) và chọn **"Actions"**.
        4.  Nhấp vào nút **"New repository secret"** (Bí mật repository mới).
        5.  Trong ô **"Name"** (Tên), nhập chính xác là `API_KEY`. (Tên này phải khớp với cách bạn truy cập nó trong mã hoặc workflow, ví dụ: `process.env.API_KEY` hoặc `${{ secrets.API_KEY }}` trong GitHub Actions).
        6.  Trong ô **"Secret"** (Giá trị bí mật), dán API Key Gemini của bạn vào.
        7.  Nhấp vào nút **"Add secret"** (Thêm bí mật).

        **Cách sử dụng GitHub Secret trong GitHub Actions:**
        Nếu bạn thiết lập một workflow GitHub Actions (ví dụ, trong một tệp `.github/workflows/main.yml`) để build hoặc deploy ứng dụng, bạn có thể truyền secret này vào dưới dạng biến môi trường. Ví dụ:
        ```yaml
        name: Build and Deploy
        on: [push]
        jobs:
          build:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v3
              - name: Setup Node.js
                uses: actions/setup-node@v3
                with:
                  node-version: '18' # Hoặc phiên bản Node.js bạn dùng
              - name: Install dependencies
                run: npm install
              - name: Build application
                run: npm run build # Giả sử bạn có lệnh build
                env:
                  API_KEY: ${{ secrets.API_KEY }} # Đây là cách truyền secret
              # ... các bước deploy khác ...
        ```
        Trong quá trình build, `process.env.API_KEY` sẽ có sẵn cho ứng dụng của bạn nếu công cụ build của bạn (ví dụ: Vite, Webpack, Parcel) được cấu hình để nhúng các biến môi trường.

4.  **Chạy ứng dụng ở chế độ phát triển (Development Mode):**
    *   Ứng dụng này (cụ thể là `index.html` và `index.tsx`) được thiết kế để được phục vụ bởi một máy chủ phát triển web (development server). Máy chủ này không chỉ phục vụ các tệp tĩnh mà còn cần có khả năng làm cho biến môi trường `API_KEY` (từ tệp `.env` cho phát triển cục bộ) truy cập được dưới dạng `process.env.API_KEY` trong mã JavaScript phía client.
    *   **Nếu bạn sử dụng một công cụ build hiện đại như Vite, Parcel, hoặc Create React App (đã được cấu hình để hỗ trợ `process.env.API_KEY`):**
        Thường bạn sẽ có một lệnh như `npm run dev`, `npm start`, hoặc `yarn dev`. Hãy kiểm tra tài liệu của công cụ bạn đang dùng. Ví dụ, với Vite, bạn có thể chạy `npm run dev` hoặc `yarn dev`.
    *   **Nếu bạn đang phục vụ `index.html` một cách thủ công (ít khuyến khích cho ứng dụng React có biến môi trường):**
        Bạn cần một máy chủ HTTP đơn giản. Một cách phổ biến là sử dụng gói `serve`:
        ```bash
        npx serve .
        ```
        Tuy nhiên, việc chỉ phục vụ tệp tĩnh như vậy sẽ không tự động nạp `process.env.API_KEY` từ tệp `.env`. Bạn sẽ cần một cơ chế phức tạp hơn hoặc một công cụ phát triển thực thụ (như Vite) để tiêm biến môi trường vào client.
    *   Cách tiếp cận đơn giản nhất để thử nghiệm nhanh với các tệp tĩnh là sử dụng một tiện ích mở rộng (extension) như "Live Server" trong Visual Studio Code, sau đó mở tệp `index.html`. Tuy nhiên, hãy lưu ý rằng `process.env.API_KEY` có thể không được định nghĩa trừ khi Live Server hoặc môi trường của bạn được cấu hình để xử lý các biến môi trường cho JavaScript phía client. Mã nguồn hiện tại đang dựa vào `process.env.API_KEY` được cung cấp bởi môi trường build/dev server.

    Sau khi máy chủ phát triển khởi động, nó thường sẽ cung cấp một địa chỉ URL (ví dụ: `http://localhost:3000` hoặc `http://localhost:5173`) để bạn mở ứng dụng trong trình duyệt.

## Cách sử dụng ứng dụng

1.  Mở ứng dụng trong trình duyệt web của bạn theo địa chỉ URL được cung cấp bởi máy chủ phát triển.
2.  Từ danh sách thả xuống, **chọn ngôn ngữ lập trình** của đoạn mã bạn muốn đánh giá.
3.  **Nhập mã nguồn của bạn:**
    *   **Dán trực tiếp:** Sao chép mã và dán vào vùng văn bản lớn.
    *   **Tải lên tệp:** Nhấp vào nút "Tải lên tệp" và chọn tệp mã nguồn từ máy tính của bạn. Nội dung tệp sẽ được hiển thị trong vùng văn bản (ở chế độ chỉ đọc). Bạn có thể xóa tệp đã tải lên để quay lại chế độ dán mã.
4.  Nhấp vào nút **"Nhận Đánh Giá AI"**.
5.  Chờ trong giây lát để AI xử lý. Phản hồi chi tiết sẽ xuất hiện trong khung bên phải.
6.  Nếu có phản hồi và bạn muốn AI tối ưu hóa mã, nhấp vào nút **"Tối ưu hóa mã này"**. Mã đã tối ưu (nếu có) sẽ xuất hiện bên dưới. Bạn có thể sao chép mã này.

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
