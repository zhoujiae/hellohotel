// orderlist.js
var app = getApp();
var con = require("../../../../utils/data.js");
// var openid;
var order_detail, stat;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderdetail: [],
    roomdetail: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getUserInfo();    
    wx.request({
      url: con.getorderbyid,
      data: { 
        wxappid: con.wyy_user_wxappid,
        id: options.id
        },
      method: 'GET',
      header: {
        "Content-Type": 'application/json'
      },
      success: function (res) {
        that.setData({
          orderdetail: res.data.info,
          roomdetail: res.data.info.good
        })
        console.log(res.data.info)
        order_detail = res.data.info
      }
    })
  },
  // 提交支付
  formSubmit: function (e) {
    console.log(order_detail)
    var that = this;
    app.getUserInfo();
    // console.log(b)
    var a = e.detail.value;
    // 判断输入项是否为空
    wx.request({
      url: con.again_order,
      data: {
        wxappid: con.wyy_user_wxappid,
        name: order_detail.name,
        openid: app.globalData.openid,
        phone: order_detail.phone,
        startdate: order_detail.kdate,
        enddate: order_detail.jdate,
        roomnum: order_detail.num,
        roomname: order_detail.guest_id,
        price: order_detail.pay_price,
        id: order_detail.id,
        out_trade_no: order_detail.out_trade_no
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        var zhifu = res.data;
        console.log(res.data);
        stat = res.data.status;
        if (stat == 1) {
          // 调用支付
          wx.requestPayment({
            'timeStamp': zhifu.timeStamp,
            'nonceStr': zhifu.nonceStr,
            'package': zhifu.package,
            'signType': zhifu.signType,
            'paySign': zhifu.paySign,
            'success': function (res1) {
              console.log(zhifu.out_trade_no)
              console.log(res1)
              if (res1.errMsg == "requestPayment:ok") {
                console.log(con.wyy_user_wxappid)
                // 更改支付状态
                wx.request({
                  url: con.order_success,
                  data: {
                    wxappid: con.wyy_user_wxappid,
                    out_trade_no: zhifu.out_trade_no,
                    id: order_detail.goods_id,
                    orderNum: order_detail.room_num
                  },
                  method: 'GET',
                  header: {
                    "Content-Type": 'application/json'
                  },
                  success: function (res1) {
                    console.log(zhifu.out_trade_no)
                    console.log(res1)
                    that.setData({

                    })
                    console.log(res1.data);
                    if (res1.data.status == 1) {
                      wx.showToast({
                        title: res1.data.errMsg,
                        icon: 'success',
                        duration: 1000,
                        mask: true
                      })
                      that.showModal()
                      setTimeout(function () {
                        wx.switchTab({
                          url: '../mine'
                        })
                      }, 2000)
                    } else {
                      wx.showToast({
                        title: res1.data.errMsg,
                        icon: 'loading',
                        duration: 2000,
                        mask: true
                      })
                    }
                  }
                });
              } else {
                wx.showToast({
                  title: '支付失败',
                  icon: 'loading',
                  duration: 2000,
                  mask: true
                })
              }

            },
            'fail': function (res) {
              console.log(res)
              wx.showToast({
                title: '支付失败',
                icon: 'loading',
                duration: 2000,
                mask: true
              })
            },
            'complete': function (res) {

            }
          })
        } else {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'loading',
            duration: 2000, 
            mask: true
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 底部弹窗
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
})