// 时间选择器


// 引用日志输出
var Journal = require('../JS/tool/journal.js')
//引入签名加密商户号
var Sign = require('../JS/tool/sign.js')
//网络请求
var Request = require("../JS/request/request.js")
//数据接口地址
var Server = require('../JS/request/server_address.js');
//全局通用js
var Currency = require('../JS/tool/currency.js');

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		mack: {
			type: Number,
			observer: function (newVal, oldVal) {
				if (newVal) {
					get_time(this);
				}
			}
		},
		ti_type: Boolean,
		date_itme: null,
		function_type: Number,
		store_id: Number,
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		index_type: 0,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		//选择时间
		seleclor_date_time: function (e) {
			var time = e.currentTarget.dataset.time;
			this.setData({
				mack: false,
				date_itme_index: time,
			})
			try {
				wx.setStorageSync('time', time)
				//修改时间
				this.triggerEvent('time_sele');
			} catch (e) {
			}
		},
		//关闭
		mack: function () {
			this.setData({
				mack: false,
			})
		}
	},
})


//获取时间段
function get_time(that) {
	let data = {};
	data['sign'] = Sign.sign();
	data['mchid'] = Sign.getMchid();
	data['store_id'] = that.data.store_id;
	data['type'] = that.data.function_type;
	Request.request_data(
		Server.TIME_SELECT(),
		data,
		function (res) {
			that.setData({
				time: res,
			})
			if (!res[0].can_click) {
				var date_itme_index = res[0];
				if (that.data.date_itme) {
					date_itme_index = that.data.date_itme;
				}
				try {
					wx.setStorageSync('time', date_itme_index);
					that.setData({
						date_itme_index: date_itme_index,
					})
					//修改时间
					that.triggerEvent('time_sele');
				} catch (e) {
				}
			} else {
				//修改时间
				that.triggerEvent('time_sele');
			}
		},
		function (res) {
			wx.showToast({
				title: res ? res : "失败！！！",
				icon: 'none',
				duration: 2000
			})
		},
		function (res) {
			Journal.myconsole('时间段请求的数据');
			Journal.myconsole(res);
		});
}
