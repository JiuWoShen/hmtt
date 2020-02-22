// 所有与文章相关的请求
import instance from '../utils/request'

// 请求当前频道的文章信息
export function getArticle ({ channelId, timestamp }) {
  return instance({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: {
      // 传参----结构赋值
      channel_id: channelId,
      //   时间戳
      timestamp: timestamp,
      //   是否置顶
      with_top: 0
    }
  })
}
// 将文章设置为不喜欢
export function dislikeArt (id) {
  return instance({
    url: '/article/dislikes',
    method: 'POST',
    // 传参格式啊小兄嘚
    data: {
      target: id
    }
  })
}
// 举报文章
export function reportArt ({ id, index }) {
  return instance({
    url: '/article/reports',
    method: 'POST',
    data: {
      target: id,
      type: index
    }
  })
}
// 得到文章详情
export function artDetail (articleId) {
  return instance({
    url: `/articles/${articleId}`
  })
}
