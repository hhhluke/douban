const superagent = require('superagent')
const cheerio = require('cheerio')

function setSawData(url) {
  let sawData = []
  return new Promise((resolve, rej) => {
    superagent
      .get(url)
      .set('Access-Control-Allow-Origin', '*')
      .withCredentials()
      .end((err, res) => {
        //页面dom在text里
        let $ = cheerio.load(res.text)
        let pages = $('.thispage').attr('data-total-page')
        $('.grid-view .item .info').each((_, item) => {
          sawData.push({
            movie: $(item).find('.title a em').text(),
            link: $(item).find('.title a').attr('href'),
            date: $(item).find('.date').text(),
            rank: $(item).find('.date').prev().attr('class').match(/\d+/),
            comment: $(item).find('.comment').text()
          })
        })
        resolve(sawData)
        if (err) rej(err)
      })
  })
}
export const getSawList = id => {
  const url =
    `https://movie.douban.com/people/${id}/collect?start=0&sort=time&rating=all&filter=all&mode=grid`
  let data = []
}
