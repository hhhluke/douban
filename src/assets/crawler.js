const superagent = require('superagent')
const cheerio = require('cheerio')
import { getNumFromString } from './utils'
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

// function setSawData() {
//   let sawData = []
//   return new Promise((resolve, rej) => {
//     superagent
//       .get(url)
//       .set('Access-Control-Allow-Origin', '*')
//       .withCredentials()
//       .end((err, res) => {
//         //页面dom在text里
//         let $ = cheerio.load(res.text)
//         $('.grid-view .item .info').each((_, item) => {
//           sawData.push({
//             movie: $(item)
//               .find('.title a em')
//               .text(),
//             link: $(item)
//               .find('.title a')
//               .attr('href'),
//             date: $(item)
//               .find('.date')
//               .text(),
//             rank: $(item)
//               .find('.date')
//               .prev()
//               .attr('class')
//               .match(/\d+/),
//             comment: $(item)
//               .find('.comment')
//               .text()
//           })
//         })
//         resolve(sawData)
//         if (err) rej(err)
//       })
//   })
// }
// export const getSawList = id => {
//   const url = `https://movie.douban.com/people/${id}/collect?start=0&sort=time&rating=all&filter=all&mode=grid`
//   let data = []
// }
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
      want: res.movie[1]
    },
    book: { read: res.book[2], want: res.book[1] },
    photo: res.photo[0],
    friend: { star: res.friend[0], follower: res.friend[1] }
  }
}

export const movieToExcel = async id => {
  let pages = Math.ceil(store.state.base.movie)
  let arr = [...new Array(pages).keys()].map(a => a * 15)
  Promise.all(arr.map(item=>{
    await getDom(url).then($ => {
      let url = `https://movie.douban.com/people/${id}/collect?start=${item}&sort=time&rating=all&filter=all&mode=grid`

    })
  }))
  console.log(arr)
  let res = await getDom(url).then($ => {})
}
