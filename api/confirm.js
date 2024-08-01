let config =  require('../config')

module.exports =  async function(request, response) {
    const rawBody = await request.text()
    return response.json({ query: request.query, verb: request.method, rawBody, body: request.body, config })
}