/*
* 积分商城设置页面
* */
(function (window, $, undefined) {
    var tpl_groupAdd = function (options){
        var settings = $.extend({
            tpl_preview:'',  //左边模板位置
            tpl_form: '',    //右边模板位置
            data: null,      //左边数据
            data_tpl: {
                title:
                '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                        '<label class="control-label">页面名称 <em class="text-danger">*</em></label>' +
                        '<div class="control-input">' +
                        '<input type="text" class="form-control js-t-title" id="t_title" name="t_title" value="{{if name}}{{name}}{{/if}}" >' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="control-label">分享描述</label>' +
                        '<div class="control-input">' +
                        '<textarea class="form-control js-title-desc" placeholder="用户通过微信分享给朋友时，会自动显示分享描述">{{description}}</textarea>' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="control-label">分享图片</label>' +
                        '<div class="control-input">' +
                        '<a href="javascript:;" id="shareImgBtn" class="add-img w100 bg-white"><i class="icon-plus"></i> 添加图片</a>' +
                        '<div class="img">{{if src}}<img src="{{src}}" id="shareImg" class="img-responsive w100" />{{/if}}</div>' +
                        '<input type="hidden" id="shareImgHidden">' +
                        '</div>' +
                    '</div>' +
                '</div>',
                group: [
                    /*'{{if isName}}<h5 class="mt10 plr15 text-gray">{{name}}</h5>{{/if}}' +*/
                    '<ul class="ms-goods-list bg listStyle-{{ listStyle }} shopStyle-{{ shopStyle }}">' +
                        '{{ each list as value}}' +
                            '<li>' +
                                '<a href="javascript:;">' +
                                '<div class="pic placeholder_auto"><img src="{{ value.src }}" alt=""></div>' +
                                '<div class="info">' +
                                    '{{if showTitle}}<div class="title">{{ value.title }}</div>{{/if}}' +
                                    '{{if showBuy}}<div class="buy-btn btn{{btnStyle}}"><span>{{if btnText}} {{btnText}} {{/if}}</span><i class="icon-cart"></i></div>{{/if}}' +
                                    '{{if showPrice}}<div class="price">{{ value.price }}</div>{{/if}}' +
                                '</div>' +
                                '</a>' +
                            '</li>' +
                        '{{ /each }}' +
                    '</ul>',
                    '<div class="form-horizontal">' +
                        /*'<div class="form-group">' +
                            '<label class="control-label">分组名称</label>' +
                            '<div class="control-input">{{name}}</div>' +
                        '</div>' +
                        '<div class="form-group js-isName">' +
                            '<label class="ml10 mr10"><input type="checkbox" name="ck_isName" class="qkj-checkbox" {{if isName}} checked {{/if}}> 页面上显示商品分组名称</label>' +
                        '</div>' +*/
                        '{{if nameType == "2"}}<div class="form-group">' +
                            '<label class="control-label">第一级优先</label>' +
                            '<div class="control-input">' +
                                '<select class="form-control js-firstLevel">{{each firstLevel as value}}<option value="{{value.id }}" {{if firstLevelValue == value.id }}selected{{/if}}>{{ value.name }}</option>{{/each}}</select>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="control-label">第二级优先</label>' +
                            '<div class="control-input">' +
                                '<select class="form-control js-twoLevel">{{each twoLevel as value}}<option value="{{value.id }}" {{if twoLevelValue == value.id }}selected{{/if}}>{{ value.name }}</option>{{/each}}</select>' +
                            '</div>' +
                        '</div>{{/if}}' +
                        '<div class="form-group">' +
                            '<label class="control-label">列表样式</label>' +
                            '<div class="control-input">' +
                            '<label class="mr10"><input type="radio" name="g_rListStyle" class="qkj-radio" value="0" {{if listStyle == "0"}} checked {{/if}} > 大图</label>' +
                            '<label class="mr10"><input type="radio" name="g_rListStyle" class="qkj-radio" value="1" {{if listStyle == "1"}} checked {{/if}}> 小图</label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="control-label">商品样式</label>' +
                            '<div class="control-input">' +
                            '<label class="mr10"><input type="radio" name="g_rShopStyle" class="qkj-radio" value="0" {{if shopStyle == "0"}} checked {{/if}}> 卡片</label>' +
                            '<label class="mr10"><input type="radio" name="g_rShopStyle" class="qkj-radio" value="1" {{if shopStyle == "1"}} checked {{/if}}> 极简</label>' +
                            '</div>' +
                        '</div>' +
                        '{{if shopStyle == "0"}}<div class="form-group js-showCart">' +
                            '<label class="ml10 mr10"><input type="checkbox" name="ck_showBuy" class="qkj-checkbox" {{if showBuy}} checked {{/if}}> 显示购买按钮</label>' +
                            '<div class="ml30" {{if showBuy}}style="display:block"{{else}}style="display:none"{{/if}}>' +
                            '<label class="mr10"><input type="radio" name="g_rShowBuy" class="qkj-radio" value="0" {{if btnStyle == "0"}} checked {{/if}}> 加号</label>' +
                            '<label class="mr10"><input type="radio" name="g_rShowBuy" class="qkj-radio" value="1" {{if btnStyle == "1"}} checked {{/if}}> 购物车</label>' +
                            '<label class="mr10"><input type="radio" name="g_rShowBuy" class="qkj-radio" value="2" {{if btnStyle == "2"}} checked {{/if}}> ' +
                            '文字 ' +
                            '<input type="text" value="{{if btnText}}{{btnText}}{{else}}立即购买{{/if}}" size="6" class="form-control-inline g_btnInputText">' +
                            '</label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group js-showName">' +
                            '<label class="ml10 mr10"><input type="checkbox" name="g_ck_showTitle" class="qkj-checkbox" {{if showTitle}} checked {{/if}}> 显示商品名</label>' +
                            '</div>{{/if}}' +
                            '<div class="form-group">' +
                            '<label class="ml10 mr10"><input type="checkbox" name="g_ck_showPrice" class="qkj-checkbox"  {{if showPrice}} checked {{/if}}> 显示价格</label>' +
                        '</div>' +
                    '</div>'
                ],
                goods: [
                    '<ul class="ms-goods-list bg listStyle-{{ listStyle }} shopStyle-{{ shopStyle }}">' +
                        '{{ each list as value}}' +
                            '<li>' +
                                '<a href="javascript:;">' +
                                    '<div class="pic placeholder_auto"><img src="{{ value.src }}" alt=""></div>' +
                                    '<div class="info">' +
                                    '{{if showTitle}}<div class="title">{{ value.title }}</div>{{/if}}' +
                                    '{{if showBuy}}<div class="buy-btn btn{{btnStyle}}"><span>{{if btnText}} {{btnText}} {{/if}}</span><i class="icon-cart"></i></div>{{/if}}' +
                                    '{{if showPrice}}<div class="price">{{ value.price }}</div>{{/if}}' +
                                    '</div>' +
                                '</a>' +
                            '</li>' +
                        '{{ /each }}' +
                    '</ul>',
                    '<div class="form-horizontal">' +
                        '<div class="form-group">' +
                            '<label class="control-label">商品分组</label>' +
                            '<div class="control-input">' +
                                '<select class="form-control js-shopGroup">{{each shopGroup as value}}<option value="{{value.id }}" {{if shopGroupValue == value.id }}selected{{/if}}>{{ value.name }}</option>{{/each}}</select>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="control-label">显示个数</label>' +
                            '<div class="control-input">' +
                                '<label class="mr10"><input type="radio" name="rShopNumber" class="qkj-radio" value="6" {{if shopNumber == "6"}} checked {{/if}}> 6</label>' +
                                '<label class="mr10"><input type="radio" name="rShopNumber" class="qkj-radio" value="12" {{if shopNumber == "12"}} checked {{/if}}> 12</label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="control-label">列表样式</label>' +
                            '<div class="control-input">' +
                                '<label class="mr10"><input type="radio" name="rListStyle" class="qkj-radio" value="0" {{if listStyle == "0"}} checked {{/if}} > 大图</label>' +
                                '<label class="mr10"><input type="radio" name="rListStyle" class="qkj-radio" value="1" {{if listStyle == "1"}} checked {{/if}}> 小图</label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label class="control-label">商品样式</label>' +
                            '<div class="control-input">' +
                                '<label class="mr10"><input type="radio" name="rShopStyle" class="qkj-radio" value="0" {{if shopStyle == "0"}} checked {{/if}}> 卡片</label>' +
                                '<label class="mr10"><input type="radio" name="rShopStyle" class="qkj-radio" value="1" {{if shopStyle == "1"}} checked {{/if}}> 极简</label>' +
                            '</div>' +
                        '</div>' +
                        '{{if shopStyle == "0"}}<div class="form-group js-showCart">' +
                            '<label class="ml10 mr10"><input type="checkbox" name="ck_showBuy" class="qkj-checkbox" {{if showBuy}} checked {{/if}}> 显示购买按钮</label>' +
                            '<div class="ml30" {{if showBuy}}style="display:block"{{else}}style="display:none"{{/if}}>' +
                                '<label class="mr10"><input type="radio" name="rShowBuy" class="qkj-radio" value="0" {{if btnStyle == "0"}} checked {{/if}}> 加号</label>' +
                                '<label class="mr10"><input type="radio" name="rShowBuy" class="qkj-radio" value="1" {{if btnStyle == "1"}} checked {{/if}}> 购物车</label>' +
                                '<label class="mr10"><input type="radio" name="rShowBuy" class="qkj-radio" value="2" {{if btnStyle == "2"}} checked {{/if}}> ' +
                                    '文字 ' +
                                    '<input type="text" value="{{if btnText}}{{btnText}}{{else}}立即购买{{/if}}" size="6" class="form-control-inline btnInputText">' +
                                '</label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group js-showName">' +
                            '<label class="ml10 mr10"><input type="checkbox" name="ck_showTitle" class="qkj-checkbox" {{if showTitle}} checked {{/if}}> 显示商品名</label>' +
                        '</div>{{/if}}' +
                        '<div class="form-group">' +
                            '<label class="ml10 mr10"><input type="checkbox" name="ck_showPrice" class="qkj-checkbox"  {{if showPrice}} checked {{/if}}> 显示价格</label>' +
                        '</div>' +

                    '</div>'
                ],
                banner: [
                    '<div class="region-banner js-region-banner">' +
                        '{{if list.length}}' +
                            '<ul class="slide-wrap">' +
                                '{{each list as value}}<li><a href="javascript:;"><img src="{{if value.imgSrc}}{{value.imgSrc}}{{else}}{{defaultImg}}{{/if}}"></a></li>{{/each}}' +
                            '</ul>' +
                            '{{if list.length > 1}}<ul class="thumbnail">{{each list as value}}<li></li>{{/each}}</ul>{{/if}}' +
                        '{{else}}' +
                            '<ul class="slide-wrap">' +
                                '<li><a href="javascript:;"><img src="../../../img/mall/page_set/banner_default.jpg"></a></li>' +
                            '</ul>' +
                        '{{/if}}' +
                    '</div>',
                    '<div class="form-horizontal">' +
                        '{{if list.length}}{{each list as value index}}<dl class="dl-horizontal">' +
                            '<dt>' +
                                '<a href="javascript:;" id="imgBtn_{{index}}"></a>' +
                                '<img src="{{value.imgSrc}}" id="img_{{index}}" class="img-responsive" />' +
                                '<input type="hidden" id="imgHidden_{{index}}">' +
                            '</dt>' +
                            '<dd>' +
                                '<div class="form-group">' +
                                    '<label class="control-label">链接</label>' +
                                    '<div class="control-input">' +
                                        '<select class="form-control js-linkSelect">' +
                                            '<option value="">设置页面链接地址</option>' +
                                            '{{each options as option i}}' +
                                                '{{if i < 2}}<option value="{{i+1}}" {{if value.linkIndex !="" && (value.linkIndex == i+1)}}selected{{/if}}>{{option}}</option>' +
                                                '{{else}}<option value="{{i+2}}" {{if value.linkIndex !="" && (value.linkIndex == i+2)}}selected{{/if}}>{{option}}</option>{{/if}}' +
                                            '{{/each}}' +
                                        '</select>' +
                                        '<div class="mt5" {{if value.linkIndex !="" && "6" == value.linkIndex}}style="display:block"{{else}}style="display:none"{{/if}}>' +
                                            '<input type="text" size="9" class="form-control-inline" {{if value.inputValue}}value="{{value.inputValue}}{{/if}}">' +
                                            '<a href="javascript:;" class="ml5 js-banner-sure">确定</a>' +
                                        '</div>' +
                                        '{{if value.linkIndex == "7"}}<div class="link-select"><a href="#modalHomePage" data-toggle="modal" class="link js-link-select-banner"><span>商城页面</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#input_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                                        '{{if value.linkIndex == "8"}}<div class="link-select"><a href="#modalGoodsSale" data-toggle="modal" class="link js-link-select-banner"><span>商品</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#shopInput_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                                        '{{if value.linkIndex == "9"}}<div class="link-select"><a href="#modalGroupPage" data-toggle="modal" class="link js-link-select-banner"><span>商品分组</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#group_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                                    '</div>' +
                                '</div>' +
                                '<a href="javascript:;" class="close close-bg js-banner-close">×</a>' +
                            '</dd>' +
                        '</dl>{{/each}}{{/if}}' +
                        '<div class="form-group"><a href="javascript:;" class="add-banner js-add-banner"><i class="icon-plus"></i> 添加广告</a></div>' +
                        '<div class="text-gray-light">最多添加10个广告</div>' +
                    '</div>'
                ],
                nav:[
                    '{{if list.length}}<ul class="region-nav">' +
                        '{{each list as value}}<li><a href="javascript:;"><span class="pic"><img src="{{value.imgSrc}}"></span>{{if value.title}}<span class="title">{{value.title}}</span>{{/if}}</a></li>{{/each}}' +
                    '</ul>{{/if}}',
                    '<div class="form-horizontal">' +
                        '{{each list as value index}}<dl class="dl-horizontal">' +
                        '<dt>' +
                            '<a href="javascript:;" id="imgBtn_{{index}}"></a>' +
                            '<img src="{{value.imgSrc}}" id="img_{{index}}" class="img-responsive" />' +
                            '<input type="hidden" id="imgHidden_{{index}}">' +
                        '</dt>' +
                        '<dd>' +
                            '<div class="form-group">' +
                                '<label class="control-label">文字</label>' +
                                '<div class="control-input">' +
                                    '<input type="text" class="form-control js-nav-title" value="{{value.title}}">' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label class="control-label">链接</label>' +
                                '<div class="control-input">' +
                                    '<select class="form-control js-linkSelect-nav">' +
                                        '<option value="">设置页面链接地址</option>' +
                                        '{{each options as option i}}' +
                                            '{{if i < 2}}<option value="{{i+1}}" {{if value.linkIndex !="" && (value.linkIndex == i+1)}}selected{{/if}}>{{option}}</option>' +
                                            '{{else}}<option value="{{i+2}}" {{if value.linkIndex !="" && (value.linkIndex == i+2)}}selected{{/if}}>{{option}}</option>{{/if}}' +
                                        '{{/each}}' +
                                    '</select>' +
                                    '<div class="mt5" {{if value.linkIndex !="" && "6" == value.linkIndex}}style="display:block"{{else}}style="display:none"{{/if}}>' +
                                        '<input type="text" size="9" class="form-control-inline" {{if value.inputValue}}value="{{value.inputValue}}{{/if}}">' +
                                        '<a href="javascript:;" class="ml5 js-banner-sure">确定</a>' +
                                    '</div>' +
                                    '{{if value.linkIndex == "7"}}<div class="link-select"><a href="#modalHomePage" data-toggle="modal" class="link js-link-select-nav"><span>商城页面</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#input_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                                    '{{if value.linkIndex == "8"}}<div class="link-select"><a href="#modalGoodsSale" data-toggle="modal" class="link js-link-select-nav"><span>商品</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#shopInput_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                                    '{{if value.linkIndex == "9"}}<div class="link-select"><a href="#modalGroupPage" data-toggle="modal" class="link js-link-select-nav"><span>商品分组</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#group_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                                '</div>' +
                            '</div>' +
                        '</dd>' +
                    '</dl>{{/each}}' +
                    '</div>'
                ],
                search: [
                    '<div class="region-search" style="background-color:{{defaultColor}}">' +
                        '<form action="/" method="GET">' +
                            '<input class="form-control" placeholder="搜索商品" type="text">' +
                            '<button type="submit" class="search-btn">搜索</button>' +
                        '</form>' +
                    '</div>',
                    '<div class="js-search">' +
                        '<div id="js-colorpicker" class="dropdown-m">' +
                            '<a href="javascript:;" class="dropdown-switch js-DropdownBt">' +
                                '<span class="js-bt-label" style="background-color:{{defaultColor}}">{{defaultColor}}</span>' +
                            '</a>' +
                            '<ul class="dropdown-data js-dropdownList"></ul>' +
                        '</div>' +
                    '</div>'
                ],
                /*richText: [
                    '<div class="region-richText">{{ if text != ""}} {{@text}} {{else}} <p>点此编辑『富文本』内容 ——&gt;</p><p>你可以对文字进行<strong>加粗</strong>、<em>斜体</em>、<span style="text-decoration: underline;">下划线</span>、<span style="text-decoration: line-through;">删除线</span>、文字<span style="color: rgb(0, 176, 240);">颜色</span>、<span style="background-color: rgb(255, 192, 0); color: rgb(255, 255, 255);">背景色</span>、以及字号<span style="font-size: 20px;">大</span><span style="font-size: 14px;">小</span>等简单排版操作。</p><p>还可以在这里加入表格了</p><table><tbody><tr><td style="word-break: break-all;" width="93" valign="top">中奖客户</td><td style="word-break: break-all;" width="93" valign="top">发放奖品</td><td style="word-break: break-all;" width="93" valign="top">备注</td></tr><tr><td style="word-break: break-all;" width="93" valign="top">猪猪</td><td style="word-break: break-all;" width="93" valign="top">内测码</td><td style="word-break: break-all;" width="93" valign="top"><em><span style="color: rgb(255, 0, 0);">已经发放</span></em></td></tr><tr><td style="word-break: break-all;" width="93" valign="top">大麦</td><td style="word-break: break-all;" width="93" valign="top">积分</td><td style="word-break: break-all;" width="93" valign="top"><a href="javascript: void(0);" target="_blank">领取地址</a></td></tr></tbody></table><p style="text-align: left;"><span style="text-align: left;">也可在这里插入图片、并对图片加上超级链接，方便用户点击。</span></p>  {{/if}}</div>'
                ]*/
            },
            ue: '',
        }, options);

        this.settings = settings; //设置为该对象的属性
        this.init(settings);  //初始化
    };

    tpl_groupAdd.prototype = {
        init: function (opts) {
            var _this = this,
                //商品初始数据
                data_goods = {
                    type:'goods',  //功能类型
                    shopGroup: [],  //分组商品
                    shopGroupValue: '1',  //分组选中值
                    shopNumber: '6',  //显示个数
                    listStyle: '1', //列表样式
                    shopStyle: '0', //商品样式
                    showBuy: true, //是否显示购买按钮
                    btnStyle: '0',  //按钮样式
                    btnText: '',   //按钮文字
                    showTitle: false, //是否显示标题
                    showPrice: true, //是否显示价格
                    list: [
                        {
                            src:'../../../img/qrcode_default.jpg',
                            title: '此处显示商品名称',
                            price:'￥379.00'
                        },
                        {
                            src:'../../../img/qrcode_default.jpg',
                            title: '此处显示商品名称',
                            price:'￥200.00'
                        },
                        {
                            src:'../../../img/qrcode_default.jpg',
                            title: '模板页获取例子3',
                            price:'￥250.00'
                        },
                        {
                            src:'../../../img/qrcode_default.jpg',
                            title: '此处显示商品名称',
                            price:'￥80.00'
                        }
                    ]
                },
                //广告初始数据
                data_banner = {
                    type:'banner',  //功能类型
                    options:['商城主页','会员中心','全部商品','在线客服','自定义外链','商城页面','商品','商品分组','积分商城'],
                    defaultImg: '../../../img/mall/page_set/banner_default.jpg',
                    list: []
                },
                data_nav = {
                    type:'nav',
                    options:['商城主页','会员中心','全部商品','在线客服','自定义外链','商城页面','商品','商品分组','积分商城'],
                    list:[
                        {
                            imgSrc: '',
                            title: '',
                            linkIndex: ''
                        },
                        {
                            imgSrc: '',
                            title: '',
                            linkIndex: ''
                        },
                        {
                            imgSrc: '',
                            title: '',
                            linkIndex: ''
                        },
                        {
                            imgSrc: '',
                            title: '',
                            linkIndex: ''
                        }
                    ]
                },
                data_search = {
                    type:'search',
                    defaultColor: '#ffffff'
                },
                data_richText = {
                    type:'richText',
                    text: ''
                };

            //获取商品分组
            $.ajax({
                url: '/pageset/feature/get-group.html',
                type: "GET",
                dataType: 'json',
                success: function(res){
                    data_goods.shopGroup = res;
                    if(data_goods.shopGroup == 1){
                        data_goods.shopGroupValue == res[0].id;
                    }
                    //判断数据第一项如果没有TITLE的话就插入到数组第一个里面
                    if(opts.data[0].type != 'title'){
                        opts.data.unshift({
                            type:'title',
                            name: '',  //店铺名字
                            description: '', //页面描述
                            src: '' //商品样式
                        });
                    }

                    //初始化数据
                    if(opts.data.length){
                        $.each(opts.data, function (i,o) { //加载数据
                            if(o.type != 'title'){
                                if(!!o.options){
                                    o.options = data_banner.options;
                                    _this.addTpl(o);
                                }else if(o.type == 'group'){
                                    o.firstLevel = [{"id":"2","name":"兑换量越高越靠前"},{"id":"3","name":"浏览量越高越靠前"}];
                                    o.twoLevel = [{"id":"1","name":"创建时间越晚越靠前"},{"id":"2","name":"创建时间越早越靠前"},{"id":"3","name":"兑换量越高越靠前"}];
                                    _this.addTpl(o);
                                }else{
                                    _this.addTpl(o);
                                }
                            }
                        });
                        $.each(_this.module, function (name, method) { //加载模块里的功能
                            switch (name){
                                case "title":
                                    method(_this,opts.data[0]);
                                    break;
                                case "group":
                                    method(_this);
                                    break;
                                case "goods":
                                    method(_this,data_goods);
                                    break;
                                case "banner":
                                    method(_this,data_banner);
                                    break;
                                case "nav":
                                    method(_this,data_nav);
                                    break;
                                case "search":
                                    method(_this,data_search);
                                    break;
                                // case "richText":
                                //     method(_this,data_richText);
                                //     break;
                            }

                        });
                    }
                }
            });

            //排序
            $(".ui-sortable").sortable({
                stop: function( event, ui ) {
                    $(ui.item).trigger('click');
                }
            });
            //模块之间点击选中样式
            $(document).on("click", ".region",function (){
                var hiddenData = '';
                template_com.methods.removeClass("editing");
                _this.setInitSelected(this,_this);
            });
            //删除模块
            $(document).on("click", ".js-delete",function (e){
                $(this).parents(".region").remove();
                if(!$(opts.tpl_preview).html()){
                    $(opts.tpl_form).html('');
                    $(".js-ms-form").hide();
                }else{
                    $(".region:first").trigger('click');
                }
                util.stopPropagation(e);
            });

            //初始化公共方法
            template_com.methods.moduleCommon(_this,opts);
        },
        module:{
            title: function (_this,data) {
                var $msTitle = $(".js-ms-title"),
                    str_form = '';

                function setTemp(data){
                    str_form = template_com.methods.tplFun(data, _this.settings.data_tpl[data.type]);

                    template_com.methods.removeClass("editing");
                    $msTitle.find(".hiddenData").val(JSON.stringify(data));
                    //生成的模板放入到右边
                    $(".js-ms-form-title").html(str_form);

                    $('#shareImgBtn').uploadify({
                        uploader: _this.settings.upload_url + '/upload.php',// 服务器处理地址
                        swf: '/js/lib/uploadify/uploadify.swf',
                        buttonText: "选择图片",//按钮文字
                        height: 34,  //按钮高度
                        width: 82, //按钮宽度
                        fileSizeLimit: 2048,
                        fileTypeExts: '*.jpg;*.png;*.jpeg;',//允许的文件类型
                        fileTypeDesc: "请选择图片文件", //文件说明
                        formData: { 'folder' : 'mall_page_item', 'thumb':'750_0@750*0,375_375@375*375,300_300@300*300'}, //提交给服务器端的参数
                        onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                            eval("var jsondata = " + data + ";");
                            var key = jsondata['key'];
                            var fileName = jsondata['fileName'];

                            var path = _this.settings.upload_url + '/images/mall_page_item/source/' + fileName;
                            $('#shareImgHidden').val(fileName);

                            // 隐藏域取值/赋值
                            var initHiddenData = JSON.parse($msTitle.find(".hiddenData").val());
                            initHiddenData.src = path ;
                            $msTitle.find(".hiddenData").val(JSON.stringify(initHiddenData));
                            $('#shareImg').attr('src', path);
                        }
                    });
                }
                setTemp(data);
                //页面名称
                $(document).on('change', '.js-t-title', function () {
                    var hiddenData = JSON.parse($msTitle.find(".hiddenData").val());

                    $msTitle.find('span').html($(this).val());
                    hiddenData.name = $(this).val();
                    $msTitle.find(".hiddenData").val(JSON.stringify(hiddenData));
                    $(this).next().hide(); //隐藏错误提示
                });
                //页面描述
                $(document).on('change', '.js-title-desc', function () {
                    var hiddenData = JSON.parse($msTitle.find(".hiddenData").val());

                    hiddenData.description = $(this).val();
                    $msTitle.find(".hiddenData").val(JSON.stringify(hiddenData));
                });
            },
            group: function (_this,data) {
                setTimeout(function () {
                   $(".region").eq(0).click();
                });
                //是否显示商品名称
                $(document).on("click", "input[name='ck_isName']",function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    _this.isToggle($(this),'isName',hiddenData);
                });
                //第一级优先
                $(document).on("change", ".js-firstLevel",function () {
                    var index = $(this).val(),
                        hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.firstLevelValue = index;
                    _this.editTpl(hiddenData);
                });
                //第二级优先
                $(document).on("change", ".js-twoLevel",function () {
                    var index = $(this).val(),
                        hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.twoLevelValue = index;
                    _this.editTpl(hiddenData);
                });
                //列表样式
                $(document).on("click", "input[name='g_rListStyle']",function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.listStyle = $(this).val();
                    _this.editTpl(hiddenData);
                });
                //商品样式
                $(document).on("click", "input[name='g_rShopStyle']",function () {
                    var index = $(this).val(),
                        hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.shopStyle = index;
                    _this.editTpl(hiddenData);
                    if(index == '1'){
                        $('.js-showCart').hide();
                        $('.js-showName').hide();
                    }else{
                        $('.js-showCart').show();
                        $('.js-showName').show();
                    }
                });
                //按钮样式选择
                $(document).on("click", "input[name='g_rShowBuy']",function () {
                    var index = $(this).val(),
                        text = $(this).parent().find(".g_btnInputText"),
                        hiddenData = JSON.parse($(".editing").find(".hiddenData").val());;

                    hiddenData.btnStyle = index;
                    //如果是文字按钮
                    if(text && index == "2"){
                        hiddenData.btnText = text.val();
                    }
                    _this.editTpl(hiddenData)
                });
                //是否显示购买按钮
                $(document).on("click", "input[name='g_ck_showBuy']",function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    _this.isToggle($(this),'showBuy',hiddenData);
                    if($(this).prop("checked")){
                        $(this).parent().next().show();
                    }else{
                        $(this).parent().next().hide();
                    }
                });
                //是否显示商品名称
                $(document).on("click", "input[name='g_ck_showTitle']",function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    _this.isToggle($(this),'showTitle',hiddenData);
                });
                //是否显示价格
                $(document).on("click", "input[name='g_ck_showPrice']",function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    _this.isToggle($(this),'showPrice',hiddenData);
                });
                //按文字输入的按钮样式选择
                $(document).on("change", ".g_btnInputText",function () {
                    var text = $(this).val(),
                        hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.btnText = text ? text : '立即购买';  //如果为空，则变成“立即购买”
                    _this.editTpl(hiddenData)
                });
            },
            goods: function (_this,data) {
                //商品添加
                $("#ms_goods").click(function () {
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last",_this); //最后一个选中

                    //当用户不去改变商品列表的商品分组时，在添加的时候把商品分组的当前项赋值给左侧的当前的商品列表模块
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.shopGroupValue = $(".js-shopGroup").find("option:selected").val();
                    $(".editing").find(".hiddenData").val(JSON.stringify(hiddenData));
                });
                //列表样式
                $(document).on("click", "input[name='rListStyle']",function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.listStyle = $(this).val();
                    _this.editTpl(hiddenData);
                });
                //选择的商品分组
                $(document).on("change", ".js-shopGroup",function () {
                    var index = $(this).val(),
                        hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.shopGroupValue = index;
                    _this.editTpl(hiddenData);
                });
                //显示个数
                $(document).on("click", "input[name='rShopNumber']",function () {
                    var index = $(this).val(),
                        hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.shopNumber = index;
                    _this.editTpl(hiddenData);
                });
                //商品样式
                $(document).on("click", "input[name='rShopStyle']",function () {
                    var index = $(this).val(),
                        hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.shopStyle = index;
                    _this.editTpl(hiddenData);
                    if(index == '1'){
                        $('.js-showCart').hide();
                        $('.js-showName').hide();
                    }else{
                        $('.js-showCart').show();
                        $('.js-showName').show();
                    }
                });
                //按钮样式选择
                $(document).on("click", "input[name='rShowBuy']",function () {
                    var index = $(this).val(),
                        text = $(this).parent().find(".btnInputText"),
                        hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.btnStyle = index;
                    //如果是文字按钮
                    if(text && index == "2"){
                        hiddenData.btnText = text.val();
                    }
                    _this.editTpl(hiddenData)
                });
                //是否显示购买按钮
                $(document).on("click", "input[name='ck_showBuy']",function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    _this.isToggle($(this),'showBuy',hiddenData);
                    if($(this).prop("checked")){
                        $(this).parent().next().show();
                    }else{
                        $(this).parent().next().hide();
                    }
                });
                //是否显示商品名称
                $(document).on("click", "input[name='ck_showTitle']",function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    _this.isToggle($(this),'showTitle',hiddenData);
                });
                //是否显示价格
                $(document).on("click", "input[name='ck_showPrice']",function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    _this.isToggle($(this),'showPrice',hiddenData);
                });
                //按文字输入的按钮样式选择
                $(document).on("change", ".btnInputText",function () {
                    var text = $(this).val(),
                        hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.btnText = text ? text : '立即购买';
                    _this.editTpl(hiddenData)
                });
            },
            banner: function (_this,data) {
                //设置高度
                setTimeout(function(){
                    template_com.methods.runSetHeight();
                }, 500);

                //添加图片广告模块
                $("#ms_banner").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last",_this); //最后一个选中
                });
                //模块里添加广告，控制10个
                $(document).on('click', '.js-add-banner',function () {
                    var length = $(this).parent().parent().find("dl").length,
                        initHiddenData = '';

                    if(length > 10){
                        layer.msg('最多添加10个广告')
                    }else{
                        initHiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                        initHiddenData.list.push({
                            url:'',
                            imgSrc: '',
                            title: '',
                            linkIndex: '',
                            inputValue: ''
                        });
                        _this.editTpl(initHiddenData);
                        template_com.methods.runSetHeight();
                    }
                });
                //删除模块里添加广告项
                $(document).on('click', '.js-banner-close',function () {
                    var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".dl-horizontal").index($(this).parent().parent());

                    $(this).parent().parent().remove();
                    initHiddenData.list.splice(index,1);
                    _this.editTpl(initHiddenData);
                    template_com.methods.runSetHeight();
                });
                //选择链接
                $(document).on('change', '.js-linkSelect', function () {
                    _this.setLinkSelect({
                        type: 'banner',
                        element: $(this),
                        _window:_this
                    });
                });
                //重新选择链接
                $(document).on('click', '.js-link-select-banner', function () {
                    _this.setLinkSelect({
                        type: 'banner',
                        element: $(this).parent().parent().find('.form-control'),
                        _window:_this,
                        id: $(this).find("span:last-child").attr("class").split("_")[1]//获取当前的选中的id
                    });
                });
                //自定义外链输入框变化
                $(document).on('click', '.js-banner-sure', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".dl-horizontal").index($(this).parents(".dl-horizontal"));

                    hiddenData.list[index].url = $(this).prev().val();
                    hiddenData.list[index].inputValue = $(this).prev().val();
                    _this.editTpl(hiddenData);
                    template_com.methods.runSetHeight();
                });
                //标题
                $(document).on('change', '.js-banner-title', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".ms-form .dl-horizontal").index($(this).parents(".dl-horizontal"));
                    hiddenData.list[index].title = $(this).val();
                    _this.editTpl(hiddenData);
                    template_com.methods.runSetHeight();
                });
            },
            nav: function (_this,data) {
                //添加图片导航模块
                $("#ms_nav").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last",_this); //最后一个选中
                });

                //选择链接
                $(document).on('change', '.js-linkSelect-nav', function () {
                    _this.setLinkSelect({
                        type: '',
                        element: $(this),
                        _window:_this
                    });
                });
                //重新选择链接
                $(document).on('click', '.js-link-select-nav', function () {
                    _this.setLinkSelect({
                        type: '',
                        element: $(this).parent().parent().find('.form-control'),
                        _window:_this,
                        id: $(this).find("span:last-child").attr("class").split("_")[1]//获取当前的选中的id
                    });
                });
                //自定义外链输入框变化
                $(document).on('click', '.js-banner-sure', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".dl-horizontal").index($(this).parents(".dl-horizontal"));

                    hiddenData.list[index].url = $(this).prev().val();
                    hiddenData.list[index].inputValue = $(this).prev().val();
                    _this.editTpl(hiddenData);
                    template_com.methods.runSetHeight();
                    return false;
                });
                //标题
                $(document).on('change', '.js-nav-title', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".dl-horizontal").index($(this).parents(".dl-horizontal"));
                    console.log(index);
                    hiddenData.list[index].title = $(this).val();
                    _this.editTpl(hiddenData);
                });
            },
            search: function (_this,data) {
                //添加图片广告模块
                $("#ms_search").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    template_com.methods.setColor(".js-dropdownList");  //设置颜色
                });

                // 颜色选择
                $(document).on('click','.js-DropdownBt',function (e) {
                    util.stopPropagation(e);
                    $(this).parent().addClass('open');
                });
                $(document).on('click','.js-dropdownList li',function (e) { //点击每个颜色操作
                    var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        color = '';

                    $(this).parent().parent().removeClass('open');
                    color = $(this).find("a").html();
                    $(".js-bt-label").css({'background-color': color}).html(color);
                    initHiddenData.defaultColor = color ;
                    _this.editTpl(initHiddenData);
                });
                $(document).click(function () { //点击颜色区域外的地方关闭颜色选择框
                    $("#js-colorpicker").removeClass('open');
                });
            },
            richText: function (_this,data) {
                var ue = _this.settings.ue;
                //改变的时候
                ue.on("contentChange", function () {
                    data.text = ue.getContent();
                    var str_l = template_com.methods.tplFun(data, _this.settings.data_tpl[data.type][0]);
                    $('.editing .js-control-group').html(str_l).prev().val(JSON.stringify(data)); //左边
                    template_com.methods.compute(_this.settings.tpl_form);
                });

                //添加图片广告模块
                $("#ms_richText").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last",_this); //最后一个选中
                    ue.setContent(''); //清空文本编辑器内容
                });
            }
        },
        addTpl: function (data) { //添加左侧模板
            var str_l = template_com.methods.tplFun(data, this.settings.data_tpl[data.type][0]),
                tpl_l = "<div class='region'>" +
                    "<input type='hidden' class='hiddenData' value=\'"+ JSON.stringify(data) +"\'>" +
                    "<div class='js-control-group'>" + str_l;

            // 分组的没有删除
            if(data.type == "group"){
                tpl_l += "</div><div class='actions'><div class='actions-wrap'><span class='action js-edit'>编辑</span></div></div>";
            }else{
                tpl_l += "</div><div class='actions'><div class='actions-wrap'><span class='action js-edit'>编辑</span><span class='action js-delete'>删除</span></div></div></div>";
            }

            template_com.methods.removeClass("editing");
            $(this.settings.tpl_preview).append(tpl_l); //左边
            $(".js-ms-form").show(); //右侧大框显示
            if(data.type == 'nav' || data.type == 'banner'){//加载上传图片
                this.uploadFun(data.list.length, this.settings.upload_url);
            }

        },
        editTpl: function (data) { //编辑模板
            var str_l = template_com.methods.tplFun(data, this.settings.data_tpl[data.type][0]), //获得对应的左侧模板
                str_form = '';
            $('.editing .js-control-group').html(str_l).prev().val(JSON.stringify(data)); //左边
            //判断是不是文本编辑器类型
            if(data.type != 'richText'){
                str_form = template_com.methods.tplFun(data, this.settings.data_tpl[data.type][1]);
                $(this.settings.tpl_form).html(str_form); //右边
                if(data.type == 'search'){
                    template_com.methods.setColor(".js-dropdownList");
                }
            }else{
                $(this.settings.tpl_form).html("<div id='container'></div>");
                this.settings.ue = UE.getEditor('container', {
                    toolbars: [
                        ['bold', 'source', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc','edittable','edittd', 'link']
                    ]
                });
            }
            template_com.methods.compute(this.settings.tpl_form);  //计算高度
            if(data.type == 'nav' || data.type == 'banner'){ //加载上传图片
                this.uploadFun(data.list.length,this.settings.upload_url);
            }
        },
        isToggle: function (element, attr, data) { //判断多选框
            if(element.prop("checked")){
                data[attr] = true;
            }else{
                data[attr] = false;
            }
            this.editTpl(data)
        },
        setInitSelected: function (element,_this) {  //第一个元素选中
            if($(element).length){
                $(element).addClass('editing');
                var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                this.editTpl(initHiddenData);
                if (_this && initHiddenData.type == 'banner'){
                    template_com.methods.runSetHeight();
                }
            }
        },
        setLinkSelect: function (option) {  //上传图片 链接选择功能
            var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                index = $(".ms-form .dl-horizontal").index(option.element.parents(".dl-horizontal")),
                radioChecked = '';

            //自定义外链，显示外链输入框
            if(option.element.val() == "6"){
                option.element.next().show();
            }else{
                option.element.next().hide();
            }

            hiddenData.list[index].linkIndex = option.element.val();

            //如果是7、8、9的话，
            switch (option.element.val()){
                case "7":
                    $("#modalHomePage").modal();

                    //如果id的值存在,则勾选弹出框的值
                    $("input[name='ckMall']").prop("checked", false);
                    if(option.id){
                        $("#input_"+option.id).parents("tr").find("input").prop("checked", true);
                    }

                    //未点击确定的情况下关闭弹出框
                    $("#modalHomePage").on('hide.bs.modal', function () {
                        option.element.val("");
                    });

                    //弹出框“确定”按钮点击
                    $("#btnHomePage").click(function () {
                        radioChecked = $("input[name='ckMall']:checked");
                        //获取选择商城页面的id
                        hiddenData.list[index].checkedId = radioChecked.val();
                        option._window.editTpl(hiddenData);
                        if(option.type == 'banner'){
                            template_com.methods.runSetHeight();
                        }
                    });

                    break;
                case "8":
                    $("#modalGoodsSale").modal();

                    //如果id的值存在,则勾选弹出框的值
                    $("input[name='ckShop']").prop("checked", false);
                    if(option.id){
                        $("#shopInput_"+option.id).parents("tr").find("input").prop("checked", true);
                    }

                    //未点击确定的情况下关闭弹出框
                    $("#modalGoodsSale").on('hide.bs.modal', function () {
                        option.element.val("");
                    });

                    //弹出框“确定”按钮点击
                    $("#btnGoodsSale").click(function () {
                        radioChecked = $("input[name='ckShop']:checked");
                        //获取选择商城页面的id
                        hiddenData.list[index].checkedId = radioChecked.val();
                        option._window.editTpl(hiddenData);
                        if(option.type == 'banner'){
                            template_com.methods.runSetHeight();
                        }
                    });
                    break;
                case "9":
                    $("#modalGroupPage").modal();

                    //如果id的值存在,则勾选弹出框的值
                    $("input[name='ckGroup']").prop("checked", false);
                    if(option.id){
                        $("#group_"+option.id).parents("tr").find("input").prop("checked", true);
                    }

                    //未点击确定的情况下关闭弹出框
                    $("#modalGroupPage").on('hide.bs.modal', function () {
                        option.element.val("");
                    });

                    //弹出框“确定”按钮点击
                    $("#btnGroupPage").click(function () {
                        radioChecked = $("input[name='ckGroup']:checked");
                        //获取选择商城页面的id
                        hiddenData.list[index].checkedId = radioChecked.val();
                        option._window.editTpl(hiddenData);
                        if(option.type == 'banner'){
                            template_com.methods.runSetHeight();
                        }
                    });
                    break;
                default:
                    this.editTpl(hiddenData);
            }

            if(option.type == 'banner'){
                template_com.methods.runSetHeight();
            }
        },

        uploadFun: function (len,upload_url) {
            var $editing = $(".editing"),
                length = '',
                _this = this;
            //循环加载上传软件
            setTimeout(function () {
                length = $(".ms-form .dl-horizontal").length;
                for(var i = 0,len=length; i<len; i++) {
                    $('#imgBtn_' + i).uploadify({
                        uploader: upload_url + '/upload.php',// 服务器处理地址
                        swf: '/js/lib/uploadify/uploadify.swf',
                        buttonText: "选择图片",//按钮文字
                        height: 34,  //按钮高度
                        width: 82, //按钮宽度
                        fileSizeLimit: 2048,
                        fileTypeExts: '*.jpg;*.png;*.jpeg;',//允许的文件类型
                        fileTypeDesc: "请选择图片文件", //文件说明
                        formData: { 'folder' : 'mall_page_item', 'thumb':'750_0@750*0,375_375@375*375'}, //提交给服务器端的参数
                        onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                            eval("var jsondata = " + data + ";");
                            var key = jsondata['key'];
                            var fileName = jsondata['fileName'];
                            var obj = '';

                            var path = upload_url + '/images/mall_page_item/750_0/' + fileName;
                            //获取当前对象父元素的兄弟元素并赋值
                            obj = $("#" + file.id.substr(0,file.id.length-2));
                            $parent = obj.parent().parent();
                            $parent.find("input").val(fileName);
                            $parent.find("img").attr('src', path);

                            // 隐藏域取值/赋值
                            var hiddenData = JSON.parse($editing.find(".hiddenData").val()),
                                index = $(".ms-form .dl-horizontal").index(obj.parents(".dl-horizontal"));
                            hiddenData.list[index].imgSrc = path;
                            $editing.find(".hiddenData").val(JSON.stringify(hiddenData));
                            _this.editTpl(hiddenData);
                            setTimeout(function () {
                                template_com.methods.runSetHeight();
                            },400)
                        }
                    });
                }
            },200);
        },
    };

    window.tpl_groupAdd = window.tpl_groupAdd || tpl_groupAdd;
})(window, jQuery);

