// 增删查本地数据---------只有查才需要返回数据，增删都只要设置就OK
export function setLocal (key, value) {
  // 将传过来的值转换为Json字符串后再进行存储
  window.localStorage.setItem(key, JSON.stringify(value))
}
// 查
export function getLocal (key) {
  // 将传过来的值转换为 对象 后再 返回给用户
  return JSON.parse(window.localStorage.getItem(key))
}
// 删
export function removeLocal (key) {
  window.localStorage.removeItem(key)
}
