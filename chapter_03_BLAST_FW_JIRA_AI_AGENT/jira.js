const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

async function fetchJiraIssue(issueKey) {
    const { JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN } = process.env;

    // Graceful fallback to local mock data if real credentials aren't provided
    if (!JIRA_DOMAIN || !JIRA_EMAIL || !JIRA_API_TOKEN) {
        console.warn("⚠️ Jira credentials missing. Falling back to local mock_scrum_6.json data.");
        const mockDataPath = path.join(__dirname, '..', 'mock_scrum_6.json');
        const mockData = await fs.readFile(mockDataPath, 'utf8');
        return JSON.parse(mockData);
    }

    const url = `https://${JIRA_DOMAIN}/rest/api/2/issue/${issueKey}`;
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

    const response = await axios.get(url, {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
        }
    });

    // Map directly to our Data Schema (gemini.md)
    return {
        issueKey: response.data.key,
        fields: {
            summary: response.data.fields.summary,
            description: response.data.fields.description,
            // Custom field mapping for AC (replace customfield_10000 with your actual Jira setup)
            acceptanceCriteria: response.data.fields.customfield_10000 || "" 
        }
    };
}

module.exports = { fetchJiraIssue };