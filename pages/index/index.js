// pages/index/index.js
import request from '../../utils/request.js'

Page({
    /**
     * 页面的初始数据
     */
    data: {
        //轮播图的数据
        bannerList: [],
        //推荐歌曲
        recomendList: [],
        //排行榜数据
        topList: []

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        //获取轮播图的banner数据
        let bannerListData = await request('/banner', {
            type: 2
        });
        this.setData({
            bannerList: bannerListData.banners,

        })
        //获取歌曲的推荐数据
        let recomendListData = await request('/personalized')
        this.setData({
            recomendList: recomendListData.result
        })
        let idx = 0;
        let resultArr = [];
        while (idx < 5) {
            let result = await request('/top/list', {idx: idx++});
            let obj = {
                name: result.playlist.name,
                tracks: result.playlist.tracks.slice(0, 3)
            }
            resultArr.push(obj)
        }
        this.setData({
            topList: resultArr
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }

})
/*
<swiper class="topListSwiper" next-margin="50rpx">
      <swiper-item class="swiperItem" wx:for="{{topList}}" wx:key="name">
        <view class="swiperContent">
          <view class="title">{{item.name}}> </view>
          <view class="musicContent" wx:for="{{item.tracks}}" wx:key="id" wx:for-item="musicItem">
            <image class="musicImg" src="{{musicItem.al.picUrl}}"></image>
            <text class="count">{{index + 1}}</text>
            <text class="musicName">{{musicItem.name}}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>*/
