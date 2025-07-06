import multer from "multer";

// Dùng bộ nhớ RAM thay vì lưu file vào disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép ảnh"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
