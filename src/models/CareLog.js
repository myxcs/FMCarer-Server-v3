import mongoose from "mongoose";

const careLogSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Children", // Bé được chăm sóc
    required: true
  },
  caregiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Người chăm sóc thực hiện
    required: true
  },
  activityType: {
    type: String,
    enum: ["feeding", "sleeping", "bathing", "playing", "medication", "checkup", "other"],
    required: true
  },
  description: {
    type: String,
    default: "" // Mô tả chi tiết nếu cần
  },
  performedAt: {
    type: Date,
    default: Date.now // Thời gian thực tế thực hiện
  },
  status: {
    type: String,
    enum: ["completed", "skipped", "failed"],
    default: "completed" // Trạng thái thực hiện
  },
  scheduleRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CareSchedule", // Tham chiếu nếu hoạt động này đến từ lịch đã lên
    default: null
  },
  notes: {
    type: String,
    default: "" // Ghi chú thêm về tình trạng, phản ứng của bé,...
  },
  isActive: {
    type: Boolean,
    default: true // Xóa mềm
  }
}, {
  timestamps: true
});

const CareLog = mongoose.model("CareLog", careLogSchema);

export default CareLog;
