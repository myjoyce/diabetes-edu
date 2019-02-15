// pages/movies/movieDetails.js
//import { Douban } from '../../../../utils/apis.js';

const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {},
    pubdates: '',
    comments_count: 0,
    comments: [],
    loaded: false,
    isFold: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          bgImgHeight: res.windowWidth/2
        })
      },
    })
    wx.setNavigationBarTitle({
      title: options.title || '详情',
    })
    this.setData({
      dbName:options.dbName
    })
    this.setData({ id: options.id })
    this.getDetails(options.id);
    // this.getComments(options.id);
  },
  
  /**
   * 获取书籍详情
   */
  getDetails: function(id) {
    wx.showLoading({
      title: 'loading...',
    });
    let _this = this;
    debugger
    db.collection(_this.data.dbName).doc(id).get().then(res => {
      const book = res.data;
      let pubdates = '';
      // for (let item of res.pubdates) {
      //   if (item.indexOf("中国") > 0) {
      //     pubdates = item + "上映";
      //   }
      // }
      let casts = [];
      // for (let item of book.casts) {
      //   casts.push(item.name);
      // }
      wx.hideLoading();
      _this.setData({
        details: res.data,
        pubdates,
        casts: casts.join(' / '),
        loaded: true,
        comments_count: book.comments_count
      });
      wx.setNavigationBarTitle({
        title: res.data.title,
      })
    }).catch(err=>{
      console.log(err);
      
    })
  },

  /**
   * 获取影视短评
   */
  // getComments: function(id) {
  //   const that = this;
  //   db.collection('mybook').doc(id).get({
  //       start: 0,
  //       count: 6
  //   }).then(res => {
  //       that.setData({
  //         comments: res.comments
  //       })
  //     }
  //   )
  // },

  /**
   * 折叠开关
   */
  foldToggle() {
    const {isFold} = this.data;
    this.setData({
      isFold: !isFold
    })
  },

  /**
   * 剧照预览
   */
  // onImagePre(e) {
  //   const { img } = e.currentTarget.dataset;
  //   const { details } = this.data;
  //   let urls = [];
  //   for(let item of details.photos) {
  //     urls.push(item.image)
  //   }
  //   wx.previewImage({
  //     current: img,
  //     urls
  //   })
  // }
})