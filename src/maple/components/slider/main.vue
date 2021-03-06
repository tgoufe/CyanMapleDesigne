<template>
  <div
    v-if="visible"
    class="cmui-slider"
  >
    <div
      :id="id"
      ref="swiper-container"
      class="swiper-container"
      :style="containerStyle"
    >
      <div class="swiper-wrapper">
        <!-- <div class="swiper-slider-prepend"></div> todo-->
        <slot />
        <!-- <div class="swiper-slider-append"></div> todo-->
      </div>
      <!-- Add Arrows -->
      <div
        v-if="nav"
        class="swiper-button-next"
      />
      <div
        v-if="nav"
        class="swiper-button-prev"
      />
      <!-- Add pagination -->
      <div class="swiper-pagination" />
      <!-- Add scrollbar -->
      <div class="swiper-scrollbar" />
    </div>
  </div>
</template>

<style lang="scss" type="text/scss">

.swiper-scrollbar:empty {
  display: none;
}
</style>
<script type="text/javascript">
import Swiper from 'swiper'
import themeList from './themeList.json'
import _ from 'lodash'
import sliderList from './sliderList'
function optionsMaker (options, themeName) {
  let themeOptions = _.get(themeList, themeName)
  let propOptions = {}
  // set slidesPerView as col
  if (this.col === 0) {
    propOptions.slidesPerView = 'auto'
  } else {
    propOptions.slidesPerView = this.col
  }
  // set scrollbar
  if (this.scrollbar) {
    propOptions.scrollbar = {
      el: '.swiper-scrollbar'
    }
  }
  // set pagination as page
  if (this.page) {
    let tempOption = {
      el: '.swiper-pagination'
    }
    if (_.isString(this.page)) {
      if (this.page === 'progress') {
        tempOption.type = 'progressbar'
      } else if (this.page === 'number') {
        tempOption.type = 'fraction'
      }
    } else if (_.isNumber(this.page)) {
      tempOption.dynamicBullets = true
      tempOption.dynamicMainBullets = parseInt(this.page) || 1
    }
    _.set(propOptions, 'pagination', tempOption)
  }
  // set navigation as nav
  if (this.nav) {
    _.set(propOptions, 'navigation', {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    })
  }
  // set spaceBetween as space
  if (this.space) {
    propOptions.spaceBetween = this.space
  }
  // 提取常用属性方便使用
  ['loop', 'autoplay', 'direction', 'freeMode'].forEach(item => {
    propOptions[item] = this[item]
  })
  let rsOptions = _.defaultsDeep(options, propOptions, themeOptions)
  if (rsOptions.slidesPerView === 'auto') {
    let pos = rsOptions.direction === 'vertical' ? 'height' : 'width'
    this.$children.forEach(item => {
      item.$el.style[pos] = item.$el.style[pos] || 'auto'
    })
  }
  return rsOptions
}
const DEFAULT_EVENTS = [
  'beforeDestroy',
  'slideChange',
  'slideChangeTransitionStart',
  'slideChangeTransitionEnd',
  'slideNextTransitionStart',
  'slideNextTransitionEnd',
  'slidePrevTransitionStart',
  'slidePrevTransitionEnd',
  'transitionStart',
  'transitionEnd',
  'touchStart',
  'touchMove',
  'touchMoveOpposite',
  'sliderMove',
  'touchEnd',
  'click',
  'tap',
  'doubleTap',
  'imagesReady',
  'progress',
  'reachBeginning',
  'reachEnd',
  'fromEdge',
  'setTranslate',
  'setTransition',
  'resize'
]
let sliderObserve = new (class {
  constructor() {
    this.controlList = {}
    this.refList = []
    this.subscribeList = []
  }
  observeControl (vm) {
    let controlName = vm.control
    if (controlName && _.isString(controlName)) {
      this.refList.forEach(item => {
        if (item.name === controlName) {
          this.bindControl(vm.swiper, item.vm.swiper)
        }
      })
      this.controlList[controlName] = vm.swiper
      this.subscribeList.push((swiper, ref) => {
        if (this.controlList[ref]) {
          this.bindControl(this.controlList[ref], swiper)
        }
      })
    }
    let refName = _.get(vm, '$vnode.data.ref')
    if (refName) {
      this.refList.push({ vm, name: refName })
      this.publish(vm.swiper, refName)
    }
  }
  bindControl (controlSwiper, targetSwiper) {
    targetSwiper.controller.control = controlSwiper
  }
  publish (swiper, refName) {
    this.subscribeList.forEach(item => item(swiper, refName))
  }
})()
export default {
  name: 'cmui-slider',
  props: {
    id: { type: String, default: _.uniqueId('cmui-slider_'), intro: '默认ID' },
    watch: { type: [Object, Array], default: () => ({}), intro: '要监控的对象，当对象改变时slider将重新渲染' },
    theme: { type: Number, default: 0, intro: '' },
    options: { type: Object, default: null, intro: 'Swiper初始化传递的选项详见官方文档' },
    loop: { type: Boolean, default: false, intro: '是否循环播放' },
    autoplay: { type: Boolean, default: false, intro: '是否自动播放' },
    col: { type: Number, default: 1, intro: '列数' },
    page: { type: [Boolean, String, Number], default: false, intro: '是否显示page' },
    direction: { type: String, default: 'horizontal', intro: '水平轮播还是垂直轮播' },
    height: { type: String, default: '', intro: '固定轮播的高度' },
    nav: { type: Boolean, default: false, intro: '是否显示左右箭头' },
    space: { type: Number, default: 0, intro: '两个item之间的距离' },
    freeMode: { type: Boolean, default: false, intro: '是否使用自由模式' },
    scrollbar: { type: Boolean, default: false, intro: '是否显示滚动条' },
    control: { type: String, default: '', intro: '控制器对应的ref' }
  },
  data: function () {
    return {
      visible: true
    }
  },
  computed: {
    containerStyle () {
      let rs = {}
      if (this.height) {
        rs.height = this.height
      }
      return rs
    }
  },
  watch: {
    watch: {
      immediate: false,
      handler (newValue, oldValue) {
        if (this.loop) {
          _.differenceWith(newValue, oldValue, _.isEqual).length &&
            this.resetSwiper()
        } else {
          !_.isEqual(newValue, oldValue) && this.resetSwiper()
        }
      }
    },
    options: {
      deep: true,
      handler (newOptions, oldOptions) {
        if (!_.isEqual(newOptions, oldOptions)) {
          this.resetSwiper()
        }
      }
    }
  },
  mounted () {
    this.resetSwiper()
  },

  methods: {
    destroy () {
      this.swiper && this.swiper.destroy(true, false)
      this.visible = false
    },
    resetSwiper () {
      this.$nextTick(() => {
        let hasInit = !!this.swiper
        if (hasInit) {
          this.swiper.destroy(false, false)
        } else {
          this.swiperIndex = sliderList.length
        }
        _.delay(() => {
          this.swiper = new Swiper(
            this.$refs['swiper-container'],
            optionsMaker.call(this, this.options),
            this.theme
          )
          sliderObserve.observeControl(this)
          if (hasInit) {
            sliderList[this.swiperIndex] = this.swiper
          } else {
            sliderList.add(this.swiper)
          }
          this.bindEvents()
          this.$emit('rendered', this)
        }, 0)
      })
    },
    update () {
      if (this.swiper) {
        this.swiper.update && this.swiper.update()
        this.swiper.navigation && this.swiper.navigation.update()
        this.swiper.pagination && this.swiper.pagination.render()
        this.swiper.pagination && this.swiper.pagination.update()
      }
    },
    bindEvents () {
      let vm = this
      DEFAULT_EVENTS.forEach(eventName => {
        this.swiper.on(eventName, function (...args) {
          vm.$emit(eventName, ...args, vm.swiper)
          vm.$emit(
            eventName.replace(/([A-Z])/g, '-$1').toLowerCase(),
            ...args,
            vm.swiper
          )
        })
      })
    }
  }
}
</script>
