const Product = require("../../models/product");

const { validationResult } = require("express-validator");

exports.getAddProductController = (req, res, next) => {
    const errors = validationResult(req);
    const edit = req.query.edit;
    const productId = req.params.productId;
    if (edit && productId) {
        return Product.findById(productId)
            .then((product) => {
                return res.render("admin/add-product", {
                    title: "Edit Product",
                    path: "/admin/add-product",
                    editing: true,
                    product: product,
                    errors: errors.array(),
                });
            })
            .catch((err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);   
            }); 
    }
    res.render("admin/add-product", {
        title: "Add Product",
        path: "/admin/add-product",
        editing: false,
        errors: validationResult(req).array(),
    });
};

exports.getProductsController = (req, res, next) => {
    const errors = validationResult(req);
    Product.find({ userId: req.user._id })
    .then((products) => {
        return res.render("admin/admin-products", {
            title: "Admin Products",
            path: "/admin/products",
            products: products,
            errors: errors.array(),
        });
    })
    .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);   
    });
};

exports.postAddProductController = (req, res, next) => {
    const errors = validationResult(req);
    const { title, price, description, image } = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).render("admin/add-product", {
            title: "Add Product",
            path: "/admin/add-product",
            editing: false,
            errors: errors.array(),
            product: {
                title: title,
                price: price,
                description: description,
                imageUrl: image,
            }
        });
    }
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: image,
        userId: req.user,
    });
    product.save()
    .then(() => {
        res.redirect("/admin/products");
    })
    .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);   
    });
};

exports.postEditProductController = (req, res, next) => {
    const { title, price, description, image } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("admin/add-product", {
            title: "Add Product",
            path: "/admin/add-product",
            editing: true,
            errors: errors.array(),
            product: {
                title: title,
                price: price,
                description: description,
                imageUrl: image,
            }
        });
    }
    const productId = req.params.productId;
    Product.findById(productId)
    .then((product) => {
        if (!product) {
            return res.redirect("/");
        }
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect("/");
        }
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = image;
        return product.save()
        .then(() => {
            res.redirect("/admin/products");
        })
    })
    .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);       });
};

exports.deleteProductController = (req, res, next) => {
    const productId = req.params.productId;
    return Product.deleteOne({ _id: productId, userId: req.user._id })
        .then(() => {
        res.redirect("/admin/products");
    })
    .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);       });
};
