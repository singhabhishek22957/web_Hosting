import {Router} from "express";
import { login, registerUser, testing } from "../controllers/userControllers.js";


const router = Router();

router.route('/').get((req, res) => res.send("User Route"))

router.route("/register").post(registerUser);
router.route("/login").post(login);

router.route('/testing').post(testing)

// router.route('*', (req, res) => res.status(404).send("Route not found"))








export default router