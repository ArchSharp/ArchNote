import {
  UniversitiesByCountry,
  VerifyCompany,
} from "./../Controller/HttpClientController";
import { Router } from "express";
const router: Router = Router();

router.get("/country/universities/:country", UniversitiesByCountry);
router.post("/cacverify/:param", VerifyCompany);

export default router;
