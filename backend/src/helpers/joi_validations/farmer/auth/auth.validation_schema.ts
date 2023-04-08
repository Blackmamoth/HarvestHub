const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const farmerRegisterSchema = Joi.object({
    userName: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    farmName: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    pinCode: Joi.string().trim().min(6).max(6).required(),
    productType: Joi.string().trim().valid('FRUITS', 'VEGETABLES', 'DAIRY', 'MEAT').required(),
    password: joiPassword
        .string()
        .trim()
        .min(8)
        .max(16)
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),
});

const farmerLoginSchema = Joi.object({
    email: Joi.string().trim().required(),
    password: joiPassword
        .string()
        .trim()
        .min(8)
        .max(16)
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),
})

export { farmerRegisterSchema, farmerLoginSchema }