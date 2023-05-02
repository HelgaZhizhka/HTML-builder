const fs = require('fs')
const path = require('path')
const { stdin } = process


const outFile = path.join(__dirname, 'new.txt')
const writeStream = fs.createWriteStream(outFile, { flags: 'a' })

console.log('Напишите какой-то любой текст (выйти: ввести "exit" или нажать Ctrl+C):')

stdin.on('data', (input) => {
  const text = input.toString().trim()

  if (text === 'exit') {
    console.log('Пока! До новых встреч!')
    process.exit()
  } else {
    writeStream.write(text + '\n')
  }
})