const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login/login");

router.get("/login", loginController.loginController);
router.post("/login", loginController.postLoginController);

router.get("/signup", loginController.getSignupController);
router.post("/signup", loginController.postSignupController);

router.post("/logout", loginController.postLogoutController);

router.get("/reset", loginController.getResetController);
router.post("/reset", loginController.postResetController);

router.get("/new-password/:token", loginController.getNewPasswordController);
router.post("/new-password/:token", loginController.postNewPasswordController);


module.exports = router;