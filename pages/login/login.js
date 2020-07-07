// pages/login/login.js
import request from '../../utils/request'
Page({
  /* 
  登录流程:
  发送请求,获取表单数据进行数据校验
  input事件
  原生:oninput事件
  框架:input事件名
  小程序:bind/catch+input事件
   */
  data: {
    phoneNumber: '',//手机号
    password: '',//密码
  },
  onLoad: function(options) {

  },
  handleInput(event) {
    //收集表单数据
    /* console.log(event.detail.value)
    console.log(event.currentTarget.id) */
    //let type = event.currentTarget.id;
    let type = event.currentTarget.dataset.type;
    this.setData({
      [type]: event.detail.value
    })
  },
  async login() {
 /*    //判断本地是否有数据
    let userInfo = wx.getStorageInfoSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
    } */
    let {
      phoneNumber,
      password
    } = this.data;
    if (!phoneNumber || !password) {
      //验证不通过
      wx.showToast({
        title: '用户名或者密码错误',
        icon: 'none', //没有提示的图片但是可以显示最多两行文字
      })
    } else {
      //前端验证通过
      //进行后端验证
      let result = await request(`/login/cellphone?phone=${phoneNumber}&password=${password}`)
      console.log(result.code);
      if (result.code === 501) {
        wx.showToast({
          title: '手机号错误',
          icon: 'none', //没有提示的图片但是可以显示最多两行文字
        })
      } else if (result.code === 502) {
        wx.showToast({
          title: '密码错误',
          icon: 'none', //没有提示的图片但是可以显示最多两行文字
        })
      } else {
        //登录成功
        wx.showToast({
          title: '登录成功',
          icon: 'success', //没有提示的图片但是可以显示最多两行文字
        })
        //设置本地缓存
        wx.setStorageSync("userInfo", JSON.stringify(result.profile))
        //跳转到个人中心页面
        wx.switchTab({
          url: '/pages/personal/personal'
        })

      }
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