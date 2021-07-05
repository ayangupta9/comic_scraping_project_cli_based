const fetch = require('node-fetch')
const pdfkit = require('pdfkit')
const path = require('path')
const cliPro = require('cli-progress')
const chalk = require('chalk')
const fs = require('fs')

const pdfSavingDirName = 'scraped comics'

module.exports.stringManip = function stringManip (input, seperator) {
  const returnVal = input
    .toLowerCase()
    .trim()
    .split(seperator)
    .join('+')

  return returnVal
}

module.exports.createPDF = async function createPDF (comicDetails, pathToSave) {
  console.log(chalk.magentaBright('Do not terminate process'))

  const bar = new cliPro.SingleBar({}, cliPro.Presets.shades_classic)
  bar.start(comicDetails.images.length, 0)
  let doc = new pdfkit({
    margins: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20
    }
  })

  const date = new Date().getTime().toString()

  const pdfDirExists = fs.existsSync(path.join(pathToSave, pdfSavingDirName))

  if (!pdfDirExists) {
    fs.mkdirSync(path.join(pathToSave, pdfSavingDirName))
  }

  doc.pipe(
    fs.createWriteStream(path.join(pathToSave, pdfSavingDirName, date + '.pdf'))
  )

  doc.text(
    `${comicDetails.issueName}\n\n\nComic Scraping project\nby Ayan Gupta\nGithub: @ayangupta9`,
    doc.page.width / 3,
    doc.page.width / 3
  )

  bar.increment(1)

  for (const imgUrl of comicDetails.images) {
    const response = await fetch(imgUrl)
    const buffer = await response.buffer()

    doc.addPage().image(buffer, {
      fit: [doc.page.width - 50, doc.page.height - 50],
      align: 'center',
      valign: 'center'
    })
    bar.increment(1)
  }
  bar.stop()
  doc.end()
  console.log(
    chalk.greenBright(
      `\nPDF CREATED at ${path.join(pathToSave, pdfSavingDirName)}\n`
    )
  )
}

module.exports.quitProgram = function quitProgram () {
  console.log(chalk.magentaBright('Quiting program'))
  return process.exit(1)
}

module.exports.logError = function logError () {
  console.log(chalk.redBright('Encountered Some Error'))
  quitProgram()
}
