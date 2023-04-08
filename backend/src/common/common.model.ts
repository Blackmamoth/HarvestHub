import { Schema, SchemaTypes, model } from "mongoose";

export interface Farmer {
    readonly _id: string;
    userName: string;
    email: string;
    farmName: string;
    location: string;
    pinCode: string;
    productType: 'FRUITS' | 'VEGETABLES' | 'DAIRY' | 'MEAT'
    password: string;
}

export interface Consumer {
    readonly _id: string;
}

const RefreshTokenSchema = new Schema({
    userId: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
    userType: {
        type: String,
        enum: ['FARMER', 'CONSUMER'],
        required: true,
    }
}, { timestamps: true })

export const refreshTokenModel = model("refresh_token", RefreshTokenSchema);

