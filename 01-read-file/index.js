const { createReadStream } = require('fs');
const path = require('path');
const { stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const readStream = createReadStream(filePath, 'utf8');

readStream.on('data', (chunk) => {
  stdout.write(chunk);
});

readStream.on('error', (err) => {
  console.error('Error on reading file', err);
});
