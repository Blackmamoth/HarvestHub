import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';
import JoiObjectId from 'joi-objectid';

const joi = Joi.extend(joiPasswordExtendCore);
joi.objectId = JoiObjectId(Joi);

const farmerRegisterSchema = Joi.object({
    userName: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    farmName: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    pinCode: Joi.string().trim().min(6).max(6).required(),
    productType: Joi.string().trim().valid('FRUITS', 'VEGETABLES', 'DAIRY', 'MEAT').required(),
    password: joi
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
    password: joi
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