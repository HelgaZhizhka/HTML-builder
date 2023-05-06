const fsp = require('fs/promises');
const path = require('path');

const stylesSrc = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');

async function buildStyles(src, dest) {
  try {
    const files = await fsp.readdir(src);
    const stylesPromises = files
      .filter((file) => path.extname(file) === '.css')
      .map((file) => fsp.readFile(path.join(src, file), 'utf-8'));
    const styles = await Promise.all(stylesPromises);
    await fsp.mkdir(dest, { recursive: true });
    await fsp.writeFile(path.join(dest, 'bundle.css'), styles.join('\n'));
  } catch (err) {
    console.error('Ошибка при сборке стилей:', err.message);
  }

  console.log('Cборка стилей произошла успешно');
}

buildStyles(stylesSrc, outputDir);
