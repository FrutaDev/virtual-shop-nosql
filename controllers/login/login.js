const User = require("../../models/user");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const getEnv = require("getenv");


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: getEnv("SENDGRID_API")
    }
}));

exports.loginController = (req, res) => {
    res.render("login/login", {
        title: "Login",
        path: "/login",
        errors: req.flash("error"),
        success: req.flash("success"),
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
                transporter.sendMail({
                    to: email,
                    from: "frutabanana20@gmail.com",
                    subject: "Confirmación de registro",
                    html: "Gracias por registrarte en nuestra tienda virtual"
                })
                res.redirect("/login");
            })
        })
        .catch(error => {
            console.log(error);
        });
    })
}

exports.getResetController = (req, res) => {
    res.render("login/reset", {
        title: "Restablecer contraseña",
        path: "/reset",
        errors: req.flash("error"),
        success: req.flash("success"),
    });
};

exports.postResetController = (req, res) => {
    const { email } = req.body;
    console.log(email);
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            req.flash("error", "El usuario no existe");
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
                req.flash("success", "Correo enviado exitosamente");
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
}

exports.getNewPasswordController = (req, res) => {
    const { token } = req.params;
    console.log(token);
    res.render("login/new-password", {
        title: "Restablecer contraseña",
        path: "/new-password",
        errors: req.flash("error"),
        success: req.flash("success"),
        token: token
    });
};

exports.postNewPasswordController = (req, res) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (password !== confirmPassword) {
        req.flash("error", "Las contraseñas no coinciden");
        return res.status(400).redirect(`/new-password/${token}`);
    }
    User.findOne({resetToken: token, resetTokenExpiration: { $gt: Date.now() }})
    .then(user => {
        if (!user) {
            req.flash("error", "El token no es válido");
            return res.status(400).redirect(`/new-password/${token}`);
        }
        return bcrypt.hash(password, 10)
        .then(hashedPassword => {
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save()
            .then(() => {
                req.flash("success", "Contraseña restablecida exitosamente");
                res.redirect("/login");
            })
        })
    })
}
