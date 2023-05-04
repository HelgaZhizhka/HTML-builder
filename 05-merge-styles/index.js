const fsp = require('fs/promises');
const path = require('path');

const stylesSrc = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

async function buildStyles() {
  const files = await fsp.readdir(stylesSrc);

  const stylesPromises = files
    .filter((file) => path.extname(file) === '.css')
    .map((file) => fsp.readFile(path.join(stylesSrc, file), 'utf-8'));

  const styles = await Promise.all(stylesPromises);

  await fsp.mkdir(outputDir, { recursive: true });
  await fsp.writeFile(outputFile, styles.join('\n'));

  console.log('Cборка стилей произошла успешно');
}

buildStyles().catch((err) => console.error('Ошибка при сборке стилей:', err.message));
