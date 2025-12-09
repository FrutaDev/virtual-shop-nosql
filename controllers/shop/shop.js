const Product = require("../../models/product");
const Order = require("../../models/order");

exports.getHomeController = (req, res) => {
    Product.find()
    .then(products => {
        res.render("home", {
            title: "Home",
            path: "/",
            products: products,
            isLoggedIn: req.session.isLoggedIn
        });
    })
    .catch(error => {
        console.log(error);
    });
};

exports.getProductsController = (req, res) => {
    res.render("shop/products", {
        title: "Products",
        path: "/products",
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.getCartController = (req, res) => {
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
            isLoggedIn: req.session.isLoggedIn
        });
    })
    .catch(error => {
        console.log(error);
    });
};

exports.postCartController = (req, res) => {
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
    .catch(error => {
        console.log(error);
    });
};

exports.postRemoveFromCartController = (req, res) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    req.user
    .removeANumberFromCart(productId, quantity)
    // eslint-disable-next-line no-unused-vars
    .then(result => {
        res.redirect("/cart");
    })
    .catch(error => {
        console.log(error);
    });
};

exports.getOrdersController = (req, res) => {
    Order.find({userId: req.user._id})
    .populate('items.productId')
    .then(orders => {
        orders.forEach(order => {
            console.log("Items: ", order.items);
            order.totalPrice = order.items.reduce((total, item) => total + item.productId.price * item.quantity, 0);
        });
        res.render("shop/orders", {
            title: "Orders",
            path: "/orders",
            orders: orders,
            isLoggedIn: req.session.isLoggedIn
        });
    })
    .catch(error => {
        console.log(error);
    });
};

exports.getProductController = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        res.render("shop/product-detail", {
            title: "Product",
            path: "/product",
            product: product,
            isLoggedIn: req.session.isLoggedIn
        })
    })
    .catch(error => {
        console.log(error);
    });
};

exports.postOrdersController = (req, res) => {
    req.user
    .addOrder()
    // eslint-disable-next-line no-unused-vars
    .then(result => {
        res.redirect("/orders");
    })
    .catch(error => {
        console.log(error);
    });
};
