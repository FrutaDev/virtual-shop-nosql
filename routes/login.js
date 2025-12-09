const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login/login");

router.get("/login", loginController.loginController);
router.get("/create-user", loginController.createUserController);

router.post("/login", loginController.postLoginController);
router.post("/logout", loginController.postLogoutController);

module.exports = router;