let fs  =  require('fs');

fetch("https://google.com")
  .then((response) => {
    console.log('::FETCH::'),
    response.text().then(html=>fs.writeFileSync('res.html', html))
  })
  .catch(err=>console.log('::ERR::', err))