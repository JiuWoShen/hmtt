<template>
  <div class="home">
    <!-- 头部 -->
    <van-nav-bar left-arrow class="headerBar" fixed>
      <template slot="title">
        <div class="title">首页</div>
      </template>
    </van-nav-bar>
    <!-- 频道导航栏 -->
    <van-tabs class="homeheadnav" v-model="active">
      <!-- -----------------------------遍历 渲染 首页频道 -->
      <van-tab v-for="(Citem, Cindex) in channels" :key="Cindex" :title="Citem.name">
        <!-- 文章列表 -->
        <van-pull-refresh v-model="Citem.isLoading" @refresh="onRefresh">
          <van-list v-model="Citem.loading" :finished="Citem.finished" finished-text="没有更多了" @load="onLoad">
            <!-- ----------------遍历每个频道下的 list 里的 文章 数据 -->
            <van-cell v-for="(item, index) in Citem.list" :key="index">
              <template slot="title">
                <!-- list下文章的具体数据 -->
              <div>{{item.title}}</div>
              <!-- 宫格 -->
              <van-grid :border="false" :column-num="3">
                <!-- -----------------------------------遍历每个list下的图片数组 -->
                <van-grid-item  v-for="(imgitem,imgindex) in item.cover.images" :key="imgindex">
                  <!-- -------图片懒加载 -->
                  <van-image lazy-load :src="imgitem" />
                </van-grid-item>
              </van-grid>
              <div class="other">
                <div class="about">
                  <!-- list下文章的具体数据 -->
                  <span>{{item.aut_name}}</span>
                  <span>{{item.comm_count}}评论</span>
                  <!-- 时间使用全局时间过滤器 -->
                  <span>{{item.pubdate | timefilter}}</span>
                </div>
                <div>
                  <van-icon @click="more(item.art_id)" color='#ccc' class="moreicon" name="cross" />
                </div>
              </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
        <div class="rightNavicon">
          <van-icon @click="showChannel" name="wap-nav"/>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 子组件的使用---给子组件传值-----注册子组件的事件------高亮选中-----简化代码--sync -->
    <!-- <channnel :active='active' @update:active='active=$event' :value="show" :channels="channels" @inputf="show=$event"></channnel> -->
    <channnel :active.sync='active' :value="show" :channels="channels" @inputf="show=$event"></channnel>
    <!-- 高亮选中----将选中当前选中的下标传给子组件-----操作应该将文章id传至面板 -->
    <more :value='moreShow' @deleteArt='deleteArt' :artId="artId" @input='moreShow=$event'></more>
  </div>
</template>

<script>
import { getUserChannels } from '../../api/channels.js'
import { getLocal } from '../../utils/mylocal.js'
import { getArticle } from '../../api/articels'
// 导入子组件
import channnel from './componnent/channnel'
import more from './componnent/more'
export default {
  name: 'home',
  components: {
    channnel, more
  },
  data () {
    return {
      // 默认选中的导航
      active: 0,
      // 导航栏用户频道
      channels: [],
      // 文章列表----每个频道自身携带了这些属性
      // list: [],
      // // 加载状态
      // loading: false,
      // // 是否加载完成
      // finished: false,
      // // 下拉刷新的加载
      // isLoading: false

      // 控制面板显示-------默认隐藏
      show: false,
      // 拉黑面板显示
      moreShow: false,
      // 文章id
      artId: 0
    }
  },
  methods: {
    // 文章列表事件---组件子代事件----页面一打开就会执行的事件    数据不触底也会一直执行
    async onLoad () {
      // 得到当前选中的频道----通过当前频道的信息发送请求获取文章列表
      // window.console.log(this.channels[this.active])
      let channelId = this.channels[this.active].id
      let timestamp = Date.now()
      // 发送请求获取数据
      try {
        let res = await getArticle({ channelId, timestamp })
        // 将文正数据保存到  当前  频道的 list 中------这样每个频道都是自己的数据了
        this.channels[this.active].list = [...this.channels[this.active].list, ...res.data.data.results]
        // 判断返回数据的长度是否为 0----为0将加载完毕设置为true
        if (res.data.data.results.length === 0) {
          this.channels[this.active].finished = true
        }
        window.console.log(this.channels[this.active].list)
        this.channels[this.active].loading = false
      } catch {
        window.console.log('请求文章错误！')
      }

      // 初试版本
      // // 默认会将 loading 状态设置为 true----因此页面数据就会处于一直加载的状态---数据加载完成需手动将loading改为false
      // let arr = [11, 2, 3, 4, 6, 5, 7, 8, 7, 7, 9, 8, 8, 8, 8, 8]
      // this.list = [...this.list, ...arr]
      // this.loading = false
      // // 当数据超过100条时设置数据加载完成
      // if (this.list.length >= 100) {
      //   this.finished = true
      // }
      // window.console.log(this.list.length)
      // window.console.log('onload')
    },
    onRefresh () {
      // 下拉刷新---得到当前的频道----并清空数据
      this.channels[this.active].loading = false
      this.channels[this.active].finished = false
      this.channels[this.active].isLoading = false
      this.channels[this.active].list = []
      this.onLoad()

      // 初试版本
      // window.console.log('onrefresh')
      // window.setTimeout(() => {
      //   // 将数据源设置为空
      //   this.list = []
      //   // 将列表的加载状态设置为 false ---将是否加载完成设置为 true
      //   this.loading = false
      //   this.finished = false
      //   this.isLoading = false
      // }, 1000)
    },
    setProp () {
      // 遍历频道数组---添加属性--------后期动态添加的属性动态渲染---通过 $set(添加给谁，属性名，属性值)
      this.channels.forEach(item => {
        this.$set(item, 'loading', false)
        this.$set(item, 'finished', false)
        this.$set(item, 'isLoading', false)
        this.$set(item, 'list', [])
      })
    },
    // 频道面板的显示
    showChannel () {
      this.show = true
    },
    more (id) {
      this.moreShow = true
      this.artId = id
    },
    deleteArt () {
      // 执行删除文章-----得到数据源及当前需要删除的文章id
      this.channels[this.active].list.forEach((item, index) => {
        if (item.art_id === this.artId) {
          // 当前频道下的文章信息
          this.channels[this.active].list.splice(index, 1)
        }
      })
    }
  },
  async created () {
    try {
      // 判断用户是否登录
      if (this.$store.state.user.token) {
        // 用户登录过便从数据库中获取频道信息
        let res = await getUserChannels()
        // window.console.log(res)
        this.channels = res.data.data.channels
      } else {
        // 没有登录-----判断用户是否操作过频道数据---操作过（本地会有记录）从本地获取---没有操作过从数据库获取默认
        if (getLocal('channels')) {
          this.channels = getLocal('channels')
        } else {
          let res = await getUserChannels()
          // window.console.log(res)
          this.channels = res.data.data.channels
        }
      }
    } catch {
      this.$toast.fail('请求失败')
    }
    // window.console.log(this.channels)
    // 得到频道信息后，为了让每个频道下的数据不同，需要天机几个额外的属性
    this.setProp()
  }
}
</script>
<style lang="less">
.home{
  // 显示底部导航------嵌套在layout中
  margin-bottom: 50px;
  margin-top: 90px;
  // 导航栏添加固定定位
  .van-tabs__wrap{
    position: fixed;
    z-index: 999;
    top: 46px;
    width: 90%;
    left: 0;
  }
  .headerBar{
    background-color:  rgb(25, 137, 250);
    .title{
      color: white;
    }
  }
  .rightNavicon{
    position: fixed;
    right: 0;
    top: 46px;
    width: 10%;
    z-index: 999;
    text-align: center;
    height: 44px;
    line-height: 44px;
  }
  .other{
    display: flex;
    justify-content: space-between;
    .about{
      span{
        margin-right: 10px;
        color: #cccc;
      }
    }
    .moreicon{
      font-size: 12px;
      border: 1px solid #ccc;
    }
  }
}
</style>
