import mongoose from "mongoose";

const childrenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    birthday: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 18
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    profileImage: {
        type: String,
        default: "" // Có thể dùng avatar mặc định nếu để trống
    },
    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        required: true
    },
    note: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Children = mongoose.model("Children", childrenSchema);

export default Children;
