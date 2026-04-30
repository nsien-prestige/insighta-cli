// Public OAuth client ID — safe to bundle (visible in every redirect URL)
// Replace with your actual GitHub OAuth App client ID before publishing
const GITHUB_CLI_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Ov23li9FWIkSMYAHMMtT'

// Production API base URL — users can override with API_URL env var for local dev
const API_BASE_URL = process.env.API_URL || 'https://insightabackend.hostless.app'

module.exports = { GITHUB_CLI_CLIENT_ID, API_BASE_URL }
