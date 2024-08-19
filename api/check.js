let { store, format } = require('../utils');

module.exports = function(request, response) {
  let { query } = request;
  store.read(query.domain).then(stored=>{
    response.json({ success:!0 })
  }).catch(err=>{
    response.json({error: 'Domain not registered in app'})
  })
}