/**
 * 从字符串里解析数值
 * @param {String} str
 * @returns {Number}
 */
export const getNumFromString = str => {
  return Number(str.match(/\d+/))
}
/**
 * 从字符串里解析数值
 * @param {String} str
 * @returns {String}
 */
export const getDateFromString = str => {
  return str.match(/(\d+\-\d+\-\d+)/)[0]
}
/**
 *判断是否为数值
 * @param {*} s
 * @returns {Boolean}
 */
function isNum(s) {
  if (s != null && s != '') {
    return !isNaN(s)
  }
  return false
}
/**
 * 根据总数生产豆瓣页码数组
 * 30=》 [0,15]
 * @param {Number} num
 * @param {Number} count
 * @returns {Array}
 */
export const pagesToArray = (num, count) => {
  if (!isNum(num)) return []
  return [...new Array(Math.ceil(num / count)).keys()].map(a => a * count)
}
/**
 * 扁平化数组
 * @param {*} arr
 * @returns {Array}
 */
export const flatten = arr => {
  return arr.reduce(
    (acc, cur) =>
      Array.isArray(cur) ? acc.concat(flatten(cur)) : acc.concat(cur),
    []
  )
}

/**
 *
 * 扁平化Promise.all()返回值
 * @param {Array} arr(异步)
 * @returns
 */
export const flattenPromise = async arr => {
  return flatten(await Promise.all(arr))
}
