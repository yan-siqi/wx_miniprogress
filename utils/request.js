import config from './config.js'

export default (url, data = {}, method = 'GET') => {
  //promisse+asyn和await 是 使用同步流程表达异步的执行过程
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      // url: config.phoneHost + url, //不传递参数的话是undefined=>请求失败
      data, //但是data不传参数,走形参的默认值,但是当初是空对象,所以形参给默认值:空对象
      method: method, //发送请求的方法 post/get(默认)/ppush..保证发送请求的灵活性  需要传递参数=>直接拿形参里边的值
      header: {
        cookie: JSON.parse(wx.getStorageSync('cookies') || '[]').toString()
      },
      success: (res) => {
        // console.log(res.cookies);
        //请求成功
        console.log(res.data);
        /*
         * 判断当前的请求是否是登录?
         * 如果是:保存到本地
         * 如果不是:直接返回res.data
         * */
        if (data.isLogin) {
          wx.setStorage({
            key: 'cookies',
            data: JSON.stringify(res.cookies)
          })
        }
        resolve(res.data)
        //拿到数据更新数据
        /*  this.setData({
           bannerList: res.data.banners
         }) */
      },
      fail: (err) => {
        console.log('请求失败,具体请参考:', err);
        reject(err)
      }
    })
  })
}