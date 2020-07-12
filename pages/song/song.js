// pages/song/song.js
//引入pubsubjs
import PubSub from 'pubsub-js'
import request from '../../utils/request.js'
//格式化时间的库
import moment from 'moment'
let appInstance = getApp(); //获取全局实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //判断音乐是否播放
    song: {}, //歌曲信息对象
    musicId: '', //音乐id
    musicLink: '', //音乐链接
    durationTime: '00:00', //音乐总时长
    currentTime: '00:00', //当前时长
    currentWidth: 0, //实时进度条的长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) { //options默认是空对象,接收路由跳转传底的参数
    let musicId = options.musicId;
    //获取播放的音乐数据
    this.getSongData(musicId)
    //判断当前的页面是否在进行播放:有音乐在播放  
    //以及appInstance.globalData.musicId(全局保存的id)和当前页面的id是否是相等
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.musicId) {
      //表示当期那页面在播放
      this.setData({
        isPlay: true
      })
    }
    //在音乐播放之前监听部署对象(在onload中进行监听) 监视播放 暂停和停止
    //首先创建一个背景音乐
    this.backgroundAudioManager = wx.getBackgroundAudioManager(); //获取背景音乐的播放
    this.backgroundAudioManager.onPlay(() => {
      //console.log('pllay')
      this.setData({
        isPlay: true
      })
      //修改全局的状态
      appInstance.globalData.isMusicPlay = true;
      appInstance.globalData.musicId = musicId;
    })
    this.backgroundAudioManager.onPause(() => {
      // console.log('pause');
      this.setData({
        isPlay: false, //是最新的播放状态

      })
      //修改全局的状态
      appInstance.globalData.isMusicPlay = false;
    })
    this.backgroundAudioManager.onStop(() => {
      // console.log('stop')
      this.setData({
        isPlay: false, //是最新的播放状态

      })
      //停掉音乐(部分手机上可能会不行)
      // this.backgroundAudioManager.stop();
      //修改全局的状态
      appInstance.globalData.isMusicPlay = false;
    })
    //根据歌曲播放的实时进度
    //注意获取的时间是毫秒
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })
    })
    //监听音乐播放,自动切换下一首歌曲
    this.backgroundAudioManager.onEnd(() => {
      PubSub.publish('switchType', 'next')
    })
    //订阅recomendSong页面发来的消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      //获取歌曲信息
      this.getSongData(musicId);
      //播放歌曲数据
      this.musicControl(true, musicId) //直接进行播放 +音乐的id //故意不传musicLink发送最新的请求
    })
  },
  //获取音乐的详情数据
  async getSongData(musicId) {
    // 发请求获取音乐响应数据
    let songData = await request('/song/detail', {
      ids: musicId
    })
    //格式化时间
    let dt = songData.songs[0].dt;
    let durationTime = moment(dt).format('mm:ss');
    this.setData({
      song: songData.songs[0],
      musicId,
      durationTime
    })

    // 修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  //控制音乐播放的函数
  musicPlay() {
    let isPlay = !this.data.isPlay;
    let {
      musicId,
      musicLink
    } = this.data;
    this.setData({
      isPlay, //是最新的播放状态

    })
    this.musicControl(isPlay, musicId, musicLink);
  },
  //音乐的播放控制  数据
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      //判断是否发送请求获取新的音乐链接
      if (!musicLink) {
        //代表音乐播放
        //发请求异步获取音乐的播放链接
        let musicLinkData = await request(`/song/url`, {
          id: musicId
        })
        musicLink = musicLinkData.data[0].url; //获取音乐链接
        //跟新音乐播放链接
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink; //音乐链接播放
      //title是必填属性 否则无法播放
      this.backgroundAudioManager.title = this.data.song.name;

      //修改全局的状态 开始播放
      /*     appInstance.globalData.isMusicPlay = true;
          appInstance.globalData.musicId = musicId; */
    } else {
      //代表音乐暂停
      this.backgroundAudioManager.pause();
      //  console.log(this.backgroundAudioManager)
      //修改全局的状态 停止播放
      // appInstance.globalData.isMusicPlay = false;
    }
  },
  //点击进行切换下一首歌曲
  handleSwitch(event) {
    this.backgroundAudioManager.stop(); //停掉上一次的音乐
    /*
    //目的是为了保证性能优化 但是在onload中已经在监听音乐的stop状态了 ,所以可以省掉
        this.setData({
           isPlay:false,
         })
         //修改全局的音乐
         appInstance.globalData.isMusicPlay=false; */
    let type = event.currentTarget.id;
    //发布消息给音乐推荐
    PubSub.publish('switchType', 'next')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(event) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})