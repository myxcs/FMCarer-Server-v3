import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",            // Người gửi yêu cầu hỗ trợ / khiếu nại
    required: true
  },
  subject: {
    type: String,
    required: true,         // Tiêu đề ngắn gọn: "Không nạp được tiền", "Bị mất lịch hẹn"
  },
  message: {
    type: String,
    required: true          // Mô tả chi tiết vấn đề
  },
  category: {
    type: String,
    enum: ["technical", "billing", "account", "content", "other"],
    default: "other"        // Loại khiếu nại / hỗ trợ
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "resolved", "rejected"],
    default: "pending"      // Trạng thái xử lý
  },
  response: {
    type: String,
    default: ""             // Phản hồi của admin (nếu có)
  },
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",            // Admin xử lý
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true           // Hỗ trợ xóa mềm nếu cần
  }
}, {
  timestamps: true          // Tự động thêm createdAt, updatedAt
});

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);

export default SupportTicket;
