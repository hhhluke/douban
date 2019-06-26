const superagent = require('superagent')
const cheerio = require('cheerio')
const Excel = require('exceljs')
import { getNumFromString, pagesToArray, flatten } from './utils'
import store from '../store'

/**
 *
 * 通过url获取dom
 * @param {String} url
 * @returns {$}
 */
function getDom(url) {
  return new Promise((resolve, rej) => {
    superagent
      .get(url)
      .set('Access-Control-Allow-Origin', '*')
      .withCredentials()
      .end((err, res) => {
        //页面dom在text里
        let $ = cheerio.load(res.text)
        resolve($)
        if (err) rej(err)
      })
  })
}

export const getBaseData = async id => {
  let url = `https://www.douban.com/people/${id}`
  //获取基础数据
  let res = await getDom(url).then($ => {
    let _data = {}
    ;['movie', 'book', 'friend', 'photo'].forEach(item => {
      _data[item] = Array.from(
        $(`#${item} .pl a`).map((_, item) => getNumFromString($(item).text()))
      )
    })
    _data.friend.push(getNumFromString($('.rev-link a').text()))
    return _data
  })

  return {
    movie: {
      saw: res.movie[2],
      wish: res.movie[1]
    },
    book: { read: res.book[2], wish: res.book[1] },
    photo: res.photo[0],
    friend: { star: res.friend[0], follower: res.friend[1] }
  }
}
/**
 *获取已看电影数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getSawMovieData(pages, id) {
  return flatten(
    await Promise.all(
      pages.map(async item => {
        let url = `https://movie.douban.com/people/${id}/collect?start=${item}&sort=time&rating=all&filter=all&mode=grid`
        return await getDom(url).then($ => {
          let _arr = []
          $('.grid-view .item .info').each((_, item) => {
            _arr.push({
              movie: $(item)
                .find('.title a em')
                .text()
                .split('/')[0]
                .trim(),
              link: $(item)
                .find('.title a')
                .attr('href'),
              date: $(item)
                .find('.date')
                .text(),
              rank: $(item)
                .find('.date')
                .prev()
                .attr('class')
                ? getNumFromString(
                    $(item)
                      .find('.date')
                      .prev()
                      .attr('class')
                  )
                : '',
              comment: $(item)
                .find('.comment')
                .text()
            })
          })
          return _arr
        })
      })
    )
  )
}
/**
 *获取想看电影数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getWishMovieData(pages, id) {
  return flatten(
    await Promise.all(
      pages.map(async item => {
        let url = `https://movie.douban.com/people/${id}/wish?start=${item}&sort=time&rating=all&filter=all&mode=grid`
        return await getDom(url).then($ => {
          let _arr = []
          $('.grid-view .item .info').each((_, item) => {
            _arr.push({
              movie: $(item)
                .find('.title a em')
                .text()
                .split('/')[0]
                .trim(),
              link: $(item)
                .find('.title a')
                .attr('href'),
              date: $(item)
                .find('.date')
                .text()
            })
          })
          return _arr
        })
      })
    )
  )
}
/**
 *
 * 电影数据转excel
 * @param {Number} id
 * @returns
 */
export const movieToExcel = async id => {
  let arrSaw = pagesToArray(store.state.base.movie.saw)
  let arrWish = pagesToArray(store.state.base.movie.wish)
  let resSaw = await getSawMovieData(arrSaw, id)
  let resWish = await getWishMovieData(arrWish, id)
  let workbook = new Excel.Workbook()
  let sheetSaw = workbook.addWorksheet('已看')
  let sheetWish = workbook.addWorksheet('想看')
  sheetSaw.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: '电影名称', key: 'movie', width: 32 },
    { header: '链接', key: 'link', width: 36 },
    { header: '简评', key: 'comment', width: 10 },
    { header: '评分', key: 'rank', width: 10 },
    { header: '日期', key: 'date', width: 10 }
  ]
  sheetSaw.addRows(resSaw)
  sheetWish.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: '电影名称', key: 'movie', width: 32 },
    { header: '链接', key: 'link', width: 36 },
    { header: '日期', key: 'date', width: 10 }
  ]
  sheetWish.addRows(resWish)
  workbook.xlsx.writeFile('movie.xlsx').then(function() {
    console.log('done')
  })
}
