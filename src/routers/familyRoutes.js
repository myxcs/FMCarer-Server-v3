import express from "express";
import {
  createFamily,
  addChildToFamily,
} from "../controllers/familyController.js";

import { isAuth } from "../middleware/auth.js";
import { isMain } from "../middleware/role.js";

const familyRouter = express.Router();

// Tạo nhóm gia đình → chỉ main
router.post("/create", isAuth, isMain, createFamily);

// Thêm trẻ vào nhóm → cũng chỉ main
router.post("/add-child", isAuth, isMain, addChildToFamily);

export default familyRouter;
