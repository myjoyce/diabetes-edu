//app.js
import { Honye } from './utils/apis'
import Util from './utils/util'
/**
 * 主要用来提供两版显示
 * 本地版本号大于服务端版本号代表未发布，简版显示应对审核
 * 本地版本号小余等于服务端版本号代表已发布
 */
const version = {
    versionCode: 10,
    versionName: '1.0.6(10)',
}

wx.cloud.init({
    traceUser: true,
    env: 'te-f8be46',
})

App({

    globalData: {
        version,
        userInfo: null,
        setting: {},
        config: null,
        published: false, // 是否为发布版
    },

    onLaunch() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        this.getSetting()
        this.getDefaultConfig()
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },

    /**
     * 获取用户信息
     * 支持 callback 和 Promise
     * @param {function} cb (object:userInfo) => void
     */
    getUserInfo(cb) {
        return new Promise((resolve, reject) => {
            if (this.globalData.userInfo) {
                typeof cb === 'function' && cb(this.globalData.userInfo)
                resolve(this.globalData.userInfo)
            } else {
                wx.login({
                    success: () => {
                        wx.getUserInfo({
                            success: res => {
                                this.globalData.userInfo = res.userInfo
                                typeof cb === 'function' && cb(this.globalData.userInfo)
                                resolve(this.globalData.userInfo)
                            }
                        })
                    }
                })
            }
        })
    },

    /** 从服务器获取默认配置 */
    getDefaultConfig(callback) {
        return new Promise((resolve, reject) => {
            if (this.globalData.config) {
                typeof callback === 'function' && callback(this.globalData.config)
                resolve(this.globalData.config)
            } else {
                Honye.get(Honye.CONFIG)
                    .then(res => {
                        this.globalData.config = res
                        this.globalData.published = version.versionCode <= res.newestVersion
                        typeof callback === 'function' && callback(res)
                        resolve(res)
                    })
            }
        })
    },

    /**
     * 是否已经发布
     * @param {Function} callback 回调返回 Boolean 结果
     */
    hasPublished(callback) {
        if (this.globalData.config) {
            typeof callback == "function" &&
                callback(this.globalData.published)
        } else {
            this.getDefaultConfig((res) => {
                const published = version.versionCode <= res.newestVersion
                typeof callback == "function" &&
                    callback(published)
            })
        }
    },

    /** 退出登录 */
    logout(callback) {
        this.globalData.userInfo = null
        callback && callback(this.globalData)
    },

    /** 获取本地设置 */
    getSetting(callback) {
        const { setting } = this.globalData
        if (setting && (!Util.isEmpty(setting))) {
            typeof callback == "function" && callback(setting)
        } else {
            wx.getStorage({
                key: 'setting',
                success: res => {
                    this.globalData.setting = res.data
                    typeof callback == "function" && callback(res.data)
                }
            })
        }
    },
})