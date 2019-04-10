// 个人中心

//获取应用实例
var app = getApp()

Page({

  data: {
    version: app.globalData.version,
    userInfo: {},
    hasUserInfo:false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 进入个人资料
   */
  bindViewTap: function () {
    const { version, config } = app.globalData;
    if(app.globalData.userInfo) {
      if (version.versionCode > config.newestVersion) return;
      wx.navigateTo({
        url: '/pages/pUser/pages/userinfo/userinfo'
      })
    }
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 去设置
   */
  toSetting: function() {
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },

  /**
   * 退出登录
   */
  logout: function() {
    wx.showModal({
      content: '确定要退出？',
      success: (res) => {
        res.confirm && app.logout(() => {
          this.setData({
            userInfo: {},
            hasUserInfo:false
          })
        })
      }
    })
  },

  /**
   * 关于
   */
  toAbout: function() {
    const { version, config } = app.globalData;
    if (version.versionCode <= config.newestVersion)
    wx.navigateTo({
      url: '/pages/about/index',
    })
  },

  /**
   * 转发
   */
  onShareAppMessage: function(opt) {
    return {
      title: "好用得不得了",
      path: "/pages/discovery/discovery",
      imageUrl: "http://xpic.588ku.com/figure/00/00/00/08/56/5355a15b1f68dfd.jpg!/fw/800",
      success: res => {
        console.log("成功", res);
      },
      complete: res => {
        console.log("完成", res);
      }
    };
  },

  /**
   * 我喜欢的文章
   */
  toFavBookList: function() {
    const { version, config } = app.globalData;
    if(version.versionCode <= config.newestVersion)
    wx.navigateTo({
      url: '/pages/pUser/pages/favBookList/index',
    })
  },

  /**
   * 我喜欢的卡片
   */
  toFavCards: function() {
    const { version, config } = app.globalData;
    if (version.versionCode <= config.newestVersion)
    wx.navigateTo({
      url: '/pages/pUser/pages/favCards/index',
    })
  },

  /**
   * 作出评价
   */
  toEvalute() {
    wx.navigateTo({
      url: '/pages/pUser/pages/evaluate/evaluate',
    })
  },

  /**
   * 客服按钮监听
   */
  onContactTap() {
    wx.setClipboardData({
      data: '您好，请问我可以为您做些什么~',
    })
  }

})
