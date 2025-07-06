import Post from "../models/Post.js";
import mongoose from "mongoose";

// 📝 Tạo bài viết mới
export const createPost = async (req, res) => {
  try {
    const { content, audience, images } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = new Post({
      author: userId,
      content,
      audience: audience || "public",
      images: images || [],
      approved: audience === "family" ? true : false // Family posts không cần duyệt
    });

    await post.save();
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📄 Lấy danh sách bài viết phù hợp
export const getPosts = async (req, res) => {
  try {
    const user = req.user;
    let filter = {};

    if (user.role === "admin") {
      filter = {}; // Admin thấy tất cả
    } else {
      filter = {
        $or: [
          { audience: "family", author: user._id },
          { audience: "public", approved: true },
        ],
      };
    }

    const posts = await Post.find(filter)
      .populate("author", "username profileImage role")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📄 Lấy bài viết theo user
export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({
      author: userId,
      $or: [
        { audience: "family" },
        { audience: "public", approved: true }
      ]
    })
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ❤️ Like / Unlike bài viết
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId); // Like
    } else {
      post.likes.splice(index, 1); // Unlike
    }

    await post.save();
    res.json({ message: "Post updated", likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 💬 Thêm bình luận
export const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) return res.status(400).json({ message: "Comment is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: userId,
      content,
      createdAt: new Date(),
    });

    await post.save();
    res.json({ message: "Comment added", comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Duyệt bài viết (chỉ admin)
export const approvePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.audience !== "public") {
      return res.status(400).json({ message: "Only public posts need approval" });
    }

    post.approved = true;
    await post.save();

    res.json({ message: "Post approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
