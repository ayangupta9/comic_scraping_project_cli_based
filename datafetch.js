const scrapingUtils = require('./scraping-util')
const utils = require('./utils')

const mainurl = 'http://readallcomics.com'

module.exports.fetchSearchResultUrls = async function fetchSearchResultUrls (
  answer1
) {
  if (
    answer1.userInputComicSearch === undefined ||
    answer1.userInputComicSearch.length === 0
  ) {
    console.log('Enter valid comic name')
    return
  } else if (
    answer1.userInputComicSearch === 'quit' ||
    answer1.userInputComicSearch === 'exit' ||
    answer1.userInputComicSearch === 'q'
  ) {
    console.log('exiting...')
    return
  } else {
    const searchParam = utils.stringManip(answer1.userInputComicSearch, ' ')
    const requiredUrl = `${mainurl}/?story=${searchParam}&s=&type=comic`
    const data = await scrapingUtils.getData(requiredUrl)
    return data
  }
}

module.exports.fetchCategoriesIssuesUrls = async function fetchCategoriesIssuesUrls (
  answer2,
  searchResultsUrls
) {
  const requiredUrl = searchResultsUrls.find(o => {
    if (o.comicName.replace('\n', '\0') === answer2.chosenComic) {
      return o
    }
    return undefined
  })

  let issuesData
  if (requiredUrl !== undefined) {
    issuesData = await scrapingUtils.getData2(requiredUrl.link)
  }
  return issuesData
}

module.exports.fetchComicData = async function fetchComicData (
  answer3,
  issueResultsUrls
) {
  const requiredUrl = issueResultsUrls.find(o => {
    if (o.comicName.replace('\n', '\0') === answer3.chosenIssue) {
      return o
    }
    return undefined
  })

  let comicImagesData
  if (requiredUrl !== undefined) {
    comicImagesData = await scrapingUtils.getData3(requiredUrl.link)
  }
  return comicImagesData
}
