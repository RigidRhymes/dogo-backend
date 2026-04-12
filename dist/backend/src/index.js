"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const index_1 = require("./db/index");
const PORT = process.env.PORT || 4000;
(0, index_1.connectDB)().then(() => {
    console.log("Database connected to MongoDB atlas");
    server_1.app.listen(PORT, () => {
        console.log(`server running at http:localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
});
