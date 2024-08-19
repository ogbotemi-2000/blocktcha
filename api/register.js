let password          = require('./password'),
    { store, format } = require('../utils');

module.exports = async function(request, response) {
  let { label, domain, uuid } = request.body;
  request.method==='GET' ? response.send('&lt;Not allowed&gt;')
  : store.read(domain).then(data=>{

      response.json({ error: "::DUPLICATE::", message: 'The provided domain has already been registered in this app' })
    }).catch(err=>password.hash(domain).then((hashed, data, history)=>{
      uuid||=password.uuid(), data = { domain, label, uuid, key: btoa(domain), secret: hashed },

      store.read(uuid).then(stored=>history = JSON.parse(stored)).catch(err=>history = { domains: [] })
      .finally(_=>history.domains.push(domain))

      console.log('::STORED::', history),

      store.write(format(JSON.stringify(data)), function() {
        store.write(format(JSON.stringify(history)), _=>_, uuid),
        response.json(data)
      }, domain/** uses the domain as the file name to save this data to /tmp/ in vercel */)
    }))
}