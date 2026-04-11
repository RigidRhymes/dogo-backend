"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const db_1 = require("./db");
const PORT = process.env.PORT || 4000;
db_1.db.connect()
    .then(() => {
    console.log('Database connected to PostgreSQL');
    server_1.app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error('PostgreSQL connection failed:', err);
    process.exit(1);
});
