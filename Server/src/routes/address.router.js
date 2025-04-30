import { Router } from "express";
import { getAddressByPincode } from "../controllers/address.controller.js";

const router = Router(); 


router.route("/").get((req, res) => res.send("Address Route"))

router.route("/address-by-pincode").post(getAddressByPincode);

export default router