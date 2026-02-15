const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/transform", async (req, res) => {
    try {
        const { text, type } = req.body;

        if (!text) {
            return res.status(400).json({ error: "No text provided" });
        }

        let instruction;

        switch (type) {
            case "shorten":
                instruction = "Rewrite this text in a shorter and concise way.";
                break;
            case "formal":
                instruction = "Rewrite this text in a professional and formal tone.";
                break;
            case "casual":
                instruction = "Rewrite this text in a casual and friendly tone.";
                break;
            default:
                instruction = "Improve grammar and clarity while preserving meaning.";
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a professional writing assistant."
                },
                {
                    role: "user",
                    content: `${instruction}\n\n${text}`
                }
            ],
            temperature: 0.5
        });

        const output = completion.choices[0].message.content;

        res.json({ text: output });

    } catch (error) {
        console.error("OpenAI error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 AI backend running on http://127.0.0.1:${PORT}`);
});
