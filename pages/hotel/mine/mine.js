//index.js
//获取应用实例
var app = getApp();
var con = require("../../../utils/data.js");
Page({
  data: {
    navbar: ['未支付订单', '已支付订单'],
    currentTab: 0,
    userInfo: {},
    orderlist: [],
    orderlistNo: [],
    orderlistYes: [],
    showView: true,
    yname: {}
  },
  // 菜单切换
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      console.log(userInfo)
    })
    // 订单列表
    wx.request({
      url: con.order_list,
      data: {
        wxappid: con.wyy_user_wxappid,
        openid: app.globalData.openid
      },
      method: 'GET',
      header: {
        "Content-Type": 'application/json'
      },
      success: function (res) {
        // console.log(openid);
        that.setData({
          // 未支付订单
          orderlistNo: res.data.no,
          // 已支付订单
          orderlistYes: res.data.yes

        })
        console.log(res.data)
      }
    })
    // 获取域名接口
    wx.request({
      url: con.get_copyright,
      method: 'GET',
      data: { wxappid: con.wyy_user_wxappid },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          yname: res.data
        })
        console.log(res.data)
      }

    })
    // 显示隐藏
    showView: (options.showView == "true" ? true : false)
  },
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  // 跳转订单详情
  go_orderdetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'orderdetail/orderdetail?id=' + id,
    })
  },
  // 下拉刷新
  onPullDownRefresh: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    // 订单列表
    wx.request({
      url: con.order_list,
      data: {
        wxappid: con.wyy_user_wxappid,
        openid: app.globalData.openid
      },
      method: 'GET',
      header: {
        "Content-Type": 'application/json'
      },
      success: function (res) {
        // console.log(openid);
        that.setData({
          // 未支付订单
          orderlistNo: res.data.no,
          // 已支付订单
          orderlistYes: res.data.yes

        })
        console.log(res.data)
      }
    })
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1000
    })
  }
})
