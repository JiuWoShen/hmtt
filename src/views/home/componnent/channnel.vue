<template>
  <div class="channnels">
    <!-- 子组件中不能用v-model直接操作-----------触发父组件的inputf事件  传递参数 -->
    <van-popup :value="this.value" @input="$emit('inputf', $event)" position="bottom" :style="{ height: '90%' }">
      <!-- 用单元格装起来 -->
      <van-cell>
        <van-icon @click="close" class="channelIcon" name="cross" />
      </van-cell>
      <van-cell>
        <template slot="title">
          <!-- 我的频道数据应该从---首页的频道列表中获取 -->
          <div>我的频道</div>
        </template>
        <template slot="default">
          <van-button v-if="edit===false" plain hairline size='mini' @click="edit=true" round type="danger">编辑</van-button>
          <van-button v-else plain hairline size='mini' @click="edit=false" round type="danger">完成</van-button>
        </template>
      </van-cell>
      <van-grid>
        <van-grid-item class="myChannel" @click="changeColor(index)" v-for="(item, index) in channels" :key="index">
          <template slot="text">
            <span class="myChanneltext" :class="{active:active === index}" >{{item.name}}</span>
            <!-- 阻止事件冒泡----父元素也有点击事件 -->
            <van-icon @click.stop="delMychannel(item)" v-if="edit===true && index != 0" class="myChannelicon" color='rgb(205, 205, 205)' name="close" />
          </template>
        </van-grid-item>
      </van-grid>
      <!-- 推荐频道 -->
      <van-cell>
        <template slot="title">
          <div>推荐频道</div>
        </template>
      </van-cell>
      <van-grid>
        <!-- -------------------------------从计算属性返回的数组取数据 -->
        <van-grid-item @click="addMychannel(allitem)" v-for="(allitem, index) in filterChannel" :key="index" text="文字">
          <template slot="text">
            <!-- 频道推荐的数据应该是除过我的频道数据之外的数据 -->
            <span class="allChanneltext">{{allitem.name}}</span>
          </template>
        </van-grid-item>
      </van-grid>
    </van-popup>
    <!-- 单向数据流不能直接修改父组件的数据 -->
  </div>
</template>

<script>
import { setLocal } from '../../../utils/mylocal.js'
import { getAllChannels, resetUserChannels } from '../../../api/channels.js'
export default {
  // 接收父组件的传值
  props: [ 'value', 'channels', 'active' ],
  data () {
    return {
      edit: false,
      allChannels: []
    }
  },
  methods: {
    // 叉叉关闭面板
    close () {
      // 触发父组件的 inputf 事件------此时没有组件的默认事件传值操作----应该手动传 false
      this.$emit('inputf', false)
    },
    async getAllChnnel () {
      let res = await getAllChannels()
      this.allChannels = res.data.data.channels
      // window.console.log(res)
    },
    // 我的频道的添加删除
    async addMychannel (item) {
      // 并添加额外的属性
      this.$set(item, 'loading', false)
      this.$set(item, 'finished', false)
      this.$set(item, 'isLoading', false)
      this.$set(item, 'list', [])
      // 添加到我的频道
      this.channels.push(item)
      // 保存状态
      // a登录----直接提交到服务器
      window.console.log(this.$store.state.user.token)
      if (this.$store.state.user.token) {
        // -----------------------去掉第一个
        let channel = this.channels.slice(1).map((item, index) => {
          return {
            id: item.id,
            // 序号从1开始并且除过第一个推荐
            seq: index + 2
          }
        })
        // 提交至服务器中
        let res = await resetUserChannels(channel)
        window.console.log(res)
      } else {
        // b.没有登录
        // b.1用户操作过频道数据-------保存操作本地
        setLocal('channels', this.channels)
      }
    },
    // 点击图标-----将该条数据移除至频道推荐
    async delMychannel (item) {
      // 遍历我的频道-----当id与本条数据id相同则删除该条数据
      this.channels.forEach((Citem, Cindex) => {
        if (item.id === Citem.id) {
          this.channels.splice(Cindex, 1)
        }
      })
      // 保存当前的操作
      // a.登录
      if (this.$store.state.user.token) {
        // -----------------------去掉第一个
        let channel = this.channels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        // 提交至服务器中
        await resetUserChannels(channel)
      } else {
        // 没有登录---保存到本地
        setLocal('channels', this.channels)
      }
    },
    changeColor (index) {
      // 点击改变高亮下标----update固定用来用 sync 简化代码
      this.$emit('update:active', index)
    }
  },
  computed: {
    // 计算属性将所有频道的数据除去我的频道的数据
    filterChannel () {
      // 我的频道的id集合
      let ids = this.channels.map(item => {
        return item.id
      })
      // 所有频道不包含我的频道id的数据-------filter筛选满足条件的元素
      let other = this.allChannels.filter(item => {
        return !ids.includes(item.id)
      })
      return other
    }
  },
  created () {
    this.getAllChnnel()
  }
}
</script>

<style lang="less">
.channnels{
  .channelIcon{
    font-size: 25px;
  }
  .myChannel{
    position: relative;
    .myChanneltext{
      font-size: 12px;
      color: rgb(100, 101, 102);
    }
    .myChannelicon{
      position: absolute;
      top: 0;
      right: 0;
      font-size: 12px;
    }
    .active{
    color: red !important;
    }
  }
  .allChanneltext{
    font-size: 12px;
    color: rgb(100, 101, 102);
  }
}
</style>
