// book.js
var app = getApp();
var con = require("../../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    housefenlei: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getUserInfo();
    wx.request({
      url: con.index,
      data: { wxappid: con.wyy_user_wxappid},
      method: 'GET',
      header: {
        "Content-Type": 'application/json'
      },
      success: function (res) {
        that.setData({
          // 房间信息
          housefenlei: res.data.house,
        })
        console.log(res.data.house);
      }
    });
  },
  // 跳转订房详情
  go_roomdetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'detail/roomdetail/roomdetail?id=' + id,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})