// 封装登录验证的插件
// 导入store
import store from '../store/index'
import router from '../router/router'
// 1.声明插件对象
let myPlugin = {}
// 2.给对象添加一个install方法----方法的第一个参数是 Vue
myPlugin.install = function (Vue) {
  // 给 Vue 添加一个实例方法
  Vue.prototype.$login = function () {
    // 进行登录验证
    if (!store.state.user.token) {
      router.push('/checkLogin')
      return false
    }
    return true
  }
}
// 3.暴露插件对象
export default myPlugin
// 4.在  main.js  中  导入  并且  use 一下即可
