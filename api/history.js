let password          = require('./password'),
    { store, format } = require('../utils');

module.exports = async function(request, response) {
	let { uuid } = request.body;

	store.read(uuid).then((data, stored=[])=>{
		data = JSON.parse(data),
		data.domains.forEach((domain, i, a)=>store.read(domain).then(read=>{
			(read =  JSON.parse(read)).HITS = (read.HITS||[]).length,
			stored.push(read);
			if(!a[i+1]) response.end(JSON.stringify({ history:!0, stored }));
		}))
	}).catch(err=>{
		console.log("::ERROR::", err),
		response.json({history:!0, error:"::NON-EXISTENT::", message:'The account ID provided is not found'})
	})
}
