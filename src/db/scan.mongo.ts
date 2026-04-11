import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    user_id: {type: String, required: true},

    email: {type: String},

    phone: {type: String},

    social_media: [{
        platform: {type: String},
        handle: {type: String},
        status: {type: String},
        result: {type: String},
    }],

    status: {type: String, enum: ["queued", "completed", "failed"], default: "queued"},
    result: {type: Object},
}, { timestamps: true });


export const Scan = mongoose.model("Scan", scanSchema);