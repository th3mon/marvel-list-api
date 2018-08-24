const fs = require('fs');

function createJsonFileWriter(fileName) {
  const writeStream = fs.createWriteStream(`${fileName}.json`);

  return content => {
    writeStream.write(content, 'utf8');
    writeStream.end();
  };
}

module.exports = createJsonFileWriter;
