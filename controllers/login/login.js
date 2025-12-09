const User = require("../../models/user");

const bcrypt = require("bcryptjs");

exports.loginController = (req, res) => {
    res.render("login/login", {
        title: "Login",
        path: "/login",
    });
};

exports.postLoginController = (req, res) => {
    const { email, password } = req.body;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                console.log("User not found");
                return res.status(400).redirect("/login");
            }
            return bcrypt.compare(password, user.password)
            .then(result => {
                if (!result) {
                    console.log("Invalid password");
                    return res.status(400).redirect("/login");
                }
                console.log("User logged in");
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
    });
};
exports.postSignupController = (req, res) => {
    const { name, lastname, email, password, confirmPassword } = req.body;
    User.findOne({email: email})
    .then(user => {
        if (user) {
            return res.status(400).redirect("/signup");
        }
        if (password !== confirmPassword) {
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
                res.redirect("/login");
            })
        })
        .catch(error => {
            console.log(error);
        });
    })
}