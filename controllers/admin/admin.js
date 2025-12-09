const Product = require("../../models/product");

exports.getAddProductController = (req, res) => {
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
                    isLoggedIn: req.session.isLoggedIn
                });
            })
            .catch((error) => {
                console.log(error);
            }); 
    }
    res.render("admin/add-product", {
        title: "Add Product",
        path: "/admin/add-product",
        editing: false,
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.getProductsController = (req, res) => {
    Product.find()
    .populate('userId')
    .then((products) => {
        console.log(products);
        return res.render("admin/admin-products", {
            title: "Admin Products",
            path: "/admin/products",
            products: products,
            isLoggedIn: req.session.isLoggedIn
        });
    })
    .catch((error) => {
        console.log(error);
    });
};

exports.postAddProductController = (req, res) => {
    const { title, price, description, image } = req.body;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: image,
        userId: req.user,
        isLoggedIn: req.session.isLoggedIn
    });
    product.save()
    .then(() => {
        console.log("Product saved");
        res.redirect("/admin/products");
    })
    .catch((error) => {
        console.log(error);
    });
};

exports.postEditProductController = (req, res) => {
    const { title, price, description, image } = req.body;
    const productId = req.params.productId;
    Product.findById(productId)
    .then((product) => {
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = image;
        return product.save();
    })
    .then(() => {
        console.log("Product updated");
        res.redirect("/admin/products");
    })
    .catch((error) => {
        console.log(error);
    });
};

exports.deleteProductController = (req, res) => {
    const productId = req.params.productId;
    return Product.findByIdAndDelete(productId)
        .then(() => {
            console.log("Product deleted");
            res.redirect("/admin/products");
        })
        .catch((error) => {
            console.log(error);
        });
};
