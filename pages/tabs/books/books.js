// pages/movies/movies.js
import { $markDropmenu } from '../../common/index.js';
//import { Douban } from '../../../utils/apis.js';

const db =wx.cloud.database();
const book = db.collection('mybook');
var app = getApp();
let pageNo = 0;
const pageSize = 18;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    loadmore: true,
    books: [],
    isGrid: app.globalData.setting.wantSee?app.globalData.setting.wantSee.layout === 'grid':false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBooks()
    this.setData({
      isGrid: app.globalData.setting.wantSee ? app.globalData.setting.wantSee.layout === 'grid' : false
    })
  },

  /**
   * 页面隐藏
   */
  onHide: function(options) {
    this.dropMenu && this.dropMenu();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    pageNo = 0;
    this.getBooks()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loadmore) {
      pageNo++;
      this.setData({
        loading: true
      });
      this.getBooks()
    }
  },

  /**
   * 我的书籍
   */
  getBooks: function() {
    let that = this;
    book.get(
      {
        start: pageNo * pageSize,
        count: pageSize
      }
    ).then(res => {
      wx.stopPullDownRefresh();
      let books = res.data;
      for (let item of books) {
        item.tags = item.tags.join('/')
      }
      that.setData({
        loading: false,
        books: pageNo ? [...that.data.books, ...books ]:books,
        loadmore: books.length >= pageSize
      });
    })
  },

  bindViewTap: function(event) {
    const { version, config } = app.globalData;
    if(version.versionCode <= config.newestVersion) {
      const { id, title } = event.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/pBook/pages/details/bookDetails?title=${title}&id=${id}`,
      })
    }
  },

  /**
   * 改变布局方式
   */
  changeLayout: function() {
    const { isGrid } = this.data;
    let { wantSee } = app.globalData.setting;
    wantSee = { ...wantSee, layout: isGrid ? 'linear' : 'grid'}
    wx.setStorage({
      key: 'setting',
      data: { ...app.globalData.setting, wantSee },
    })
    this.dropMenu && this.dropMenu(); // 如果排序菜单已打开则关闭
    this.setData({ 
      isGrid: !isGrid
    }, () => {
      app.globalData.setting = { ...app.globalData.setting, wantSee };
    });
  },
/**
 * 扫码加书
 */
  scanCode: function (event) {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: res => {
        console.log(res.result);
        wx.cloud.callFunction({
          //要调用的云函数名称
          name: 'bookinfo',
          //传递给云函数的参数
          data: {
            isbn: res.result
          },
          success: res => {
            var bookString = res.result;
            //console.log(JSON.parse(bookString))
            const db = wx.cloud.database()
            const book = db.collection('mybook')
            //set price , shop
            db.collection('mybook').add({
              data: JSON.parse(bookString)
            }).then(res => {
              console.log(res)
            }).catch(err => {
              console.log(err)
            })
          },
          fail: err => {
            console.log(err)
          }
        })
      },
      fail: err => {
        console.log(err);
      }
    })
  }
})