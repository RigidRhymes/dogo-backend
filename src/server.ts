import express from 'express';
import {scanRouter} from "./api/scan.route";
import cors from 'cors'
import fetch from "node-fetch"

export const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())

app.use('/api/scan', scanRouter)

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