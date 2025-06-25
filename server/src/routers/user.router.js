import { Router } from "express";
import {
   registeruser,
   loginUser,
   logoutUser,
   currentUser,
   refreshToken,
   loginUserGoogle,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registeruser);
router.route("/login").post(loginUser);
router.route("/login-google").post(loginUserGoogle);
router.route("/renew-token").get(refreshToken);

//secure route
router.route("/logout").get(verifyJwt, logoutUser);
router.route("/current").get(verifyJwt, currentUser);

export default router;
