//1
for (var i = 0; i < 5; i++) {
  ;(function(i) {
    setTimeout(() => {
      console.log(i + 1)
    }, 1000 * i)
  })(i)
}

/**
 * 2
 * @param {Array} arr
 * @param {Number} sum
 * @returns {Boolean}
 */
function twoSum(arr, sum) {
  if (arr.length === 0) return false
  let left = 0,
    right = arr.length - 1
  while (left < right) {
    if (arr[left] + arr[right] > sum) {
      right--
    } else if (arr[left] + arr[right] < sum) {
      left++
    } else {
      return true
    }
  }
  return false
}

//3
3
5
7
8
4
6
2
1
/**
 * setTimeout属于宏任务，所以1，2因为异步被塞到宏任务队列中
 * Promise.resolve是同步执行的，所以先输出3
 * then里的内容属于微任务，4进入微任务队列
 * async function内部同步执行，输出5
 * await会同步等到异步任务执行结束，所以输出7，6被塞到微任务队列中
 * 同步输出8
 * 同步任务结束，开始执行微任务队列，依次输出队列中4，6
 * 微任务队列结束，开始执行宏任务队列，输出2，1
 */

/**
 *
 * @class Toucher
 */
class Toucher {
  constructor(element) {
    this.el = element
  }
  on(e, fn) {
    if (e === 'swipe') this.swipe(fn)
  }
  swipe(fn) {
    let sTouch, eTouch
    this.el.addEventListener(
      'touchstart',
      e => {
        sTouch = eTouch = e.targetTouches[0]
      },
      false
    )

    this.el.addEventListener(
      'touchend',
      e => {
        eTouch = e.changedTouches[0]
        let direction = []
        direction[0] = eTouch.pageX - sTouch.pageX > 0 ? 'right' : 'left'
        direction[1] = eTouch.pageY - sTouch.pageY > 0 ? 'down' : 'up'
        fn && fn({ direction: direction })
      },
      false
    )
  }
}

//5
class EventEmitter {
  constructor() {
    this.deps = {}
    this.onceDeps = {}
  }
  on(key, fn) {
    this.deps[key] = fn
  }
  off(key) {
    if (key) {
      this.deps[key] = null
    } else {
      this.deps = null //若参数为空，移除所有监听事件
    }
  }
  once(key, fn) {
    this.onceDeps[key] = { fn: fn, tag: true }
  }
  fire(key, argu) {
    let fn = this.deps[key],
      onceFn = this.onceDeps[key]
    //若为多次执行事件，存在则执行
    if (fn) fn(argu)
    //单次执行事件，tag为true则执行，执行完将tag改为false
    if (onceFn && onceFn.tag) {
      onceFn.fn(argu)
      onceFn.tag = false
    }
  }
}

function flat(arr) {
  return arr.reduce(
    (acc, cur) =>
      Array.isArray(cur) ? acc.concat(flat(cur)) : acc.concat(cur),
    []
  )
}
