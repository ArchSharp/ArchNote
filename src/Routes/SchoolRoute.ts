import {
  ddelete,
  logout,
  newtoken,
  sendverifyemail,
  sendverifyphone,
  signin,
  signup,
  update,
} from "../Controller/SchoolController";
import { authtoken } from "../Middleware/TokenAuth";
import { Router } from "express";
const router: Router = Router();

/* HTTP REQUEST */

router.post("/signup", signup);
router.post("/signin", signin);
router.delete("/delete/:id", ddelete); //only for superadmin
router.put("/update/:id", authtoken, update);
router.post("/sendverifyemail/:email", authtoken, sendverifyemail);
router.post("/sendverifyphone/:phone", authtoken, sendverifyphone);
router.post("/newtoken", newtoken);
router.delete("/logout", logout);

export default router;
