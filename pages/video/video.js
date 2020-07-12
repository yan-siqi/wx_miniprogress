// pages/video/video.js
import request from "../../utils/request";

Page({
  data: {
    videoGroupList: [], //视频导航的标签数据
    navId: '', //导航id
    videoList: [], //视频列表数据
    videoContext: '', //上下文
    videoId: '',
    triggered: false, // 标识下拉刷新是否被触发
  },
  onLoad: async function(options) {
    //验证用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      //提示用户先登录
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return
    }
    //导航的标签数据
    let videoGroupListData = await request('/video/group/list');

    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId);
  },
  async getVideoList(navId) {
    //获取视频列表数据
    let videoListData = await request(`/video/group`, {
      id: navId
    });
    //关闭正在加载的提示框
    wx.hideLoading()
    console.log(videoListData)
    this.setData({
      triggered: false,
      videoList: videoListData.datas

    })
  },
  //切换导航的id
  changeNavId(event) {
    this.setData({
      navId: event.currentTarget.id >>> 0, //数据类型的强制转换
      videoList: [] //切换的时候当前页面的数据要清空
    })
    //点击的时候,显示正在加载中
    wx.showLoading({
      title: '正在加载中...',
    })
    this.getVideoList(this.data.navId);
  },
  //控制video继续播放的回调:当播放下一个视频的时候,关掉上一个
  handlePlay(event) {
    let vid = event.currentTarget.id;
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid);
    //视频自行播放
    this.videoContext.play()
    //console.log(this.videoContext)
    // this.videoContext.play()
    // this.vid !== vid && this.videoContext && this.videoContext.stop(vid);
    //上边的连等 <=>
    /* 
     if(this.vid !== vid){
      if(this.videoContext){
        this.videoContext.stop();
      }
     */
    //this.vid = vid;
    //this.videoContext.wx.createContext(vid);
    //创建视频上下文对象:VideoContext wx.createVideoContext(string id, Object this)
    /*let vid = event.currentTarget.id;
    if (!this.data.videoContext) {
      let videoContext = wx.createVideoContext(vid)
      //页面初始化的时候this.setData.videoContext 是空串
      this.setData({
        videoContext
      })
    } else {
      //将原来的视频停掉
      this.data.videoContext.stop();
      let videoContext = wx.createVideoContext(vid)
      //页面初始化的时候this.setData.videoContext 是空串
      this.setData({
        videoContext
      })
    }*/
  },
  //自定义下拉事件的刷新=>用户发送请求获取数据展示
  handleTopRefresher() {
    console.log('用户下拉刷新');
    this.getVideoList(this.data.navId)
  },
  //触底刷新数据
  handleBottomRefresher() {
    //  console.log('触底刷新')
    //实际上是和下拉刷新的功能等同
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
    //用户点击右上角进行发送数据
  onShareAppMessage: function() {
    console.log('触发分享')
    return {
      title: '自定义的转发分享',
      page: '/pages/video/video',
      imageUrl: '/static/images/nvsheng.jpg'

    }
  }
})