import mongoose from "mongoose";

const familySchema = new mongoose.Schema({
    familyName: {
        type: String,
        required: true,
        trim: true
    },
    mainUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Các tài khoản phụ trong gia đình
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Family = mongoose.model("Family", familySchema);

export default Family;
