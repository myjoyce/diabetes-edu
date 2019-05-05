// pages/search/search.js
// import { Douban } from './../../utils/apis.js';
const api = require('../../utils/api.js');
const utils = require('../../utils/util.js');

const db = wx.cloud.database();
// const app = getApp();
// const count = 20;  // 每页加载数据数目
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    paragraph: '想知道哪些食物糖尿病人能吃、哪些不能吃、吃多少？直接输入你想了解的关键词，比如“苹果”、“香蕉”就会出来对应的结果喔',
    hotsearch:'热门搜索',
    hotitem:['苹果','香蕉','红薯','南瓜','柚子','花生','牛奶','玉米'],
    loading: false,
    // pageNo: 0,
    // hasMore: true,
    // totalRecord: 0, //图书总数
    isInit: true, //是否第一次进入应用
    // loadingMore: false, //是否正在加载更多
    pageData: [], //食物详情
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
        title: '请输入食物名称',
        icon: 'none',
        duration: 1000
      });
      return;
    } 
      this.setData({
        scrollTop: 0,
        // pageNo: 0,
        // hasMore: true
      }, () => {
        this.requestData.call(this);
      })
    
  },
  goDetail:function(event){
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      // loadingMore: true,
      inputVal:name
    });
    this.requestData.call(this);
  },
/**
 * 请求食物详情
 */
requestData:function() {
  let _this = this;
  const q = this.data.inputVal;
  // const start = this.data.pageNo;

  _this.setData({
    // loadingMore: true,
    isInit: false
  });

  wx.showLoading({
    title: '加载中',
  });

  db.collection('foodSearch').where({
    name:q,
  }).get().then(res=>{
    const pageData = res.data[0];
    _this.setData({
      pageData: pageData
    })
    console.log(pageData);
    
    wx.hideLoading();
    })
},


  /**
   * 取消返回
   */
  goBack: function () {
    wx.navigateBack()
  },


})