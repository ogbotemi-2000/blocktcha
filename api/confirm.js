let config =  require('../config')

module.exports =  async function(request, response) {
    return response.json({ query: request.query, verb: request.method, body: request.body, config })
}