"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;
if (!MONGO_URI) {
    console.error('MongoDB URI is missing');
    process.exit(1);
}
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log("Database connected to MongoDB atlas");
    server_1.app.listen(PORT, () => {
        console.log(`server running at http:localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
});
