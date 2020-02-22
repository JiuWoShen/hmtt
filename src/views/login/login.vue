<template>
  <div class="login">
    <van-nav-bar class="lgin_nav" title="登录"/>
    <van-cell-group>
      <van-field v-model="userInfo.phone" placeholder="请输入手机号" :error-message="error_message.error_phone" left-icon>
        <!-- 插槽语法 -->
        <template slot="left-icon">
          <i class="myicon iconfont icon-ipad"></i>
        </template>
      </van-field>
      <van-field v-model="userInfo.code" placeholder="请输入验证码" :error-message="error_message.error_code" left-icon>
        <template slot="left-icon">
          <i class="myicon iconfont icon-password"></i>
        </template>
        <van-button class="capBtn" slot="button" color="rgb(237, 237, 237)" round size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="loginBtn">
      <van-button type="info" size="large" :loading='laoding' @click="loginBtns">登录</van-button>
    </div>
  </div>
</template>

<script>
import { userLogin } from '../../api/user.js'
export default {
  data () {
    return {
      userInfo: {
        phone: '13911111111',
        code: '246810'
      },
      error_message: {
        error_phone: '',
        error_code: ''
      },
      laoding: false
    }
  },
  methods: {
    // 登录验证
    // async--await放至嵌套地狱   async--修饰放异步代码的函数    await---修饰异步代码
    loginBtns () {
      this.laoding = true
      // 判断是否提交至服务器
      if (!this.checkLogin()) {
        this.laoding = false
        return
      }
      // 发送请求
      window.setTimeout(async () => {
        try {
          // try为成功后的
          let res = await userLogin(this.userInfo)
          window.console.log(res)
          // 设置本地及仓库信息 ---方法名要加引号
          this.$store.commit('setUser', res.data.data) // token 与 refreshToken
          // 跳转至index页面----
          // A.如果访问的是home页面跳转至home页面    B.如果是通过登录验证登录则是返回上一级路由 back()
          // window.console.log(this.$route)
          if (this.$route.path === '/login') {
            this.$router.push('/home')
          } else {
            this.$router.back()
          }
          // 按钮加载状态
          this.laoding = false
        } catch {
          // catch为请求失败
          // window.console.log('登录失败')
          this.laoding = false
          this.$toast.fail('登录失败')
        }
      }, 1000)
    },
    checkLogin () {
      let err = []
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!reg.test(this.userInfo.phone)) {
        this.error_message.error_phone = '手机号格式不正确！'
        err.push(false)
      } else {
        this.error_message.error_phone = ''
        err.push(true)
      }
      if (this.userInfo.code.trim().length !== 6) {
        this.error_message.error_code = '验证码格式不正确！'
        err.push(false)
      } else {
        this.error_message.error_code = ''
        err.push(true)
      }
      return !err.includes(false)
    }
  }
}
</script>

<style lang='less'>
.login{
  .lgin_nav{
    background-color: rgb(25, 137, 250);
    .van-nav-bar__title{
      color: white;
    }
  }
  .loginBtn{
    padding: 20px 10px;
  }
  .capBtn .van-button__text{
    padding: 5px;
    color: rgb(102, 102, 102);
  }
}
</style>
