const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin/admin");
const isAuth = require("../middleware/is-auth");

router.get("/add-product", isAuth, adminController.getAddProductController);
router.get("/add-product/:productId",isAuth, adminController.getAddProductController);
router.get("/products",isAuth, adminController.getProductsController);
router.post("/add-product",isAuth, adminController.postAddProductController);
router.post("/edit-product/:productId",isAuth, adminController.postEditProductController);
router.post("/delete-product/:productId",isAuth, adminController.deleteProductController);

module.exports = router;