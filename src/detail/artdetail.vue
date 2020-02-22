<template>
  <div class="detail">
    <!-- 头部 -->
    <van-nav-bar left-arrow @click-left="$router.back()" class="headerBar" fixed>
      <template slot="title">
      <div class="title">搜索结果</div>
      </template>
    </van-nav-bar>
    <!-- 标题 -->
    <h2>{{artContent.title}}</h2>
    <!-- 作者信息 -->
    <van-cell>
      <template slot="title">
        <div class="authInfo">
          <div class="userImg">
              <img :src="artContent.aut_photo" alt="">
          </div>
          <div class="phone">
            <div class="name">{{artContent.aut_name}}</div>
            <div class="time">{{artContent.pubdate | timefilter}}</div>
          </div>
          <div class="follow">
              <van-button @click="follow" v-if="artContent.is_followed === false" type="info">+ 关注</van-button>
              <van-button @click="disfollow" v-else type="info">已关注</van-button>
          </div>
        </div>
      </template>
    </van-cell>
    <!-- 文章内容 -->
    <van-cell>
      <template slot="title">
        <div v-html="artContent.content"></div>
      </template>
    </van-cell>
    <!-- 对文章点赞或者不喜欢 -->
    <div class="btns">
      <van-button class="btn" round plain icon="like" :type="artContent.attitude === 1 ? 'danger' : 'default'">&nbsp;&nbsp;&nbsp;点赞</van-button>
      <van-button class="btn" round plain icon="delete" :type="artContent.attitude === 0 ? 'danger' : 'default'">&nbsp;&nbsp;&nbsp;不喜欢</van-button>
    </div>
    <!-- 评论组件 -->
    <van-cell slot="title">文章评论</van-cell>
    <div>
      <comment v-for="(item, index) in 10" :key="index"/>
    </div>
    <!-- 写评论 -->
    <div>
      <writeComm />
    </div>
  </div>
</template>

<script>
import comment from './componet/comment'
import writeComm from './componet/writeComm'
import { artDetail } from '../api/articels.js'
import { followUser, disFollow } from '../api/user.js'
export default {
  components: {
    comment,
    writeComm
  },
  data () {
    return {
      artId: 0,
      artContent: []
    }
  },
  methods: {
    async getArticle () {
      let res = await artDetail(this.artId)
      // window.console.log(res)
      this.artContent = res.data.data
    },
    // 关注作者
    async follow () {
      // 得到作者的ID
      let autId = this.artContent.aut_id
      await followUser(autId)
      // 手动设置关注标识
      this.artContent.is_followed = true
      this.$toast('关注成功')
      // window.console.log(res)
    },
    //  取关作者
    async disfollow () {
      let autId = this.artContent.aut_id
      let res = await disFollow(autId)
      this.artContent.is_followed = false
      this.$toast('取关成功')
      window.console.log(res)
    }
  },
  created () {
    // ------------从当前路由取数据用  route
    this.artId = this.$route.params.artKey
    // 发送请求得到文章详情
    this.getArticle()
  }
}
</script>

<style lang='less' scoped>
.detail{
  margin-top: 46px;
  margin-bottom: 54px;
  // 头部导航栏
  .headerBar{
    background-color:  rgb(25, 137, 250);
    .title{
      color: white;
    }
  }
  // 左侧箭头颜色
  .van-nav-bar .van-icon{
    color: white;
  }
  h2{
      font-weight: 400;
      line-height: 66px;
      text-align: center;
  }
  .authInfo{
    display: flex;
    .userImg{
      margin-right: 10px;
      img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .phone{
      flex: 1;
    }
  }
  .btns{
      text-align: center;
      .btn{
          margin: 20px;
      }
  }
}
</style>
