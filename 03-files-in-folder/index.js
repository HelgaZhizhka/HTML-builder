const { readdir, stat } = require('fs/promises');
const path = require('path');

async function readFilesInFolder() {
  const secretFolder = path.join(__dirname, 'secret-folder');
  try {
    const files = await readdir(secretFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretFolder, file.name);
        const stats = await stat(filePath);
        const fileSize = stats.size / 1024;
        const fileExt = path.extname(file.name);
        const fileName = path.basename(file.name, fileExt);
        console.log(`${fileName} - ${fileExt.substring(1)} - ${fileSize.toFixed(3)}kb`);
      }
    }
  } catch (err) {
    console.error(`Ошибка при чтении папки ${secretFolder}`);
  }
}
readFilesInFolder();
