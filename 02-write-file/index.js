const fs = require('fs')
const path = require('path')
const readline = require('readline')  
const { stdin, stdout } = process


const outFile = path.join(__dirname, 'new.txt')
const writeStream = fs.createWriteStream(outFile, { flags: 'a' })

console.log('Напишите какой-то любой текст (выйти: ввести "exit" или нажать Ctrl+C):')

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
})
rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Пока! До новой встречи!')
    rl.close()
  } else {
    writeStream.write(input + '\n')
  }
})
process.on('SIGINT', () => {
  console.log('\nПока! До новой встречи!')
  rl.close()
  process.exit()
})