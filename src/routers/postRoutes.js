import express from "express";
import {
  createPost,
  getPosts,
  getPostsByUser,
  likePost,
  commentOnPost,
  approvePost,
} from "../controllers/postController.js";

import { isAuth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/role.js";

const router = express.Router();

// 📝 Tạo bài viết
router.post("/", isAuth, createPost);

// 📃 Lấy bài viết
router.get("/", isAuth, getPosts);
router.get("/user/:userId", isAuth, getPostsByUser);

// ❤️ Like
router.patch("/:postId/like", isAuth, likePost);

// 💬 Bình luận
router.post("/:postId/comment", isAuth, commentOnPost);

// ✅ Duyệt bài viết (admin only)
router.patch("/:postId/approve", isAuth, isAdmin, approvePost);

export default router;
