const superagent = require('superagent')
const cheerio = require('cheerio')
const Excel = require('exceljs')
const http = require('http')

const { ipcRenderer } = require('electron')
export function log() {
  ipcRenderer.send('douban', 'ping')
  ipcRenderer.on('reply', res => {
    console.log('header', res)
  })
  ipcRenderer.on('douban-log', (event, arg) => {
    console.log('客户端', event, arg) // prints "pong"
  })
}
import {
  flattenPromise,
  getNumFromString,
  pagesToArray,
  flatten,
  getDateFromString
} from './utils'
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
async function getSawMovie(id) {
  let pages = pagesToArray(store.state.base.movie.saw)
  return flattenPromise(
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
}
/**
 *获取想看电影数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getWishMovie(id) {
  let pages = pagesToArray(store.state.base.movie.wish)
  return flattenPromise(
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
}

/**
 *获取已看图书数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getSawBook(id) {
  let pages = pagesToArray(store.state.base.book.read)
  return flattenPromise(
    pages.map(async item => {
      let url = `https://book.douban.com/people/${id}/collect?start=${item}&sort=time&rating=all&filter=all&mode=grid`
      return await getDom(url).then($ => {
        let _arr = []
        $('.subject-item .info').each((_, item) => {
          let _data = $(item)
            .find('.pub')
            .text()
            .split('/')
            .map(item => item.trim())
          _arr.push({
            book: $(item)
              .find('h2 a')
              .attr('title'),
            author: _data[0],
            translator: _data[1],
            link: $(item)
              .find('h2 a')
              .attr('href'),
            comment: $(item)
              .find('.comment')
              .text()
              .trim(),
            date: getDateFromString(
              $(item)
                .find('.date')
                .text()
            )
          })
        })
        return _arr
      })
    })
  )
}
/**
 *获取想看图书数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getWishBook(id) {
  let pages = pagesToArray(store.state.base.book.wish)
  return flattenPromise(
    pages.map(async item => {
      let url = `https://book.douban.com/people/${id}/wish?start=${item}&sort=time&rating=all&filter=all&mode=grid`
      return await getDom(url).then($ => {
        let _arr = []
        $('.subject-item .info').each((_, item) => {
          let _data = $(item)
            .find('.pub')
            .text()
            .split('/')
            .map(item => item.trim())
          _arr.push({
            book: $(item)
              .find('h2 a')
              .attr('title'),
            author: _data[0],
            translator: _data[1],
            link: $(item)
              .find('h2 a')
              .attr('href'),
            date: getDateFromString(
              $(item)
                .find('.date')
                .text()
            )
          })
        })
        return _arr
      })
    })
  )
}

/**
 * 获取关注列表
 * @param {Number} id
 */
export async function getStar(id) {
  let url = 'https://accounts.douban.com/login'
  http.get('https://www.douban.com/service/auth2/auth')
  // `https://www.douban.com/people/${id}/statuses`
  // return await getDom(url).then($ => {
  //   let _arr = []
  //   $('.obu').each((_, item) => {
  //     _arr.push({
  //       name: $(item)
  //         .find('dd a')
  //         .text(),
  //       link: $(item)
  //         .find('dd a')
  //         .attr('href'),
  //       avatar: $(item)
  //         .find('dt a img')
  //         .attr('src')
  //     })
  //   })
  //   console.log(_arr)
  //   return _arr
  // })
}

/**
 * 获取被关注列表
 * @param {Number} id
 */
async function getFollower(id) {
  let pages = pagesToArray(store.state.base.friend.follower)
  return flattenPromise(
    pages.map(async item => {
      let url = `https://www.douban.com/people/${id}/contacts`
      return await getDom(url).then($ => {
        let _arr = []
        $('.subject-item .info').each((_, item) => {
          _arr.push({})
        })
        return _arr
      })
    })
  )
}
/**
 *
 * 电影数据转excel
 * @param {Number} id
 * @returns {Excel}
 */
export const movieToExcel = async id => {
  let resSawMovie = await getSawMovie(id),
    resWishMovie = await getWishMovie(id),
    resSawBook = await getSawBook(id),
    resWishBook = await getWishBook(id)

  let workbook = new Excel.Workbook()
  let sheetSawMovie = workbook.addWorksheet('电影-已看'),
    sheetWishMovie = workbook.addWorksheet('电影-想看'),
    sheetSawBook = workbook.addWorksheet('图书-已读'),
    sheetWishBook = workbook.addWorksheet('图书-想读')
  sheetSawMovie.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: '电影名称', key: 'movie', width: 30 },
    { header: '链接', key: 'link', width: 46 },
    { header: '简评', key: 'comment', width: 20 },
    { header: '评分', key: 'rank', width: 10 },
    { header: '日期', key: 'date', width: 10 }
  ]
  sheetWishMovie.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: '电影名称', key: 'movie', width: 30 },
    { header: '链接', key: 'link', width: 46 },
    { header: '日期', key: 'date', width: 10 }
  ]
  sheetSawBook.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: '书名', key: 'book', width: 32 },
    { header: '作者', key: 'author', width: 16 },
    { header: '译者', key: 'translator', width: 16 },
    { header: '链接', key: 'link', width: 46 },
    { header: '简评', key: 'comment', width: 10 },
    { header: '日期', key: 'date', width: 10 }
  ]
  sheetWishBook.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: '书名', key: 'book', width: 32 },
    { header: '作者', key: 'author', width: 16 },
    { header: '译者', key: 'translator', width: 16 },
    { header: '链接', key: 'link', width: 46 },
    { header: '日期', key: 'date', width: 10 }
  ]

  sheetSawMovie.addRows(resSawMovie)
  sheetWishMovie.addRows(resWishMovie)
  sheetSawBook.addRows(resSawBook)
  sheetWishBook.addRows(resWishBook)

  return await workbook.xlsx
    .writeFile('movie.xlsx')
    .then(function() {
      return true
    })
    .catch(e => {
      return false
    })
}
