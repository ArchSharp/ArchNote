import {
  flutterwave_chargecard,
  makepaystack_payment,
  verifypaystack_payment,
} from "../Controller/PaymentController";
import { authtoken } from "../Middleware/TokenAuth";
import { Router } from "express";

const router: Router = Router();
/* HTTP REQUEST */

router.post("/paystack/makepayment", authtoken, makepaystack_payment);
router.get("/paystack/verifypayment/:reference", verifypaystack_payment);
router.post("/flutterwave/chargecard", flutterwave_chargecard);

export default router;
