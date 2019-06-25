<template>
  <div class="count-to-wrapper">
    <p class="content-outer">
      <span :id="counterId">{{ init }}</span>
    </p>
  </div>
</template>

<script>
import CountUp from 'countup'
export default {
  name: 'CountTo',
  props: {
    init: {
      type: Number,
      default: 0
    },
    /**
     * @description 起始值，即动画开始前显示的数值
     */
    startVal: {
      type: Number,
      default: 0
    },
    /**
     * @description 结束值，即动画结束后显示的数值
     */
    end: {
      type: Number,
      required: true
    },
    /**
     * @description 保留几位小数
     */
    decimals: {
      type: Number,
      default: 0
    },
    /**
     * @description 分隔整数和小数的符号，默认是小数点
     */
    decimal: {
      type: String,
      default: '.'
    },
    /**
     * @description 动画持续的时间，单位是秒
     */
    duration: {
      type: Number,
      default: 2
    },
    /**
     * @description 动画延迟开始的时间，单位是秒
     */
    delay: {
      type: Number,
      default: 0
    },
    /**
     * @description 是否禁用easing动画效果
     */
    uneasing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      counter: null
    }
  },
  computed: {
    counterId() {
      return `count_to_${this._uid}`
    }
  },
  mounted() {
    this.$nextTick(() => {
      let endVal = this.end
      this.counter = new CountUp(
        this.counterId,
        this.startVal,
        endVal,
        this.decimals,
        this.duration,
        {
          useEasing: !this.uneasing,
          useGrouping: this.useGroup
        }
      )
      setTimeout(() => {
        if (!this.counter.error) this.counter.start()
      }, this.delay)
    })
  },
  watch: {
    end(newVal) {
      let endVal = newVal
      this.counter.update(endVal)
    }
  }
}
</script>

<style lang="less" scoped>
.count-to-wrapper {
  display: flex;
  justify-content: center;
  .content-outer {
    display: inline-block;
    margin: 0;
  }
}
</style>
