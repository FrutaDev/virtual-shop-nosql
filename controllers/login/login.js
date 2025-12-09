const User = require("../../models/user");

const loginController = (req, res) => {
    res.render("login/login", {
        title: "Login",
        path: "/login",
        isLoggedIn: req.session.isLoggedIn
    });
};

const createUserController = (req, res) => {
    res.render("login/create-user", {
        title: "Create User",
        path: "/create-user",
        isLoggedIn: req.session.isLoggedIn
    });
};

const postLoginController = (req, res) => {
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

const postLogoutController = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
        }
        console.log("Session destroyed");
        res.redirect("/");
    });
}


exports.loginController = loginController;
exports.createUserController = createUserController;
exports.postLoginController = postLoginController;
exports.postLogoutController = postLogoutController;