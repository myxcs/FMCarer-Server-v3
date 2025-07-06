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
import upload from "../lib/multer.js";

const router = express.Router();

// Tạo bài viết
// Mới (hỗ trợ upload tối đa 5 ảnh)
router.post("/", isAuth, upload.array("images", 5), createPost);


// Lấy bài viết
router.get("/", isAuth, getPosts);
router.get("/user/:userId", isAuth, getPostsByUser);

// Like
router.patch("/:postId/like", isAuth, likePost);

// Bình luận
router.post("/:postId/comment", isAuth, commentOnPost);

// Duyệt bài viết (admin only)
router.patch("/:postId/approve", isAuth, isAdmin, approvePost);

export default router;
