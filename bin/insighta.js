#!/usr/bin/env node

require('dotenv').config()
const { Command } = require('commander')
const authCommands = require('../commands/auth')
const profileCommands = require('../commands/profiles')

const program = new Command()

program
    .name('insighta')
    .description('CLI tool for Insighta Labs')
    .version('1.0.0')
    .helpOption('-h, --help', 'Display help')
    .addHelpCommand(false)

// --- Auth Commands ---
program
    .command('login')
    .description('Login with GitHub')
    .action(authCommands.login)

program
    .command('logout')
    .description('Logout and clear credentials')
    .action(authCommands.logout)

program
    .command('whoami')
    .description('Show currently logged in user')
    .action(authCommands.whoami)

// --- Profile Commands ---
const profiles = program
    .command('profiles')
    .description('Manage profiles')

profiles
    .command('list')
    .description('List all profiles')
    .option('--gender <gender>', 'Filter by gender (male/female)')
    .option('--country <country>', 'Filter by country code (e.g NG)')
    .option('--age-group <ageGroup>', 'Filter by age group')
    .option('--min-age <minAge>', 'Filter by minimum age')
    .option('--max-age <maxAge>', 'Filter by maximum age')
    .option('--sort-by <sortBy>', 'Sort by field')
    .option('--order <order>', 'Sort order (asc/desc)')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Results per page', '10')
    .action(profileCommands.list)

profiles
    .command('get <id>')
    .description('Get a single profile by ID')
    .action(profileCommands.get)

profiles
    .command('search <query>')
    .description('Search profiles using natural language')
    .action(profileCommands.search)

profiles
    .command('create')
    .description('Create a new profile (admin only)')
    .option('--name <name>', 'Name to create profile for')
    .action(profileCommands.create)

profiles
    .command('delete <id>')
    .description('Delete a profile by ID (admin only)')
    .action(profileCommands.deleteProfile)

profiles
    .command('export')
    .description('Export profiles to CSV')
    .option('--format <format>', 'Export format (csv)')
    .option('--gender <gender>', 'Filter by gender')
    .option('--country <country>', 'Filter by country code')
    .option('--age-group <ageGroup>', 'Filter by age group')
    .action(profileCommands.exportProfiles)

program.parseAsync(process.argv).catch((err) => {
    console.error(err)
    process.exit(1)
})
