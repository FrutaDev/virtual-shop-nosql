const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin/admin");
const isAuth = require("../middleware/is-auth");

const { addProductValidator, editProductValidator } = require("../validators/admin-validator");

router.get("/add-product", isAuth, adminController.getAddProductController);
router.post("/add-product",isAuth, addProductValidator, adminController.postAddProductController);
router.get("/add-product/:productId",isAuth, adminController.getAddProductController);
router.post("/edit-product/:productId",isAuth, editProductValidator, adminController.postEditProductController);
router.post("/delete-product/:productId",isAuth, adminController.deleteProductController);
router.get("/products",isAuth, adminController.getProductsController);

module.exports = router;