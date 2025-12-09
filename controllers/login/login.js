const User = require("../../models/user");

exports.loginController = (req, res) => {
    res.render("login/login", {
        title: "Login",
        path: "/login",
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.postLoginController = (req, res) => {
    User.findById("69386c3aa58f6c2658eb1dcd")
        .then(user => {
            req.session.userId = user._id.toString();
            req.session.isLoggedIn = true;
            req.session.save(err => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: err });
                }
                console.log("Session saved");
                res.redirect("/");
            });
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postLogoutController = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
        }
        console.log("Session destroyed");
        res.redirect("/");
    });
}
exports.getSignupController = (req, res) => {
    res.render("login/signup", {
        title: "Create User",
        path: "/create-user",
        isLoggedIn: req.session.isLoggedIn
    });
};
exports.postSignupController = (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = password;
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        cart: {
            items: []
        }
    });
    user.save()
    .then(() => {
        res.redirect("/login");
    })
    .catch(error => {
        console.log(error);
    });
}
