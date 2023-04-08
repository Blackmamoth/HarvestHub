import jwt from 'jsonwebtoken';
import { Consumer, Farmer, refreshTokenModel } from './common.model';
import { CONSUMER_ACCESS_TOKEN, CONSUMER_REFRESH_TOKEN, FARMER_ACCESS_TOKEN, FARMER_REFRESH_TOKEN } from './common.constants';
import moment from 'moment';

const generateAccessToken = (user: Farmer | Consumer): string => {
    const expiration = moment().add(30, 'minutes').unix();
    let token: string;
    if ("farmName" in user) {
        token = jwt.sign(
            { farmerId: user._id },
            FARMER_ACCESS_TOKEN,
            { expiresIn: expiration }
        )
    } else {
        token = jwt.sign(
            { consumerId: user._id },
            CONSUMER_ACCESS_TOKEN,
            { expiresIn: expiration }
        )
    }
    return token;
}

const generateRefreshToken = async (user: Farmer | Consumer): Promise<string> => {
    const expiration = moment().add(1, 'day').unix();
    let token: string;
    if ("farmName" in user) {
        token = jwt.sign(
            { farmerId: user._id },
            FARMER_REFRESH_TOKEN,
            { expiresIn: expiration }
        )
        await refreshTokenModel.create({
            userId: user._id,
            refreshToken: token,
            userType: "FARMER",
        });
    } else {
        token = jwt.sign(
            { consumerId: user._id },
            CONSUMER_REFRESH_TOKEN,
            { expiresIn: expiration },
        )
        await refreshTokenModel.create({
            userId: user._id,
            refreshToken: token,
            userType: "CONSUMER",
        })
    }
    return token;
}
export { generateAccessToken, generateRefreshToken }