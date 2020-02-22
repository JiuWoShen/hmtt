import instance from '../utils/request'
export function userLogin ({ phone, code }) {
  return instance({
    url: '/authorizations',
    method: 'post',
    data: {
      // 这里传参名得看接口啊，兄嘚
      mobile: phone,
      code: code
    }
  })
}
// 关注用户
export function followUser (autId) {
  return instance({
    url: '/user/followings',
    method: 'POST',
    data: {
      target: autId
    }
  })
}
// 取关用户
export function disFollow (autId) {
  return instance({
    url: `/user/followings/${autId}`,
    method: 'DELETE'
  })
}
