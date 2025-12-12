const { body } = require("express-validator");
const User = require("../models/user");

exports.loginValidator = [
    body("email").isEmail().withMessage("Por favor, ingresa un correo electrónico válido"),
    body("password").isLength({ min: 5 }).withMessage("Por favor, ingresa una contraseña con al menos 5 caracteres")
    // eslint-disable-next-line no-unused-vars
    .custom((value, { req }) => {
        return User.findOne({ email: value })
            .then((user) => {
                if (!user) {
                    return Promise.reject("El correo electrónico no está registrado");
                }
                return true;
            })
            .catch((error) => {
                throw error;
            });
    })
];

exports.signupValidator = [
    body("email").isEmail().withMessage("Por favor, ingresa un correo electrónico válido")
    // eslint-disable-next-line no-unused-vars
    .custom((value, { req }) => {
        return User.findOne({ email: value })
            .then((user) => {
                if (user) {
                    return Promise.reject("El correo electrónico ya está en uso");
                }
                return true;
            })
            .catch((error) => {
                throw error;
            });
    }),
    body("confirmPassword", "Las contraseñas no coinciden")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Las contraseñas no coinciden");
        }
        return true;
        }),
    body("password").isLength({ min: 5 }).withMessage("Por favor, ingresa una contraseña con al menos 5 caracteres"),
    body("name").trim().isLength({ min: 3 }).withMessage("Por favor, ingresa un nombre con al menos 3 caracteres"),
    body("lastname").trim().isLength({ min: 3 }).withMessage("Por favor, ingresa un apellido con al menos 3 caracteres"),
]
