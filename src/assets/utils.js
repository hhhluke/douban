/**
 * 从字符串里解析数值
 * @param {String} str
 * @returns {Number}
 */
export const getNumFromString = str => {
  return Number(str.match(/\d+/))
}
