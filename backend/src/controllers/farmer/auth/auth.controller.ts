import { farmerLoginSchema, farmerRegisterSchema } from '../../../helpers/joi_validations/farmer/auth/auth.validation_schema';
import { generateAccessToken, generateRefreshToken } from '../../../common/common.helpers';
import { farmerModel } from '../../../models/farmer/auth/auth.model';
import httpErrors from 'http-errors';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { Farmer, refreshTokenModel } from '../../../common/common.model';
import { FARMER_REFRESH_TOKEN } from '../../../common/common.constants';

const registerFarmer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const farmerDetails = await farmerRegisterSchema.validateAsync(req.body);
        const farmerExists = await farmerModel.find({
            email: farmerDetails.email,
        });
        if (farmerExists?.length > 0)
            throw httpErrors.Conflict(`Email ${farmerDetails.email} is already in use.`);
        const farmer = new farmerModel({
            email: farmerDetails.email,
            farmName: farmerDetails.farmName,
            location: farmerDetails.location,
            password: farmerDetails.password,
            pinCode: farmerDetails.pinCode,
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
                userId: farmer._id,
                userType: "FARMER",
            });
            if (farmerRefreshTokens?.length)
                farmerRefreshTokens.forEach(async (token) => await token.deleteOne());
            const access_token = generateAccessToken(farmer as unknown as Farmer);
            const refresh_token = await generateRefreshToken(farmer as unknown as Farmer);
            res
                .status(200)
                .cookie("refresh_token", refresh_token, {
                    secure: false,
                    signed: true,
                    httpOnly: true,
                    sameSite: true,
                    expires: new Date(moment().endOf("day").unix()),
                })
                .send({
                    error: false,
                    data: {
                        access_token,
                        farmerDetails: {
                            _id: farmer._id,
                            username: farmer.userName,
                            email: farmer.email,
                            farmName: farmer.farmName,
                            location: farmer.location,
                            pinCode: farmer.pinCode,
                            productType: farmer.productType,
                        },
                    },
                    message: "Logged In successfully",
                });
        } else {
            throw httpErrors.Unauthorized("Incorrect password, please try again")
        }
    } catch (error: any) {
        if (error?.isJoi) error.status = 422;
        next(error);
    }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req?.signedCookies?.refresh_token?.toString();
        const token = await refreshTokenModel.findOne({ refreshToken: refreshToken, userType: "FARMER" });
        if (!token)
            throw httpErrors.UnprocessableEntity("Cannot process JWT");
        const verifyToken: any = jwt.verify(
            refreshToken,
            FARMER_REFRESH_TOKEN,
        );
        const farmerId = verifyToken.farmerId;
        const farmer = await farmerModel.findById(farmerId);
        if (!farmer) {
            res.status(404);
            throw httpErrors.NotFound("farmer not found");
        }
        const access_token = generateAccessToken(farmer as unknown as Farmer);
        const refresh_token = await generateRefreshToken(farmer as unknown as Farmer);
        await token.deleteOne();
        res
            .cookie("refresh_token", refresh_token, {
                secure: false,
                signed: true,
                httpOnly: true,
                sameSite: true,
                expires: new Date(moment().endOf("day").unix()),
            })
            .send({
                error: false,
                data: {
                    access_token,
                    farmerDetails: {
                        _id: farmer._id,
                        username: farmer.userName,
                        email: farmer.email,
                        farmName: farmer.farmName,
                        location: farmer.location,
                        pinCode: farmer.pinCode,
                        productType: farmer.productType,
                    },
                    message: "Token rotation successful"
                },
            });
    } catch (error: any) {
        next(error);
    }
}

export { registerFarmer, loginFarmer, refreshToken }