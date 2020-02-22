import Vue from 'vue'
import Vuex from 'vuex'
import { setLocal, getLocal } from '../utils/mylocal'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储用户登录信息------每次打开页面从本地取数据-----首次登录为空也可
    user: getLocal('userInfo') || {}
  },
  mutations: {
    // 函数设置state数据-----在设置state的同时设置本地数据-------返回对象有几个就设置几个
    setUser (state, value) {
      state.user = value
      // 调用方法设置本地数据
      setLocal('userInfo', value)
    }
  },
  actions: {
  },
  modules: {
  }
})
