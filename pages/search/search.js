// pages/search/search.js
// import { Douban } from './../../utils/apis.js';
const api = require('../../utils/api.js');
const utils = require('../../utils/util.js');

const app = getApp();
const count = 20;  // 每页加载数据数目
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    paragraph: '&emsp;生存还是毁灭，这是一个值得思考的问题。',
    bname:'《哈姆雷特》',
    loading: false,
    pageNo: 0,
    hasMore: true,
    totalRecord: 0, //图书总数
    isInit: true, //是否第一次进入应用
    loadingMore: false, //是否正在加载更多
    pageData: [], //图书数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // quote: app.globalData.config.quote
    })
  },

  clearInput: function () {
    this.setData({
      inputVal: "",
      pageData: null
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 用户确认搜索
   */
  inputConfirm() {
    const that = this;
    const { inputVal } = this.data;
    if(!inputVal) {
      wx.showToast({
        title: '请输出入书名',
        icon: 'none',
        duration: 1000
      });
      return;
    } 
      this.setData({
        scrollTop: 0,
        pageNo: 0,
        hasMore: true
      }, () => {
        this.requestData.call(this);
      })
    
  },

/**
 * 请求图书信息
 */
requestData:function() {
  const q = this.data.inputVal;
  const start = this.data.pageNo;

  this.setData({
    loadingMore: true,
    isInit: false
  });

  wx.showLoading({
    title: '加载中',
  });
  api.requestSearchBook({
    q: q,
    start: start
  }).then((data) => {
    wx.hideLoading();
    if (data.total == 0) {
      this.setData({
        loadingMore: false,
        totalRecord: 0
      });
    } else {
      this.setData({
        loadingMore: false,
        pageData: this.data.pageData.concat(data.books),
        pageNo: start + 1,
        totalRecord: data.total
      });
    }
  }).catch(_ => {
    this.setData({
      loadingMore: false,
      totalRecord: 0
    });
    wx.hideLoading();
  });
},

  //跳转到详细页面
  toDetailPage(event) {
    const {
      version,
      config
    } = app.globalData;
    if (version.versionCode <= config.newestVersion) {
      const {
        id,
        title
      } = event.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/pBook/pages/doudetails/doubookDetails?title=${title}&id=${id}`,
      })
    }
  },

  /**
   * 取消返回
   */
  goBack: function () {
    wx.navigateBack()
  },

  /**
   * 触底加载更多
   */
  loadMore: function (e) {
    const { loading, hasMore } = this.data;
    if (!loading && hasMore) {
      this.requestData.call(this);
    }
  },

  /**
   * 隐藏命令
   */
  // hiddenCommand() {
  //   const { inputVal } = this.data;
  //   const command = inputVal.split('hy:')[1].trim().toUpperCase();
  //   switch(command) {
  //     case 'OPEN MARK':  // 打开 Mark 小程序
  //       wx.navigateToMiniProgram({
  //         appId: 'wx5363d9bd45509430',
  //       })
  //       break;
  //     case 'OPEN TEST':  // 打开测试页
  //       wx.navigateTo({
  //         url: '/pages/first/first',
  //       })
  //       break;
  //     default:
  //       wx.showToast({
  //         title: '命令错误！',
  //       })
  //       break;
  //   }
  // }

})