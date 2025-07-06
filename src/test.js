import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZhMjFmNGFkZDMyMTIxMmE0Y2E2ODUiLCJpYXQiOjE3NTE3ODU5NzIsImV4cCI6MTc1MTg3MjM3Mn0.gKgEQi4XuzlS5yS3nPPWnqZ9WRCx5H609PFQSWkUxtE"; // Đổi token sau khi login
const form = new FormData();

form.append("content", "Bé mới học bò hôm nay ");
form.append("audience", "public");

// Upload 1 hoặc nhiều ảnh từ local
form.append("images", fs.createReadStream("./test.png")); // Thêm ảnh đầu tiên
// form.append("images", fs.createReadStream("./image2.png")); // thêm nếu muốn

axios.post("http://localhost:3000/api/posts", form, {
  headers: {
    ...form.getHeaders(),
    Authorization: `Bearer ${token}`
  }
}).then(res => {
  console.log(" Post created:", res.data);
}).catch(err => {
  console.error(" Error:", err.response?.data || err.message);
});
