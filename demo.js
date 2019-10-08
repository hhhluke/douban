/**
 * @param {String} s
 * @param {String} t
 * @returns {Boolean}
 */
function isSame(s, t) {
  if (s.length !== t.length) return false
  let _obj = {}
  for (let i = 0; i < s.length; i++) {
    _obj[s.slice(i, i + 1)] = t.slice(i, i + 1)
  }
  for (let i = 0; i < s.length; i++) {
    s = s.replace(s[i], _obj[s.slice(i, i + 1)])
  }
  return s === t ? true : false
}


class Pubsub() {
    constructor() {
        this.deps = {}
    }
    on(e,fn) {
        this.deps[e] = fn
    }
    off(e,fn) {
        this.deps[e] = null
        fn && fn()
    }
    emit(e) {
        this.deps[e] && this.deps[e]()
    }
}

