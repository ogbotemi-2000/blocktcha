let { store, format } = require('../utils');

module.exports = function(request, response, body) {
/** prepare request.body as an object */
  if(typeof (body = request.body) === 'string') request.body={}, body.split('&').forEach(field=>request.body[(field = field.split('='))[0]] = field[1]);
  let { transaction_hash, domain } = request.body;

 store.read(domain).then(data=>{
    (data.HITS ||=[]).push(transaction_hash),
    store.write(data, function() {
        response.json({success:!0})
    }, domain)
 })
}