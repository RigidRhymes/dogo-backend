import {app} from './server';
import {connectDB} from "./db/index";



const PORT = process.env.PORT || 4000;


connectDB().then(() => {
        console.log("Database connected to MongoDB atlas");
        app.listen(PORT, () => {
            console.log(`server running at http:localhost:${PORT}`);
        });
    })
    .catch((err: Error ) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    })