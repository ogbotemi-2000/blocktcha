let { store, format } = require('../utils');

module.exports = function(request, response) {
  let { query } = request;
  store.read(query.domain).then(stored=>{
    response.setHeader('Access-Control-Allow-Origin', (/localhost/.test(query.domain)?'http://':'https://')+query.domain),
    response.json({ success:!0 })
  }).catch(err=>{
    response.json({error: 'Domain not registered in app'})
  })
}