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
        imgList: 'http://i1.bvimg.com/673474/cb75adf8f3928714s.jpg',
        dbName:'pediatric'
      },
      {
        text: '妇科',
        imgList: 'http://i1.bvimg.com/673474/012411cf37d7cb9as.jpg',
        dbName:'women'
      },
      {
        text: '骨科',
        imgList: 'http://i1.bvimg.com/673474/c236fcf569159748s.jpg',
        dbName: 'orthopaedic'
      },
      {
        text: '心脏血管疾病',
        imgList: 'http://i1.bvimg.com/673474/dcc848365d61aaebs.jpg',
        dbName:'heart'
      },
    ],
    ListTwo: [
      {
        text: ['护理学', '美容'],
        imgListTwo: [
            'http://i1.bvimg.com/673474/d3a4eab94907f0aet.jpg',
            'http://i1.bvimg.com/673474/fa7f9cabad1dc13et.jpg'
          ],
        dbName: ['nursing', 'beauty']
      }, 
      {
        text: ['食物与营养', '心理'],
        imgListTwo: [
            'http://i1.bvimg.com/673474/5d7652cff0cfccad.jpg',
            'http://i1.bvimg.com/673474/012411cf37d7cb9a.jpg'
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
