// 搜索相关的接口请求
import instance from '../utils/request'
// ---------搜索请求将输入的关键字作为请求参数
export function thinkSearch (q) {
  return instance({
    /* get请求的两种传参方式  url: `/suggestion?q=${q}` */
    url: '/suggestion',
    params: {
      q: q
    }
  })
}
// 用户搜索历史
export function getHistory () {
  return instance({
    url: '/search/histories'
  })
}
// 用户搜索结果
export function getSearchResult ({ page, perpage, q }) {
  return instance({
    url: 'search',
    params: {
      // 不传默认为1
      page: page,
      // 每页数量--不传由后盾接口决定
      per_page: perpage,
      q: q
      // 搜索关键字
    }
  })
}
