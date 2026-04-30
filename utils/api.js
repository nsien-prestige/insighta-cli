const axios = require("axios");
const { getCredentials, clearCredentials, saveCredentials } = require("./auth");
const { API_BASE_URL } = require('./config')

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'X-API-Version': '1'
    }
})

// Before every request attach the access token
api.interceptors.request.use((config) => {
    const credentials = getCredentials()
    if (credentials?.access_token) {
        config.headers.Authorization = `Bearer ${credentials.access_token}`
    }

    return config
})

// After every response handle token expiry
api.interceptors.response.use(
    (response) => response, // if successful, return the response as is
    async (error) => {
        const originalRequest = error.config

        // If we get a 401 error, it means the access token has expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true // Mark the request as being retried

            const credentials = getCredentials()

            if(credentials?.refresh_token) {
                clearCredentials() // Clear old credentials
                console.error('Session expired. Please run: insighta login')
                process.exit(1) // Exit the process to force re-login
            }

            try {
                // Try to refresh the token
                const res = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refresh_token: credentials.refresh_token }
                )

                const { access_token, refresh_token } = res.data

                // Save the new tokens
                saveCredentials({
                    ...credentials,
                    access_token,
                    refresh_token
                })

                // Update the original request with the new access token
                originalRequest.headers.Authorization = `Bearer ${access_token}`

                // Retry the original request
                return api(originalRequest)
            } catch {
                clearCredentials() // Clear credentials if refresh fails
                console.error('Session expired. Please run: insighta login')
                process.exit(1) // Exit the process to force re-login
            }
        }

        return Promise.reject(error) // For other errors, reject the promise
    }
)

module.exports = api
