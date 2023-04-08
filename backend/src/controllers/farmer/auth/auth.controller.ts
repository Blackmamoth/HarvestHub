import { farmerLoginSchema, farmerRegisterSchema } from '../../../helpers/joi_validations/farmer/auth/auth.validation_schema';
import { generateAccessToken, generateRefreshToken } from '../../../common/common.helpers';
import { farmerModel } from '../../../models/farmer/auth/auth.model';
import httpErrors from 'http-errors';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { refreshTokenModel } from '../../../common/common.model';

const registerFarmer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const farmerDetails = await farmerRegisterSchema.validateAsync(req.body);
        const farmerExists = await farmerModel.find({
            email: farmerDetails.email,
        });
        if (farmerExists)
            throw httpErrors.Conflict(`Email ${farmerDetails.email} is already in use.`);
        const farmer = new farmerModel({
            email: farmerDetails.email,
            farmName: farmerDetails.farmName,
            location: farmerDetails.location,
            password: farmerDetails.password,
            pinCode: farmerDetails.password,
            productType: farmerDetails.productType,
            userName: farmerDetails.userName,
        });
        await farmer.save();
        res.status(201).send({
            error: false,
            data: {
                message: 'Registration successful'
            }
        })
    } catch (error: any) {
        if (error?.isJoi) error.status = 422;
        next(error);
    }
}

const loginFarmer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const farmerDetails = await farmerLoginSchema.validateAsync(req.body);
        const farmer = await farmerModel.findOne({ email: farmerDetails.email });
        if (!farmer)
            throw httpErrors.NotFound("User not found, Please check your Email and try again");
        if (await bcrypt.compare(farmerDetails.password, farmer.password)) {
            const farmerRefreshTokens = await refreshTokenModel.find({
                userId: farmer._id
            })
        }
    } catch (error: any) {
        if (error?.isJoi) error.status = 422;
        next(error);
    }
}

export { registerFarmer }