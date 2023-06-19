import { makepayment, verifypayment } from "../Controller/PaymentController";
import { authtoken } from "../Middleware/TokenAuth";
import { Router } from "express";

const router: Router = Router();
/* HTTP REQUEST */

router.post("/makepayment", authtoken, makepayment);
router.get("/verifypayment/:reference", verifypayment);

export default router;
