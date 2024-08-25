let password          = require('./password'),
    { store, format } = require('../utils');

module.exports = async function(request, response) {
	let { uuid } = request.body;

	store.read(uuid).then((data)=>{
		Promise.all(data.domains.map((domain, i, a)=>store.read(domain).then(read=>(read.HITS = (read.HITS||[]).length, read))))
		.then(stored=>{
			response.end(JSON.stringify({ history:!0, stored }))
		})
	}).catch(err=>{
		response.json({history:!0, error:"::NON-EXISTENT::", message:'The account ID provided is not found'})
	})
}
