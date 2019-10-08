import { pagesToArray, getDateFromString, mapLimit } from './utils'
import store from '../store'
import { getDom } from './crawler'
const COUNT_15 = 15
const SAW_COLUMN = [
  { header: 'Id', key: 'id', width: 16 },
  { header: '书名', key: 'book', width: 32 },
  { header: '作者', key: 'author', width: 16 },
  { header: '译者', key: 'translator', width: 16 },
  { header: '链接', key: 'link', width: 46 },
  { header: '简评', key: 'comment', width: 10 },
  { header: '日期', key: 'date', width: 10 }
]
const WISH_COLUMN = [
  { header: 'Id', key: 'id', width: 10 },
  { header: '书名', key: 'book', width: 32 },
  { header: '作者', key: 'author', width: 16 },
  { header: '译者', key: 'translator', width: 16 },
  { header: '链接', key: 'link', width: 46 },
  { header: '日期', key: 'date', width: 10 }
]
/**
 *获取已看图书数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getSawBook(id) {
  let pages = pagesToArray(store.state.base.book.collect, COUNT_15)
  return await mapLimit(pages, async (page, callback) => {
    let url = `https://book.douban.com/people/${id}/collect?start=${page}&sort=time&rating=all&filter=all&mode=grid`
    getDom(url).then($ => {
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
      callback(null, _arr)
    })
  })
}
/**
 *获取想看图书数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getWishBook(id) {
  let pages = pagesToArray(store.state.base.book.wish, COUNT_15)
  return await mapLimit(pages, async (page, callback) => {
    let url = `https://book.douban.com/people/${id}/wish?start=${page}&sort=time&rating=all&filter=all&mode=grid`
    getDom(url).then($ => {
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
      callback(null, _arr)
    })
  })
}

/**
 * @param {Number} id
 * @returns {Array}
 */
export const getBooks = async id => {
  return [await getSawBook(id), await getWishBook(id)]
}
/**
 * 电影数据写入excel
 * @param {Number} id
 * @param {*} workbook
 */
export const bookToExcel = async (id, workbook) => {
  let [saw, wish] = await getBooks(id)
  let sheetSaw = workbook.addWorksheet('图书-已看'),
    sheetWish = workbook.addWorksheet('图书-想看')
  sheetSaw.columns = SAW_COLUMN
  sheetWish.columns = WISH_COLUMN

  sheetSaw.addRows(saw)
  sheetWish.addRows(wish)
}
