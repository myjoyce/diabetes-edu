// liked cards
import wxCloud from '../../../../utils/wxCloud'

Page({

    data: {
        cards: null,
    },

    /** lifecycle */
    onLoad(options) {
        this.getCards()
    },

    /** get the cards user liked */
    getCards() {
        wxCloud('getFavCards').then( res => {
            this.setData({
                cards: res.data,
            })
        })
    },
})