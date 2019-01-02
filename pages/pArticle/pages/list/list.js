// pages/article/list.js
const db = wx.cloud.database();
var app = getApp();
let pageNo = 0;
const pageSize = 18;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {title,dbName} = options;
    wx.setNavigationBarTitle({ title })
    this.getBooks(dbName);
    
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
    if (this.data.loadmore) {
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
  getBooks: function (dbName) {
    let that = this;
    db.collection(dbName).get({
      start: pageNo * pageSize,
      count: pageSize
    }).then(res => {
      wx.stopPullDownRefresh();
      let books = res.data;
      for (let item of books) {
        item.tags = item.tags.join('/')
      }
      that.setData({
        loading: false,
        books: pageNo ? [...that.data.books, ...books] : books,
        loadmore: books.length >= pageSize
      });
    })
  },

  bindViewTap: function (event) {
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
        url: `/pages/pBook/pages/details/bookDetails?title=${title}&id=${id}`,
      })
    }
  },
})