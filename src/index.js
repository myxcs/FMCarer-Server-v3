// Import thư viện 
import express from 'express';
import "dotenv/config";
import cors from 'cors';

// Import các router của ứng dụng
import authRouter from './routers/authRoutes.js';     // Xử lý đăng ký, đăng nhập
import postRouter from './routers/postRoutes.js';     // Xử lý bài đăng (Post CRUD)

// Import hàm kết nối cơ sở dữ liệu MongoDB
import { connectDB } from './lib/db.js';


// Khởi tạo ứng dụng Express
const app = express();

// Thiết lập CORS để cho phép các nguồn khác truy cập vào API
app.use(cors({
  origin: '*', // Cho phép tất cả nguồn, có thể thay đổi theo nhu cầu bảo mật
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
}));

// Cổng mà server sẽ lắng nghe (đọc từ biến môi trường hoặc mặc định là 3000)
const PORT = process.env.PORT || 3000;


// Middleware: Cho phép Express parse JSON body từ các request
app.use(express.json());


// Route mặc định kiểm tra server hoạt động
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


// Gắn router xử lý authentication vào đường dẫn /api/auth
app.use("/api/auth", authRouter);

// Gắn router xử lý bài đăng vào đường dẫn /api/posts
app.use("/api/posts", postRouter);


// Khởi động server và lắng nghe trên PORT đã định
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // Kết nối cơ sở dữ liệu MongoDB khi server bắt đầu chạy
  connectDB();
});
