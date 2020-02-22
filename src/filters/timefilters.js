// 封装一个全局时间过滤器
import Vue from 'vue'
// 导入dayjs------使用时间间隔需要使用dayjs的插件
import dayjs from 'dayjs'
// 相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文包
import 'dayjs/locale/zh-cn'
// 全局使用简体中文
dayjs.locale('zh-cn')
// 扩展插件
dayjs.extend(relativeTime)

Vue.filter('timefilter', function (time) {
  return dayjs().from(dayjs(time))
})
