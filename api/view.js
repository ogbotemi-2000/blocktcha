let fs = require('fs');

module.exports = function(request, response) {
    let { dir } = request.query;
    fs.readdir(dir, function(err, files) {
        response.end(files.toString())
    })
}