const express = require("express");
const router = express.Router();

const {signupValidator, loginValidator} = require("../validators/login");

const loginController = require("../controllers/login/login");

router.get("/login", loginController.loginController);
router.post("/login", loginValidator, loginController.postLoginController);

router.get("/signup", loginController.getSignupController);
router.post("/signup", signupValidator, loginController.postSignupController);

router.post("/logout", loginController.postLogoutController);

router.get("/reset", loginController.getResetController);
router.post("/reset", loginController.postResetController);

router.get("/new-password/:token", loginController.getNewPasswordController);
router.post("/new-password/:token", loginController.postNewPasswordController);


module.exports = router;