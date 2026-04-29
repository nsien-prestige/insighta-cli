const chalk = require('chalk')
const Table = require('cli-table3')
const ora = require('ora')

// Spinner instance for loading states
const createSpinner = (text) => {
    return ora({
        text,
        color: 'cyan'
    })
}

// Success message in green
const success = (message) => {
    console.log(chalk.green('✓✓' + message))
}

// Error message in red
const error = (message) => {
    console.error(chalk.red('✗✗' + message))
}

// Info message in cyan
const info = (message) => {
    console.log(chalk.cyan('ℹ️' + message))
}

// Display profiles as a table
const displayProfiles = (profiles) => {
    if (profiles.length === 0) {
        info('No profiles found')
        return
    }

    const table = new Table({
        head: [
            chalk.white('ID'),
            chalk.white('Name'),
            chalk.white('Gender'),
            chalk.white('Age'),
            chalk.white('Age Group'),
            chalk.white('Country'),
        ],
        colWidths: [38, 20, 10, 6, 12, 10],
        style: {
            head: [], // No color for header
            border: ['cyan']
        }
    })

    profiles.forEach(profile => {
        table.push([
            chalk.gray(profile.id),
            profile.name,
            profile.gender === 'male' ? chalk.blue(profile.gender) : chalk.magenta(profile.gender),
            profile.age,
            profile.age_group,
            profile.country_id
        ])
    })

    console.log(table.toString())
}

// Display a single profile
const profileDetail = (profile) => {
    const table = new Table({
        style: { border: ['cyan'] }
    })

    table.push(
        { 'ID': chalk.gray(profile.id) },
        { 'Name': profile.name },
        { 'Gender': profile.gender === 'male' ? chalk.blue(profile.gender) : chalk.magenta(profile.gender) },
        { 'Gender Probability': `${(profile.gender_probability * 100).toFixed(1)}%` },
        { 'Age': String(profile.age) },
        { 'Age Group': profile.age_group },
        { 'Country': `${profile.country_name} (${profile.country_id})` },
        { 'Country Probability': `${(profile.country_probability * 100).toFixed(1)}%` },
        { 'Created At': new Date(profile.created_at).toLocaleString() }
    )

    console.log(table.toString())
}

// Display pagination info
const paginationInfo = (page, totalPages, total) => {
    console.log(
        chalk.gray(`\nPage ${page} of ${totalPages} — ${total} total profiles\n`)
    )
}

// Display logged in user info
const userInfo = (user) => {
    const table = new Table({
        style: { border: ['cyan'] }
    })

    table.push(
        { 'Username': chalk.green('@' + user.username) },
        { 'Email': user.email || 'Not provided' },
        { 'Role': user.role === 'admin' ? chalk.red(user.role) : chalk.yellow(user.role) },
        { 'ID': chalk.gray(user.id) }
    )

    console.log(table.toString())
}

module.exports = {
    createSpinner,
    success,
    error,
    info,
    displayProfiles,
    profileDetail,
    paginationInfo,
    userInfo
}

