require('dotenv').config();
const fetch = require('node-fetch');
console.log('Before dotenv config');
const result = require('dotenv').config();
console.log('Dotenv result:', result);
console.log('After dotenv config, key:', process.env.OPENAI_API_KEY);
const express = require('express');
const path = require('path');
const PORT = 3000;
const app = express();


// Serve static files (CSS, JS, etc.)
app.use(express.static(__dirname + "/public/"));
app.use(express.json());


app.post('/api/extract-claims', async (req, res) => {
    const { transcript } = req.body;
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: `Extract distinct claims and beliefs from this transcript as relevant to the question, "What can we do to improve Bushrod Park?". Put each claim on a new line with no additional text decoration in front of them (like dashes or bullets).\n

"${transcript}"`
                }],
                max_tokens: 500
            })
        });
        
        const data = await response.json();
        res.json({ claims: data.choices[0].message.content });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to process transcript' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});