import mongoose, { ConnectOptions } from "mongoose";
import * as colorette from 'colorette';
import { MONGO_URI } from "../common/common.constants";

const connectDB = (): void => {
    try {
        mongoose.set('strictQuery', false);
        mongoose.connect(
            MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectOptions,
        )
        console.log(colorette.cyan(colorette.bold("Application connected to MongoDB Server")));
        process.on('SIGINT', () => {
            mongoose.connection.close();
            console.log(
                colorette.red(
                    colorette.bold("Application disconnected from MongoDB Server")
                )
            );
            process.exit(0);
        })
    } catch (error) {
        console.log(
            colorette.red(
                colorette.bold("Error occured while connecting to MongoDB Server")
            )
        );
    }
}

export { connectDB };