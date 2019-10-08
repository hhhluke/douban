import { pagesToArray, getNumFromString, mapLimit } from './utils'
import store from '../store'
import { getDom } from './crawler'
const COUNT_15 = 15
const SAW_COLUMN = [
  { header: 'Id', key: 'id', width: 10 },
  { header: '电影名称', key: 'movie', width: 30 },
  { header: '链接', key: 'link', width: 46 },
  { header: '简评', key: 'comment', width: 20 },
  { header: '评分', key: 'rank', width: 10 },
  { header: '日期', key: 'date', width: 10 }
]
const WISH_COLUMN = [
  { header: 'Id', key: 'id', width: 10 },
  { header: '电影名称', key: 'movie', width: 30 },
  { header: '链接', key: 'link', width: 46 },
  { header: '日期', key: 'date', width: 10 }
]
/**
 *获取已看电影数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getSawMovie(id) {
  let pages = pagesToArray(store.state.base.movie.collect, COUNT_15)
  return await mapLimit(pages, async (page, callback) => {
    let url = `https://movie.douban.com/people/${id}/collect?start=${page}&sort=time&rating=all&filter=all&mode=grid`
    getDom(url).then($ => {
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
      callback(null, _arr)
    })
  })
}
/**
 *获取想看电影数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getWishMovie(id) {
  let pages = pagesToArray(store.state.base.movie.wish, COUNT_15)
  return await mapLimit(pages, async (page, callback) => {
    let url = `https://movie.douban.com/people/${id}/wish?start=${page}&sort=time&rating=all&filter=all&mode=grid`
    getDom(url).then($ => {
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
      callback(null, _arr)
    })
  })
}

/**
 * @param {Number} id
 * @returns {Array}
 */
export const getMovies = async id => {
  return [await getSawMovie(id), await getWishMovie(id)]
}

/**
 * 电影数据写入excel
 * @param {Number} id
 * @param {*} workbook
 */
export const movieToExcel = async (id, workbook) => {
  let [saw, wish] = await getMovies(id)
  let sheetSaw = workbook.addWorksheet('电影-已看'),
    sheetWish = workbook.addWorksheet('电影-想看')
  sheetSaw.columns = SAW_COLUMN
  sheetWish.columns = WISH_COLUMN

  sheetSaw.addRows(saw)
  sheetWish.addRows(wish)
}
