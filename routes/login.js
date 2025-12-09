const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login/login");

router.get("/login", loginController.loginController);
router.get("/signup", loginController.getSignupController);

router.post("/login", loginController.postLoginController);
router.post("/logout", loginController.postLogoutController);
router.post("/signup", loginController.postSignupController);

module.exports = router;