const fs = require('fs')
const createJsonFileWriter = require('./create-json-file-writer');

jest.mock('fs');

describe('Create JSON File Writer', () => {
  it('should create JSON file writer', () => {
    const fileWriter = createJsonFileWriter('someFile');

    expect(fileWriter).toBeDefined();
    expect(typeof fileWriter).toBe('function');
  });

  it('should create folder if it not exist', () => {
    fs.existsSync.mockImplementation(() => true)
    const fileWriter = createJsonFileWriter('someFile');

    expect(fs.existsSync).toHaveBeenCalled();
  });

  it('should write content to file', () => {
    const writeStreamMock = {
      write: jest.fn(),
      end: jest.fn()
    };

    fs.createWriteStream.mockImplementation(() => writeStreamMock);

    const fileWriter = createJsonFileWriter('someFile');
    const content = JSON.stringify({
      some: 'content',
      here: 'it is'
    });

    fileWriter(content);

    expect(writeStreamMock.write).toHaveBeenCalledWith(content, 'utf8');
    expect(writeStreamMock.end).toHaveBeenCalled();
  });
});
