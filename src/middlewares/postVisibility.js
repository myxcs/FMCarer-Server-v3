// middlewares/postVisibility.js

import User from "../models/User.js";

/**
 * Middleware phân quyền xem bài viết
 * Gắn vào `req.postFilter` để controller dùng tiếp
 */
export const applyPostVisibility = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = req.params; // Nếu dùng với route `/user/:userId`

    // Default filter
    let filter = {};

    if (user.role === "admin") {
      filter = userId ? { author: userId } : {};
    } else if (["main", "sub"].includes(user.role)) {
      if (userId) {
        const authorUser = await User.findById(userId);
        if (!authorUser) {
          return res.status(404).json({ message: "User not found" });
        }

        const isSameUser = user._id.toString() === userId;
        const isSameFamily =
          user.familyId &&
          authorUser.familyId &&
          user.familyId.toString() === authorUser.familyId.toString();

        filter.author = userId;

        if (!isSameUser) {
          if (isSameFamily) {
            filter.$or = [
              { audience: "family" },
              { audience: "public", approved: true },
            ];
          } else {
            filter.$or = [{ audience: "public", approved: true }];
          }
        }
      } else {
        // Route /posts: không có userId
        filter = {
          $or: [
            { audience: "family", author: user._id },
            { audience: "public", approved: true },
          ],
        };
      }
    } else {
      return res.status(403).json({ message: "Permission denied" });
    }

    req.postFilter = filter;
    next();
  } catch (err) {
    console.error("Error in post visibility middleware:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
