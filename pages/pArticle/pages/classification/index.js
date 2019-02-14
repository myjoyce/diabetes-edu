//var api = require('../../utils/api.js')
//const db = wx.cloud.database();
var app = getApp()
Page({
  data: {
    systemInfo: {},
    //_api: {},
    List: [
      {
        text:'儿科',
        imgList: '../../../../assets/images/classification/1.jpg',
        dbName:'pediatric'
      },
      {
        text: '妇科',
        imgList: '../../../../assets/images/classification/2.jpg',
        dbName:'women'
      },
      {
        text: '骨科',
        imgList: '../../../../assets/images/classification/3.jpg',
        dbName: 'orthopaedic'
      },
      {
        text: '心脏血管疾病',
        imgList: '../../../../assets/images/classification/4.jpg',
        dbName:'heart'
      },
    ],
    ListTwo: [
      {
        text: ['护理学', '美容'],
        imgListTwo: [
            '../../../../assets/images/classification/5.jpg',
            '../../../../assets/images/classification/6.jpg'
          ],
        dbName: ['nursing', 'beauty']
      }, 
      {
        text: ['食物与营养', '心理'],
        imgListTwo: [
            '../../../../assets/images/classification/7.jpg',
            '../../../../assets/images/classification/4.jpg'
          ],
        dbName: ['food', 'psychological']
      }
],
  },

  onLoad: function (options) {
    var that = this
    wx.getSystemInfo(function (res) {
      that.setData({
        systemInfo: res
      })
    })

 
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },

  toList(e) {
      const {
        item
      } = e.currentTarget.dataset;
      if (item != " ") {
        wx.navigateTo({
          url: `/pages/pArticle/pages/list/list?title=${item.text}&&dbName=${item.dbName}`,
        })
      }
    },
  toListTwo(e){
      const {
        text,dbname
      } = e.currentTarget.dataset;
      if (text != " ") {
        wx.navigateTo({
          url: `/pages/pArticle/pages/list/list?title=${text}&&dbName=${dbname}`,
        })
      }
  },
})
