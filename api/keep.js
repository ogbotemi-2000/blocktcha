let { store, format } = require('../utils');

module.exports = function(request, response) {
 let { transaction_hash, domain } = request.body;
 store.read(domain).then(data=>{
    console.log('::KEEP::', data)
    (data.HITS ||=[]).push(transaction_hash),
    console.log('::KEEP::HIT', data)
    store.write(data, function() {
        response.json({success:!0})
    }, domain)
 })
}