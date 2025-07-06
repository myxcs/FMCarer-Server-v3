import mongoose from "mongoose";

const careScheduleSchema = new mongoose.Schema({
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
    default: "" // Mô tả cụ thể (vd: "uống thuốc ho 5ml")
  },
  scheduledTime: {
    type: Date,
    required: true // Thời gian dự kiến thực hiện
  },
  durationMinutes: {
    type: Number,
    default: 30 // Thời lượng ước tính
  },
  repeat: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly"],
    default: "none"
  },
  notifyBeforeMinutes: {
    type: Number,
    default: 10 // Nhắc trước bao nhiêu phút
  },
  status: {
    type: String,
    enum: ["pending", "completed", "missed"],
    default: "pending"
  },
  notes: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true // Cho phép xóa mềm
  }
}, {
  timestamps: true
});

const CareSchedule = mongoose.model("CareSchedule", careScheduleSchema);

export default CareSchedule;
