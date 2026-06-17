# Data Schema

## Input / Output Shapes

### 1. Input Shape (from Atlassian MCP)
The system will fetch data matching this logical structure:
```json
{
  "issueKey": "SCRUM-6",
  "fields": {
    "summary": "string",
    "description": "string",
    "acceptanceCriteria": "string (optional, might be embedded in description)"
  }
}
```

### 2. Output Shape (Delivery Payload)
The system will generate and save a raw Markdown file locally to `chapter_03_BLAST_FW_JIRA_AI_AGENT/SCRUM-6_Test_Plan.md`.

**Expected Markdown Structure (based on formal QA template):**
```markdown
# Test Plan: {issueKey} - {summary}

## 1.0 Overview & Scope
### 1.1 Objective
### 1.2 In-Scope Features
### 1.3 Out-of-Scope Features
### 1.4 Assumptions & Dependencies

## 2.0 Test Strategy
### 2.1 Testing Levels
### 2.2 Test Types (e.g., Functional, UI, API, Security)
### 2.3 Traceability
    - This test plan is based exclusively on the information within Jira ticket {issueKey}.

## 3.0 Test Cases
### 3.1 Positive Test Cases
### 3.2 Negative Test Cases
### 3.3 Edge & Boundary Cases

## 4.0 QA & Validation
### 4.1 Missing Information / Gaps
### 4.2 Self-Validation (Anti-Hallucination Check)
```