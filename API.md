# API Documentation

Complete API reference for the Repo Health Checker.

## Base URL

```
http://localhost:3000
```

## Endpoints

### Health Check

Check if the API is running.

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "ok"
}
```

**Example**:
```bash
curl http://localhost:3000/api/health
```

---

### Analyze Repository (Upload)

Upload and analyze repository files.

**Endpoint**: `POST /api/analyze`

**Content-Type**: `multipart/form-data`

**Parameters**:
- `files` (required): Array of files from the repository
- `repoName` (optional): Display name for the repository
- `config` (optional): JSON string with analysis configuration

**Request Example**:
```bash
# Using curl (directory upload)
curl -X POST http://localhost:3000/api/analyze \
  -F "repoName=my-project" \
  -F "config={\"checks\":{\"readme\":true,\"license\":true}}" \
  -F "files=@README.md" \
  -F "files=@package.json" \
  -F "files=@LICENSE"
```

**Configuration Schema**:
```typescript
{
  enabled?: boolean;
  checks?: {
    readme?: boolean;
    license?: boolean;
    tests?: boolean;
    gitignore?: boolean;
    dependencies?: boolean;
    ci?: boolean;
    linting?: boolean;
  };
  thresholds?: {
    minReadmeLength?: number;
    maxDependencyAge?: number;
    minTestCoverage?: number;
  };
}
```

**Response**:
```json
{
  "success": true,
  "analysisId": "123e4567-e89b-12d3-a456-426614174000",
  "result": {
    "healthScore": 85,
    "checks": [
      {
        "checkType": "readme_presence",
        "category": "Documentation",
        "severity": "success",
        "passed": true,
        "message": "README.md file exists"
      }
    ],
    "summary": {
      "total": 20,
      "passed": 17,
      "failed": 3,
      "errors": 1,
      "warnings": 2,
      "info": 0
    },
    "metadata": {
      "analyzedAt": "2024-01-15T10:30:00.000Z",
      "duration": 245,
      "repositoryName": "my-project"
    }
  }
}
```

**Error Response**:
```json
{
  "error": "No files provided"
}
```

---

### Run Demo Analysis

Analyze a sample well-configured repository.

**Endpoint**: `POST /api/demo`

**Request**:
```bash
curl -X POST http://localhost:3000/api/demo
```

**Response**:
Same structure as `/api/analyze` endpoint.

**Example JavaScript**:
```javascript
const response = await fetch('/api/demo', {
  method: 'POST',
});

const data = await response.json();
console.log('Health Score:', data.result.healthScore);
console.log('Checks:', data.result.checks);
```

---

### Get Analysis by ID

Retrieve a specific analysis result.

**Endpoint**: `GET /api/analysis/:id`

**Parameters**:
- `id` (path): UUID of the analysis

**Request**:
```bash
curl http://localhost:3000/api/analysis/123e4567-e89b-12d3-a456-426614174000
```

**Response**:
```json
{
  "analysis": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "repositoryId": "456e7890-e89b-12d3-a456-426614174000",
    "healthScore": 85,
    "status": "completed",
    "config": {},
    "results": { /* full analysis results */ },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "completedAt": "2024-01-15T10:30:01.000Z"
  },
  "checks": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174000",
      "analysisId": "123e4567-e89b-12d3-a456-426614174000",
      "checkType": "readme_presence",
      "severity": "success",
      "passed": true,
      "message": "README.md file exists",
      "details": null,
      "filePath": "README.md",
      "lineNumber": null,
      "createdAt": "2024-01-15T10:30:01.000Z"
    }
  ],
  "repository": {
    "id": "456e7890-e89b-12d3-a456-426614174000",
    "name": "my-project",
    "type": "upload",
    "url": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404)**:
```json
{
  "error": "Analysis not found"
}
```

---

### List Analyses

Get a list of recent analyses.

**Endpoint**: `GET /api/analyses`

**Request**:
```bash
curl http://localhost:3000/api/analyses
```

**Response**:
```json
{
  "analyses": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "healthScore": 85,
      "status": "completed",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "completedAt": "2024-01-15T10:30:01.000Z",
      "repositoryId": "456e7890-e89b-12d3-a456-426614174000",
      "repositoryName": "my-project",
      "repositoryType": "upload"
    }
  ]
}
```

**Notes**:
- Returns up to 50 most recent analyses
- Results are ordered by creation date (newest first)

---

## Data Models

### AnalysisResult

```typescript
interface AnalysisResult {
  healthScore: number;          // 0-100
  checks: CheckResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    errors: number;
    warnings: number;
    info: number;
  };
  metadata: {
    analyzedAt: string;         // ISO 8601 timestamp
    duration: number;            // milliseconds
    repositoryName: string;
  };
}
```

### CheckResult

```typescript
interface CheckResult {
  checkType: string;
  category: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  passed: boolean;
  message: string;
  details?: any;
  filePath?: string;
  lineNumber?: number;
  suggestion?: string;
}
```

### Check Categories

- **Documentation**: README and docs checks
- **Legal & Compliance**: License and legal checks
- **Code Quality**: Tests, CI/CD, linting checks
- **Git Hygiene**: .gitignore and git best practices
- **Dependencies**: Package management checks

### Severity Levels

- **error**: Critical issues that should be fixed immediately
- **warning**: Important issues that should be addressed
- **info**: Suggestions for improvement
- **success**: Checks that passed successfully

---

## Integration Examples

### Node.js/JavaScript

```javascript
const FormData = require('form-data');
const fs = require('fs');

async function analyzeRepository(files, repoName) {
  const formData = new FormData();
  
  formData.append('repoName', repoName);
  
  for (const file of files) {
    formData.append('files', fs.createReadStream(file));
  }
  
  const response = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    body: formData,
  });
  
  return await response.json();
}

// Usage
analyzeRepository(
  ['README.md', 'package.json', 'LICENSE'],
  'my-awesome-project'
).then(result => {
  console.log('Health Score:', result.result.healthScore);
});
```

### Python

```python
import requests

def analyze_repository(files, repo_name):
    url = 'http://localhost:3000/api/analyze'
    
    files_data = []
    for file_path in files:
        with open(file_path, 'rb') as f:
            files_data.append(('files', f))
    
    data = {'repoName': repo_name}
    
    response = requests.post(url, files=files_data, data=data)
    return response.json()

# Usage
result = analyze_repository(
    ['README.md', 'setup.py', 'LICENSE'],
    'my-python-project'
)
print(f"Health Score: {result['result']['healthScore']}")
```

### GitHub Actions

```yaml
name: Repository Health Check

on: [push, pull_request]

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Analyze Repository
        run: |
          # Upload repository to health checker
          # (This example assumes you have a script to upload)
          ./scripts/upload-to-health-checker.sh
```

---

## Rate Limiting

Currently, there are no rate limits. Future versions may implement:
- Rate limiting per IP address
- API key authentication
- Usage quotas

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (missing required parameters) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Webhooks (Future Feature)

Future versions will support webhooks for:
- Analysis completion notifications
- Health score threshold alerts
- Scheduled analysis reports

---

## Best Practices

1. **File Selection**: Upload only necessary files (exclude node_modules, .git, etc.)
2. **Repository Name**: Use descriptive names for better tracking
3. **Configuration**: Use configuration to disable irrelevant checks
4. **Error Handling**: Always check response status and handle errors
5. **Polling**: For long-running analyses, consider polling `/api/analysis/:id`

---

## Support

For API issues or questions:
- Open an issue on GitHub
- Check the documentation
- Review example integrations

---

**API Version**: 1.0.0  
**Last Updated**: 2024
