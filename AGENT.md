# Zapier CLI - Agent Guide

This CLI provides access to the Zapier Natural Language Actions API for executing automation workflows.

## Quick Start

```bash
# Configure API key
zapier config set apiKey YOUR_API_KEY

# List available actions
zapier actions list --json

# Get action details
zapier actions get <action-id> --json

# Execute an action
zapier actions execute <action-id> --params '{"key":"value"}' --json
```

## Available Commands

- `config` - Manage configuration (set, get, list, clear)
- `actions list` - List all available Natural Language Actions
- `actions get <id>` - Get details for a specific action
- `actions execute <id>` - Execute an action with parameters

## Output Format

All commands support `--json` flag for machine-readable output. Use this flag when calling from AI agents.

## Error Handling

If a command fails, it will exit with code 1 and print an error message to stderr.

## Authentication

The CLI uses an API key for authentication. Set it using:
- `zapier config set apiKey <key>`
- Or environment variable: `ZAPIER_API_KEY`

Get your API key from: https://nla.zapier.com/
