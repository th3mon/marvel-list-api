const fs = require('fs');

function createJsonFileWriter(fileName) {
  const dir = 'cache';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const writeStream = fs.createWriteStream(`${dir}/${fileName}.json`);

  return content => {
    writeStream.write(content, 'utf8');
    writeStream.end();
  };
}

module.exports = createJsonFileWriter;
