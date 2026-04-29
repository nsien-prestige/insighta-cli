const http = require('http')
const crypto = require('crypto')
const { saveCredentials, getCredentials, clearCredentials } = require('../utils/auth')
const api = require('../utils/api')
const { success, error, info, userInfo, createSpinner } = require('../utils/display')

const generateRandomString = (length = 64) => {
    return crypto.randomBytes(length).toString('base64url')
}

const generateCodeChallenge = (verifier) => {
    return crypto
        .createHash('sha256')
        .update(verifier)
        .digest('base64url')
}

const login = async () => {
    const existing = getCredentials()
    if (existing?.user) {
        info(`Already logged in as @${existing.user.username}`)
        info('Run insighta logout first if you want to switch accounts')
        return
    }

    const state = generateRandomString(32)
    const codeVerifier = generateRandomString(64)
    const codeChallenge = generateCodeChallenge(codeVerifier)

    info('Starting login flow...')

    await new Promise((resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            if (!req.url.startsWith('/callback')) {
                res.end('Not found')
                return
            }

            const url = new URL(req.url, 'http://localhost:9876')
            const code = url.searchParams.get('code')
            const returnedState = url.searchParams.get('state')

            if (returnedState !== state) {
                res.end('<h1>Login failed - state mismatch. Close this tab.</h1>')
                server.close()
                error('Login failed: state mismatch')
                reject(new Error('State mismatch'))
                return
            }

            if (!code) {
                res.end('<h1>Login failed - no code received. Close this tab.</h1>')
                server.close()
                reject(new Error('No code received'))
                return
            }

            res.end(`
                <html>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                        <h1>✅ Login successful!</h1>
                        <p>You can close this tab and return to your terminal.</p>
                    </body>
                </html>
            `)

            const spinner = createSpinner('Completing login...').start()

            try {
                const response = await api.post('/auth/cli/callback', {
                    code,
                    code_verifier: codeVerifier,
                    redirect_uri: 'http://localhost:9876/callback'
                })

                const { access_token, refresh_token, user } = response.data

                saveCredentials({ access_token, refresh_token, user })

                spinner.stop()
                success(`Logged in as @${user.username}`)
                resolve()
            } catch (err) {
                spinner.stop()
                error('Login failed: ' + (err.response?.data?.message || err.message))
                reject(err)
            } finally {
                server.close()
            }
        })

        server.listen(9876, () => {
            const params = new URLSearchParams({
                client_id: process.env.GITHUB_CLIENT_ID,
                redirect_uri: 'http://localhost:9876/callback',
                scope: 'read:user user:email',
                state,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256'
            })

            const authUrl = `https://github.com/login/oauth/authorize?${params}`

            info('Opening browser for GitHub login...')

            import('open').then(({ default: open }) => {
                open(authUrl)
            })
        })

        server.on('error', (err) => {
            error('Failed to start local server: ' + err.message)
            reject(err)
        })
    })
}

const logout = async () => {
    const credentials = getCredentials()

    if (!credentials) {
        error('You are not logged in')
        return
    }

    const spinner = createSpinner('Logging out...').start()

    try {
        await api.post('/auth/logout', {
            refresh_token: credentials.refresh_token
        })
    } catch {
        // Even if backend call fails, clear local credentials
    } finally {
        spinner.stop()
        clearCredentials()
        success('Logged out successfully')
    }
}

const whoami = () => {
    const credentials = getCredentials()

    if (!credentials?.user) {
        error('You are not logged in')
        info('Run: insighta login')
        return
    }

    userInfo(credentials.user)
}

module.exports = { login, logout, whoami }