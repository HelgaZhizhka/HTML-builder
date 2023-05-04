const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

function readdirPromise(folderPath, options) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, options, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function statPromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

readdirPromise(secretFolder, { withFileTypes: true })
  .then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(secretFolder, file.name);
        statPromise(filePath)
          .then((stats) => {
            const ext = path.extname(file.name);
            const name = path.basename(file.name, ext);
            const size = stats.size / 1024;

            console.log(`${name} - ${ext} - ${size.toFixed(3)}kb`);
          })
          .catch((err) => {
            console.error('Ошибка при получении информации о файле:', err);
          });
      }
    });
  })
  .catch((err) => {
    console.error('Ошибка при чтении директории:', err);
  });
