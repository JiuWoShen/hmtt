// 封装axios及设置请求响应拦截
import axios from 'axios'
// 导入仓库数据
import store from '../store/index'
// 导入jsonbigint
import jsonbig from 'json-bigint'
// 实例化
const instance = axios.create({
  // 设置基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/', // 项目基地址
  // 得到服务器返回的原始数据
  transformResponse: [function (data) {
    try {
      // JSON.parse 其实是 axios 内部的默认处理方式
      return jsonbig.parse(data)
    } catch (error) {
      return JSON.parse(data)// 转换失败---按照默认的方式处理数据
    }
  }]
})

// 再创建一个请求用来在相应拦截器中发送刷新token的请求
const instance2 = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/' // 项目基地址
})

// 请求拦截器
instance.interceptors.request.use(function (config) {
  // 请求拦截器中判断用户是否登录----用户信息是否包含token
  if (store.state.user.token) {
    // 用户有登录--便设置请求头
    // 在请求头中设置token以获取登录用户操作过的频道信息
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应拦截器
instance.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  // error中的 config 保存了所有的请求信息
  // window.console.dir(error)

  // token过期的错误状态码为 401
  if (error.response.status === 401) {
    // 得到refresh_token
    let refreshToken = store.state.user.refresh_token
    // 将数据提交到服务器----生成新的token
    let res = await instance2({
      url: 'authorizations',
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    })
    // window.console.log(res)-----res.data.data.token 里就保存着刷新后的token
    // 将token设置给user
    store.state.user.token = res.data.data.token
    // 重新设置store
    store.commit('setUser', store.state.user)
    // 重新携带新的token发送请求获取数据
    return instance(error.config)
  }
  return Promise.reject(error)
})
// 暴露instance
export default instance
