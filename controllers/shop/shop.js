const Product = require("../../models/product");
const Order = require("../../models/order");

const { validationResult } = require("express-validator");

exports.getHomeController = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render("home", {
            title: "Home",
            path: "/",
            products: products,
            errors: validationResult(req).array(),
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getProductsController = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render("shop/products", {
            title: "Products",
            path: "/products",
            products: products,
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getCartController = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items.map(item => {
            return { 
                product: {...item.productId._doc},
                quantity: item.quantity
            }
        });
        res.render("shop/cart", {
            title: "Cart",
            path: "/cart",
            products: products,
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postCartController = (req, res, next) => {
    const productId = req.params.productId;
    let quantity = req.body.quantity;
    Product.findById(productId)
    .then(product => {
        if (!quantity) {
            quantity = 1;
        }
        return req.user.addToCart(product, quantity);
    })
    // eslint-disable-next-line no-unused-vars
    .then(result => {
        res.redirect("/cart");
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postRemoveFromCartController = (req, res, next) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    req.user
    .removeANumberFromCart(productId, quantity)
    // eslint-disable-next-line no-unused-vars
    .then(result => {
        res.redirect("/cart");
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
};

exports.getOrdersController = (req, res, next) => {
    Order.find({userId: req.user._id})
    .populate('items.productId')
    .then(orders => {
        orders.forEach(order => {
            order.totalPrice = order.items.reduce((total, item) => total + item.productId.price * item.quantity, 0);
        });
        res.render("shop/orders", {
            title: "Orders",
            path: "/orders",
            orders: orders,
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
};

exports.getProductController = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        res.render("shop/product-detail", {
            title: "Product",
            path: "/product",
            product: product,
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
};

exports.postOrdersController = (req, res, next) => {
    req.user
    .addOrder()
    // eslint-disable-next-line no-unused-vars
    .then(result => {
        res.redirect("/orders");
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
};
