import Post from "../models/Post.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js";
import mongoose from "mongoose";

//  Tạo bài viết mới (hỗ trợ upload ảnh)
export const createPost = async (req, res) => {
  try {
    const { content, audience } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    //  Nếu có ảnh thì upload lên Cloudinary
    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "fmcarer/posts" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }

    const post = new Post({
      author: userId,
      content,
      audience: audience || "public",
      images: uploadedImages, //  dán phần này tại đây
      approved: audience === "family" ? true : false,
    });


    await post.save();
    res.status(201).json({ message: " Post created", post });
  } catch (err) {
    console.error(" Error creating post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Lấy danh sách bài viết phù hợp với vai trò
export const getPosts = async (req, res) => {
  try {
    const user = req.user;

    // Lấy page và limit từ query string, mặc định nếu không có
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    if (user.role === "admin") {
      filter = {}; // Admin thấy tất cả
    } else if (["main", "sub"].includes(user.role)) {
      filter = {
        $or: [
          { audience: "family", author: user._id },
          { audience: "public", approved: true },
        ],
      };
    } else {
      return res.status(403).json({ message: "Permission denied" });
    }

    const total = await Post.countDocuments(filter); // Tổng số bài viết
    const posts = await Post.find(filter)
      .populate("author", "username profileImage role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const hasMore = skip + posts.length < total;

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
    });
  } catch (err) {
    console.error(" Error getting posts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//  Lấy bài viết của 1 người dùng
export const getPostsByUser = async (req, res) => {
  
  try {
    const { userId } = req.params;
    const currentUser = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const filter = { author: userId };

    // Lấy thông tin người đăng bài để kiểm tra familyId
    const authorUser = await User.findById(userId);
    if (!authorUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSameUser = currentUser._id.toString() === userId;
    const isAdmin = currentUser.role === "admin";
    const isSameFamily =
      currentUser.familyId &&
      authorUser.familyId &&
      currentUser.familyId.toString() === authorUser.familyId.toString();

    // Xác định bài viết nào được phép hiển thị
    if (isAdmin || isSameUser) {
      // thấy tất cả bài
      // Không cần thêm $or
    } else if (isSameFamily) {
      // Thấy bài trong gia đình và bài công khai đã được duyệt
      filter.$or = [
        { audience: "family" },
        { audience: "public", approved: true },
      ];
    } else {
      // Người ngoài: chỉ thấy bài công khai đã duyệt
      filter.$or = [{ audience: "public", approved: true }];
    }

    const posts = await Post.find(filter)
      .populate("author", "username profileImage role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      total,
      hasMore: skip + posts.length < total,
    });
  } catch (err) {
    console.error(" Error getting user posts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//  Like hoặc Unlike
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    //  So sánh ObjectId bằng toString
    const index = post.likes.findIndex(id => id.toString() === userId.toString());

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ message: "Post updated", likes: post.likes.length });
  } catch (err) {
    console.error(" Error liking post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Thêm bình luận
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
    console.error(" Error commenting:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Duyệt bài viết (admin only)
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

    console.log(`Admin ${req.user._id} approved post ${postId}`);
    res.json({ message: "Post approved" });
  } catch (err) {
    console.error(" Error approving post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  Xóa bài viết (admin hoặc tác giả)// Xoá bài viết + ảnh cloudinary
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isAuthor = post.author.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "You are not allowed to delete this post" });
    }

    //  Xoá ảnh trên Cloudinary
    if (post.images && post.images.length > 0) {
      for (const image of post.images) {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
    }

    await post.deleteOne();

    res.json({ message: "Post and images deleted successfully" });
  } catch (err) {
    console.error(" Error deleting post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
