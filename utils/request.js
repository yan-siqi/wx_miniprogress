import config from './config.js'
export default (url, data = {}, method = 'GET') => {
  //promisse+asyn和await 是 使用同步流程表达异步的执行过程
  return new Promise((resolve, reject) => {
    wx.request({
      url:config.host+url, //不传递参数的话是undefined=>请求失败
      data, //但是data不传参数,走形参的默认值,但是当初是空对象,所以形参给默认值:空对象
      method: method, //发送请求的方法 post/get(默认)/ppush..保证发送请求的灵活性  需要传递参数=>直接拿形参里边的值
      success: (res) => {
        //请求成功
        console.log(res.data);
        resolve(res.data)
        //拿到数据然后跟新数据
       /*  this.setData({
          bannerList: res.data.banners
        }) */
      },
      fail: (err) => {
        console.log(err);
        reject(err)
      }
    })
  })
}