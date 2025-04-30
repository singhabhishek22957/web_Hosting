import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { isCharityAuthenticate } from "../middlewares/auth.middleware.js";
import { getCharity, loginCharity, logout, registerCharity } from "../controllers/charity.controller.js";
import { charityDonationHistory } from "../controllers/acceptedDonationByCharity.controllers.js";

const router = Router();


router.route('/').get((req, res) => res.send("Charity Route"))

router.route("/register").post(upload.fields([{"name":"logoImage", maxCount:1},{"name":"coverImage", maxCount:1}]), registerCharity);
router.route("/login").post(loginCharity);
router.route("/logout").get(isCharityAuthenticate,logout)
router.route("/get-charity").get(isCharityAuthenticate,getCharity);
// router.route("*").get((req, res) => res.status(404).send("Route not found"));

// donation accepted history 
router.route("/donation-history").post(isCharityAuthenticate,charityDonationHistory);

export default router