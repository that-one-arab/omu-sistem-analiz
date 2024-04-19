const baseUrl = process.env.BASE_URL || 'http://localhost:8080'

export default async function customFetch(path, options) {
    const res = await fetch(baseUrl + path, options)
    return res
}
