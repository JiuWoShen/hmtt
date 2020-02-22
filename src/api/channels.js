// 处理所有与频道相关的请求
import instance from '../utils/request'
// 获取用户频道
export function getUserChannels () {
  return instance({
    url: '/user/channels'
  })
}
// 所有频道信息
export function getAllChannels () {
  return instance({
    url: '/channels'
  })
}
// 重置频道信息
export function resetUserChannels (channel) {
  return instance({
    url: '/user/channels',
    method: 'PUT',
    data: {
      channels: channel
    }
  })
}
