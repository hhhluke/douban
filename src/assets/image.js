const fs = require('fs')
const request = require('request')
import store from '../store'
//本地存储目录
const DIR = './db_images'
const COUNT_18 = 18
import { flattenPromise, pagesToArray, mapLimit } from './utils'
import { getDom } from './crawler'

/**
 *下载一个相册的图片
 * @param {Array} urls
 * @param {String} name
 * @returns
 */
async function download(urls, name) {
  urls.map((url, index) => {
    fs.mkdirSync(`${DIR}/${name}`, {
      recursive: true
    })
    request.get(url).pipe(fs.createWriteStream(`${DIR}/${name}/${index}.jpg`))
  })
}

/**
 * 获取个人相册基本数据
 * @param {Number} id
 * @returns {Array}
 */
async function getAlbumList(id) {
  if (store.state.base.photo > 0) {
    let pages = pagesToArray(store.state.base.photo, COUNT_18)
    return await mapLimit(pages, async (page, callback) => {
      let url = `https://www.douban.com/people/${id}/photos?start=${page}`
      getDom(url).then($ => {
        let _arr = []
        $('.albumlst').each((_, item) => {
          _arr.push({
            name: $(item)
              .find('.pl2 a')
              .text(),
            url: $(item)
              .find('.album_photo')
              .attr('href'),
            sum: Number(
              $(item)
                .find('.pl')
                .text()
                .split('张')[0]
                .trim()
            )
          })
        })
        callback(null, _arr)
      })
    })
  }
}

/**
 * 根据所有相册数据并下载
 * @param {Array} albums
 * @returns
 */
async function getImagesByAlbums(albums) {
  return mapLimit(albums, async (album, callback) => {
    let images = await getImagesByAlbum(album)
    let arr = await getBigImagesByAlbum(images)
    callback(null, arr)
    download(arr, album.name)
  })
}

/**
 * 获取一个相册所有照片详情地址
 * @param {Object} obj
 * @returns {Array}
 */
async function getImagesByAlbum(obj) {
  let { url, sum } = obj
  let pages = pagesToArray(sum, COUNT_18)
  return mapLimit(pages, async (page, callback) => {
    let _url = `${url}?m_start=${page}`
    getDom(_url).then($ => {
      let _arr = []
      $('.photo_wrap a').each(async (_, item) => {
        _arr.push($(item).attr('href'))
      })
      callback(null, _arr)
    })
  })
}

/**
 * 获取一个相册所有照片大图地址
 * @param {Array} urls
 * @returns {Array}
 */
async function getBigImagesByAlbum(urls) {
  return mapLimit(urls, async (page, callback) => {
    getDom(page).then($ => {
      callback(null, $('.image-show .image-show-inner img').attr('src'))
    })
  })
}

/**
 * 入口函数
 */
export async function getImgs(id) {
  let albums = await getAlbumList(id)
  await getImagesByAlbums(albums)
}
