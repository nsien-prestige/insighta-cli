require('dotenv').config()
const { Command } = require('commander')
const { login, logout, whoami } = require('../commands/auth')
const { list, get, search, create, exportProfiles } = require('../commands/profiles')

const program = new Command()

program
    .name('insighta')
    .description('CLI tool for Insighta Labs')
    .version('1.0.0')

// --- Auth Commands ---

program
    .command('login')
    .description('Login with GitHub')
    .action(login)

program
    .command('logout')
    .description('Logout and clear credentials')
    .action(logout)

program
    .command('whoami')
    .description('Show currently logged in user')
    .action(whoami)

// --- Profile Commands ---

const profiles = program
    .command('profiles')
    .description('Manage profiles')

profiles
    .command('list')
    .description('List all profiles')
    .option('--gender <gender>', 'Filter by gender (male/female)')
    .option('--country <country>', 'Filter by country code (e.g NG)')
    .option('--age-group <ageGroup>', 'Filter by age group (child/teenager/adult/senior)')
    .option('--min-age <minAge>', 'Filter by minimum age')
    .option('--max-age <maxAge>', 'Filter by maximum age')
    .option('--sort-by <sortBy>', 'Sort by field (age/created_at/gender_probability)')
    .option('--order <order>', 'Sort order (asc/desc)')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Results per page', '10')
    .action(list)

profiles
    .command('get <id>')
    .description('Get a single profile by ID')
    .action(get)

profiles
    .command('search <query>')
    .description('Search profiles using natural language')
    .action(search)

profiles
    .command('create')
    .description('Create a new profile (admin only)')
    .option('--name <name>', 'Name to create profile for')
    .action(create)

profiles
    .command('export')
    .description('Export profiles to CSV')
    .option('--format <format>', 'Export format (csv)')
    .option('--gender <gender>', 'Filter by gender')
    .option('--country <country>', 'Filter by country code')
    .option('--age-group <ageGroup>', 'Filter by age group')
    .action(exportProfiles)

program.parse(process.argv)