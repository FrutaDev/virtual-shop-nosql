const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin/admin");

router.get("/add-product", adminController.getAddProductController);
router.get("/add-product/:productId", adminController.getAddProductController);
router.get("/products", adminController.getProductsController);
router.post("/add-product", adminController.postAddProductController);
router.post("/edit-product/:productId", adminController.postEditProductController);
router.post("/delete-product/:productId", adminController.deleteProductController);

module.exports = router;