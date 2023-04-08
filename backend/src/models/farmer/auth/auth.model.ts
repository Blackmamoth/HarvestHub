import { Schema, model } from 'mongoose';
import { genSalt, hash } from 'bcryptjs';
import { NextFunction } from 'express';

const FarmerSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    farmName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    pinCode: {
        type: String,
        required: true,
        maxLength: 6,
        minLength: 6,
    },
    productType: {
        type: String,
        enum: ['FRUITS', 'VEGETABLES', 'DAIRY', 'MEAT'],
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

FarmerSchema.pre('save', async function (next: any) {
    let farmer = this;
    if (!farmer.isModified()) return (next);
    const salt = await genSalt();
    const hashedPassword = await hash(this.password, salt);
    this.password = hashedPassword;
    next();
});

const farmerModel = model('farmer', FarmerSchema);

export { farmerModel }