const fsp = require('fs/promises');
const path = require('path');

async function copyDir(src, dest) {
  try {
    await fsp.rm(destDir, { recursive: true, force: true });
  } catch (err) {
    console.error(`Ошибка удаления содержимого папки: ${err.message}`);
  }

  try {
    await fsp.mkdir(dest, { recursive: true });
  } catch (err) {
    console.error(`Ошибка создания папки: ${err.message}`);
  }

  const files = await fsp.readdir(src, {withFileTypes: true});

  for (const file of files) {
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);
    if (file.isFile()) {
      await fsp.copyFile(srcPath, destPath);
    } else {
      try {
        await copyDir(srcPath, destPath);
      } catch (err) {
        console.error('Ошибка при копировании папки:', err);
      }
    }
  }
}

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

(async () => {
  await copyDir(srcDir, destDir);
  console.log('Копирование папки прошло успешно');
})();


