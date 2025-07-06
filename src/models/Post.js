import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Người đăng bài (main hoặc sub)
        required: true
    },
    audience: {
        type: String,
        enum: ["family", "public"],
        default: "family" // Chế độ xem: chỉ nội bộ hoặc công khai cộng đồng
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        url: String,
        public_id: String
    }],
    approved: {
        type: Boolean,
        default: false // Dành cho bài viết "public", cần Admin duyệt
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true // Xóa mềm
    }
}, {
    timestamps: true
});

const Post = mongoose.model("Post", postSchema);

export default Post;
