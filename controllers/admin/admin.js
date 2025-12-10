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
                    errors: req.flash('error'),
                    success: req.flash('success'),
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
        errors: req.flash('error'),
        success: req.flash('success'),
    });
};

exports.getProductsController = (req, res) => {
    Product.find({ userId: req.user._id })
    .then((products) => {
        return res.render("admin/admin-products", {
            title: "Admin Products",
            path: "/admin/products",
            products: products,
            errors: req.flash('error'),
            success: req.flash('success'),
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
    });
    product.save()
    .then(() => {
        req.flash("success", "Producto agregado");
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
        if (!product) {
            req.flash("error", "Producto no encontrado");
            return res.redirect("/");
        }
        if (product.userId.toString() !== req.user._id.toString()) {
            req.flash("error", "Tú no tienes permiso para editar este producto");
            return res.redirect("/");
        }
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = image;
        return product.save()
        .then(() => {
            req.flash("success", "Producto actualizado");
            res.redirect("/admin/products");
        })
        .catch((error) => {
            console.log(error);
        });
    })
    .catch((error) => {
        console.log(error);
    });
};

exports.deleteProductController = (req, res) => {
    const productId = req.params.productId;
    return Product.deleteOne({ _id: productId, userId: req.user._id })
        .then((product) => {
            if (!product) {
                req.flash("error", "Producto no encontrado");
                return res.redirect("/");
            }
            if (product.userId.toString() !== req.user._id.toString()) {
                req.flash("error", "Tú no tienes permiso para eliminar este producto");
                return res.redirect("/");
            }
            req.flash("success", "Producto eliminado");
            res.redirect("/admin/products");
        })
        .catch((error) => {
            console.log(error);
        });
};
