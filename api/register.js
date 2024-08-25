let password          = require('./password'),
    { store, format } = require('../utils');

module.exports = async function(request, response) {
  let { label, domain, uuid } = request.body;
  uuid||=password.uuid(),
  request.method==='GET' ? response.send('&lt;Not allowed&gt;')
  : store.read(domain).then(data=>{

      response.json({ error: "::DUPLICATE::", message: 'The provided domain has already been registered in this app' })
    }).catch(err=>password.hash(domain).then((hashed, data, history)=>{
       data = { domain, label, uuid, key: btoa(domain), secret: hashed },

      store.read(uuid).then(stored=>history = stored).catch(err=>history = { domains: [] })
      .finally(_=>{
        history.domains.push(domain),
        store.write(data, function() {
          store.write(history, function() {
            response.json(data)
          }, uuid)
        }, domain/** uses the domain as the file name to save this data to /tmp/ in vercel */)
      })
    }))
}