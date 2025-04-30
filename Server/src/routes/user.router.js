import {Router} from "express";
import { getUser, login, logout, registerUser, testing } from "../controllers/userControllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";
import { userDonationHistory } from "../controllers/acceptedDonationByCharity.controllers.js";


const router = Router();

router.route('/').get((req, res) => res.send("User Route"))

router.route("/register").post(upload.fields([{"name":"avatar", maxCount:1}]), registerUser);
router.route("/login").post(login);
router.route("/logout").get(isUserAuthenticated,logout)
router.route("/get-user").get(isUserAuthenticated,getUser);  

router.route('/testing').post(testing)

// router.route('*', (req, res) => res.status(404).send("Route not found"))

// donation history 
router.route("/donation-history").post(isUserAuthenticated,userDonationHistory);






export default router