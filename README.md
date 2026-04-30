# Insighta CLI

A globally installable command line tool for interacting with the Insighta Labs+ platform.

## Installation

```bash
npm install -g .
```

After installation, the `insighta` command is available from any directory.

## Configuration

Create a `.env` file in the project root:

```env
API_URL=https://insightabackend.hostless.app
GITHUB_CLIENT_ID=your_cli_oauth_app_client_id
```

## CLI Usage

### Auth Commands

**Login with GitHub:**
```bash
insighta login
```
Opens your browser to GitHub OAuth, waits for authorization, then stores tokens locally at `~/.insighta/credentials.json`.

**Logout:**
```bash
insighta logout
```
Clears local credentials and invalidates the refresh token on the server.

**Show current user:**
```bash
insighta whoami
```
Displays your username, email, role, and user ID.

### Profile Commands

**List all profiles:**
```bash
insighta profiles list
```

**List with filters:**
```bash
insighta profiles list --gender male
insighta profiles list --country NG
insighta profiles list --age-group adult
insighta profiles list --min-age 25 --max-age 40
insighta profiles list --sort-by age --order desc
insighta profiles list --page 2 --limit 20
insighta profiles list --gender male --country NG --age-group adult
```

**Get a single profile by ID:**
```bash
insighta profiles get <id>
```

**Natural language search:**
```bash
insighta profiles search "young males from nigeria"
insighta profiles search "females above 30"
insighta profiles search "adults from kenya"
```

**Create a profile (admin only):**
```bash
insighta profiles create --name "Harriet Tubman"
```

**Export profiles to CSV:**
```bash
insighta profiles export --format csv
insighta profiles export --format csv --gender male --country NG
```
The CSV file is saved to your current working directory.

## Authentication Flow

```
insighta login
      ↓
CLI generates state + code_verifier + code_challenge (PKCE)
      ↓
CLI starts local server on localhost:9876
      ↓
CLI opens browser to GitHub OAuth page
      ↓
User authorizes on GitHub
      ↓
GitHub redirects to localhost:9876/callback
      ↓
CLI captures code and validates state
      ↓
CLI sends POST /auth/cli/callback { code, code_verifier }
      ↓
Backend returns { access_token, refresh_token, user }
      ↓
Tokens saved to ~/.insighta/credentials.json
      ↓
Logged in as @username
```

## Token Handling

- Tokens are stored at `~/.insighta/credentials.json`
- Every API request automatically attaches the access token as a Bearer header
- When a 401 response is received, the CLI automatically attempts to refresh the token
- If the refresh token is also expired, the user is prompted to run `insighta login` again
- On logout, the credentials file is deleted and the server invalidates the refresh token

## Credentials File

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "username": "github-username",
    "email": "user@example.com",
    "role": "analyst"
  }
}
```

## Project Structure

```
insighta-cli/
├── bin/
│   └── insighta.js       ← entry point, command definitions
├── commands/
│   ├── auth.js           ← login, logout, whoami
│   └── profiles.js       ← list, get, search, create, export
├── utils/
│   ├── api.js            ← axios instance with auto token refresh
│   ├── auth.js           ← read/write credentials file
│   └── display.js        ← tables, spinners, colors
├── .env
└── package.json
```

## Dependencies

- **commander** — parses CLI commands and options
- **axios** — makes HTTP requests to the backend
- **chalk** — colors terminal output
- **ora** — loading spinners
- **cli-table3** — renders data as tables
- **open** — opens the browser for GitHub OAuth