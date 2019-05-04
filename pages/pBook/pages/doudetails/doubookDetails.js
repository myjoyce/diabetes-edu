const api = require('../../../../utils/api.js');
const utils = require('../../../../utils/util.js');

Page({
    data: {
        id: null,
        loadidngHidden: false,
        details: {},
        pubdates: '',
        // comments_count: 0,
        comments: [],
        isFold: true
    },
    onLoad(options) {
        let _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    bgImgHeight: res.windowWidth / 2
                })
            },
        })
        wx.setNavigationBarTitle({
            title: options.title || '详情',
        })

        this.setData({
            id: options.id
        })
    },
    onReady() {
        wx.showLoading({
            title: '加载中',
        });

        api.requestBookDetail(
            this.data.id, {
                fields: 'image,summary,publisher,title,rating,pubdate,author,author_intro,catalog'
            }
        ).then((data) => {
            this.setData({
                loadidngHidden: true,
                details: data
            });
            wx.hideLoading();
        }).catch(_ => {
            this.setData({
                loadidngHidden: true
            });
            wx.hideLoading();
            wx.navigateBack();
        });
    },


    /**
    * 折叠开关
    */
    foldToggle() {
        const {
            isFold
        } = this.data;
        this.setData({
            isFold: !isFold
        })
    },


});
