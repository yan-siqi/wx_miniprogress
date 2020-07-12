// pages/personal/personal.js
import request from '../../utils/request'

let startY = 0; //起始坐标
let moveY = 0; //移动之后的坐标
let distance = 0; //前后距离差
Page({

  /**
   * 页面的初始数据
   */
  data: {
    converTransform: '',
    converTransition: '',
    userInfo: {}, //用户信息
    recentPlayList: [] //用户的播放记录
  },
  //手指刚刚放上去的时候
  handleTouchStart(event) {
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY;
  },
  //手指移动的时候
  handleTouchMove(event) {
    moveY = event.touches[0].clientY;
    distance = moveY - startY; //计算手指移动的距离
    //加上临界值
    if (distance < 0) return;
    if (distance >= 80) {
      distance = 80;
    }
    //动态的更新数据
    this.setData({
      //移动了多少
      converTransform: `translateY(${distance}px)`
    })
  },
  //手指离开的额时候
  handleTouchEnd(event) {
    this.setData({
      converTransform: `translateY(0px)`,
      converTransition: `transform 1s ease`
    })
  },
  toLogin() {
    //判断用户是否已经登录
    if (this.data.userInfo.nickname) {
      return;
    }
    //跳转到登录界面
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    // 判断本地是否有用户登录的信息数据
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })


      // 获取用户播放 记录
      let recentPlayListData = await request(`/user/record?uid=${this.data.userInfo.userId}&type=0`)
     // console.log(recentPlayListData)
      this.setData({
        recentPlayList: recentPlayListData.allData
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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