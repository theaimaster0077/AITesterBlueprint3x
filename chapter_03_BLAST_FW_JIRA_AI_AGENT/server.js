require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

// Tools
const { fetchJiraIssue } = require('./tools/jira');
const { generateTestPlan } = require('./tools/groq');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-plan', async (req, res) => {
    const { issueKey } = req.body;
    if (!issueKey) {
        return res.status(400).json({ error: 'Jira issueKey is required.' });
    }

    try {
        console.log(`[Link] Fetching data for ${issueKey}...`);
        const issueData = await fetchJiraIssue(issueKey);

        console.log(`[Architect] Loading Master System Prompt...`);
        const promptPath = path.join(__dirname, 'system_prompt.md');
        const systemPrompt = await fs.readFile(promptPath, 'utf8');

        console.log(`[Trigger] Generating Test Plan via GROQ...`);
        const markdownOutput = await generateTestPlan(systemPrompt, issueData);

        // Stylize: Save locally as requested in Phase 1 constraints
        const fileName = `${issueKey}_Test_Plan.md`;
        const filePath = path.join(__dirname, fileName);
        await fs.writeFile(filePath, markdownOutput, 'utf8');
        console.log(`[Stylize] Saved local file: ${fileName}`);

        res.json({ success: true, message: `Test plan saved to ${fileName}`, payload: markdownOutput });
    } catch (error) {
        console.error('Error in B.L.A.S.T pipeline:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Only start the server locally, export for Vercel serverless deployment
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 B.L.A.S.T. Jira Agent API running on http://localhost:${PORT}`);
    });
}

module.exports = app;