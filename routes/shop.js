const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop/shop");

router.get("/", shopController.getHomeController);
router.get("/products", shopController.getProductsController);
router.get("/cart", shopController.getCartController);
router.get("/orders", shopController.getOrdersController);
router.get("/products/:productId", shopController.getProductController);

router.post("/add-to-cart/:productId", shopController.postCartController);
router.post("/remove-from-cart/:productId", shopController.postRemoveFromCartController);
router.post("/orders", shopController.postOrdersController);

module.exports = router;
