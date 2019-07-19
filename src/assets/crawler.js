const superagent = require('superagent')
const cheerio = require('cheerio')
const Excel = require('exceljs')
const fs = require('fs')
const COUNT_15 = 15
const COUNT_20 = 20
let db_id = ''
let db_cookis = ''
const { ipcRenderer } = require('electron')
export function log() {
  ipcRenderer.send('douban', 'ping')
  ipcRenderer.on('reply', res => {
    console.log('reply', res)
  })
  ipcRenderer.on('douban-log', (event, arg) => {
    console.log('douban-log', event, arg) // prints "pong"
  })
  ipcRenderer.on('cookie', (event, arg) => {
    console.log('cookie', event, arg) // prints "pong"
  })
  ipcRenderer.on('cookie1', (event, arg) => {
    console.log('cookie1', event, arg) // prints "pong"
  })
  ipcRenderer.on('db-cookie', (e, arg) => {
    console.log('db-cookie', e, arg)
    db_cookis = arg
  })
  ipcRenderer.on('db-id', (e, arg) => {
    console.log('db-id', e, arg)
    db_id = arg
  })
}
import {
  flattenPromise,
  getNumFromString,
  pagesToArray,
  flatten,
  getDateFromString
} from './utils'
import { bookToExcel } from './book'
import { getMovies, movieToExcel } from './movie'
import { musicToExcel } from './music'
import { getImgs } from './image'
import store from '../store'

/**
 *
 * 通过url获取dom
 * @param {String} url
 * @returns {$}
 */
export function getDom(url) {
  return new Promise((resolve, rej) => {
    superagent
      .get(url)
      .set('Cookie', db_cookis)
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
    let _data = {
      movie: {},
      book: {},
      game: {},
      music: {},
      photo: 0,
      friend: {}
    }
    ;['movie', 'book', 'music', 'game'].forEach(item => {
      $(`#${item} .pl a`).each((_, a) => {
        let _src = $(a).attr('href'),
          _num = getNumFromString($(a).text())
        if (_src.includes('wish')) _data[item]['wish'] = _num
        if (_src.includes('collect')) _data[item]['collect'] = _num
      })
    })
    _data.photo = getNumFromString($($(`#photo h2 .pl a`).get(0)).text())
    _data.friend.star = getNumFromString($(`#friend .pl a`).text())
    _data.friend.follower = getNumFromString($('.rev-link a').text())
    return _data
  })
  return res
}

/**
 * 获取关注列表
 * @param {Number} id
 */
export async function getStar() {
  let pages = pagesToArray(store.state.base.friend.star, COUNT_20)
  return flattenPromise(
    pages.map(async item => {
      let url = `https://www.douban.com/contacts/list?tag=0&start=${item}`
      return await getDom(url).then($ => {
        let _arr = []
        $('li.clearfix').each((_, item) => {
          _arr.push({
            name: $(item)
              .find('.info h3 a')
              .text(),
            link: $(item)
              .find('.info h3 a')
              .attr('href'),
            address: $(item)
              .find('.info p .loc')
              .text()
              .replace('常居：', ''),
            signature: $(item)
              .find('.info p .signature')
              .text()
              .replace('签名：', '')
          })
        })
        return _arr
      })
    })
  )
}

/**
 * 获取被关注列表
 * @param {Number} id
 */
async function getFollower() {
  let pages = pagesToArray(store.state.base.friend.follower, COUNT_20)
  return flattenPromise(
    pages.map(async item => {
      let url = `https://www.douban.com/contacts/rlist?start=${item}`
      return await getDom(url).then($ => {
        let _arr = []
        $('li.clearfix .info h3 a:first-child').each((_, item) => {
          _arr.push({
            name: $(item).text(),
            link: $(item).attr('href')
          })
        })
        return _arr
      })
    })
  )
}

/**
 * 简单备份(书影音照片)
 * @param {Number/String} id
 * @returns
 */
export const backup = async id => {
  let workbook = new Excel.Workbook()
  await movieToExcel(id, workbook)
  await bookToExcel(id, workbook)
  await musicToExcel(id, workbook)
  await getImgs(id)
  return await workbook.xlsx
    .writeFile(`douban${id}.xlsx`)
    .then(function() {
      return true
    })
    .catch(_ => {
      return false
    })
}
