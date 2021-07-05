#!/usr/bin/env node
const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const open = require('open')
const fs = require('fs')

const utils = require('./utils')
const dataFetch = require('./datafetch')

const inputArr = process.argv.slice(2)

let searchResultsUrls
let issueResultsUrls
let comicDataUrls

async function init () {
  if (inputArr.length === 1 && inputArr[0] === 'init') {
    console.log(
      chalk.yellowBright(
        figlet.textSync('COMIC SCRAPER', {
          font: 'Big Money-nw'
        })
      )
    )
    console.log(chalk.rgb(184, 229, 163)('\t\t\t\tby Ayan Gupta\n'))
    console.log(chalk.rgb(184, 229, 163)('Welcome to COMIC SCRAPER (CLI)\n'))

    const answer1 = await inquirer
      .prompt([
        {
          name: 'userInputComicSearch',
          message: 'Enter comic name'
        }
      ])
      .catch(err => logError())

    if (
      answer1.userInputComicSearch === 'quit' ||
      answer1.userInputComicSearch === 'q' ||
      answer1.userInputComicSearch === 'exit'
    ) {
      utils.quitProgram()
    }

    searchResultsUrls = await dataFetch.fetchSearchResultUrls(answer1)

    const choices1 = []
    for (const item of searchResultsUrls) {
      choices1.push(item.comicName.replace('\n', '\0'))
    }
    choices1.push('quit')

    const answer2 = await inquirer.prompt([
      {
        type: 'list',
        name: 'chosenComic',
        message: 'Following comics were found related to the search:',
        choices: choices1
      }
    ])

    if (answer2.chosenComic === 'quit') {
      utils.quitProgram()
    }

    console.log(
      chalk.yellowBright(
        '\n' +
          figlet.textSync(answer2.chosenComic, {
            font: 'Pagga',
            whitespaceBreak: true,
            horizontalLayout: 'default',
            verticalLayout: 'default'
          }) +
          '\n'
      )
    )

    issueResultsUrls = await dataFetch.fetchCategoriesIssuesUrls(
      answer2,
      searchResultsUrls
    )

    const choices2 = []
    for (const item of issueResultsUrls) {
      choices2.push(item.comicName.replace('\n', '\0'))
    }
    choices2.push('quit')

    const answer3 = await inquirer.prompt([
      {
        type: 'list',
        name: 'chosenIssue',
        message: 'Following issues were found related to the comic:',
        choices: choices2
      }
    ])

    if (answer3.chosenIssue === 'quit') {
      utils.quitProgram()
    }

    console.log(
      chalk.rgb(
        49,
        214,
        216
      )(
        '\n' +
          figlet.textSync(answer3.chosenIssue, {
            font: 'Pagga',
            whitespaceBreak: true,
            horizontalLayout: 'default',
            verticalLayout: 'default'
          }) +
          '\n'
      )
    )

    comicDataUrls = await dataFetch.fetchComicData(answer3, issueResultsUrls)

    const choices3 = ['preview', 'download', 'quit']

    const previewDownloadFunc = async () => {
      const answer4 = await inquirer.prompt([
        {
          type: 'list',
          name: 'viewOrDownload',
          message:
            'Would you like to view the cover page or download the pdf format of the comic issue?',
          choices: choices3
        }
      ])

      if (answer4.viewOrDownload === choices3[0]) {
        await open(comicDataUrls.images[0])
        console.log(chalk.greenBright('Previewing in browser'))
        previewDownloadFunc()
      } else if (answer4.viewOrDownload === choices3[2]) {
        utils.quitProgram()
      } else {
        const answer5 = await inquirer.prompt([
          {
            name: 'pathToStore',
            default: process.cwd(),
            message: 'Enter directory path to store PDF:'
          }
        ])
        let pathStore = answer5.pathToStore
        while (
          pathStore !== 'quit' ||
          pathStore !== 'q' ||
          pathStore !== 'exit'
        ) {
          const isDir = fs.lstatSync(pathStore).isDirectory()
          if (!isDir) {
            console.log(
              chalk.redBright('Entered path is not a directory! Try again')
            )
          } else {
            break
          }
        }

        console.log(chalk.greenBright('creating pdf\n'))
        await utils.createPDF(comicDataUrls, pathStore)
      }
    }

    await previewDownloadFunc()
  } else {
    console.log(chalk.redBright('Enter valid command!'))
  }
}

init()
