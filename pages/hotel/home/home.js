// home.js
var WxParse = require("../../../wxParse/wxParse.js");
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var app = getApp();
var con = require("../../../utils/data.js");
var lng, lat, name, address, showModalStatus;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['酒店简介', '评价'],
    currentTab: 0,
    // 轮播图数据
    lunbolist: [],
    // 精彩推荐客房
    housefenlei: [],
    hotelinfo: [],
    evalue: [],
    manyi: [
      { value: '一般' ,num: 1 },
      { value: '满意', num: 2, checked: "true" },
      { value: '非常满意', num: 3 }
    ],
    // 评价列表
    evalue_list: [],
    // 评价满意状态
    pj: "",
    opentime: "",
    detime: ""
  },
  // 菜单切换
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestjiekou();
  },
  requestjiekou: function () {
    var demo = new QQMapWX({
      key: 'QCDBZ-GZ3WI-BQDG7-5H24V-Y2HSO-I7BSG'
    });
    var that = this;
    app.getUserInfo();
    // 首页接口
    wx.request({
      url: con.index,
      data: { wxappid: con.wyy_user_wxappid, count: 4 },
      method: 'GET',
      header: {
        "Content-Type": 'application/json'
      },
      success: function (res) {
        lat = res.data.hotel.latitude;
        lng = res.data.hotel.longitude;
        name = res.data.hotel.name;
        address = res.data.hotel.province + res.data.hotel.city + res.data.hotel.district + res.data.hotel.address;
        WxParse.wxParse('arta', 'html', res.data.hotel.intro, that, 0);
        // 时间戳转化
        var opentime = new Date(parseInt(res.data.hotel.opening) * 1000).toJSON().slice(0, 10);
        var detime = new Date(parseInt(res.data.hotel.decorate) * 1000).toJSON().slice(0, 10);
        that.setData({
          // 轮播图数据
          lunbolist: res.data.photo,
          // 酒店信息
          hotelinfo: res.data.hotel,
          // 房间信息;
          housefenlei: res.data.house,
          // 评价信息
          evalue: res.data.evalue,
          lat: res.data.hotel.latitude,
          lng: res.data.hotel.longitude,
          // 开业时间
          opentime: opentime,
          detime: detime,
          markers: [{
            iconPath: "../../../images/map.png",
            id: 0,
            latitude: res.data.hotel.latitude,
            longitude: res.data.hotel.longitude,
            title: res.data.hotel.name,
            width: 30,
            height: 30
          }]
        })
        console.log(res.data);
      }
    });
    // 评价列表接口
    wx.request({
      url: con.evalue_list,
      data: { wxappid: con.wyy_user_wxappid },
      method: 'GET',
      header: {
        "Content-Type": 'application/json'
      },
      success: function (res) {
        // WxParse.wxParse('arta', 'html', res.data.hotel.intro, that, 0);
        that.setData({
          evalue_list: res.data.msg
        })
        var a = res.data.msg;
        console.log(res.data.msg);
      }
    });
  },
  // 地图导航
  bindgothere: function (e) {
    console.log(lat);
    console.log(lng);
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      name: name,
      address: address
    })
  },
  // 跳转预订页面
  go_book: function (e) {
    wx.switchTab({
      url: '../book/book'
    })
  },
  // 跳转订房详情
  go_roomdetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'detail/roomdetail/roomdetail?id=' + id,
    })
  },
  formSubmit: function (e) {
    var that = this;
    app.getUserInfo();
    var a = e.detail.value;
    console.log(a);
    console.log(a.satisfied)
    // 如果评论信息不为空就提交到评论接口
    if (a.comment != "") {
      // 提交评价信息到接口
      wx.request({
        url: con.evalue_add,
        data: {
          wxappid: con.wyy_user_wxappid,
          openid: app.globalData.openid,
          info: a.comment,
          satisfaction: a.satisfied
        },
        method: 'GET',
        header: {
          "Content-Type": 'application/json'
        },
        success: function (res) {
          that.requestjiekou();
          that.setData({

          })
          console.log(res.data);
          if (res.data.status == 1) {
            wx.showToast({
              title: '发表成功',
              icon: 'success',
              duration: 2000
            })
            
          } 
          if (res.data.status == 0) {
            wx.showToast({
              title: '对不起,尚未查询到您在本酒店的订单,无法评价!',
              icon: 'fail',
              duration: 2000
            })
          }
          // else {
          //   wx.showToast({
          //     title: '发表失败1',
          //     icon: 'fail',
          //     duration: 2000
          //   })
          // }
        }
      });
    } else {
      wx.showToast({
        title: '发表失败',
        icon: 'fail',
        duration: 2000
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})