$(function () {
    // 滚动置顶
    util.setScrollFixed('.js-region-add');
});

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
                '<input type="text" class="form-control js-t-title" id="t_title" name="t_title" value="{{name}}" >' +
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
                '<div class="img">{{if src}}<img src="{{img_url}}{{src}}" id="shareImg" class="img-responsive w100" />{{/if}}</div>' +
                '<input type="hidden" id="shareImgHidden">' +
                '</div>' +
                '</div>' +
                '</div>',
                group: [
                    '{{if isName}}<h5 class="mt10 plr15 text-gray">{{name}}</h5>{{/if}}' +
                    '<ul class="ms-goods-list bg listStyle-{{ listStyle }} shopStyle-{{ shopStyle }}">' +
                    '{{ each list value}}' +
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
                    '<label class="control-label">分组名称</label>' +
                    '<div class="control-input">{{name}}</div>' +
                    '</div>' +
                    '<div class="form-group js-isName">' +
                    '<label class="ml10 mr10"><input type="checkbox" name="ck_isName" class="qkj-checkbox" {{if isName}} checked {{/if}}> 页面上显示商品分组名称</label>' +
                    '</div>' +
                    '{{if nameType == "2"}}<div class="form-group">' +
                    '<label class="control-label">第一级优先</label>' +
                    '<div class="control-input">' +
                    '<select class="form-control js-firstLevel">{{each firstLevel value}}<option value="{{value.id }}" {{if firstLevelValue == value.id }}selected{{/if}}>{{ value.name }}</option>{{/each}}</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">第二级优先</label>' +
                    '<div class="control-input">' +
                    '<select class="form-control js-twoLevel">{{each twoLevel value}}<option value="{{value.id }}" {{if twoLevelValue == value.id }}selected{{/if}}>{{ value.name }}</option>{{/each}}</select>' +
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
                banner: [
                    '<div class="region-banner js-region-banner">' +
                    '{{if list.length}}' +
                    '<ul class="slide-wrap">' +
                    '{{each list value}}<li><a href="javascript:;"><img src="{{if value.imgSrc}}{{img_url}}{{value.imgSrc}}{{else}}{{defaultImg}}{{/if}}"></a></li>{{/each}}' +
                    '</ul>' +
                    //'{{if list.length > 1}}<ul class="thumbnail">{{each list value}}<li></li>{{/each}}</ul>{{/if}}' +
                    '{{else}}' +
                    '<ul class="slide-wrap">' +
                        '<li><a href="javascript:;"><img src="../../../img/mall/page_set/banner_default.jpg"></a></li>' +
                    '</ul>' +
                    '{{/if}}' +
                    '</div>',

                    '<div class="form-horizontal r-banner-wrap">' +
                    '<div class="form-group r-banner-style">' +
                        '<label class="control-label">选择模板</label>' +
                        '<div class="control-input">' +
                            '<ul class="image-list js-r-banner-style-ul">' +
                            '<li data-index="1" {{if style==1}}class="active"{{/if}}><img src="../../../img/mall/page_set/banner_style1.png"><span>轮播海报</span></li>' +
                            '<li data-index="4" {{if style==4}}class="active"{{/if}}><img src="../../../img/mall/page_set/banner_style4.png"><span>1行1个</span></li>' +
                            '<li data-index="5" {{if style==5}}class="active"{{/if}}><img src="../../../img/mall/page_set/banner_style5.png"><span>横向滑动 (大)</span></li>' +
                            '<li data-index="2" {{if style==2}}class="active"{{/if}}><img src="../../../img/mall/page_set/banner_style2.png"><span>横向滑动 (小)</span></li>' +
                            '<li data-index="3" {{if style==3}}class="active"{{/if}}><img src="../../../img/mall/page_set/banner_style3.png"><span>横向滑动 (导航)</span></li>' +
                            /*'<li data-index="6" {{if style==6}}class="active"{{/if}}><img src="../../../img/mall/page_set/banner_style6.png"><span>绘制热区</span></li>' +*/
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                    '{{if style!=1 && style!=6}}<div class="form-group">' +
                    '<label class="control-label">图片间隙</label>' +
                    '<div class="control-input">' +
                    '<div class="guide-slider js-guideBar">' +
                    '<div class="ratings_bars">' +
                    '<div class="scale" id="bar0">' +
                    '<div style="width:{{margin*5.5}}px"></div>' +
                    '<span class="banner-slider-btn" style="left:{{margin*5.5}}px"></span>' +
                    '</div>' +
                    '<input type="text" class="bars_10 bars_input" value="{{margin}}" /> 像素' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>{{/if}}' +
                    '{{if style==3}}<div class="form-group">' +
                    '<label class="control-label">一屏显示</label>' +
                    '<div class="control-input">' +
                    '<select class="form-control w100 js-lineDisplay"><option value="1" {{if lineDisplay == 1}}selected{{/if}}>4张图片</option><option value="2"{{if lineDisplay == 2}}selected{{/if}}>5张图片</option><option value="3"{{if lineDisplay == 3}}selected{{/if}}>6张图片</option></select>' +
                    '</div>' +
                    '</div>{{/if}}' +
                    '{{if list.length}}' +
                    '{{if style==6}}' +
                        '{{each hot value index}}'+
                        '<div class="banner-hot"><a href="#modalhot" data-toggle="modal" data-index="{{index}}"><img src="{{value.imgSrc}}" /></a>' +
                        '{{if hot.length}}<div class="banner-hot_flag">已添加{{hot.length}}个热区</div></div>{{/if}}' +
                        '{{/each}}'+
                        '<div class="h6 mt10 mb10 text-gray-light">点击图片打开热区编辑器</div>' +
                    '{{else}}' +
                        '{{each list value index}}<dl class="dl-horizontal">' +
                        '<dt>' +
                            '<a href="javascript:;" id="imgBtn_{{index}}"></a>' +
                            '{{if value.imgSrc}}<img src="{{img_url}}{{value.imgSrc}}" id="img_{{index}}" class="img-responsive" />{{/if}}' +
                            '<input type="hidden" id="imgHidden_{{index}}">' +
                        '</dt>' +
                        '<dd>' +
                            '<div class="form-group">' +
                            '<label class="control-label">标题</label>' +
                            '<div class="control-input">' +
                            '<input type="text" class="form-control js-title" data-index="1" value="{{value.title}}" >' +
                            '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label class="control-label">链接</label>' +
                                '<div class="control-input">' +
                                    '<select class="form-control js-linkSelect" data-index="1" required title="请选择链接" name="linkSelect_{{index}}">' +
                                    '<option value="">设置页面链接地址</option>' +
                                    '{{each options option}}' +
                                    '<option value="{{option.id}}" {{if value.linkIndex !="" && (value.linkIndex == option.id)}}selected{{/if}}>{{option.name}}</option>' +
                                    '{{/each}}' +
                                    '</select>' +
                                    '<div class="mt5" {{if value.linkIndex !="" && "6" == value.linkIndex}}style="display:block"{{else}}style="display:none"{{/if}}>' +
                                    '<input type="text" size="9" class="form-control-inline" {{if value.inputValue}}value="{{value.inputValue}}{{/if}}">' +
                                    '<a href="javascript:;" class="ml5 js-sure" data-index="1">确定</a>' +
                                    '</div>' +
                                    '{{if value.linkIndex == "7"}}<div class="link-select"><a href="#modalHomePage" data-toggle="modal" class="link js-link-select" data-index="1"><span>微页面</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#input_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}' +
                                    '{{if value.linkIndex == "8"}}<div class="link-select"><a href="#modalGoodsSale" data-toggle="modal" class="link js-link-select" data-index="1"><span>商品</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#shopInput_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}' +
                                    '{{if value.linkIndex == "9"}}<div class="link-select"><a href="#modalGroupPage" data-toggle="modal" class="link js-link-select" data-index="1"><span>商品分组</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#group_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}' +
                                    '{{if value.linkIndex == "12"}}<div class="link-select"><a href="#modalReserve" data-toggle="modal" class="link js-link-select" data-index="1"><span>预约</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#reserve_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}' +
                                    '{{if value.linkIndex == "14"}}<div class="link-select"><a href="#modalWx_applet" data-toggle="modal" class="link js-link-select" data-index="1"><span>小程序</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#wxappletName_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}' +
                                '</div>' +
                            '</div>' +
                            '{{if value.linkIndex !="" && "13" == value.linkIndex}}<div class="form-group">' +
                                '<label class="control-label"><em class="text-danger">*</em>联系电话</label>' +
                                '<div class="control-input">' +
                                '<input type="text" class="form-control js-phone" value="{{value.inputValue}}" title="请输入电话号码或手机号，区号请用“-”隔开" placeholder="请输入电话号码或手机号，区号请用“-”隔开">' +
                                '</div>' +
                            '</div>{{/if}}' +
                            '<a href="javascript:;" class="close close-bg js-banner-close">×</a>' +
                        '</dd>' +
                    //'</dl>{{/each}}{{/if}}' +
                    '</dl>{{/each}}{{/if}}{{/if}}' +
                    '<div class="form-group"><a href="javascript:;" class="add-banner {{if style != 6}}js-add-banner{{/if}}">' +
                    //'<div class="form-group"><a href="javascript:;" class="add-banner js-add-banner">' +
                    '<i class="icon-plus" {{if style == 6}}id="bannerAdd"{{/if}}></i> ' +
                    //'<i class="icon-plus"></i> ' +
                    '添加广告 <div class="h6">' +
                    '{{if style==1}}建议尺寸 750x350 像素' +
                    '{{else if style==4}}建议宽度 750 像素' +
                    '{{else if style==2}}建议宽度 300 像素' +
                    '{{else if style==3}}{{if lineDisplay == 1}}<span class="mr10" >4张：建议宽度 210 像素</span>{{else if lineDisplay == 2}}<span class="mr10">5张：建议宽度 160 像素</span>{{else if lineDisplay == 3}}<div>6张：建议宽度 130 像素</div>{{/if}}' +
                    '{{else if style==5}}建议宽度 670 像素' +
                    '{{else if style==6}}建议宽度 750 像素，高度1000 像素以内{{/if}}' +
                    '</div></a></div>' +
                    //'{{/if}}</div></a></div>' +
                    '<div class="text-gray-light">最多添加20个广告</div>' +
                    '</div>'
                ],
                discount: [
                    '<div class="region-discount">' +
                    '{{if list.length === 0}}' +
                    '<img src="../../../img/mall/page_set/temp_discount.png" class="img-responsive">'+
                    '{{/if}}' +
                    '{{each list value}}'+
                    '<img src="../../../img/mall/page_set/temp_discount.png" class="img-responsive">'+
                    '{{/each}}'+
                    '</div>',

                    '<div class="form-horizontal region-discount-r">' +
                    '{{if !title}}<div class="form-group">' +
                    '<label class="control-label">限时折扣</label>' +
                    '<div class="control-input"><a href="#modalActivity" data-toggle="modal"><i class="icon-plus"></i> 选择活动</a></div>' +
                    '</div>{{else}}' +
                    '<div class="form-group">' +
                    '<label class="control-label">已选活动</label>' +
                    '<div class="control-input">' +
                    '<div class="link-select">' +
                    '<a href="#modalActivity" data-toggle="modal"><span class="span_{{activityId}}">{{title}}</span></a>' +
                    '<a href="javascript:;" class="close close-bg js-activityDel">×</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">已选商品</label>' +
                    '<div class="control-input">' +
                    '<ul class="image-list js-pic-list">' +
                    '{{each list value}}' +
                    '<li><img src="{{value.src}}"><a href="javascript:;" class="js-activityShopDel close close-bg">×</a></li>' +
                    '{{/each}}' +
                    '<li><a href="#modalActivityGoods" data-toggle="modal" class="add-pic js-add-pic">加商品</a></li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>{{/if}}' +
                    '</div>'
                ],
                fightG: [
                    '<div class="region-discount">' +
                    '{{if list.length === 0}}' +
                    '<img src="../../../img/mall/page_set/temp_fightG.jpg" class="img-responsive">'+
                    '{{/if}}' +
                    '{{each list value}}'+
                    '<img src="../../../img/mall/page_set/temp_fightG.jpg" class="img-responsive">'+
                    '{{/each}}'+
                    '</div>',

                    '<div class="form-horizontal region-discount-r">' +
                    '{{if !title}}<div class="form-group">' +
                    '<label class="control-label">拼团</label>' +
                    '<div class="control-input"><a href="#modalFightG" data-toggle="modal"><i class="icon-plus"></i> 选择活动</a></div>' +
                    '</div>{{else}}' +
                    '<div class="form-group">' +
                    '<label class="control-label">已选活动</label>' +
                    '<div class="control-input">' +
                    '<div class="link-select">' +
                    '<a href="#modalFightG" data-toggle="modal"><span class="span_{{activityId}}">{{title}}</span></a>' +
                    '<a href="javascript:;" class="close close-bg js-activityDel">×</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">已选商品</label>' +
                    '<div class="control-input">' +
                    '<ul class="image-list js-pic-list">' +
                    '{{each list value}}' +
                    '<li><img src="{{value.src}}"><a href="javascript:;" class="js-activityShopDel close close-bg">×</a></li>' +
                    '{{/each}}' +
                    '<li><a href="#modalActivityGoods" data-toggle="modal" class="add-pic js-add-pic">加商品</a></li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>{{/if}}' +
                    '</div>'
                ],
                goods: [
                    '<ul class="ms-goods-list bg listStyle-{{ listStyle }} shopStyle-{{ shopStyle }}">' +
                    '{{ each list value}}' +
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
                    '<select class="form-control js-shopGroup">{{each shopGroup value}}<option value="{{value.id }}" {{if shopGroupValue == value.id }}selected{{/if}}>{{ value.name }}</option>{{/each}}</select>' +
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
                nav:[
                    '{{if list.length}}<ul class="region-nav r-navCols r-navCols{{cols}} r-navStyle{{style}}">' +
                    '{{each list value}}<li><a href="javascript:;"><span class="pic" style="background-image: url({{color_url}}{{value.defaultImage}})";>{{if value.imgSrc}}<img src="{{img_url}}{{value.imgSrc}}">{{/if}}</span>{{if value.title}}<span class="title" style="width:{{(296-(list.length-1)*10)/cols}}px">{{value.title}}</span>{{/if}}</a></li>{{/each}}' +
                    '</ul>{{/if}}',

                    '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<label class="control-label">单行个数</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="navCols" value="3" {{if cols=="3"}}checked{{/if}}> 一行3个</label> ' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="navCols" value="4" {{if cols=="4"}}checked{{/if}}> 一行4个</label> ' +
                    '<label><input type="radio" class="qkj-radio" name="navCols" value="5" {{if cols=="5"}}checked{{/if}}> 一行5个</label>'+
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">图标样式</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="navStyle" value="1" {{if style=="1"}}checked{{/if}}> 圆形</label> ' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="navStyle" value="2" {{if style=="2"}}checked{{/if}}> 圆角</label> ' +
                    '</div>' +
                    '</div>' +
                    '<div>{{each list value index}}<dl class="dl-horizontal">' +
                    '<dt>' +
                    '<a href="javascript:;" id="imgBtn_{{index}}"></a>' +
                    '{{if value.imgSrc}}<img src="{{img_url}}{{value.imgSrc}}" id="img_{{index}}" class="img-responsive" />{{/if}}' +
                    '<input type="hidden" id="imgHidden_{{index}}">' +
                    '</dt>' +
                    '<dd>' +
                    '<div class="form-group">' +
                    '<label class="control-label">颜色</label>' +
                    '<div class="control-input">' +
                    '<div id="js-colorpicker" class="dropdown-m">' +
                    '<a href="javascript:;" class="dropdown-switch js-DropdownBt"><span class="js-bt-label" style="background-color:{{value.defaultColor}}">{{value.defaultColor}}</span></a>' +
                    '<ul class="dropdown-data js-dropdownList"></ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">标题</label>' +
                    '<div class="control-input">' +
                    '<input type="text" class="form-control js-title" data-index="1" value="{{value.title}}">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">链接</label>' +
                    '<div class="control-input">' +
                    '<select class="form-control js-linkSelect" data-index="1">' +
                    '<option value="">设置页面链接地址</option>' +
                    '{{each options option}}' +
                    '<option value="{{option.id}}" {{if value.linkIndex !="" && (value.linkIndex == option.id)}}selected{{/if}}>{{option.name}}</option>' +
                    '{{/each}}' +
                    '</select>' +
                    '<div class="mt5" {{if value.linkIndex !="" && "6" == value.linkIndex}}style="display:block"{{else}}style="display:none"{{/if}}>' +
                    '<input type="text" size="9" class="form-control-inline" {{if value.inputValue}}value="{{value.inputValue}}{{/if}}">' +
                    '<a href="javascript:;" class="ml5 js-sure" data-index="1">确定</a>' +
                    '</div>' +
                    '{{if value.linkIndex == "7"}}<div class="link-select"><a href="#modalHomePage" data-toggle="modal" class="link js-link-select" data-index="1"><span>微页面</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#input_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                    '{{if value.linkIndex == "8"}}<div class="link-select"><a href="#modalGoodsSale" data-toggle="modal" class="link js-link-select" data-index="1"><span>商品</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#shopInput_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                    '{{if value.linkIndex == "9"}}<div class="link-select"><a href="#modalGroupPage" data-toggle="modal" class="link js-link-select" data-index="1"><span>商品分组</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#group_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                    '{{if value.linkIndex == "14"}}<div class="link-select"><a href="#modalWx_applet" data-toggle="modal" class="link js-link-select" data-index="1"><span>小程序</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#wxappletName_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}' +
                    '</div>' +
                    '</div>' +
                    '{{if value.linkIndex !="" && "13" == value.linkIndex}}<div class="form-group">' +
                    '<label class="control-label"><em class="text-danger">*</em>联系电话</label>' +
                    '<div class="control-input">' +
                    '<input type="text" class="form-control js-phone" value="{{value.inputValue}}" placeholder="请输入电话号码或手机号，区号请用“-”隔开">' +
                    '</div>' +
                    '</div>{{/if}}' +
                    '<a href="javascript:;" class="close close-bg js-banner-close">×</a>' +
                    '</dd>' +
                    '</dl>{{/each}}' +
                    '<div class="form-group"><a href="javascript:;" class="add-banner js-add-nav"><i class="icon-plus"></i> 添加一个图标 <div class="h6">建议图片尺寸 100x100 像素</div></a></div>' +
                    '<div class="text-gray-light">最多添加10个图标</div></div>' +
                    '</div>'
                ],
                richText: [
                    '<div class="region-richText-l {{if !isFullScreen}}r-richText-padded{{/if}}" style="background-color: {{defaultColor}}">{{if text}}{{@text}}{{else}}<div class="cap-richtext" color="#f9f9f9" fullscreen="0" type="rich_text"><p>点此编辑『富文本』内容 ——&gt;</p><p>你可以对文字进行<strong>加粗</strong>、<em>斜体</em>、<span style="text-decoration: underline;">下划线</span>、<span style="text-decoration: line-through;">删除线</span>、文字<span style="color: rgb(0, 176, 240);">颜色</span>、<span style="background-color: rgb(255, 192, 0); color: rgb(255, 255, 255);">背景色</span>、以及字号<span style="font-size: 20px;">大</span><span style="font-size: 14px;">小</span>等简单排版操作。</p><p>还可以在这里加入表格了</p><table><tbody><tr><td style="word-break: break-all;" width="93" valign="top">中奖客户</td><td style="word-break: break-all;" width="93" valign="top">发放奖品</td><td style="word-break: break-all;" width="93" valign="top">备注</td></tr><tr><td style="word-break: break-all;" width="93" valign="top">猪猪</td><td style="word-break: break-all;" width="93" valign="top">内测码</td><td style="word-break: break-all;" width="93" valign="top"><em><span style="color: rgb(255, 0, 0);">已经发放</span></em></td></tr><tr><td style="word-break: break-all;" width="93" valign="top">大麦</td><td style="word-break: break-all;" width="93" valign="top">积分</td><td style="word-break: break-all;" width="93" valign="top"><a href="javascript: void(0);" target="_blank">领取地址</a></td></tr></tbody></table><p style="text-align: left;"><span style="text-align: left;">也可在这里插入图片、并对图片加上超级链接，方便用户点击。</span></p></div>{{/if}}</div>',

                    '<div class="region-richText-r">' +
                    '<div class="form-horizontal"><div class="form-group inline-block mr20">背景颜色：<input type="text" class="color-set w48 form-control form-control-inline" style="background-color:{{defaultColor}}" data-value="1" /><span class="reset-color" data-value="#fafafa">重置</span></div>' +
                    '<div class="form-group inline-block line-height30">是否全屏：<label><input type="checkbox" class="qkj-checkbox js-isFullscreen mt5" {{if isFullScreen}}checked{{/if}} /> 全屏显示</label></div> </div>' +
                    '<textarea id="container"></textarea>' +
                    '</div>'
                ],
                post: [
                    '<div class="region-post" style="color:{{textColor}}"><div class="bg1" style="background-color:{{defaultColor}};"></div><i class="icon-horn"></i> <span class="text-center inline-block" style="width:254px">{{if text}}{{text}}{{else}}欢迎光临{{/if}}</span></div>',

                    '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<label class="control-label">公告内容 <em class="text-danger">*</em></label>' +
                    '<div class="control-input"><input type="text" class="form-control js-post-title" placeholder="请填写内容，如果过长，将会在手机上滚动显示" value="{{text}}"></div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">背景颜色</label>' +
                    '<div class="control-input"><input type="text" class="color-set w48 form-control form-control-inline" style="background-color:{{defaultColor}}" data-value="1" /><span class="reset-color" data-value="#fdebe9">重置</span></div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">文字颜色</label>' +
                    '<div class="control-input"><input type="text" class="color-set w48 form-control form-control-inline" style="background-color:{{textColor}}"  data-value="2" /><span class="reset-color" data-value="#F03F2B">重置</span></div>' +
                    '</div>' +
                    '</div>'
                ],
                guideLine: [
                    '<div class="region-guideLine region-guideLineStyle{{borderStyle}} {{if margin==2}}region-guideLineMargin{{/if}}"><hr  style="border-top-color: {{borderColor}}" class="hr"></div>',

                    '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<label class="control-label">颜色</label>' +
                    '<div class="control-input">' +
                    '<div><input type="text" class="color-set w48 form-control form-control-inline" style="background-color:{{borderColor}}" data-value="3" /><span class="reset-color" data-value="#e8e9eb">重置</span></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">边距</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="guidLineMargin" value="1" {{if margin=="1"}}checked{{/if}}> 无边距</label> ' +
                    '<label><input type="radio" class="qkj-radio" name="guidLineMargin" value="2" {{if margin=="2"}}checked{{/if}}> 左右留边</label>'+
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">样式</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="borderstyle" value="1" {{if borderStyle=="1"}}checked{{/if}}> 实线</label> ' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="borderstyle" value="2" {{if borderStyle=="2"}}checked{{/if}}> 虚线</label> ' +
                    '<label><input type="radio" class="qkj-radio" name="borderstyle" value="3" {{if borderStyle=="3"}}checked{{/if}}> 点线</label>'+
                    '</div>' +
                    '</div>' +
                    '</div>'
                ],
                guidePadding: [
                    '<div class="region-guidePadding bg-gray-lighter"><div style="height: {{height}}px"></div></div>',

                    '<div class="form-horizontal">' +
                    '<h5 class="border-b pb10 mb15">辅助空白</h5>' +
                    '<div class="form-group">' +
                    '<label class="control-label">空白高度</label>' +
                    '<div class="control-input">' +
                    '<div class="guide-slider js-guideBar">' +
                    '<div class="ratings_bars">'+
                    '<div class="scale" id="bar0">' +
                    '<div style="width:{{height*1.65}}px"></div>' +
                    '<span class="guide-slider-btn" style="left:{{height*1.65}}px"></span>' +
                    '</div>' +
                    '<span class="bars_10">{{height}}</span> 像素' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                ],
                imageText: [
                    '<div class="region-imageText r-imageText{{style}}">' +
                    '{{if list.length}}{{each list value index}}<div class="image-h">' +
                    '<div class="img" {{if value.imgSrc}}style="background-image: url({{img_url}}{{value.imgSrc}})"{{/if}}>' +
                    '</div>' +
                    '<div class="text">' +
                        '<h5 class="font-bold" style="font-size: {{fontsize/2}}px; text-align: {{if alignCenter==\"1\"}}left{{else}}center{{/if}}">{{if value.title}}{{value.title}}{{else}}标题{{/if}}</h5>' +
                        '<p style="font-size: {{fontsize/2 - 3}}px; text-align: {{if alignCenter==\"1\"}}left{{else}}center{{/if}}">{{if value.textarea}}{{value.textarea}}{{else}}文本{{/if}}</p>' +
                    '</div>' +
                    '</div>{{/each}}{{/if}}' +
                    '</div>',

                    '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<label class="control-label">图文样式</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="imageTexttyle" value="1" {{if style=="1"}}checked{{/if}}> 左图右文</label> ' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="imageTexttyle" value="2" {{if style=="2"}}checked{{/if}}> 小图上下</label> ' +
                    '<label><input type="radio" class="qkj-radio" name="imageTexttyle" value="3" {{if style=="3"}}checked{{/if}}> 大图上下</label>'+
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="control-label">对齐方式</label>' +
                        '<div class="control-input">' +
                        '<label class="mr20"><input type="radio" class="qkj-radio" name="alignCenterStyle" value="1" {{if alignCenter=="1"}}checked{{/if}}> 居左</label> ' +
                        '<label><input type="radio" class="qkj-radio" name="alignCenterStyle" value="2" {{if alignCenter=="2"}}checked{{/if}}> 居中</label> ' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="control-label">字号大小</label>' +
                        '<div class="control-input">' +
                        '<label class="mr20"><input type="radio" class="qkj-radio" name="fontsizeStyle" value="36" {{if fontsize=="36"}}checked{{/if}}> 大号</label> ' +
                        '<label class="mr20"><input type="radio" class="qkj-radio" name="fontsizeStyle" value="32" {{if fontsize=="32"}}checked{{/if}}> 中号</label> ' +
                        '<label><input type="radio" class="qkj-radio" name="fontsizeStyle" value="28" {{if fontsize=="28"}}checked{{/if}}> 小号</label> ' +
                        '</div>' +
                    '</div>' +
                    '{{if list.length}}{{each list value index}}<dl class="dl-horizontal">' +
                    '<dt>' +
                    '<a href="javascript:;" id="imgBtn_{{index}}"></a>' +
                    '{{if value.imgSrc}}<img src="{{img_url}}{{value.imgSrc}}" id="img_{{index}}" class="img-responsive" />{{/if}}' +
                    '<input type="hidden" id="imgHidden_{{index}}">' +
                    '</dt>' +
                    '<dd>' +
                    '<div class="form-group">' +
                    '<label class="control-label">标题 <em class="text-danger">*</em></label>' +
                    '<div class="control-input">' +
                    '<input type="text" class="form-control js-title" data-index="1" maxlength="30" value="{{value.title}}" />'+
                    '</div>'+
                    '</div>'+
                    '<div class="form-group">' +
                    '<label class="control-label">文本</label>' +
                    '<div class="control-input">' +
                    '<textarea class="form-control js-imageText-textarea" maxlength="50">{{value.textarea}}</textarea>'+
                    '</div>'+
                    '</div>'+
                    '<div class="form-group">' +
                    '<label class="control-label">链接</label>' +
                    '<div class="control-input">' +
                    '<select class="form-control js-linkSelect" data-index="1" required title="请选择链接" name="linkSelect_{{index}}">' +
                    '<option value="">设置页面链接地址</option>' +
                    '{{each options option}}' +
                    '<option value="{{option.id}}" {{if value.linkIndex !="" && (value.linkIndex == option.id)}}selected{{/if}}>{{option.name}}</option>' +
                    '{{/each}}' +
                    '</select>' +
                    '<div class="mt5" {{if value.linkIndex !="" && "6" == value.linkIndex}}style="display:block"{{else}}style="display:none"{{/if}}>' +
                    '<input type="text" size="9" class="form-control-inline" {{if value.inputValue}}value="{{value.inputValue}}{{/if}}">' +
                    '<a href="javascript:;" class="ml5 js-sure" data-index="1">确定</a>' +
                    '</div>' +
                    '{{if value.linkIndex == "7"}}<div class="link-select"><a href="#modalHomePage" data-toggle="modal" class="link js-link-select" data-index="1"><span>微页面</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#input_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                    '{{if value.linkIndex == "8"}}<div class="link-select"><a href="#modalGoodsSale" data-toggle="modal" class="link js-link-select" data-index="1"><span>商品</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#shopInput_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                    '{{if value.linkIndex == "9"}}<div class="link-select"><a href="#modalGroupPage" data-toggle="modal" class="link js-link-select" data-index="1"><span>商品分组</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#group_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}'+
                    '{{if value.linkIndex == "14"}}<div class="link-select"><a href="#modalWx_applet" data-toggle="modal" class="link js-link-select" data-index="1"><span>小程序</span> | <span class="span_{{value.checkedId}}"><script>$(".span_{{value.checkedId}}").html($("#wxappletName_{{value.checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-del">×</a></div>{{/if}}' +
                    '</div>' +
                    '</div>' +
                    '{{if value.linkIndex !="" && "13" == value.linkIndex}}<div class="form-group">' +
                    '<label class="control-label"><em class="text-danger">*</em>联系电话</label>' +
                    '<div class="control-input">' +
                    '<input type="text" class="form-control js-phone" value="{{value.inputValue}}" placeholder="请输入电话号码或手机号，区号请用“-”隔开">' +
                    '</div>' +
                    '</div>{{/if}}' +
                    '<a href="javascript:;" class="close close-bg js-imageText-close">×</a>' +
                    '</dd>' +
                    '</dl>{{/each}}{{/if}}' +
                    '<div class="form-group"><a href="javascript:;" class="add-banner js-add-imageText"><i class="icon-plus"></i> 添加一个图文 <div class="h6">建议尺寸 {{if style=="1"}}280x180{{else if style=="2"}}345x220{{else if style=="3"}}710x360{{/if}} 像素</div></a></div>' +
                    '</div>'
                ],
                headline: [
                    '<div class="region-headline r-headline{{alignCenter}}" style="background-color: {{defaultColor}}">' +
                    '<h5>{{if title}}{{title}}{{else}}点击编辑『标题』{{/if}}{{if navTitle}}<span><a href="{{navUrl}}">{{navTitle}}</a></span>{{/if}}</h5>' +
                    '{{if subtitle}}<p>{{subtitle}}</p>{{/if}}' +
                    '</div>',

                    '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<label class="control-label">标题名称 <em class="text-danger">*</em></label>' +
                    '<div class="control-input"><input type="text" class="form-control js-headline-title" data-type="title" maxlength="30" placeholder="" value="{{title}}"></div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">显示位置</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="alignCenterStyle" value="1" {{if alignCenter=="1"}}checked{{/if}}> 居左</label> ' +
                    '<label><input type="radio" class="qkj-radio" name="alignCenterStyle" value="2" {{if alignCenter=="2"}}checked{{/if}}> 居中</label> ' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">副标题</label>' +
                    '<div class="control-input"><input type="text" class="form-control js-headline-title" data-type="subtitle" maxlength="30" placeholder="" value="{{subtitle}}"></div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">背景颜色 <em class="text-danger">*</em></label>' +
                    '<div class="control-input"><input type="text" class="color-set w48 form-control form-control-inline" style="background-color:{{defaultColor}}" data-value="1" /><span class="reset-color" data-value="#ffffff">重置</span></div>' +
                    '</div>' +
                    '{{if isNavShow}}<div class="headline-nav">' +
                    '<div class="form-group">' +
                    '<label class="control-label">导航名称</label>' +
                    '<div class="control-input">' +
                    '<input type="text" class="form-control js-headline-title" data-index="2" data-type="navTitle" maxlength="4" value="{{navTitle}}" />'+
                    '</div>'+
                    '</div>'+
                    '<div class="form-group">' +
                    '<label class="control-label">链接</label>' +
                    '<div class="control-input">' +
                    '<select class="form-control js-linkSelect" data-index="2" required title="请选择链接" name="linkSelect_">' +
                    '<option value="">设置页面链接地址</option>' +
                    '{{each options option i}}' +
                    '<option value="{{option.id}}" {{if linkIndex !="" && (linkIndex == option.id)}}selected{{/if}}>{{option.name}}</option>' +
                    '{{/each}}' +
                    '</select>' +
                    '<div class="mt5" {{if linkIndex !="" && "6" == linkIndex}}style="display:block"{{else}}style="display:none"{{/if}}>' +
                    '<input type="text" size="9" class="form-control-inline" {{if inputValue}}value="{{inputValue}}{{/if}}">' +
                    '<a href="javascript:;" class="ml5 js-headline-sure">确定</a>' +
                    '</div>' +
                    '{{if linkIndex == "7"}}<div class="link-select"><a href="#modalHomePage" data-toggle="modal" class="link js-link-select" data-index="2"><span>商城页面</span> | <span class="span_{{checkedId}}"><script>$(".span_{{checkedId}}").html($("#input_{{checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-headline-del">×</a></div>{{/if}}'+
                    '{{if linkIndex == "8"}}<div class="link-select"><a href="#modalGoodsSale" data-toggle="modal" class="link js-link-select" data-index="2"><span>商品</span> | <span class="span_{{checkedId}}"><script>$(".span_{{checkedId}}").html($("#shopInput_{{checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-headline-del">×</a></div>{{/if}}'+
                    '{{if linkIndex == "9"}}<div class="link-select"><a href="#modalGroupPage" data-toggle="modal" class="link js-link-select" data-index="2"><span>商品分组</span> | <span class="span_{{checkedId}}"><script>$(".span_{{checkedId}}").html($("#group_{{checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-headline-del">×</a></div>{{/if}}'+
                    '{{if linkIndex == "14"}}<div class="link-select"><a href="#modalWx_applet" data-toggle="modal" class="link js-link-select" data-index="2"><span>小程序</span> | <span class="span_{{checkedId}}"><script>$(".span_{{checkedId}}").html($("#wxappletName_{{checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-headline-del">×</a></div>{{/if}}' +
                    '</div>' +
                    '</div>' +
                    '{{if linkIndex !="" && "13" == linkIndex}}<div class="form-group">' +
                    '<label class="control-label"><em class="text-danger">*</em>联系电话</label>' +
                    '<div class="control-input">' +
                    '<input type="text" class="form-control js-headline-phone" value="{{inputValue}}" placeholder="请输入电话号码或手机号，区号请用“-”隔开">' +
                    '</div>' +
                    '</div>{{/if}}' +
                    '<a href="javascript:;" class="close close-bg js-headline-close">×</a></div>{{/if}}' +
                    '{{if !isNavShow}}<div class="form-group"><a href="javascript:;" class="add-banner js-add-headline"><i class="icon-plus"></i> 添加文本导航</a></div>{{/if}}' +
                    '</div>'
                ],
                search: [
                    '<div class="region-search" style="background-color:{{defaultColor}}">' +
                    '<form action="/" method="GET">' +
                    '<input class="form-control" placeholder="搜索商品" type="text">' +
                    '<button type="submit" class="search-btn">搜索</button>' +
                    '</form>' +
                    '</div>',

                    '<div class="js-search"><div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<label class="control-label">背景颜色</label>' +
                    '<div class="control-input"><input type="text" class="color-set w48 form-control" style="background-color:{{defaultColor}}"  data-value="1" /></div>' +
                    '</div>' +
                    '</div></div>'
                ],
                video: [
                    '<div class="region-video"><img src="../../../img/icon/icon-video.png" /></div>',

                    '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<label class="control-label">视频标题</label>' +
                    '<div class="control-input"><input type="text" class="form-control js-video-title" value="{{title}}"></div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">视频网址</label>' +
                    '<div class="control-input"><input type="text" class="form-control js-video-url" value="{{url}}"></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="text-gray-light">目前仅支持腾讯视频链接，添加其他链接无法读取，请将视频上传到腾讯视频后将网址输入上方地址栏中完成添加</div>'
                ],
                coupon: [
                    '<div class="region-couponL region-couponL{{style}}">' +
                    '{{each list value}}' +
                    '<div class="item">' +
                    '<div class="left"><div class="number">{{if style!="1"}}¥{{/if}} <em>{{value.number}}</em></div><div class="title">{{value.condition}}</div></div>' +
                    '<div class="btn btn-sm btn-danger">领券</div> </div>{{/each}}' +
                    '</div>',

                    '<div class="form-horizontal region-couponR">' +
                    '<div class="form-group">' +
                    '<label class="control-label">优惠券样式</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="couponStyle" value="1" {{if style=="1"}}checked{{/if}}> 列表</label> ' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="couponStyle" value="2" {{if style=="2"}}checked{{/if}}> 横板小图</label> ' +
                    '<label><input type="radio" class="qkj-radio" name="couponStyle" value="3" {{if style=="3"}}checked{{/if}}> 竖板小图</label> ' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group"><h6 class="pl-10">优惠券列表</h6>' +
                    '{{each list value index}}<div class="item"><div class="num">{{index+1}}、</div><div class="c-type">{{value.cType}}</div><div class="name">{{value.name}}（{{value.condition}}）</div>{{if value.sign}}<div class="label label-danger">{{value.sign}}</div>{{/if}}<div class="close close-bg js-coupon-del">×</div> </div>{{/each}}'+
                    '</div>' +
                    '<div class="form-group"><a href="#modalCoupon" data-toggle="modal" class="add-banner js-coupon-btn"><i class="icon-plus"></i> 添加优惠券</a></div>' +
                    '<div class="text-gray-light">温馨提示：当页面无可显示的优惠券时，优惠券区块将隐藏</div>' +
                    '</div>'
                ]
            },
            ue: '',
            linkOptions: function(){
                const urlArr = window.location.href.split('/');
                const is_zhmd = urlArr.indexOf('wechatapp')>=0 && urlArr.indexOf('store-page')>=0;//当前页面是小程序智慧门店
                const is_sc = urlArr.indexOf('wechatapp')>=0 && urlArr.indexOf('page-set-feature')>=0;//当前页面是小程序商城
                if(is_zhmd){
                    switch(options.wisdom_version){
                        // 智慧门店展示版
                        case '1':
                            return[
                                {
                                    id:'1',
                                    name:'首页'
                                },
                                {
                                    id:'7',
                                    name:'微页面'
                                },
                                {
                                    id:'11',
                                    name:'相册'
                                },
                                {
                                    id:'12',
                                    name:'预约'
                                },
                                {
                                    id:'13',
                                    name:'联系我们'
                                },
                                {
                                    id:'14',
                                    name:'小程序'
                                },
                            ]
                            break;
                        // 智慧门店营销版 
                        case "2":
                            return[
                                {
                                    id:'1',
                                    name:'首页'
                                },
                                {
                                    id:'7',
                                    name:'微页面'
                                },
                                {
                                    id:'11',
                                    name:'相册'
                                },
                                {
                                    id:'12',
                                    name:'预约'
                                },
                                {
                                    id:'16',
                                    name:'买单'
                                },
                                {
                                    id:'15',
                                    name:'储值'
                                },
                                {
                                    id:'13',
                                    name:'联系我们'
                                },
                                {
                                    id:'14',
                                    name:'小程序'
                                }
                            ]
                            break;
                        // 行业版 
                        case "3":
                            return[
                                {
                                    id:'1',
                                    name:'首页'
                                },
                                {
                                    id:'7',
                                    name:'微页面'
                                },
                                {
                                    id:'11',
                                    name:'相册'
                                },
                                {
                                    id:'12',
                                    name:'预约'
                                },
                                {
                                    id:'16',
                                    name:'买单'
                                },
                                {
                                    id:'15',
                                    name:'储值'
                                },
                                {
                                    id:'13',
                                    name:'联系我们'
                                },
                                {
                                    id:'14',
                                    name:'小程序'
                                }
                            ]
                            break;
                        default :
                        return []
                    }
                }else if(is_sc){
                    switch(options.mall_version){
                        case "5":
                            return[
                                {
                                    id:'15',
                                    name:'储值'
                                },
                                {
                                    id:'1',
                                    name:'商城首页'
                                },
                                {
                                    id:'7',
                                    name:'商城页面'
                                },
                                {
                                    id:'2',
                                    name:'会员中心'
                                },
                                {
                                    id:'4',
                                    name:'全部商品'
                                },
                                {
                                    id:'8',
                                    name:'商品'
                                },
                                {
                                    id:'9',
                                    name:'商品分组'
                                },
                                {
                                    id:'10',
                                    name:'积分商城'
                                },
                                {
                                    id:'17',
                                    name:'分销中心'
                                },
                                {
                                    id:'13',
                                    name:'联系我们'
                                },
                                {
                                    id:'14',
                                    name:'小程序'
                                }
                            ]
                            break;
                    case "4":
                        return[
                            {
                                id:'15',
                                name:'储值'
                            },
                            {
                                id:'1',
                                name:'商城首页'
                            },
                            {
                                id:'7',
                                name:'商城页面'
                            },
                            {
                                id:'2',
                                name:'会员中心'
                            },
                            {
                                id:'4',
                                name:'全部商品'
                            },
                            {
                                id:'8',
                                name:'商品'
                            },
                            {
                                id:'9',
                                name:'商品分组'
                            },
                            {
                                id:'10',
                                name:'积分商城'
                            },
                            {
                                id:'13',
                                name:'联系我们'
                            },
                            {
                                id:'14',
                                name:'小程序'
                            }
                        ]
                        break;
                        default :
                        return []
                    }
                }else{
                    // h5商城
                    switch(options.mall_version){
                        case "4":
                            return[
                                {
                                    id:'15',
                                    name:'储值'
                                },
                                {
                                    id:'1',
                                    name:'商城首页'
                                },
                                {
                                    id:'7',
                                    name:'商城页面'
                                },
                                {
                                    id:'2',
                                    name:'会员中心'
                                },
                                {
                                    id:'4',
                                    name:'全部商品'
                                },
                                {
                                    id:'8',
                                    name:'商品'
                                },
                                {
                                    id:'9',
                                    name:'商品分组'
                                },
                                {
                                    id:'10',
                                    name:'积分商城'
                                },
                                {
                                    id:'13',
                                    name:'联系我们'
                                }
                            ]
                            break;
                        case "5":
                            return[
                                {
                                    id:'15',
                                    name:'储值'
                                },
                                {
                                    id:'1',
                                    name:'商城首页'
                                },
                                {
                                    id:'7',
                                    name:'商城页面'
                                },
                                {
                                    id:'2',
                                    name:'会员中心'
                                },
                                {
                                    id:'4',
                                    name:'全部商品'
                                },
                                {
                                    id:'8',
                                    name:'商品'
                                },
                                {
                                    id:'9',
                                    name:'商品分组'
                                },
                                {
                                    id:'10',
                                    name:'积分商城'
                                },
                                {
                                    id:'13',
                                    name:'联系我们'
                                }
                            ]
                            break;
                        default :
                            return []
                    }
                }
            }
        }, options);

        this.settings = settings; //设置为该对象的属性
        this.init(settings);  //初始化
    };

    tpl_groupAdd.prototype = {
        init: function (opts) {
            var _this = this,
                data_banner = { //广告初始数据
                    type: 'banner',  //功能类型
                    "style": 1, //1:轮播海报，2：横向滑动（小）， 3：横向滑动（导航），4：1行一个，5：横向滑动（大）
                    "margin": 0, //图片间隙
                    "options": [],  //链接选项
                    "lineDisplay": "1", //一屏显示
                    "defaultImg": '../../../img/mall/page_set/banner_default.jpg',  //初始默认广告图
                    "list": []
                },
                data_coupon = { //优惠券数据
                    type:'coupon',  //功能类型
                    "style": 1, //1:列表； 2：横板小图； 3：竖版小图
                    "list": []
                },
                data_discount = { //限时折扣
                    "type": "discount",
                    "title": "",
                    "activityId": "",
                    "list": []
                },
                data_fightG = { //拼团
                    "type": "fightG",
                    "title": "",
                    "activityId": "",
                    "list": []
                },
                data_headline = {  //标题
                    "type": 'headline',
                    "title": '',
                    "alignCenter": 1,  //1:左，2：中
                    "subtitle": '',  //副标题
                    "defaultColor":'#ffffff', //背景颜色
                    "isNavShow": false,
                    "options": [],
                    "navTitle": '', //查看更多名字
                    "linkIndex": '',  //跳转的链接
                    "inputValue": '',  //自定义链接的值
                    "url":'',  //广告自定义链接
                    "checkedId": '' //弹出框选中商品的值
                },
                data_imageText = {  //图文
                    "type": "imageText",
                    "options" : [],
                    "style" : 1,  //1：左图右文， 2：小图上下，3:大图上下
                    "alignCenter": 1,
                    "fontsize": 32,
                    "list": [
                        {
                            "imgSrc": '',  //图文图片
                            "title": '',  //图文标题
                            "textarea": '', //文本
                            "linkIndex": '',  //跳转的链接
                            "inputValue": '',  //自定义链接的值
                            "url":'',  //广告自定义链接
                            "checkedId": '' //弹出框选中商品的值
                        }
                    ]
                },
                data_guideLine = {  //辅助线
                    "type": "guideLine",
                    "margin": 1, //1:无边距。 2：有边距
                    "borderColor": '#fafafa',
                    "borderStyle": 1
                },
                data_guidePadding = {  //辅助补白
                    "type": "guidePadding",
                    "height": 20
                },
                data_goods = {  //商品初始数据
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
                data_nav = {
                    type:'nav',
                    "cols": 3, //3: 一行3个； 4：1行4个； 5：1行5个
                    "style": 1, //1: 圆形； 2：圆角；
                    "options":[],
                    "list":[
                        {
                            "url":"",
                            "imgSrc":"",
                            "title":"",
                            "defaultColor" : "#ffc42c",
                            "defaultImage" : "color1.png",
                            "linkIndex":"",
                            "inputValue":"",
                            "checkedId":""
                        }
                    ]
                },
                data_post = {  //公告
                    "type": "post",
                    "text": '',
                    "defaultColor": '#F03F2B',
                    "textColor": '#F03F2B'
                },
                data_search = {
                    type:'search',
                    defaultColor: '#ffffff'
                },
                data_richText = {
                    "type":"richText",
                    "text":"",
                    "defaultColor": '#fafafa',
                    "isFullScreen": false
                },
                data_video = {
                    "type":"video",
                    "title": "",
                    "url": ""
                };
                // [{id: 36, name: "软面包"},
                // {id: 35, name: "马克龙"},
                // {id: 40, name: "服装"},
                // {id: 34, name: "面包"},
                // {id: 38, name: "分组分享分组分享1"},
                // {id: 45, name: "1"}]
                !(function(){
                    var res = [{id: 36, name: "软面包"},
                    {id: 35, name: "马克龙"},
                    {id: 40, name: "服装"},
                    {id: 34, name: "面包"},
                    {id: 38, name: "分组分享分组分享1"},
                    {id: 45, name: "1"}]
                    data_goods.shopGroup = res;
                    //默认给分组存入id
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
                                _this.addTpl(o);
                            }
                        });
                        //初始化模块方法
                        $.each(_this.module, function (name, method) { //加载模块里的功能
                            switch (name){
                                case "title":
                                    method(_this,opts.data[0]);
                                    break;
                                case "group":
                                    method(_this);
                                    break;
                                case "banner":
                                    method(_this,data_banner);
                                    break;
                                case "coupon":
                                    method(_this,data_coupon);
                                    break;
                                case "discount":
                                    method(_this,data_discount);
                                    break;
                                case "fightG":
                                    method(_this,data_fightG);
                                    break;
                                case "guideLine":
                                    method(_this,data_guideLine);
                                    break;
                                case "guidePadding":
                                    method(_this,data_guidePadding);
                                    break;
                                case "goods":
                                    method(_this,data_goods);
                                    break;
                                case "headline":
                                    method(_this,data_headline);
                                    break;
                                case "imageText":
                                    method(_this,data_imageText);
                                    break;
                                case "nav":
                                    method(_this,data_nav);
                                    break;
                                case "post":
                                    method(_this,data_post);
                                    break;
                                case "richText":
                                    method(_this,data_richText);
                                    break;
                                case "search":
                                    method(_this,data_search);
                                    break;
                                case "video":
                                    method(_this,data_video);
                                    break;
                            }

                        });
                    }
                })()
            //初始化数据
            // $.ajax({
            //     url: 'http:/pageset/feature/get-group.html',
            //     type: "GET",
            //     dataType: 'json',
            //     success: function(res){
            //         data_goods.shopGroup = res;
            //         //默认给分组存入id
            //         if(data_goods.shopGroup == 1){
            //             data_goods.shopGroupValue == res[0].id;
            //         }
            //         //判断数据第一项如果没有TITLE的话就插入到数组第一个里面
            //         if(opts.data[0].type != 'title'){
            //             opts.data.unshift({
            //                 type:'title',
            //                 name: '',  //店铺名字
            //                 description: '', //页面描述
            //                 src: '' //商品样式
            //             });
            //         }
            //         //初始化数据
            //         if(opts.data.length){
            //             $.each(opts.data, function (i,o) { //加载数据
            //                 if(o.type != 'title'){
            //                     _this.addTpl(o);
            //                 }
            //             });
            //             //初始化模块方法
            //             $.each(_this.module, function (name, method) { //加载模块里的功能
            //                 switch (name){
            //                     case "title":
            //                         method(_this,opts.data[0]);
            //                         break;
            //                     case "group":
            //                         method(_this);
            //                         break;
            //                     case "banner":
            //                         method(_this,data_banner);
            //                         break;
            //                     case "coupon":
            //                         method(_this,data_coupon);
            //                         break;
            //                     case "discount":
            //                         method(_this,data_discount);
            //                         break;
            //                     case "fightG":
            //                         method(_this,data_fightG);
            //                         break;
            //                     case "guideLine":
            //                         method(_this,data_guideLine);
            //                         break;
            //                     case "guidePadding":
            //                         method(_this,data_guidePadding);
            //                         break;
            //                     case "goods":
            //                         method(_this,data_goods);
            //                         break;
            //                     case "headline":
            //                         method(_this,data_headline);
            //                         break;
            //                     case "imageText":
            //                         method(_this,data_imageText);
            //                         break;
            //                     case "nav":
            //                         method(_this,data_nav);
            //                         break;
            //                     case "post":
            //                         method(_this,data_post);
            //                         break;
            //                     case "richText":
            //                         method(_this,data_richText);
            //                         break;
            //                     case "search":
            //                         method(_this,data_search);
            //                         break;
            //                     case "video":
            //                         method(_this,data_video);
            //                         break;
            //                 }

            //             });
            //         }
            //     }
            // });

            //初始化公共方法
            _this.moduleCommonFun(_this,opts);
        },
        // 模块里的公共方法
        moduleCommonFun: function (_this, opts) {
            //排序
            $(".ui-sortable").sortable({
                stop: function( event, ui ) {
                    $(ui.item).trigger('click');
                }
            });

            //模块之间点击选中样式
            $(document).on("click", ".region",function (){
                var self = $(this);  //获取隐藏域
                _this.removeClass();   //去除.editing样式
                _this.setInitSelected(this,_this);  //加载模板
                _this.setColor($(this)); //颜色设置
            });

            //删除模块
            $(document).on("click", ".js-delete",function (e){
                var $msTitle = $(".js-ms-title");

                $(this).parents(".region").remove();
                //如果模块都删除了，判断顶部标题是否存在，存在则点击点击，否则则隐藏右侧内容

                if(!$(opts.tpl_preview).html()){
                    if($msTitle.length ){
                        $msTitle.trigger('click');
                    }else{
                        $(opts.tpl_form).html('');
                        $(".js-ms-form").hide();
                    }
                }else{
                    $(".region:first").trigger('click');
                }

                util.stopPropagation(e);
            });
            //删除选择的链接
            $(document).on('click', '.js-del', function () {
                var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                    index = $(".dl-horizontal").index($(this).parents(".dl-horizontal"));

                hiddenData.list[index].linkIndex = '';
                hiddenData.list[index].checkedId = '';
                _this.editTpl(hiddenData);
                if(hiddenData.type == "banner"){
                    _this.runSetHeight();
                }
            });

            //活动商品添加
            $("#modalActivityGoods").on('show.bs.modal', function () {
                var $editing = $(".editing").find(".hiddenData"),
                    hiddenData = JSON.parse($editing.val()),
                    $inputChecked = '',
                    $tr = '';

                $("input[name='ckActivityShop']").prop("checked", false);  //把所有活动商品input选中状态给清除
                if(hiddenData.list.length){
                    $.each(hiddenData.list, function (i,o) {
                        if(o.shopId){  //如果活动id存在就把对应的id的input设置为选中状态
                            $("input[value='"+ o.shopId + "']").prop("checked", true);
                        }
                    });
                }

                //活动商品添加
                $("#btnActivityGoods").click(function () {
                    $editing = $(".editing").find(".hiddenData");
                    hiddenData = JSON.parse($editing.val());
                    $inputChecked = $("input[name='ckActivityShop']:checked");

                    //清空数组内容，然后再把选中的循环
                    hiddenData.list = [];
                    $inputChecked.each(function () {
                        $tr = $inputChecked.parents("tr");
                        hiddenData.list.push(
                            {
                                "src": $(this).attr("data-src"),  //商品图片
                                "shopId": $(this).val()  //商品id
                            }
                        );
                    });

                    _this.editTpl(hiddenData);
                    $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
                });
            });
            //活动商品删除
            $(document).on('click',".js-activityShopDel", function () {
                var $editing = $(".editing").find(".hiddenData"),
                    index = $(".js-pic-list li").index($(this).parent());
                hiddenData = JSON.parse($editing.val());

                $(this).parent().remove(); //当前对象的li去掉
                hiddenData.list.splice(index,1); //删除数据
                _this.editTpl(hiddenData);
                $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
            });

            //重置颜色
            $(document).on('click','.reset-color',function () {
                var $editing = $(".editing"), $msTitle = '', hiddenData = '',
                    value = $(this).prev().attr("data-value");

                if($editing.length > 0){
                    hiddenData = JSON.parse($editing.find(".hiddenData").val());
                    if(value == "1"){
                        hiddenData.defaultColor = $(this).attr("data-value");
                    }else if(value == "2"){
                        hiddenData.textColor = $(this).attr("data-value");
                    }else if(value == "3"){
                        hiddenData.borderColor = $(this).attr("data-value");
                    }
                    _this.editTpl(hiddenData);
                    _this.setColor();
                }else{
                    $msTitle = $(".js-ms-title");
                    hiddenData = JSON.parse($msTitle.find(".hiddenData").val());
                    $(this).prev().css('background-color',$(this).attr("data-value"));
                    hiddenData.defaultColor = $(this).attr("data-value");
                    $msTitle.find(".hiddenData").val(JSON.stringify(hiddenData));
                }
            });

            // 颜色选择
            $(document).on('click','.js-DropdownBt',function (e) {
                util.stopPropagation(e);
                $(this).parent().addClass('open');
            });
            // 颜色选择
            $(document).on('click','.js-dropdownList li',function (e) { //点击每个颜色操作
                var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                    index = $(".dl-horizontal").index($(this).parents(".dl-horizontal")),
                    color = '',path='';

                $(this).parent().parent().removeClass('open');
                color = $(this).find("a").html();
                $(".js-bt-label").css({'background-color': color}).html(color);
                path = 'color' + $(this).attr("data-index") + '.png';
                initHiddenData.list[index].defaultImage = path;
                initHiddenData.list[index].defaultColor = color;
                _this.editTpl(initHiddenData);
            });
            $(document).click(function () { //点击颜色区域外的地方关闭颜色选择框
                $("#js-colorpicker").removeClass('open');
            });

            //联系电话
            $(document).on('blur', '.js-phone', function () {
                var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                    index = $(".dl-horizontal").index($(this).parents(".dl-horizontal"));

                hiddenData.list[index].inputValue = $(this).val();
                _this.editTpl(hiddenData);
                _this.runSetHeight();
            });

            //选择链接
            $(document).on('change', '.js-linkSelect', function (e) {
                _this.setLinkSelect({
                    type: 'banner',
                    element: $(this),
                    _window: _this,
                    index:$(this).attr("data-index")
                });
            });
            //重新选择链接
            $(document).on('click', '.js-link-select', function (e) {
                _this.setLinkSelect({
                    type: 'banner',
                    element: $(this).parent().parent().find('.form-control'),
                    _window: _this,
                    id: $(this).find("span:last-child").attr("class").split("_")[1], //获取当前的选中的id
                    index: $(this).attr("data-index")
                });
            });
            //自定义外链输入框变化
            $(document).on('click', '.js-sure', function (e) {
                var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                    index = '';

                if(e.target.dataset.index == 1){
                    index = $(".dl-horizontal").index($(this).parents(".dl-horizontal"));
                    hiddenData.list[index].url = $(this).prev().val();
                    hiddenData.list[index].inputValue = $(this).prev().val();
                }else{
                    hiddenData.url = $(this).prev().val();
                    hiddenData.inputValue = $(this).prev().val();
                }
                _this.editTpl(hiddenData);
                _this.runSetHeight();  //广告图高度设置
            });

            //标题
            $(document).on('keyup', '.js-title', function (e) {
                var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                    index = $(".dl-horizontal").index($(this).parents(".dl-horizontal"));

                //data-index==1 时 是在list数组里面
                if(e.target.dataset.index == 1){
                    hiddenData.list[index].title = $(this).val();
                }else{
                    hiddenData.title = $(this).val();
                }
                _this.editLeftTpl(hiddenData);
            });
        },
        module:{
            title: function (_this,data) {
                var $msTitle = $(".js-ms-title"),
                    str_form = '';

                function setTemp(data){
                    //判断旧版本完整链接
                    if(data.src && data.src.indexOf("https") < 0){
                        data.img_url = _this.settings.upload_url + "/images/mall_page_item/source/";   //加载链接选择内容
                    }
                    str_form = _this.tplFun(data, _this.settings.data_tpl[data.type]);
                    if(data.src && data.src.indexOf("https") < 0){
                        delete data.img_url; //删除对象属性
                    }

                    _this.removeClass();
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
                        formData: { 'folder' : 'mall_page_item'}, //提交给服务器端的参数
                        onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                            eval("var jsondata = " + data + ";");
                            var key = jsondata['key'];
                            var fileName = jsondata['fileName'];

                            var path = _this.settings.upload_url + '/images/mall_page_item/source/' + fileName;
                            //获取当前对象父元素的兄弟元素并赋值
                            obj = $("#" + file.id.substr(0,file.id.length-2));
                            $parent = obj.parent().parent();
                            $parent.find("input").val(fileName);
                            $parent.find(".img").html('<img src="'+path+'" id="shareImg" class="img-responsive w100" />');
                            //$('#shareImgHidden').val(fileName);

                            // 隐藏域取值/赋值
                            var initHiddenData = JSON.parse($msTitle.find(".hiddenData").val());
                            initHiddenData.src = path ;
                            $msTitle.find(".hiddenData").val(JSON.stringify(initHiddenData));
                            //$('#shareImg').attr('src', path);
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
            banner: function (_this,data) {
                //设置高度
                setTimeout(function(){
                    _this.runSetHeight();
                }, 500);

                //添加图片广告模块
                $("#ms_banner").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                });
                //图片广告样式
                $(document).on('click', '.js-r-banner-style-ul li',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    $(this).addClass("active").siblings().removeClass('active');
                    hiddenData.style = $(this).attr('data-index');
                    _this.editTpl(hiddenData);
                    _this.runSetHeight();
                });
                //图片间隙输入框改变
                $(document).on('change', '.bars_input',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.margin = $(this).val() > 30 ? 30 : $(this).val() < 0 ? 0 : $(this).val();
                    _this.editTpl(hiddenData);
                    _this.runSetHeight();
                });
                //图片间隙
                $(document).on('mousedown','.banner-slider-btn', function (event) {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        self = $(this);
                    ff(this,event,0,30,function (pos,x) {
                        hiddenData.margin = pos;
                        _this.editLeftTpl(hiddenData);
                        _this.runSetHeight();
                    });
                });
                //模块里添加广告，控制20个
                $(document).on('click', '.js-add-banner',function () {
                    var length = $(this).parent().parent().find("dl").length,
                        initHiddenData = '';

                    if(length > 19){
                        layer.msg('最多添加20个广告')
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
                        _this.runSetHeight();
                    }
                });
                //删除模块里添加广告项
                $(document).on('click', '.js-banner-close',function () {
                    var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".dl-horizontal").index($(this).parent().parent());

                    $(this).parent().parent().remove();
                    initHiddenData.list.splice(index,1);
                    _this.editTpl(initHiddenData);
                    _this.runSetHeight();
                });
                //一屏显示
                $(document).on('change', '.js-lineDisplay', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    hiddenData.lineDisplay = $(this).val();
                    _this.editTpl(hiddenData);
                    _this.runSetHeight();
                });
            },
            coupon: function (_this,data) {
                //添加门店模块
                $("#ms_coupon").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                });
                //优惠券样式
                $(document).on('change', 'input[name="couponStyle"]',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.style = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //优惠券添加
                $("#modalCoupon").on('show.bs.modal', function () {
                    var $editing = $(".editing").find(".hiddenData"),
                        hiddenData = JSON.parse($editing.val()),
                        $inputChecked = '',
                        $tr = '';

                    $("input[name='checkboxCoupon']").prop("checked", false);  //把所有门店input选中状态给清除
                    if(hiddenData.list.length){
                        $.each(hiddenData.list, function (i,o) {
                            $.each($("input[name='checkboxCoupon']"), function (i,o1) {
                                if(o.id == $(o1).val()){  //如果优惠券id存在就把对应的id的input设置为选中状态
                                    $(o1).prop("checked", true);
                                }
                            });
                        });
                    }

                    //优惠券添加
                    $("#btnCouponSure").click(function () {
                        var length = '';
                        $editing = $(".editing").find(".hiddenData");
                        hiddenData = JSON.parse($editing.val());
                        $inputChecked = $("input[name='checkboxCoupon']:checked");

                        //清空数组内容，然后再把选中的循环
                        hiddenData.list = [];
                        $inputChecked.each(function () {
                            var time1 = '', time2 = '',date = '',d1 = '',d2='', newObj = '';
                            $tr = $inputChecked.parents("tr");
                            hiddenVal = JSON.parse($(this).next().val());
                            newObj = {
                                "id": $(this).val(),
                                "name": hiddenVal.name,
                                "cType": hiddenVal.type,
                                "number": hiddenVal.number,
                                "condition": hiddenVal.condition,
                                "sign": ""
                            };
                            hiddenData.list.push(newObj);
                        });

                        _this.editTpl(hiddenData);
                        $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
                    });
                });
                //优惠券删除
                $(document).on('click',".js-coupon-del", function () {
                    var $editing = $(".editing").find(".hiddenData"),
                        index = $(".region-couponR .item").index($(this).parent());
                    hiddenData = JSON.parse($editing.val());

                    $(this).parent().remove(); //当前对象的li去掉
                    hiddenData.list.splice(index,1); //删除数据
                    _this.editTpl(hiddenData);
                    $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
                });
            },
            discount: function (_this,data) {
                //添加限时折扣模块
                $("#ms_discount").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                });

                //活动弹出框显示的时候把当前对应的活动ID设置为选中状态
                $("#modalActivity").on('show.bs.modal', function () {
                    var $editing = $(".editing").find(".hiddenData"),
                        hiddenData = JSON.parse($editing.val());

                    $("input[name='ckActivity']").prop("checked", false);  //把所有活动input选中状态给清除
                    if(hiddenData.activityId){  //如果活动id存在就把对应的id的input设置为选中状态
                        $("#activityId_"+ hiddenData.activityId).prop("checked", true);
                    }

                    //活动添加
                    $("#btnActivity").click(function () {
                        var $inputChecked = $("input[name='ckActivity']:checked");
                        $editing = $(".editing").find(".hiddenData");  //不重新获取会多个赋值

                        hiddenData.activityId = $inputChecked.val();  //活动id
                        hiddenData.title = $inputChecked.parents("tr").find(".title").html(); //设置标题
                        _this.editTpl(hiddenData);
                        $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象

                        _this.ajaxLoad({
                            'activity_type': _this.settings.activity_type,
                            'activity_id': $inputChecked.val()
                        })
                    });
                });
                //活动删除
                $(document).on('click',".js-activityDel", function () {
                    var $editing = $(".editing").find(".hiddenData"),
                        hiddenData = JSON.parse($editing.val());

                    hiddenData.activityId = '';  //活动id
                    hiddenData.title = ''; //设置标题
                    hiddenData.list = []; //设置标题
                    _this.editTpl(hiddenData);
                    $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
                });
            },
            fightG: function (_this,data) {
                $("#ms_fightG").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                });

                //活动弹出框显示的时候把当前对应的活动ID设置为选中状态
                $("#modalFightG").on('show.bs.modal', function () {
                    var $editing = $(".editing").find(".hiddenData"),
                        hiddenData = JSON.parse($editing.val());

                    $("input[name='ckFightG']").prop("checked", false);  //把所有活动input选中状态给清除
                    if(hiddenData.activityId){  //如果活动id存在就把对应的id的input设置为选中状态
                        $("#FightGId_"+ hiddenData.activityId).prop("checked", true);
                    }

                    //活动添加
                    $("#btnFightG").click(function () {
                        $editing = $(".editing").find(".hiddenData");  //不重新获取会多个赋值
                        var $inputChecked = $("input[name='ckFightG']:checked");

                        hiddenData.activityId = $inputChecked.val();  //活动id
                        hiddenData.title = $inputChecked.parents("tr").find(".title").html(); //设置标题
                        _this.editTpl(hiddenData);
                        $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象

                        _this.ajaxLoad({
                            'activity_type': _this.settings.fightG_type,
                            'activity_id': $inputChecked.val()
                        })
                    });
                });

            },
            goods: function (_this,data) {
                //商品添加
                $("#ms_goods").click(function () {
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中

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
                    hiddenData.btnText = text ? text : '立即购买';  //如果为空，则变成“立即购买”
                    _this.editTpl(hiddenData)
                });
            },
            guideLine: function(_this, data){
                //添加模块
                $("#ms_guideLine").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor();  //设置颜色
                });

                //辅助线留白
                $(document).on('click', '.js-guideLine-padding',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.isPadding = $(this).prop("checked");
                    _this.editLeftTpl(hiddenData);
                });
                //辅助线样式
                $(document).on('change', 'input[name="borderstyle"]',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.borderStyle = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //辅助线边距
                $(document).on('change', 'input[name="guidLineMargin"]',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.margin = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
            },
            guidePadding: function(_this, data){
                //添加模块
                $("#ms_guidePadding").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor();  //设置颜色
                });

                $(document).on('mousedown','.guide-slider-btn', function (event) {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        self = $(this);
                    ff(this,event,10,100,function (pos,x) {
                        hiddenData.height = pos<10?10:pos;
                        _this.editLeftTpl(hiddenData);
                    });
                })
            },
            headline: function (_this, data) {
                //添加标题模块
                $("#ms_headline").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor();
                });
                //标题/ 副标题
                $(document).on('keyup', '.js-headline-title', function (ev) {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    switch (ev.target.dataset.type){
                        case "title":
                            hiddenData.title = $(this).val();
                            break;
                        case 'subtitle':
                            hiddenData.subtitle = $(this).val();
                            break;
                        case "navTitle":
                            hiddenData.navTitle = $(this).val();
                            break;
                    }

                    _this.editLeftTpl(hiddenData);
                });
                //显示位置
                $(document).on('change', 'input[name="alignCenterStyle"]',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.alignCenter = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //模块里添加文本导航
                $(document).on('click', '.js-add-headline',function () {
                    var $editing = $(".editing"),
                        hiddenData = JSON.parse($editing.find(".hiddenData").val());

                    hiddenData.isNavShow = true;
                    _this.editTpl(hiddenData);
                    hiddenData.options = [];
                    $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
                    _this.setColor();
                });
                //删除文本导航
                $(document).on('click', '.js-headline-close',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.isNavShow = false;
                    hiddenData.navTitle = '';
                    hiddenData.linkIndex = '';
                    hiddenData.inputValue = '';
                    hiddenData.url = '';
                    hiddenData.checkedId = '';
                    _this.editTpl(hiddenData);
                    _this.setColor();
                });
                //自定义外链输入框变化
                $(document).on('click', '.js-headline-sure', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.url = $(this).prev().val();
                    hiddenData.inputValue = $(this).prev().val();
                    _this.editTpl(hiddenData);
                    _this.setColor();
                });
                //删除选择的链接
                $(document).on('click', '.js-headline-del', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.linkIndex = '';
                    hiddenData.checkedId = '';
                    _this.editTpl(hiddenData);
                    _this.setColor();
                });
                //联系电话
                $(document).on('blur', '.js-headline-phone', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".dl-horizontal").index($(this).parents(".dl-horizontal"));

                    hiddenData.inputValue = $(this).val();
                    _this.editTpl(hiddenData);
                    _this.runSetHeight();
                });
            },
            imageText: function (_this, data) {
                //添加图文模块
                $("#ms_imageText").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                });
                //模块里添加图文
                $(document).on('click', '.js-add-imageText',function () {
                    var length = $(this).parent().parent().find("dl").length,
                        initHiddenData = '';

                    initHiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    initHiddenData.list.push({
                        "imgSrc": '',  //图文图片
                        "title": '',  //图文标题
                        "textarea": '', //文本
                        "linkIndex": '',  //跳转的链接
                        "inputValue": '',  //自定义链接的值
                        "url":'',  //广告自定义链接
                        "checkedId": '' //弹出框选中商品的值
                    });
                    _this.editTpl(initHiddenData);
                    _this.runSetHeight();
                });
                //图文样式
                $(document).on('change', 'input[name="imageTexttyle"]',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.style = $(this).val();
                    _this.editTpl(hiddenData);
                });
                //删除模块里添加图文项
                $(document).on('click', '.js-imageText-close',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".dl-horizontal").index($(this).parent().parent());

                    $(this).parent().parent().remove();
                    hiddenData.list.splice(index,1);
                    _this.editLeftTpl(hiddenData);
                });
                //字体大小
                $(document).on('change', 'input[name="fontsizeStyle"]', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.fontsize = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //自定义外链输入框变化
                $(document).on('click', '.js-imageText-sure', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".dl-horizontal").index($(this).parents(".dl-horizontal"));

                    hiddenData.list[index].url = $(this).prev().val();
                    hiddenData.list[index].inputValue = $(this).prev().val();
                    _this.editLeftTpl(hiddenData);
                    _this.runSetHeight();
                });
                //正文
                $(document).on('change', '.js-imageText-textarea', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".ms-form .dl-horizontal").index($(this).parents(".dl-horizontal"));
                    hiddenData.list[index].textarea = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
            },
            nav: function (_this,data) {
                //添加图片导航模块
                $("#ms_nav").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor1(".js-dropdownList");  //设置颜色
                });
                //一排个数
                $(document).on('change', 'input[name="navCols"]',function (e) {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.cols = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //模块里添加广告，控制10个
                $(document).on('click', '.js-add-nav',function () {
                    var length = $(this).parent().parent().find("dl").length,
                        initHiddenData = '';

                    if(length > 9){
                        layer.msg('最多添加10个图标')
                    }else{
                        initHiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                        initHiddenData.list.push({
                            "url":"",
                            "imgSrc":"",
                            "title":"",
                            "defaultColor" : "#ffc42c",
                            "defaultImage" : "color1.png",
                            "linkIndex":"",
                            "inputValue":"",
                            "checkedId":""
                        });
                        _this.editTpl(initHiddenData);
                    }
                });
                //图标样式
                $(document).on('change', 'input[name="navStyle"]',function (e) {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.style = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
            },
            post: function (_this,data) {
                //添加模块
                $("#ms_post").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor();  //设置颜色
                });

                //公告内容
                $(document).on('change', '.js-post-title', function () {
                    var $hiddenId = $(".editing"),
                        hiddenData = JSON.parse($hiddenId.find(".hiddenData").val()),
                        str_l = ''; //获得对应的左侧模板

                    hiddenData.text = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
            },
            richText: function (_this,data) {
                var str_l = '';

                //添加富文本模块
                $("#ms_richText").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor();  //设置颜色
                });

                //是否全屏
                $(document).on('click', '.js-isFullscreen',function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.isFullScreen = $(this).prop("checked");
                    _this.editLeftTpl(hiddenData);
                });
            },
            search: function (_this,data) {
                //添加图片广告模块
                $("#ms_search").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor();  //设置颜色
                });
            },
            video: function (_this,data) {
                //添加模块
                $("#ms_video").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                });

                //视频标题
                $(document).on('change', '.js-video-title', function () {
                    var $hiddenId = $(".editing"),
                        hiddenData = JSON.parse($hiddenId.find(".hiddenData").val()),
                        str_l = ''; //获得对应的左侧模板

                    hiddenData.title = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //视频标题
                $(document).on('change', '.js-video-url', function () {
                    var $hiddenId = $(".editing"),
                        hiddenData = JSON.parse($hiddenId.find(".hiddenData").val()),
                        str_l = ''; //获得对应的左侧模板

                    hiddenData.url = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
            }
        },
        addTpl: function (data) { //添加左侧模板
            var str_l = '', tpl_l ='',_this = this;

            //判断旧版本完整链接
            if(data.list && data.list[0] && data.list[0].imgSrc && data.list[0].imgSrc.indexOf("https") < 0){
                data.img_url = this.settings.upload_url + "/images/mall_page_item/source/";   //加载链接选择内容
            }
            data.color_url = this.settings.upload_url + "/images/page_set_color/source/";   //加载默认图标地址

            str_l = _this.tplFun(data, _this.settings.data_tpl[data.type][0]);
            if(data.list && data.list[0] && data.list[0].imgSrc && data.list[0].imgSrc.indexOf("https") < 0){
                delete data.img_url; //删除对象属性
            }
            delete data.color_url;//删除对象属性

            //分组的时候才要做判断
            tpl_l = "<div class='region'>" +
                "<input type='hidden' class='hiddenData' value=\'"+ JSON.stringify(data) +"\'>" +
                "<div class='js-control-group'>" + str_l;

            if(data.type == "group"){
                tpl_l += "</div><div class='actions'><div class='actions-wrap'><span class='action js-edit'>编辑</span></div>" +
                    "</div>";
            }else{
                tpl_l += "</div><div class='actions'><div class='actions-wrap'><span class='action js-edit'>编辑</span><span class='action js-delete'>删除</span></div></div>" +
                    "</div>";
            }

            $(_this.settings.tpl_preview).append(tpl_l); //左边

            this.removeClass();
            $(".js-ms-form").show(); //右侧大框显示
            if(data.type == 'nav' || data.type == 'banner' || data.type == 'banner'){//加载上传图片
                this.uploadFun(data.list.length)
            }
        },
        ajaxLoad: function (data1) {  //活动商品加载
            $.ajax({
                'type': 'get',
                'url': '/goods/goods/get-activity-goods.html',
                'data': data1,
                'dataType': 'json',
                'success': function (data) {
                    var str = '';
                    for (var i in data.data.list) {
                        str += '<tr>';
                        str += '<td><input type="checkbox" name="ckActivityShop" class="qkj-checkbox" value="' + data.data.list[i].id + '" data-src="' + data.data.list[i].img + '"></td>';
                        str += '<td><span id="activityShopId_' + data.data.list[i].id + '">' + data.data.list[i].name + '</span></td>';
                        str += '<td>';
                        str += '<div class="col-xs-9 p0">';
                        str += '<div>原价：￥<span class="price_cost">' + data.data.list[i].price + '</span></div>';
                        switch (data1.activity_type){
                            case "2":
                                str += '<div>折后：￥<span class="price_discount">' + data.data.list[i].discount_price + '</span></div>';
                                break;
                            case "3":
                                str += '<div>拼团：￥<span class="price_discount">' + data.data.list[i].group_price + '</span></div>';
                                break;
                        }
                        str += '</div>';
                        str += '<td><span class="stock" data-value="10">' + data.data.list[i].num + '</span></td>';
                        str += '</tr>';
                    }
                    $('.activity_goods_list').html(str);
                }
            });
        },
        compute: function (element) { //计算右边的高度
            var top = $(".editing").position().top; //获得相对偏移值
            var titleHeight = $(".js-ms-form-title").outerHeight();
            top = top > titleHeight ? top- titleHeight : top-27;
            $(element).parent().filter(':not(:animated)').animate({"margin-top": top});  //在新的动画开始前，先停止当前正在进行的动画
        },
        editLeftTpl: function (data) {  //编辑左侧模板
            var $hiddenId = $(".editing"),
                $controlGroup = $hiddenId.find('.js-control-group'),
                str_l = '', _this = this; //获得对应的左侧模板

            //判断旧版本完整链接
            if(data.list && data.list[0] && data.list[0].imgSrc && data.list[0].imgSrc.indexOf("https") < 0){
                data.img_url = this.settings.upload_url + "/images/mall_page_item/source/";   //加载链接选择内容
            }
            data.color_url = this.settings.upload_url + "/images/page_set_color/source/";   //加载默认图标地址

            str_l = this.tplFun(data, _this.settings.data_tpl[data.type][0]); //获得对应的左侧模板
            $controlGroup.html(str_l).prev().val(JSON.stringify(data)); //左边

            if(data.list && data.list[0] && data.list[0].imgSrc && data.list[0].imgSrc.indexOf("https") < 0){
                delete data.img_url; //删除对象属性
            }
            delete data.color_url;//删除对象属性

            $hiddenId.find(".hiddenData").val(JSON.stringify(data));
        },
        editTpl: function (data) { //编辑模板
            var str_l = '',str_form = '', $temp_l = $('.editing .js-control-group'), _this = this, $msForm = $(".js-ms-form");

            //判断旧版本完整链接
            if(data.list && data.list[0] && data.list[0].imgSrc && data.list[0].imgSrc.indexOf("https") < 0){
                data.img_url = this.settings.upload_url + "/images/mall_page_item/source/";   //加载链接选择内容
            }
            data.color_url = this.settings.upload_url + "/images/page_set_color/source/";   //加载默认图标地址

            //判断是不是文本编辑器类型
            switch (data.type){
                case "richText":
                    $(".js-ms-form").show();
                    _this.richTextFun(data);
                    break;
                default:
                    $(".js-ms-form").show();
                    if(!!data.options){data.options = _this.settings.linkOptions();}   //加载链接选择内容
                    str_form = _this.tplFun(data, _this.settings.data_tpl[data.type][1]);
                    $(_this.settings.tpl_form).html(str_form); //右边
                    if(!!data.options){data.options = []}  //清空加载链接内容
                    //颜色加载
                    if(data.type == 'search' || data.type == 'nav'){
                        _this.setColor1(".js-dropdownList");
                    }
                    break;
            }

            str_l = _this.tplFun(data, _this.settings.data_tpl[data.type][0]); //获得对应的左侧模板
            $temp_l.html(str_l); //左边
            _this.compute(_this.settings.tpl_form);  //计算高度
            if(data.type == 'nav' || data.type == 'banner' || data.type == 'imageText'){ //加载上传图片
                _this.uploadFun(data.list.length);
            }
            if(data.list && data.list[0] && data.list[0].imgSrc && data.list[0].imgSrc.indexOf("https") < 0){
                delete data.img_url; //删除对象属性
            }
            delete data.color_url;//删除对象属性

            $temp_l.prev().val(JSON.stringify(data)); //左边隐藏域赋值
        },
        isToggle: function (element, attr, data) { //判断多选框
            if(element.prop("checked")){
                data[attr] = true;
            }else{
                data[attr] = false;
            }
            this.editTpl(data)
        },
        richTextFun: function (data) { //文本编辑器内容改变
            var _this = this, str_form = '';

            //判断富文本编辑器是否为对象，是就销毁
            if(typeof _this.settings.ue == 'object'){
                UE.getEditor('container').destroy();  //销毁
            }

            //生成一个模块
            str_form = _this.tplFun(data, _this.settings.data_tpl[data.type][1]);
            $(_this.settings.tpl_form).html(str_form);
            //生成一个富文本对象
            _this.settings.ue = UE.getEditor('container',{
                initialFrameWidth: "100%",
                toolbars: [
                    ['bold', 'source', 'fontsize','paragraph','rowspacingtop','rowspacingbottom','lineheight', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc','edittable','edittd', 'link','simpleupload', 'insertimage']
                ]
            });
            // 初始化现有存在的值
            _this.settings.ue.addListener('ready', function() {
                this.setContent(data.text);  //this是当前创建的编辑器实例
            });

            //当编辑器里的内容改变时执行方法
            _this.settings.ue.addListener("contentChange",function(){
                var $hiddenId = $(".editing"),
                    hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());

                hiddenData.text = _this.settings.ue.getContent();
                $hiddenId.find(".hiddenData").val(JSON.stringify(hiddenData));
                _this.editLeftTpl(hiddenData);
            });
        },
        removeClass: function () { //删除样式
            $(".editing").removeClass('editing'); //清除所有选中的样式
        },
        runSetHeight: function(){  //给广告图设置最大高度的方法
            this.setInitHeight('.js-region-banner',".slide-wrap");
        },
        setColor: function (element) {  //设置颜色值
            var self = $(element).length ? $(element) : $('.editing'),  //当前选中的对象
                hiddenData = JSON.parse(self.find(".hiddenData").val()),
                color = '';

            //背景颜色
            $(".colpick").remove();
            $('.color-set').each(function () {
                var value = $(this).attr("data-value");

                if(value == "1"){
                    color = hiddenData.defaultColor;
                }else if(value == "2"){
                    color = hiddenData.textColor;
                }else if(value == "3"){
                    color = hiddenData.borderColor;
                }

                $(this).colpick({
                    colorScheme:'light',
                    layout:'rgbhex',
                    color: color,
                    onSubmit:function(hsb,hex,rgb,el) {
                        var value = $(el).attr("data-value");

                        hiddenData = JSON.parse(self.find(".hiddenData").val());
                        if(value == "1"){  //背景颜色
                            hiddenData.defaultColor = '#'+hex;
                            if(hiddenData.type == 'post'){
                                self.find('.js-control-group .bg1').css('background-color', '#'+hex);
                            }else{
                                self.find('.js-control-group >div').css('background-color', '#'+hex);
                            }
                            $(el).css('background-color', '#'+hex);
                        }else if(value == "2"){  //文字颜色
                            hiddenData.textColor = '#'+hex;
                            self.find('.js-control-group >div').css('color', '#'+hex);
                            $(el).css('background-color', '#'+hex);
                        }else if(value == "3"){  //边框颜色
                            hiddenData.borderColor = '#'+hex;
                            self.find('.js-control-group .hr').css('border-top-color', '#'+hex);
                            $(el).css('background-color', '#'+hex);
                        }
                        self.find(".hiddenData").val(JSON.stringify(hiddenData));
                        $(el).colpickHide();  //隐藏
                    }
                });
            });

            //文字颜色
            $('.text-color').colpick({
                colorScheme:'light',
                layout:'rgbhex',
                color: hiddenData.textColor,
                onSubmit:function(hsb,hex,rgb,el) {
                    hiddenData = JSON.parse(self.find(".hiddenData").val());
                    hiddenData.textColor = '#'+hex;
                    self.find(".hiddenData").val(JSON.stringify(hiddenData));
                    self.find('.js-control-group >div').css('color', '#'+hex);
                    $(el).css('background-color', '#'+hex);
                    $(el).colpickHide();  //隐藏
                }
            });
        },
        setColor1: function (element) {  //设置颜色值
            var temp = '{{each colors color i}}<li class="bg-color{{i+1}}" data-index="{{i+1}}"><a href="javascript:;" class="js-dropdownItem" style="background-color:{{color}}">{{color}}</a></li>{{/each}}';
            var data = {
                colors : [
                    "#ffc42c","#876cfd","#fd7450","#56b2f5","#68df37","#23dad8"
                ]
            };
            var html = this.tplFun(data, temp);

            $(element).html(html);
        },
        setInitSelected: function (element) {  //模块之前切换后第一个元素选中
            $(element).addClass('editing');
            var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val()),_this = this;
            this.editTpl(initHiddenData);
            setTimeout(function () {
                if (_this && initHiddenData.type == 'banner'){
                    _this.runSetHeight();
                }
                if (_this && initHiddenData.type == 'discount'){
                    //编辑进来加载商品内容
                    _this.ajaxLoad({
                        'activity_type': _this.settings.activity_type, //活动类型
                        'activity_id': initHiddenData.activityId  //活动id
                    });
                }
                if (_this && initHiddenData.type == 'fightG'){
                    //编辑进来加载商品内容
                    _this.ajaxLoad({
                        'activity_type': _this.settings.fightG_type, //活动类型
                        'activity_id': initHiddenData.activityId  //活动id
                    });
                }
            },10)
        },
        /*
         * 计算最大高度,并设置广告图最外框的高度
         * @param: 广告图最外框的样式
         * @param: 广告图要赋值高度的对象
         * */
        setInitHeight: function (arr,element) {
            var arrHeight = [];
            $(arr).each(function () {
                $(this).find("img").each(function () {
                    arrHeight.push($(this).height());
                });
                $(this).find(element).css("height", Math.max.apply(Math,arrHeight));
                arrHeight = [];
            });
        },
        setLinkSelect: function (option) {  //上传图片链接选择
            var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                index = $(".ms-form .dl-horizontal").index(option.element.parents(".dl-horizontal")),
                radioChecked = '',
                _this = this,
                $modalHomePage,  //微页面
                $modalGoodsSale, //商品
                $modalGroupPage, //分组
                //$modalReserve,   //预约
                $modalWxapplet;   //小程序

            //自定义外链，显示外链输入框
            if(option.element.val() == "6"){
                option.element.next().show();
            }else{
                option.element.next().hide();
            }

            if(option.index == 1){
                hiddenData.list[index].linkIndex = option.element.val();
            }else{
                hiddenData.linkIndex = option.element.val();
            }

            //如果是7、8、9的话，
            switch (option.element.val()){
                case "7":
                    $modalHomePage = $("#modalHomePage");
                    $modalHomePage.modal();

                    setLinkVal($modalHomePage,'ckMall','input_','btnHomePage');
                    break;
                case "8":
                    $modalGoodsSale = $("#modalGoodsSale");
                    $modalGoodsSale.modal();

                    setLinkVal($modalGoodsSale,'ckShop','shopInput_','btnGoodsSale');
                    break;
                case "9":
                    $modalGroupPage = $("#modalGroupPage");
                    $modalGroupPage.modal();

                    setLinkVal($modalGroupPage,'ckGroup','group_','btnGroupPage');
                    break;
                case "14":
                    $modalWxapplet = $("#modalWx_applet");
                    $modalWxapplet.modal();

                    setLinkVal($modalWxapplet,'wxappletInput','wxappletName_','btnWx_applet');
                    break;
                default:
                    this.editTpl(hiddenData);
                    _this.setColor();  //重新初始化颜色设置
            }

            if(option.type == 'banner'){
                _this.runSetHeight();
            }

            //设置链接value值
            function setLinkVal(modalObj,inputName,id,btnId) {
                //如果id的值存在,则勾选弹出框的值
                $("input[name='"+ inputName +"']").prop("checked", false);
                if (option.id) {
                    $("#"+ id + option.id).parents("tr").find("input").prop("checked", true);
                }

                //未点击确定的情况下关闭弹出框
                modalObj.on('hide.bs.modal', function () {
                    option.element.val("");
                });

                //弹出框“确定”按钮点击
                $("#"+ btnId).click(function () {
                    radioChecked = $("input[name='"+ inputName +"']:checked");
                    //获取选择商城页面的id
                    if(option.index == 1){
                        hiddenData.list[index].checkedId = radioChecked.val();
                    }else{
                        hiddenData.checkedId = radioChecked.val();
                    }
                    option._window.editTpl(hiddenData);
                    if (option.type == 'banner') {
                        _this.runSetHeight();
                    }
                    _this.setColor();  //重新初始化颜色设置
                });
            }
        },
        tplFun: function (data,temp) { //加载模板方法
            var render = template.compile(temp),
                str = render(data);
            return str;
        },
        uploadFun: function (len) {  //上传图片
            var $editing = $(".editing"), length = '', _this = this;
            //循环加载上传软件
            setTimeout(function () {
                length = $(".ms-form .dl-horizontal").length;
                for(var i = 0,len=length; i<len; i++) {
                    $('#imgBtn_' + i).uploadify({
                        uploader: _this.settings.upload_url + '/upload.php',// 服务器处理地址
                        swf: '/js/lib/uploadify/uploadify.swf',
                        buttonText: "选择图片",//按钮文字
                        height: 34,  //按钮高度
                        width: 82, //按钮宽度
                        fileSizeLimit: 2048,
                        fileTypeExts: '*.jpg;*.png;*.jpeg;',//允许的文件类型
                        fileTypeDesc: "请选择图片文件", //文件说明
                        formData: { 'folder' : _this.settings.folder, 'thumb': _this.settings.thumb}, //提交给服务器端的参数
                        onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                            eval("var jsondata = " + data + ";");
                            var key = jsondata['key'], fileName = jsondata['fileName'], obj = '', path='', hiddenData='', index='';

                            path = _this.settings.upload_url + '/images/mall_page_item/source/' + fileName;
                            //获取当前对象父元素的兄弟元素并赋值
                            obj = $("#" + file.id.substr(0,file.id.length-2));
                            $parent = obj.parent().parent();
                            $parent.find("input").val(fileName);
                            $parent.find("img").attr('src', path);

                            // 隐藏域取值/赋值
                            hiddenData = JSON.parse($editing.find(".hiddenData").val());
                            index = $(".ms-form .dl-horizontal").index(obj.parents(".dl-horizontal"));
                            hiddenData.list[index].imgSrc = fileName;
                            $editing.find(".hiddenData").val(JSON.stringify(hiddenData));
                            _this.editTpl(hiddenData);
                            setTimeout(function () {
                                _this.runSetHeight();
                            },400)
                        }
                    });
                }
            },200);
        }
    };

    window.tpl_groupAdd = window.tpl_groupAdd || tpl_groupAdd;
})(window, jQuery);