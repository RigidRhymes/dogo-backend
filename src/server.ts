import express from 'express';
import {scanRouter} from "./api/scan.route";
import cors from 'cors'
import fetch from "node-fetch"
import jwt from "jsonwebtoken";
import {requireAuth} from "@/middleware/requireAuth";


export const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())

app.post("/login", (req, res) => {
    const payload = {id: "test-user", email: "test@example.com"};

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1h",
        algorithm: "HS256",
    })

    res.json({token})
})

app.use('/api/scan', requireAuth, scanRouter)

app.get("/ai-test", async (req, res) => {
    const prompt = "Summarize risks of using an email found in breach.";

    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({ model: "gemma:2b", prompt}),
        });

        const raw = await  response.text();

        const lines = raw.trim().split("\n");
        let fullResponse = "";

            for(const line of lines) {
                try {
                    const obj = JSON.parse(line);
                    if(obj.response){
                        fullResponse += obj.response;
                    }
                }catch{

                }
        }

            res.json({ aiResponse: fullResponse.trim() });
    }catch (error){
        console.error("Error talking to Ollama:", error)
        res.status(500).json({ error: "Failed to connect to Ollama"})
    }
})