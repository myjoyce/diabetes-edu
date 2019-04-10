// 每日卡片
import { $markShare } from '../../../common/index'
import wxCloud from '../../../../utils/wxCloud'

Page({

    data: {
        cards: [{}],
        current: 0,
        visible: false,
        preurl:'',
    },

    onLoad(options) {
        this.getCards()
    },

    /** 获取喜欢的卡片 */
    getCards() {
        wxCloud('getCards').then( res => {
            this.setData({
                cards: res.data,
            })
        })
    },

    /** 用户点击右上角分享 */
    onShareAppMessage() {
        const { cards, current } = this.data
        return {
            title: cards[current].quote,
            path: `/pages/card/card?current=${current}`,
            imageUrl: cards[current].image,
        }
    },

    /** 切换卡片 */
    onChange(event) {
        this.setData({
            current: event.detail.current,
        })
    },

    /** 分享 */
    showShareMenu(e) {
        $markShare.show({
            titleText: '',
            buttons: [{
                    iconPath: '/assets/images/weixin_icon.png',
                    title: '微信好友',
                    openType: 'share'
                },
                {
                    iconPath: '/assets/images/weixin_circle_icon.png',
                    title: '微信朋友圈'
                },
                {
                    iconPath: '/assets/images/qq_icon.png',
                    title: 'QQ好友'
                },
                {
                    iconPath: '/assets/images/weibo_icon.png',
                    title: '微博'
                },
                {
                    iconPath: '/assets/images/save_pic_icon.png',
                    title: '保存图片'
                },
                {
                    iconPath: '/assets/images/share_more_icon.png',
                    title: '更多'
                },
            ],
            buttonClicked(index, item) {
                if (!item.openType) {
                    wx.showModal({
                        content: item.title,
                    })
                }
                return true
            }
        })
    },

    /** 喜欢/取消喜欢 */
    onFavChange(e) {
        const { checked } = e.detail
        let { cards, current } = this.data
        wxCloud('favCard', {
            id: cards[current].id,
        }).then( res => {
            wx.showToast({
                title: res.message,
            })
            cards[current].liked = !checked
            cards[current].likeCount = checked ? --cards[current].likeCount : ++cards[current].likeCount
            this.setData({ cards })
        })
    },

    /**下载卡片 */
    saveCard() {
        this.drawCanvas(); //调用绘图函数
        wx.showLoading({
            title: '努力生成中...'
        });
    },
    /**
     * 绘制图片和文本
     */
    drawCanvas(){
        let {
            cards,
            current
        } = this.data
        var that = this;
        //得到图片
        let promise = new Promise(function(resolve,reject){
            wx.getImageInfo({
                src: cards[current].image,
                success:function(res){
                    resolve(res);
                },
                fail:function(res){
                    reject(res);
                }
            })
        }).then(res=>{
            wx.downloadFile({  //网络图片需要先下载到本地
                url: cards[current].image,
                success(res){
                    if(res.statusCode === 200){
                        const ctx = wx.createCanvasContext('cardCanvas')
                        ctx.setFillStyle('white')
                        ctx.fillRect(0, 0, 297, 418)
                        ctx.draw(true);
                        that.roundRect(ctx, 0, 0, 297, 418, 10)
                        ctx.drawImage(res.tempFilePath,10,10,280,206);
                        ctx.draw(true)
                        ctx.setTextAlign('left') 
                        ctx.setFontSize(16)
                        ctx.setFillStyle('black')
                        const textHeight = that.fillTextWrap(ctx,that.data.cards[current].quote,7,245,270)
                        ctx.fillText(that.data.cards[current].author[0], 258, 365)
                        ctx.moveTo(222, 358)
                        ctx.lineTo(257, 358)
                        ctx.stroke()
                        ctx.draw(true)
                        ctx.draw(true,setTimeout(function(){
                            wx.canvasToTempFilePath({
                                x:0,
                                y:0,
                                width:297,
                                height:418,
                                destWidth:297,
                                destHeight:418,
                                canvasId:'cardCanvas',
                                success:function(res){
                                    console.log('res.tempFilePath'+res.tempFilePath);
                                    that.data.preurl = res.tempFilePath;
                                    wx.hideLoading()
                                    that.saveToAlbum()
                                },
                                fail:function(res){
                                    console.log(res);
                                    
                                }
                            })
                        },1000))
                    }
                }
            })
        }).catch(function(error){
            console.log(error);
            
        })
    },
    /**
     * 保存到相册
     */
    saveToAlbum:function(){
        var that = this;
        wx.getSetting({
            success(res){
                if(!res.authSetting['scope.writePhotoAlbum']){
                    wx.authorize({
                        scope:'scope.writePhotosAlbum',
                        success(){
                            that.startSaveImage()
                        }
                    })
                } else {
                    that.startSaveImage()
                }
            }
        })
    },

    startSaveImage(){
        let that = this;
        wx.saveImageToPhotosAlbum({
            filePath:that.data.preurl,
            success(res){

            }
        })
    },
    // 文字换行
    fillTextWrap(ctx, text, x, y, maxWidth, lineHeight) {
        // 设定默认最大宽度
        const systemInfo = wx.getSystemInfoSync();
        const deciveWidth = systemInfo.screenWidth;
        // 默认参数
        maxWidth = maxWidth || deciveWidth;
        lineHeight = lineHeight || 20;
        // 校验参数
        if (typeof text !== 'string' || typeof x !== 'number' || typeof y !== 'number') {
            return;
        }
        // 字符串分割为数组
        const arrText = text.split('');
        // 当前字符串及宽度
        let currentText = '';
        let currentWidth;
        for (let letter of arrText) {
            currentText += letter;
            currentWidth = ctx.measureText(currentText).width;
            if (currentWidth > maxWidth) {
                ctx.fillText(currentText, x, y);
                currentText = '';
                y += lineHeight;
            }
        }
        if (currentText) {
            ctx.fillText(currentText, x, y);
        }
    },
    /**绘制圆角边框 */
    roundRect(ctx,x,y,w,h,r){
        ctx.save();
        if(w<2*r){
            r = w / 2;
        }
        if(h < 2*r){
            r = h / 2;
        }
        ctx.beginPath();
        ctx.setStrokeStyle('grey');
        ctx.setLineWidth(1);
        ctx.moveTo(x + r,y);
        ctx.arcTo(x+w,y,x+w,y+h,r);
        ctx.arcTo(x+w,y+h,x,y+h,r);
        ctx.arcTo(x,y+h,x,y,r);
        ctx.arcTo(x,y,x+w,y,r);
        ctx.stroke();
        ctx.closePath();
        ctx.draw(true);
    }
})