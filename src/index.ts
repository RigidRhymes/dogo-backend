import {app} from './server';
import mongoose from 'mongoose';


const MONGO_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000;


if(!MONGO_URI){
    console.error('MongoDB URI is missing');
    process.exit(1)
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Database connected to MongoDB atlas");
        app.listen(PORT, () => {
            console.log(`server running at http:localhost:${PORT}`);
        });
    })
    .catch((err: Error ) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    })