const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop/shop");
const isAuth = require("../middleware/is-auth");

router.get("/", shopController.getHomeController);
router.get("/products", shopController.getProductsController);
router.get("/products/:productId", shopController.getProductController);
router.get("/cart", isAuth, shopController.getCartController);
router.get("/orders", isAuth, shopController.getOrdersController);

router.post("/add-to-cart/:productId", isAuth, shopController.postCartController);
router.post("/remove-from-cart/:productId", isAuth, shopController.postRemoveFromCartController);
router.post("/orders", isAuth, shopController.postOrdersController);

module.exports = router;
