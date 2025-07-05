import express from 'express';
import "dotenv/config";

import authRouter from './routers/authRoutes.js';
import { connectDB } from './lib/db.js';

const app = express(); // Đã sửa tên đúng
const PORT = process.env.PORT || 3000;

// Middleware để parse JSON từ request body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
