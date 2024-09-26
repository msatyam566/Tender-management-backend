const Joi = require("joi");


const userValidation = Joi.object({
    role: Joi.string()
    .valid("admin", "user"),
    name:Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    phone: Joi.number().required(),
    password: Joi.string().required().min(3).max(50),

})
const loginValidation = Joi.object({
    role: Joi.string()
    .valid("admin", "user"),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required().min(3).max(50),

})


module.exports = {
    userValidation,
    loginValidation
}
