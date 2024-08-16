import fs from 'fs';

fetch("https://google.com")
  .then((response) => {
    console.log('::FETCH::', response),
    response.text().then(html=>fs.writeFileSync('res.html', html))
  })
  .catch(err=>console.log('::ERR::', err))