const Groq = require('groq-sdk');

async function generateTestPlan(systemPrompt, jiraData) {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
         throw new Error("GROQ_API_KEY is missing in .env configuration.");
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: JSON.stringify(jiraData, null, 2) }
        ],
        model: 'llama3-70b-8192',
        // Enforce determinism (Architectural invariant)
        temperature: 0, 
    });

    return completion.choices[0].message.content;
}

module.exports = { generateTestPlan };