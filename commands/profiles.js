const fs = require('fs')
const path = require('path')
const api = require('../utils/api')
const {
    createSpinner,
    success,
    error,
    info,
    displayProfiles,
    profileDetail,
    paginationInfo
} = require('../utils/display')

const list = async (options) => {
    const spinner = createSpinner('Fetching profiles...').start()

    try {
        const params = {}

        if (options.gender) params.gender = options.gender
        if (options.country) params.country_id = options.country
        if (options.ageGroup) params.age_group = options.ageGroup
        if (options.minAge) params.min_age = options.minAge
        if (options.maxAge) params.max_age = options.maxAge
        if (options.sortBy) params.sort_by = options.sortBy
        if (options.order) params.order = options.order
        if (options.page) params.page = options.page
        if (options.limit) params.limit = options.limit

        const response = await api.get('/api/profiles', { params })
        const { data, page, total_pages, total } = response.data

        spinner.stop()
        displayProfiles(data)
        paginationInfo(page, total_pages, total)

    } catch (err) {
        spinner.stop()
        error(err.response?.data?.message || 'Failed to fetch profiles')
    }
}

const get = async (id) => {
    const spinner = createSpinner('Fetching profile...').start()

    try {
        const response = await api.get(`/api/profiles/${id}`)
        spinner.stop()
        profileDetail(response.data.data)

    } catch (err) {
        spinner.stop()
        error(err.response?.data?.message || 'Profile not found')
    }
}

const search = async (query) => {
    const spinner = createSpinner('Searching profiles...').start()

    try {
        const response = await api.get('/api/profiles/search', {
            params: { q: query }
        })

        const { data, page, total_pages, total } = response.data

        spinner.stop()

        if (data.length === 0) {
            info('No profiles matched your search')
            return
        }

        displayProfiles(data)
        paginationInfo(page, total_pages, total)

    } catch (err) {
        spinner.stop()
        error(err.response?.data?.message || 'Search failed')
    }
}

const create = async (options) => {
    if (!options.name) {
        error('Name is required: insighta profiles create --name "John Doe"')
        return
    }

    const spinner = createSpinner(`Creating profile for ${options.name}...`).start()

    try {
        const response = await api.post('/api/profiles', { name: options.name })
        spinner.stop()
        success('Profile created successfully!')
        profileDetail(response.data.data)

    } catch (err) {
        spinner.stop()
        error(err.response?.data?.message || 'Failed to create profile')
    }
}

const exportProfiles = async (options) => {
    if (!options.format || options.format !== 'csv') {
        error('Format is required: --format csv')
        return
    }

    const spinner = createSpinner('Exporting profiles...').start()

    try {
        const params = { format: 'csv' }

        if (options.gender) params.gender = options.gender
        if (options.country) params.country_id = options.country
        if (options.ageGroup) params.age_group = options.ageGroup

        const response = await api.get('/api/profiles/export', {
            params,
            responseType: 'text'
        })

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const filename = `profiles_${timestamp}.csv`
        const filepath = path.join(process.cwd(), filename)

        fs.writeFileSync(filepath, response.data)

        spinner.stop()
        success(`Exported to ${filepath}`)

    } catch (err) {
        spinner.stop()
        error(err.response?.data?.message || 'Export failed')
    }
}

module.exports = { list, get, search, create, exportProfiles }