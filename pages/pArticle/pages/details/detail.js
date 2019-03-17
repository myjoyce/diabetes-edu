const db = wx.cloud.database();
var app = getApp();
Page({
    data: {
        // id: '', //当前日报id
        news: {}, //日报详情
        extraInfo: null,

    },

    //获取列表残过来的参数 id：日报id， theme：是否是主题日报内容（因为主题日报的内容有些需要单独解析）
    onLoad:function(options) {

        this.setData({
            id: options.id
        });
        this.getDetails(options.id);
    },



    //现在图片预览不支持调试显示，看不到效果
    //图片预览[当前是当前图片，以后会考虑整篇日报的图片预览]
    previewImgEvent(e) {
        let src = e.currentTarget.dataset.src;
        if (src && src.length > 0) {
            wx.previewImage({
                urls: [src]
            });
        }
    },


  /**
   * 获取文章详情
   */
  getDetails: function (id) {
      wx.showLoading({
          title: 'loading...',
      });
      let _this = this;
      db.collection('banners').doc(id).get().then(res => {

        //   const news = res.data;
        //   let pubdates = '';
          // for (let item of res.pubdates) {
          //   if (item.indexOf("中国") > 0) {
          //     pubdates = item + "上映";
          //   }
          // }
        //   let casts = [];
          // for (let item of book.casts) {
          //   casts.push(item.name);
          // }
          wx.hideLoading();
          _this.setData({
              news: res.data,
            //   pubdates,
            //   casts: casts.join(' / '),
              loaded: true,
            //   comments_count: book.comments_count
          });
          wx.setNavigationBarTitle({
              title: res.data.title,
          })
      }).catch(err => {
          console.log(err);

      })
  },
});



