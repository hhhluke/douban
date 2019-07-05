import { flattenPromise, pagesToArray, getDateFromString } from './utils'
import store from '../store'
import { getDom } from './crawler'
const COUNT_15 = 15

/**
 *获取已看图书数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getSawBook(id) {
  let pages = pagesToArray(store.state.base.book.read, COUNT_15)
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
  let pages = pagesToArray(store.state.base.book.wish, COUNT_15)
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
 * @param {Number} id
 * @returns {Array}
 */
export const getBooks = async id => {
  let saw = await getSawBook(id),
    wish = await getWishBook(id)
  return [saw, wish]
}
