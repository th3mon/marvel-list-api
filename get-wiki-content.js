const clients = require('restify-clients');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('data-from-wiki.html');

const sectionId = 'mwAac';
const wikiApiUrl = `https://en.wikipedia.org/api/rest_v1/page/html/Marvel_Cinematic_Universe?sections=${sectionId}`;
const client = clients.createJsonClient(wikiApiUrl);

client.get('', (err, req, res, obj) => {
  const html = obj[sectionId];
  const $ = cheerio.load(html);
  const table = $('.wikitable');

  console.log(table.html());
});

function writeToFile() {
  writeStream.write(html);
}
