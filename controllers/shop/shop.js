const Product = require("../../models/product");

const getHomeController = (req, res) => {
    Product.find()
    .then(products => {
        res.render("home", {
            title: "Home",
            path: "/",
            products: products
        });
    })
    .catch(error => {
        console.log(error);
    });
};

const getProductsController = (req, res) => {
    res.render("shop/products", {
        title: "Products",
        path: "/products"
    });
};

const getCartController = (req, res) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items.map(item => {
            return { 
                product: {...item.productId._doc},
                quantity: item.quantity
            }
        });
        console.log(products);
        res.render("shop/cart", {
            title: "Cart",
            path: "/cart",
            products: products
        });
    })
    .catch(error => {
        console.log(error);
    });
};

const postCartController = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        return req.user.addToCart(product);
    })
    // eslint-disable-next-line no-unused-vars
    .then(result => {
        res.redirect("/cart");
    })
    .catch(error => {
        console.log(error);
    });
};

const getOrdersController = (req, res) => {
    res.render("shop/orders", {
        title: "Orders",
        path: "/orders"
    });
};

const getProductController = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        console.log("product", product);
        res.render("shop/product-detail", {
            title: "Product",
            path: "/product",
            product: product
        })
    })
    .catch(error => {
        console.log(error);
    });
};

exports.getHomeController = getHomeController;
exports.getProductsController = getProductsController;
exports.getCartController = getCartController;
exports.getOrdersController = getOrdersController;
exports.getProductController = getProductController;
exports.postCartController = postCartController;
