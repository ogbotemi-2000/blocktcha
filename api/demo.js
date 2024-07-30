import {$} from 'execa';

// const {stdout: name};
($`cat package.json`.pipe`grep version`).then(obj=>{
    let {stdout: version} = obj;
    console.log("::OUT::", version)
});
// console.log(name);
module.exports = async function(request, response) {
  
  const rawBody = await request.text()
  return response.json({ rawBody, body: request.body})
}