import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
// 导入vant-----及图片懒加载
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
// 导入字体图标
import './style/myicon.css'

// 导入全局时间过滤器
import './filters/timefilters'
// 导入自己封装的登录验证插件
import myplugin from './plugin/myplugin'

// vant图片懒加载
Vue.use(Lazyload)

Vue.use(Vant)

// use 一下自己的登录验证插件
Vue.use(myplugin)

// 封装登录验证的全局方法---$login只是一个命名而已
// Vue.prototype.$login = function () {
//   // 这里的this是原型的构造函数------而上面已经导入了store的文件-----在这里便可以直接使用
//   if (!store.state.user.token) {
//     router.push('/login')
//     return false
//   }
//   return true
// }

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
