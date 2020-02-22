<template>
  <div class="comment">
    <van-cell>
      <template slot="title">
        <div class="comm">
          <div class="usrimg">
            <img src="http://b-ssl.duitang.com/uploads/item/201807/12/20180712213241_dvkry.thumb.700_0.jpeg" alt="">
          </div>
          <div class="userInfo">
            <div class="name">啊哈</div>
            <div class="content">一条评论</div>
            <div class="times">
              <div class="time">时间</div>
              <div class="reply">回复</div>
            </div>
          </div>
          <div class="like">
            <van-icon name="like" />&nbsp;&nbsp;&nbsp;0
          </div>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang='less' scoped>
.comment{
  .comm{
    display: flex;
    .usrimg{
      img{
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    .userInfo{
      flex: 1;
    }
    .times{
      display: flex;
      .time{
        margin-right: 10px;
      }
    }
  }
}
</style>
