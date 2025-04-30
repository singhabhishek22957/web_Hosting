import {Router} from "express";
import { getAllDonations, getDonationById, registerDonation } from "../controllers/donation.controller.js";
import { acceptDonation } from "../controllers/acceptedDonationByCharity.controllers.js";
import { isCharityAuthenticate } from "../middlewares/auth.middleware.js";


const router = Router();

router.route('/').get((req, res) => res.send("User Route"))

router.route("/create").post(registerDonation);
router.route("/accepted-by-charity").post(acceptDonation);
router.route("/get-donation").get(getAllDonations)
router.route("/get-donation-by-id").post(isCharityAuthenticate,getDonationById)
// router.route('*', (req, res) => res.status(404).send("Route not found"))








export default router