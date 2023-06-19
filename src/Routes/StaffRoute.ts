import {
  addstaff,
  deletestaff,
  getallstaffs,
  getstaff,
  logout,
  signin,
  update,
} from "../Controller/StaffController";
import { authrole, authuser } from "../Middleware/RoleAuth";
import { authtoken } from "../Middleware/TokenAuth";
import { Router } from "express";
const router: Router = Router();

router.post("/add", authtoken, authuser, authrole(0, 2), addstaff);
router.delete(
  "/delete/:email",
  authtoken,
  authuser,
  authrole(0, 2),
  deletestaff
);
router.get("/get/:email", authtoken, authuser, authrole(0, 2), getstaff);
router.get(
  "/allstaffs/:schoolid",
  authtoken,
  authuser,
  authrole(0, 2),
  getallstaffs
);
router.put("/update", authtoken, authuser, authrole(0, 2), update);
router.post("/signin", signin);
router.delete("/delete", logout);

export default router;
