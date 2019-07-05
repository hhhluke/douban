import { flattenPromise, pagesToArray, getNumFromString } from './utils'
import store from '../store'
import { getDom } from './crawler'
const COUNT_15 = 15
/**
 *获取已看电影数据
 * @param {String} url
 * @param {Number} id
 * @returns {Array}
 */
async function getSawMovie(id) {
  let pages = pagesToArray(store.state.base.movie.saw, COUNT_15)
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
  let pages = pagesToArray(store.state.base.movie.wish, COUNT_15)
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
 * @param {Number} id
 * @returns {Array}
 */
export const getMovies = async id => {
  let saw = await getSawMovie(id),
    wish = await getWishMovie(id)
  return [saw, wish]
}
