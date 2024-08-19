let { store, format } = require('../utils');

module.exports = function(request, response) {
 let { transaction_hash, domain } = request.body;
 store.read(domain).then(data=>{
    data = JSON.parse(data),
    (data.HITS ||=[]).push(transaction_hash),
    store.write(format(JSON.stringify(data)), function() {
        response.json({success:!0})
    }, domain)
 })
}