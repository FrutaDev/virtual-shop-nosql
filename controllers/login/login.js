const User = require("../../models/user");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const getEnv = require("getenv");

const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: getEnv("SENDGRID_API")
    }
}));

exports.loginController = (req, res) => {
    res.render("login/login", {
        title: "Login",
        path: "/login",
        errors: validationResult(req).array(),
    });
};

exports.postLoginController = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({email: email.toLowerCase()})
        .then(user => {
            if (!user) {
                return res.status(400).redirect("/login");
            }
            return bcrypt.compare(password, user.password)
            .then(result => {
                if (!result) {
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
    })
    .catch(err => {
        const errorObj = new Error(err);
        errorObj.httpStatusCode = 500;
        return next(errorObj);        
    });
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
    const error = validationResult(req)
    console.log(error.array());
    res.render("login/signup", {
        title: "Create User",
        path: "/create-user",
        errors: error.array(),
        name: "",
        lastname: "",
        email: "",
    });
};

exports.postSignupController = (req, res, next) => {
    const { name, lastname, email, password, confirmPassword } = req.body;
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        return res.status(400).render("login/signup", {
            title: "Create User",
            path: "/create-user",
            errors: errors.array(),
            name: name,
            lastname: lastname,
            email: email.toLowerCase(),
        });
    }
    User.findOne({email: email.toLowerCase()})
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
                name: name.trim(),
                lastName: lastname.trim(),
                email: email.trim(),
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save()
            .then(() => {
                transporter.sendMail({
                    to: email,
                    from: "frutabanana20@gmail.com",
                    subject: "Confirmación de registro",
                    html: "Gracias por registrarte en nuestra tienda virtual"
                })
                res.redirect("/login");
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    })
}

exports.getResetController = (req, res) => {
    res.render("login/reset", {
        title: "Restablecer contraseña",
        path: "/reset",
        errors: validationResult(req).array(),
    });
};

exports.postResetController = (req, res, next) => {
    const { email } = req.body;
    console.log(email);
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            return res.status(400).redirect("/reset");
        }
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
                return res.status(500).redirect("/reset");
            }
            const token = buffer.toString("hex");
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
            .then(() => {
                transporter.sendMail({
                    to: email,
                    from: "frutabanana20@gmail.com",
                    subject: "Restablecimiento de contraseña",
                    html: `
                    <p>Has solicitado restablecer tu contraseña. Por favor, haz clic en el enlace siguiente para restablecerla: 
                    <a href='http://localhost:3000/new-password/${token}'>Restablecer contraseña</a></p>
                    `
                })
                res.redirect("/login");
            })
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.getNewPasswordController = (req, res) => {
    const { token } = req.params;
    res.render("login/new-password", {
        title: "Restablecer contraseña",
        path: "/new-password",
        token: token,
        errors: validationResult(req).array(),
    });
};

exports.postNewPasswordController = (req, res, next) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (password !== confirmPassword) {
        return res.status(400).redirect(`/new-password/${token}`);
    }
    User.findOne({resetToken: token, resetTokenExpiration: { $gt: Date.now() }})
    .then(user => {
        if (!user) {
            return res.status(400).redirect(`/new-password/${token}`);
        }
        return bcrypt.hash(password, 10)
        .then(hashedPassword => {
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save()
            .then(() => {
                res.redirect("/login");
            })
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}
