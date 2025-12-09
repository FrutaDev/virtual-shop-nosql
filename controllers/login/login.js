const User = require("../../models/user");

const bcrypt = require("bcryptjs");

exports.loginController = (req, res) => {
    res.render("login/login", {
        title: "Login",
        path: "/login",
        errors: req.flash("error"),
    });
};

exports.postLoginController = (req, res) => {
    const { email, password } = req.body;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash("error", "Email o contraseña incorrectos");
                return res.status(400).redirect("/login");
            }
            return bcrypt.compare(password, user.password)
            .then(result => {
                if (!result) {
                    req.flash("error", "Email o contraseña incorrectos");
                    return res.status(400).redirect("/login");
                }
                req.session.userId = user._id.toString();
                req.session.isLoggedIn = true;
                return req.session.save(err => {
                if (err) {
                    console.log(err);
                    return res.status(500).redirect("/login");
                }
                res.redirect("/");
            })
        })
        .catch(error => {
            console.log(error);
        });
    })
}

exports.postLogoutController = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).redirect("/login");
        }
        res.redirect("/");
    });
}
exports.getSignupController = (req, res) => {
    res.render("login/signup", {
        title: "Create User",
        path: "/create-user",
        errors: req.flash("error"),
    });
};
exports.postSignupController = (req, res) => {
    const { name, lastname, email, password, confirmPassword } = req.body;
    User.findOne({email: email})
    .then(user => {
        if (user) {
            req.flash("error", "El usuario ya existe");
            return res.status(400).redirect("/signup");
        }
        if (password !== confirmPassword) {
            req.flash("error", "Las contraseñas no coinciden");
            return res.status(400).redirect("/signup");
        }
        return bcrypt.hash(password, 10)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                lastName: lastname,
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save()
            .then(() => {
                req.flash("success", "Usuario creado exitosamente");
                res.redirect("/login");
            })
        })
        .catch(error => {
            console.log(error);
        });
    })
}