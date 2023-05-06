const fsp = require('fs/promises');
const path = require('path');
const layoutPath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesSrc = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(__dirname, 'project-dist');

(async () => {
  // Удаление папки distDir перед сборкой
  try {
    await fsp.rm(distDir, { recursive: true, force: true });
  } catch (err) {
    console.error(`Ошибка удаления папки distDir: ${err.message}`);
  }

  const layout = await fsp.readFile(layoutPath, 'utf-8');
  const componentFiles = (await fsp.readdir(componentsDir)).filter((file) =>
    file.endsWith('.html')
  );

  const components = {};
  for (const file of componentFiles) {
    const componentName = file.slice(0, -5);
    const componentContent = await fsp.readFile(
      path.join(componentsDir, file),
      'utf-8'
    );
    components[componentName] = componentContent;
  }

  let pageHtml = layout;
  for (const [name, content] of Object.entries(components)) {
    pageHtml = pageHtml.replace(new RegExp(`{{${name}}}`, 'g'), content);
  }

  await fsp.mkdir(distDir, { recursive: true });
  await fsp.writeFile(path.join(distDir, 'index.html'), pageHtml);

  async function copyDir(src, dest) {
    try {
      await fsp.mkdir(dest, { recursive: true });
    } catch (err) {
      console.error(`Ошибка создания папки: ${err.message}`);
    }

    const files = await fsp.readdir(src, { withFileTypes: true });

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

  async function buildStyles(src, dest) {
    try {
      const files = await fsp.readdir(src);
      const stylesPromises = files
        .filter((file) => path.extname(file) === '.css')
        .map((file) => fsp.readFile(path.join(src, file), 'utf-8'));

      const styles = await Promise.all(stylesPromises);
      await fsp.writeFile(dest, styles.join('\n'));
    } catch (err) {
      console.error('Ошибка при сборке стилей:', err.message);
    }
  }

  await buildStyles(stylesSrc, path.join(distDir, 'style.css'));
  await copyDir(assetsDir, path.join(distDir, 'assets'));
  console.log('Страница успешно собрана');
})();
