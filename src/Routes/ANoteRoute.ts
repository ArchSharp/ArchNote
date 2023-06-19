import { authtoken } from "../Middleware/TokenAuth";
import {
  alterTable,
  createDB,
  createTable,
  getAllSchools,
  getSchool,
} from "../Controller/ANoteController";
import { Router } from "express";
import { authrole, authuser } from "../Middleware/RoleAuth";

const router: Router = Router();

router.get("/createdb", createDB);
router.get("/createtable", createTable);
router.get("/altertable", alterTable);
router.get("/getschool/:id", authtoken, authuser, getSchool);
router.get(
  "/getallschools",
  authtoken,
  authuser,
  authrole(0, 2),
  getAllSchools
);

export default router;
