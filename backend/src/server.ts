import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import httpErrors from 'http-errors';
import * as colorette from 'colorette';
import path from 'path';
import { config } from 'dotenv';
import { connectDB } from './config/db.config';
import { COOKIE_SECRET } from './common/common.constants';
import FarmerAuthRoutes from './routes/farmer/auth/auth.router';

const PORT = process.env.PORT || 5000;

const app = express();

config();
connectDB();
app.use(cors());
app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/farmer/auth", FarmerAuthRoutes);

app.use(async (req, res, next) => {
    next(httpErrors.NotFound(`Route not found for [${req.method}] ${req.url}`));
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const message = error?.message || `Cannot resolve request [${req.method}] ${req.url}`;
    const status = error?.status || 500;
    if (!res.headersSent) {
        res.status(status).send({
            error: true,
            data: {
                message,
            }
        })
    }
    next();
})


app.listen(PORT, () => {
    console.log(colorette.cyan(colorette.bold(`Application running on port ${PORT}`)))
})