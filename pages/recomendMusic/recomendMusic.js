// pages/recomendMusic/recomendMusic.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
Page({
  //初始化数据
  data: {
    date: {
      day: 0,
      month: 0
    },
    recommendMusicList: [], //获取推荐列表
    index: 0, //标识当前播放音乐的下标
  },
  //页面开始加载
  onLoad: async function(options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请小主先进行登录..',
        icon: 'loading',
        success: () => {
          //回调成功的时候,会返回到用户登录界面
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      })
      return
    }
    //获取当前的日期
    this.setData({
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1 //注意月份是从0月开始
      },
    })
    //异步获取推荐的歌曲列表
    let recommendMusicListData = await request('/recommend/songs')
    //console.log(recommendMusicListData.recommend)
    //拿到数据之后进行数据更新
    this.setData({
      recommendMusicList: recommendMusicListData.recommend
    })

    //订阅song的发布消息
    PubSub.subscribe('switchType', (msg, type) => {
      //console.log('song发布的页面消息', msg, type);
      let {
        recommendMusicList,
        index
      } = this.data;
      let musicId;
      if (type === 'pre') {
        (index === 0) && (index = recommendMusicList.length)
        index -= 1
        console.log(55555)
      } else {
        (index === recommendMusicList.length - 1) && (index = -1)
        index += 1
      }
      //获取要播放音乐的id
      console.log(recommendMusicList)
      musicId = recommendMusicList[index].id
      //更新index的下标状态
      this.setData({
        index
      })
      //将获取到的页面的id发送给song页面
      PubSub.publish('musicId', musicId)
    })

  },
  //跳转至音乐详情页面的
  toSong(event) {
    let {
      song,
      id,
      index
    } = event.currentTarget.dataset
    //更新index数据
    this.setData({
      index
    })
    //console.log(song);
    //路由传参 使用query'参数的形式进行传递
    wx.navigateTo({
      url: '/pages/song/song?musicId=' + id,
    })
  },


  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})