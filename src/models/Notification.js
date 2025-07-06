import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Người nhận thông báo
        required: true,
    },
    type: {
        type: String,
        enum: ["schedule", "system", "post", "comment", "like", "admin"],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    relatedRef: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        refPath: "refModel", // Cho phép liên kết động (CareSchedule, Post, v.v.)
    },
    refModel: {
        type: String,
        enum: ["CareSchedule", "CareLog", "Post", "Comment"],
        default: null,
    },
    read: {
        type: Boolean,
        default: false,
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
