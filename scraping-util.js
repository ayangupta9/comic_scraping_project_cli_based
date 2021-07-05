const cheerio = require('cheerio')
const fetch = require('node-fetch')

module.exports.getData = async function getData (url) {
  const response = await fetch(url)
  const body = await response.text()

  const $ = cheerio.load(body)

  let obj = []
  const liAnchorEles = $('li a')
  for (let i = 0; i < liAnchorEles.length; i++) {
    obj.push({
      comicName: $(liAnchorEles[i]).text(),
      link: $(liAnchorEles[i]).attr('href')
    })
  }

  return obj
}

module.exports.getData2 = async function getData2 (url) {
  const response = await fetch(url)
  const body = await response.text()

  const $ = cheerio.load(body)
  let obj = []
  const liAnchorEles = $('ul.list-story li a')

  for (let i = 0; i < liAnchorEles.length; i++) {
    obj.push({
      link: $(liAnchorEles[i]).attr('href'),
      comicName: $(liAnchorEles[i]).text()
    })
  }
  return obj
}

module.exports.getData3 = async function getData3 (url) {
  const response = await fetch(url)
  const body = await response.text()
  const $ = cheerio.load(body)

  let obj = {}
  const seriesName = $('div.pinbin-category p a').text()
  obj.seriesName = seriesName
  const issueName = $('div.pinbin-copy h1').text()
  obj.issueName = issueName
  comicIssue = issueName

  const imgEles = $('div.pinbin-copy p img')
  for (let i = 0; i < imgEles.length; i++) {
    if (obj.images === undefined) {
      obj.images = [$(imgEles[i]).attr('src')]
    } else {
      obj.images.push($(imgEles[i]).attr('src'))
    }
  }
  return obj
}
