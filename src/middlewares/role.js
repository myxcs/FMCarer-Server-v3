// middleware/role.js

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin only" });
  }
  next();
};

export const isMain = (req, res, next) => {
  if (req.user.role !== "main") {
    return res.status(403).json({ message: "Forbidden: Main account only" });
  }
  next();
};

export const isSub = (req, res, next) => {
  if (req.user.role !== "sub") {
    return res.status(403).json({ message: "Forbidden: Sub account only" });
  }
  next();
};
