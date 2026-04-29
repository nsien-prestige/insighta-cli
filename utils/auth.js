const path = require('path')
const fs = require('fs')
const os = require('os')

// ~/.insighta/credentials.json
const CREDENTIALS_DIR = path.join(os.homedir(), '.insighta')
const CREDENTIALS_FILE = path.join(CREDENTIALS_DIR, 'credentials.json')

const saveCredentials = (data) => {
    // Create ~/.insighta folder if it doesn't exist
    if (!fs.existsSync(CREDENTIALS_DIR)) {
        fs.mkdirSync(CREDENTIALS_DIR, { recursive: true })
    }
    
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(data, null, 2))
}

const getCredentials = () => {
    if(!fs.existsSync(CREDENTIALS_FILE)) {
        return null
    }

    try {
        const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8')
        return JSON.parse(data)
    } catch {
        return null
    }
}

const clearCredentials = () => {
    if (fs.existsSync(CREDENTIALS_FILE)) {
        fs.unlinkSync(CREDENTIALS_FILE)
    }
}

module.exports = {
    saveCredentials,
    getCredentials,
    clearCredentials
} 