import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",           // Người thực hiện giao dịch
        required: true,
    },
    type: {
        type: String,
        enum: ["topup", "spend", "refund", "adjustment"], // Kiểu giao dịch
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    balanceAfter: {
        type: Number,
        default: null,         // Số dư sau giao dịch (chỉ dùng khi đã duyệt)
    },
    description: {
        type: String,
        default: "",           // Ví dụ: "Nạp tiền qua Momo", "Gia hạn gói dịch vụ"
    },

    // Thông tin duyệt giao dịch (nếu là topup)
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "approved",   // Mặc định các giao dịch hệ thống là đã duyệt, riêng "topup" có thể là pending
    },
    proofImage: {
        type: String,
        default: "",           // Biên lai/hóa đơn nạp tiền (file URL nếu có)
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",           // Quản trị viên duyệt
        default: null,
    },
    approvedAt: {
        type: Date,
        default: null,
    },

    // // Liên kết động nếu cần (hóa đơn, post,...)
    // relatedRef: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     refPath: "refModel",
    //     default: null,
    // },
    // refModel: {
    //     type: String,
    //     enum: ["Post", "Invoice", "User"],
    //     default: null,
    // },

    isActive: {
        type: Boolean,
        default: true,         // Hỗ trợ xóa mềm
    },
}, {
    timestamps: true,        // Tự động thêm createdAt và updatedAt
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
