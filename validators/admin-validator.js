const { body } = require("express-validator")

exports.addProductValidator = [
    body("title").trim().isLength({ min: 3 }).withMessage("Por favor, ingresa un nombre con al menos 3 caracteres"),
    body("price").trim().isFloat().withMessage("Por favor, ingresa un precio válido"),
    body("image").trim().isURL().withMessage("Por favor, ingresa una URL válida"),
    body("description").trim().isLength({ min: 3 }).withMessage("Por favor, ingresa una descripción con al menos 3 caracteres")
]

exports.editProductValidator = [
    body("title").trim().isLength({ min: 3 }).withMessage("Por favor, ingresa un nombre con al menos 3 caracteres"),
    body("price").trim().isFloat().withMessage("Por favor, ingresa un precio válido"),
    body("image").trim().isURL().withMessage("Por favor, ingresa una URL válida"),
    body("description").trim().isLength({ min: 3 }).withMessage("Por favor, ingresa una descripción con al menos 3 caracteres")
]