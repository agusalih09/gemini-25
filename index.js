const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');

const { GoogleGenAI } = require('@google/genai');

const port = process.env.PORT || 3000;
const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: apiKey});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.post("/api/chat", async (req, res) => {

    const { message } = req.body;

    try {
        // 2. Prepare the contents array for the Gemini API
        const contents = [{ role: "user", parts: [{ text: message }] }];
        
        // 3. Call the Gemini API and await the response
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            systemInstruction: {
                parts: [{ text: "You are a dumb baby" }]
            }
        });

        const aiResponseText = response.text;

        // 4. Send the AI's text response back to the client
        res.json({ 
            response: aiResponseText,
            source: "Gemini API"
        });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ 
            error: "Failed to generate content from AI.", 
            details: error.message 
        });
    }
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});