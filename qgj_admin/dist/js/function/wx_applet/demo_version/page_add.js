$(function () {
    // 滚动置顶
    util.setScrollFixed('.js-region-add');

    $(".js-pic-list li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $("#btnNavSure").removeAttr("disabled");
    });

    //导航切换
    $(".js-ul-switch li").click(function (e) {
        $(".ui-switch" + $(this).index()).show().siblings().hide();
        $(this).addClass("active").siblings().removeClass("active");
        loopPicList();
    });
});

//循环图标
function loopPicList() {
    if ($(".ui-switch0").is(":visible")) {
        $(".js-pic-list li").each(function () {
            if ($(this).hasClass("active")) {
                $("#btnNavSure").removeAttr("disabled");
                return false;
            } else {
                $("#btnNavSure").attr("disabled", "disabled");
            }
        })
    } else {
        $("#btnNavSure").removeAttr("disabled");
    }
}

/*
 * 原理：点击右侧，抓取左侧对应选中的对象的隐藏域里的值，然后把当前的至替换掉隐藏域的值，然后再生成html，嵌入到页面上
 * */
(function (window, $, undefined) {
    var tpl_index = function (options) {
        var settings = $.extend({
            tpl_preview: '',  //左边模板位置
            tpl_form: '',    //右边模板位置
            data: null,      //左边数据
            data_tpl: {
                title: '<div class="form-horizontal">' +
                '<div class="form-group">' +
                '<label class="control-label">页面名称 <em class="text-danger">*</em></label>' +
                '<div class="control-input">' +
                '<input type="text" class="form-control js-t-title" id="t_title" name="t_title" value="{{name}}" >' +
                '</div>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label class="control-label">分享图片</label>' +
                    '<div class="control-input">' +
                        '<a href="javascript:;" id="shareImgBtn" class="add-img w100 bg-white"><i class="icon-plus"></i> 添加图片</a>' +
                        '<div class="img">{{if src}}<img src="{{img_url}}{{src}}" id="shareImg" class="img-responsive w100" />{{/if}}</div>' +
                        '<input type="hidden" id="shareImgHidden">' +
                        '<div class="text-gray-light">在小程序分享使用，请添加宽高比为5:4的图片，不超过2M</div> ' +
                    '</div>' +
                '</div>' +
                /*'<div class="form-group">' +
                    '<label class="control-label">背景颜色</label>' +
                    '<div class="control-input"><input type="text" class="color-set w48 form-control form-control-inline" style="background-color:{{defaultColor}}" data-value="1" /><span class="reset-color" data-value="#fafafa">重置</span></div>' +
                '</div>' +*/
                '</div>',
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
                nav: [
                    '{{if list.length}}<ul class="region-nav r-navCols r-navCols{{cols}} r-navStyle{{style}}">' +
                    '{{each list value}}<li><a href="javascript:;"><span class="pic" style="background-image: url({{color_url}}{{value.defaultImage}})";>{{if value.imgSrc}}<img src="{{img_url}}{{value.imgSrc}}">{{/if}}</span>{{if value.title}}<span class="title">{{value.title}}</span>{{/if}}</a></li>{{/each}}' +
                    '</ul>{{/if}}',

                    '<div class="form-horizontal region-nav-r">' +
                    '<div class="form-group">' +
                    '<label class="control-label">单行个数</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="navCols" value="3" {{if cols=="3"}}checked{{/if}}> 一行3个</label> ' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="navCols" value="4" {{if cols=="4"}}checked{{/if}}> 一行4个</label> ' +
                    '<label><input type="radio" class="qkj-radio" name="navCols" value="5" {{if cols=="5"}}checked{{/if}}> 一行5个</label>' +
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
                    '<div class="btn-upload-lg bg">{{if value.imgSrc}}<img src="{{img_url}}{{value.imgSrc}}" id="img_{{index}}" class="img-responsive" />{{/if}}<a href="#modalNav" class="js-nav-img-add" data-toggle="modal">{{if !value.imgSrc}}添加图标{{else}}修改图标{{/if}}</a></div>' +
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
                    '<label><input type="radio" class="qkj-radio" name="guidLineMargin" value="2" {{if margin=="2"}}checked{{/if}}> 左右留边</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">样式</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="borderstyle" value="1" {{if borderStyle=="1"}}checked{{/if}}> 实线</label> ' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="borderstyle" value="2" {{if borderStyle=="2"}}checked{{/if}}> 虚线</label> ' +
                    '<label><input type="radio" class="qkj-radio" name="borderstyle" value="3" {{if borderStyle=="3"}}checked{{/if}}> 点线</label>' +
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
                    '<div class="ratings_bars">' +
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
                            '<h5 class="font-bold" style="font-size: {{fontsize/2}}px; text-align:{{if alignCenter==\"1\"}}left{{else if alignCenter==\"2\"}}center{{/if}}">{{if value.title}}{{value.title}}{{else}}标题{{/if}}</h5>' +
                            '<p style="font-size: {{fontsize/2 - 3}}px; text-align:{{if alignCenter==\"1\"}}left{{else if alignCenter==\"2\"}}center{{/if}}">{{if value.textarea}}{{value.textarea}}{{else}}文本{{/if}}</p>' +
                        '</div>' +
                        '</div>{{/each}}{{/if}}' +
                    '</div>',

                    '<div class="form-horizontal r-imageText">' +
                    '<div class="form-group">' +
                        '<label class="control-label">图文样式</label>' +
                        '<div class="control-input">' +
                            '<label class="mr20"><input type="radio" class="qkj-radio" name="imageTexttyle" value="1" {{if style=="1"}}checked{{/if}}> 左图右文</label> ' +
                            '<label class="mr20"><input type="radio" class="qkj-radio" name="imageTexttyle" value="2" {{if style=="2"}}checked{{/if}}> 小图上下</label> ' +
                            '<label><input type="radio" class="qkj-radio" name="imageTexttyle" value="3" {{if style=="3"}}checked{{/if}}> 大图上下</label>' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="control-label">对齐方式</label>' +
                        '<div class="control-input">' +
                            '<label class="mr20"><input type="radio" class="qkj-radio" name="alignCenterStyle" value="1" {{if !alignCenter || alignCenter=="1"}}checked{{/if}}> 居左</label> ' +
                            '<label><input type="radio" class="qkj-radio" name="alignCenterStyle" value="2" {{if alignCenter=="2"}}checked{{/if}}> 居中</label> ' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="control-label">字号大小</label>' +
                        '<div class="control-input">' +
                            '<label class="mr20"><input type="radio" class="qkj-radio" name="fontsizeStyle" value="36" {{if fontsize=="36"}}checked{{/if}}> 大号</label> ' +
                            '<label class="mr20"><input type="radio" class="qkj-radio" name="fontsizeStyle" value="32" {{if !fontsize || fontsize=="32"}}checked{{/if}}> 中号</label> ' +
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
                    '<label class="control-label">标题</label>' +
                    '<div class="control-input">' +
                    '<input type="text" class="form-control js-title" data-index="1" maxlength="30" value="{{value.title}}" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">文本</label>' +
                    '<div class="control-input">' +
                    '<textarea class="form-control js-imageText-textarea" maxlength="50">{{value.textarea}}</textarea>' +
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
                    '<a href="javascript:;" class="ml5 js-imageText-sure">确定</a>' +
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
                    '<input type="text" class="form-control js-headline-title" data-type="navTitle" maxlength="4" value="{{navTitle}}" />' +
                    '</div>' +
                    '</div>' +
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
                    '{{if linkIndex == "7"}}<div class="link-select"><a href="#modalHomePage" data-toggle="modal" class="link js-link-select" data-index="2"><span>商城页面</span> | <span class="span_{{checkedId}}"><script>$(".span_{{checkedId}}").html($("#input_{{checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-headline-del">×</a></div>{{/if}}' +
                    '{{if linkIndex == "8"}}<div class="link-select"><a href="#modalGoodsSale" data-toggle="modal" class="link js-link-select" data-index="2"><span>商品</span> | <span class="span_{{checkedId}}"><script>$(".span_{{checkedId}}").html($("#shopInput_{{checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-headline-del">×</a></div>{{/if}}' +
                    '{{if linkIndex == "9"}}<div class="link-select"><a href="#modalGroupPage" data-toggle="modal" class="link js-link-select" data-index="2"><span>商品分组</span> | <span class="span_{{checkedId}}"><script>$(".span_{{checkedId}}").html($("#group_{{checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-headline-del">×</a></div>{{/if}}' +
                    '{{if linkIndex == "12"}}<div class="link-select"><a href="#modalReserve" data-toggle="modal" class="link js-link-select" data-index="2"><span>预约</span> | <span class="span_{{checkedId}}"><script>$(".span_{{checkedId}}").html($("#reserve_{{checkedId}}").html())</script></span></a><a href="javascript:;" class="close close-bg js-headline-del">×</a></div>{{/if}}' +
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
                album: [
                    '<div class="region-album-wrap r-album-wrap{{style}}"><ul><li></li><li></li><li></li></ul></div>',

                    '<div class="form-horizontal region-album-r">' +
                    '<div class="form-group">' +
                    '<label class="control-label">相册样式</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="albumStyle" value="1" {{if style=="1"}}checked{{/if}}> 小图滑动</label> ' +
                    '<label><input type="radio" class="qkj-radio" name="albumStyle" value="2" {{if style=="2"}}checked{{/if}}> 九宫格</label> ' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">相册来源</label>' +
                    '<div class="control-input">' +
                    '<label class="mr20"><input type="radio" class="qkj-radio" name="albumtypeStyle" value="1" {{if albumType=="1"}}checked{{/if}}> 门店相册</label> ' +
                    '<label><input type="radio" class="qkj-radio" name="albumtypeStyle" value="2" {{if albumType=="2"}}checked{{/if}}> 通用相册</label>' +
                    '<div class="js-albumtype-category mt5"><div class="form-group"><label class="control-label">选择分类</label><div class="control-input"></div></div></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                ],
                store: [
                    '<div class="region-store">' +
                    '{{if list.length}}<div class="title">' +
                    '<h4>{{list[0].name}}</h4>' +
                    '<span>人均：{{list[0].per_capita}}元</span>' +
                    '</div>' +
                    '<div class="contact">' +
                    '<div class="addr"><i class="icon-wx-store icon-wx-address"></i><span>{{list[0].full_address}}</span></div>' +
                    '<div class="telphone"><i class="icon-telphone"></i></div>' +
                    '</div>' +
                    '<div class="shop-hours">' +
                    '<h6>营业时间：' +
                    '{{if list[0].is_all_day==1}}全天24小时 {{else}}{{list[0].open_time_time}}{{/if}}' +
                    '{{each list[0].open_time_week value}}' +
                    '{{if value == 1}}周一、{{/if}}{{if value==2}}周二、{{/if}}{{if value == 3}}周三、{{/if}}{{if value == 4}}周四、{{/if}}{{if value == 5}}周五、{{/if}}{{if value == 6}}周六、{{/if}}{{if value == 7}}周日{{/if}}' +
                    '{{/each}}' +
                    '</h6>' +
                    '<ul>{{each list[0].service value}}{{if value == 1}}<li><i class="icon-wx-store icon-wx-wifi"></i> WIFI</li>{{/if}}' +
                    '{{if value == 2}}<li><i class="icon-wx-store icon-wx-parking"></i> 停车</li>{{/if}}' +
                    '{{if value == 3}}<li><i class="icon-wx-store icon-wx-box"></i> 包厢</li>{{/if}}' +
                    '{{if value == 4}}<li><i class="icon-wx-store icon-wx-smoke"></i> 吸烟区</li>{{/if}}' +
                    '{{if value == 5}}<li><i class="icon-wx-store icon-wx-baby"></i> 婴儿椅</li>{{/if}}' +
                    '{{if value == 6}}<li><i class="icon-wx-store icon-wx-pet"></i> 宠物可带</li>{{/if}}' +
                    '{{if value == 7}}<li><i class="icon-wx-store icon-wx-phone"></i> 移动支付</li>{{/if}}' +
                    '{{if value == 8}}<li><i class="icon-wx-store icon-wx-card"></i> 刷卡</li>{{/if}}{{/each}}</ul>' +
                    '<div class="text-gray-light h6">更多服务：{{list[0].other_service}}</div>' +
                    '</div>' +
                    '{{else}}' +
                    '<div class="title">' +
                    '<h4>状元红火锅-东华店</h4>' +
                    '<span>人均：168.00元</span>' +
                    '</div>' +
                    '<div class="contact">' +
                    '<div class="addr"><i class="icon-wx-store icon-wx-address"></i><span>海天市成华区东华路8888号百丽美食广场8-18</span></div>' +
                    '<div class="telphone"><i class="icon-telphone"></i></div>' +
                    '</div>' +
                    '<div class="shop-hours">' +
                    '<h6>营业时间：08:00-23:00</h6>' +
                    '<ul><li><i class="icon-wx-store icon-wx-wifi"></i> WIFI</li><li><i class="icon-wx-store icon-wx-parking"></i> 停车</li><li><i class="icon-wx-store icon-wx-box"></i> 包厢</li><li><i class="icon-wx-store icon-wx-smoke"></i> 吸烟区</li><li><i class="icon-wx-store icon-wx-baby"></i> 婴儿椅</li><li><i class="icon-wx-store icon-wx-pet"></i> 宠物可带</li>' +
                    '<li><i class="icon-wx-store icon-wx-phone"></i> 移动支付</li><li><i class="icon-wx-store icon-wx-card"></i> 刷卡</li></ul>' +
                    '<div class="text-gray-light h6">更多服务：接待朋友聚会、宴会</div>' +
                    '</div>' +
                    '{{/if}}' +
                    '{{ if list.length}}<div class="more-store">查看全部{{list.length}}家门店</div>{{/if}}' +
                    '</div>',

                    '<div class="region-store-r">' +
                    '<div class="operate"><a href="#storeAll" data-toggle="modal" class="add-store">添加门店</a></div>' +
                    '<div class="r-store_list"><ul>' +
                    '{{each list value}}<li><a href="javascript:;" class="pull-right js-store-del">删除</a>{{value.name}}</li>{{/each}}' +
                    '</ul></div>' +
                    '</div>'
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
                card: [
                    '<div class="region-card">' +
                    '<dl class="pull-left line-height30">' +
                    '<dt><i class="icon-card"></i></dt>' +
                    '<dd><div class="h5">领取会员卡</div></dd> ' +
                    '</dl>' +
                    '<div class="pull-right mt5"><a href="javascript:;" class="btn btn-danger btn-sm">领取</a></div>' +
                    '</div>'
                ],
                payTheBill: [
                    '<div class="region-payTheBill">' +
                    '<dl class="pull-left">' +
                    '<dt><i class="icon-payTheBill"></i></dt>' +
                    '<dd><div class="h5">自助买单</div></dd> ' +
                    '</dl>' +
                    '<div class="pull-right"><a href="javascript:;" class="btn btn-danger btn-sm">买单</a></div>' +
                    '</div>'
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
                    '{{each list value index}}<div class="item"><div class="num">{{index+1}}、</div><div class="c-type">{{value.cType}}</div><div class="name">{{value.name}}（{{value.condition}}）</div>{{if value.sign}}<div class="label label-danger">{{value.sign}}</div>{{/if}}<div class="close close-bg js-coupon-del">×</div> </div>{{/each}}' +
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
                                    id:'17',
                                    name:'分销中心'
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

    tpl_index.prototype = {
        init: function (opts) {
            var _this = this,
                data_album = {  //相册
                    "type": 'album',
                    "style": 1, //1:小图滑动，2:大图轮播
                    "albumType": 1,
                    "storeCategoryType": 1,  //门店相册分类
                    "commonCategoryId": 1,  //通用相册分类id

                },
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
                    type: 'coupon',  //功能类型
                    "style": 1, //1:列表； 2：横板小图； 3：竖版小图
                    "list": []
                },
                data_headline = {  //标题
                    "type": 'headline',
                    "title": '',
                    "alignCenter": 1,  //1:左，2：中
                    "subtitle": '',  //副标题
                    "defaultColor": '#ffffff', //背景颜色
                    "isNavShow": false,
                    "options": [],
                    "navTitle": '', //查看更多名字
                    "linkIndex": '',  //跳转的链接
                    "inputValue": '',  //自定义链接的值
                    "url": '',  //广告自定义链接
                    "checkedId": '' //弹出框选中商品的值
                },
                data_imageText = {  //图文
                    "type": "imageText",
                    "options": [],
                    "style": 1,  //1：左图右文， 2：小图上下，3:大图上下
                    "alignCenter": 1,
                    "fontsize": 32,
                    "list": [
                        {
                            "imgSrc": '',  //图文图片
                            "title": '',  //图文标题
                            "textarea": '', //文本
                            "linkIndex": '',  //跳转的链接
                            "inputValue": '',  //自定义链接的值
                            "url": '',  //广告自定义链接
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
                data_nav = {
                    type: 'nav',
                    "cols": 3, //3: 一行3个； 4：1行4个； 5：1行5个
                    "style": 1, //1: 圆形； 2：圆角；
                    "options": [],
                    "list": [
                        {
                            "url": "",
                            "imgSrc": "",
                            "title": "",
                            "defaultColor": "#ffc42c",
                            "defaultImage": "color1.png",
                            "linkIndex": "",
                            "inputValue": "",
                            "checkedId": ""
                        }
                    ]
                },
                data_post = {  //公告
                    "type": "post",
                    "text": '',
                    "defaultColor": '#F03F2B',
                    "textColor": '#F03F2B'
                },
                data_store = {   //门店信息
                    "type": "store",
                    "isStore": false,
                    "list": []
                },
                data_richText = {
                    "type": "richText",
                    "text": "",
                    "defaultColor": '#fafafa',
                    "isFullScreen": false
                },
                data_video = {
                    "type": "video",
                    "title": "",
                    "url": ""
                };

            //初始化数据
            if (opts.data.length) {
                //初始化左侧数据
                $.each(opts.data, function (i, o) { //加载数据
                    if (o.type != 'title') {
                        _this.addTpl(o);
                    }
                });
                //初始化模块方法
                $.each(_this.module, function (name, method) { //加载模块里的功能
                    switch (name) {
                        case "title":
                            method(_this, opts.data[0]);
                            break;
                        case "album":
                            method(_this, data_album);
                            break;
                        case "banner":
                            method(_this, data_banner);
                            break;
                        case "coupon":
                            method(_this, data_coupon);
                            break;
                        case "guideLine":
                            method(_this, data_guideLine);
                            break;
                        case "guidePadding":
                            method(_this, data_guidePadding);
                            break;
                        case "headline":
                            method(_this, data_headline);
                            break;
                        case "imageText":
                            method(_this, data_imageText);
                            break;
                        case "nav":
                            method(_this, data_nav);
                            break;
                        case "post":
                            method(_this, data_post);
                            break;
                        case "richText":
                            method(_this, data_richText);
                            break;
                        case "store":
                            method(_this, data_store);
                            break;
                        case "video":
                            method(_this, data_video);
                            break;
                        case "card":
                            method(_this, {"type": "card"});
                            break;
                        case "payTheBill":
                            method(_this, {"type": "payTheBill"});
                            break;
                    }
                });
            }

            //初始化公共方法
            _this.moduleCommonFun(_this, opts);
        },
        // 模块里的公共方法
        moduleCommonFun: function (_this, opts) {
            //排序
            $(".ui-sortable").sortable({
                stop: function (event, ui) {
                    $(ui.item).trigger('click');
                }
            });

            //模块之间点击选中样式
            $(document).on("click", ".region", function () {
                var self = $(this);  //获取隐藏域
                _this.removeClass();   //去除.editing样式
                _this.setInitSelected(this, _this);  //加载模板
                _this.setColor($(this)); //颜色设置
            });

            //删除模块
            $(document).on("click", ".js-delete", function (e) {
                var $msTitle = $(".js-ms-title");

                $(this).parents(".region").remove();
                //如果模块都删除了，判断顶部标题是否存在，存在则点击点击，否则则隐藏右侧内容
                if (!$(opts.tpl_preview).html()) {
                    if ($msTitle.length) {
                        $msTitle.trigger('click');
                    } else {
                        $(opts.tpl_form).html('');
                        $(".js-ms-form").hide();
                    }
                } else {
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
                if (hiddenData.type == "banner") {
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
                if (hiddenData.list.length) {
                    $.each(hiddenData.list, function (i, o) {
                        if (o.shopId) {  //如果活动id存在就把对应的id的input设置为选中状态
                            $("input[value='" + o.shopId + "']").prop("checked", true);
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
            $(document).on('click', ".js-activityShopDel", function () {
                var $editing = $(".editing").find(".hiddenData"),
                    index = $(".js-pic-list li").index($(this).parent());
                hiddenData = JSON.parse($editing.val());

                $(this).parent().remove(); //当前对象的li去掉
                hiddenData.list.splice(index, 1); //删除数据
                _this.editTpl(hiddenData);
                $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
            });

            //重置颜色
            $(document).on('click', '.reset-color', function () {
                var $editing = $(".editing"), $msTitle = '', hiddenData = '',
                    value = $(this).prev().attr("data-value");

                if ($editing.length > 0) {
                    hiddenData = JSON.parse($editing.find(".hiddenData").val());
                    if (value == "1") {
                        hiddenData.defaultColor = $(this).attr("data-value");
                    } else if (value == "2") {
                        hiddenData.textColor = $(this).attr("data-value");
                    } else if (value == "3") {
                        hiddenData.borderColor = $(this).attr("data-value");
                    }
                    _this.editTpl(hiddenData);
                    _this.setColor();
                } else {
                    $msTitle = $(".js-ms-title");
                    hiddenData = JSON.parse($msTitle.find(".hiddenData").val());
                    $(this).prev().css('background-color', $(this).attr("data-value"));
                    hiddenData.defaultColor = $(this).attr("data-value");
                    $msTitle.find(".hiddenData").val(JSON.stringify(hiddenData));
                }
            });

            // 颜色选择
            $(document).on('click', '.js-DropdownBt', function (e) {
                util.stopPropagation(e);
                $(this).parent().addClass('open');
            });
            // 颜色选择
            $(document).on('click', '.js-dropdownList li', function (e) { //点击每个颜色操作
                var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                    index = $(".dl-horizontal").index($(this).parents(".dl-horizontal")),
                    color = '', path = '';

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
        module: {
            title: function (_this, data) {
                var $msTitle = $(".js-ms-title");

                function setTemp(data) {
                    var str_form = '', top = $msTitle.position().top; //获得相对偏移值
                    //判断旧版本完整链接
                    if (data.src && data.src.indexOf("https") < 0) {
                        data.img_url = _this.settings.upload_url + "/images/wechatapp_page_item/source/";   //加载链接选择内容
                    }
                    str_form = _this.tplFun(data, _this.settings.data_tpl[data.type]);
                    if (data.src && data.src.indexOf("https") < 0) {
                        delete data.img_url; //删除对象属性
                    }

                    _this.removeClass();
                    $msTitle.find("span").html(data.name);  //给title赋值
                    $msTitle.find(".hiddenData").val(JSON.stringify(data));
                    $(_this.settings.tpl_form).html(str_form).parent().filter(':not(:animated)').animate({"margin-top": top}); //右边
                    _this.setColor(".js-ms-title");  //设置颜色
                    $('#shareImgBtn').uploadify({
                        uploader: _this.settings.upload_url + '/upload.php',// 服务器处理地址
                        swf: '/js/lib/uploadify/uploadify.swf',
                        buttonText: "选择图片",//按钮文字
                        height: 34,  //按钮高度
                        width: 82, //按钮宽度
                        fileSizeLimit: 2048,
                        fileTypeExts: '*.jpg;*.png;*.jpeg;',//允许的文件类型
                        fileTypeDesc: "请选择图片文件", //文件说明
                        formData: {'folder': _this.settings.folder, 'thumb': _this.settings.thumb}, //提交给服务器端的参数
                        onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                            eval("var jsondata = " + data + ";");
                            var key = jsondata['key'];
                            var fileName = jsondata['fileName'];

                            var path = _this.settings.upload_url + '/images/wechatapp_page_item/source/' + fileName;
                            //获取当前对象父元素的兄弟元素并赋值
                            obj = $("#" + file.id.substr(0, file.id.length - 2));
                            $parent = obj.parent().parent();
                            $parent.find("input").val(fileName);
                            $parent.find(".img").html('<img src="' + path + '" id="shareImg" class="img-responsive w100" />');

                            // 隐藏域取值/赋值
                            var initHiddenData = JSON.parse($msTitle.find(".hiddenData").val());
                            initHiddenData.src = fileName;
                            $msTitle.find(".hiddenData").val(JSON.stringify(initHiddenData));
                            //$('#shareImg').attr('src', path);
                        }
                    });
                }

                setTemp(data);

                //点击左侧事件
                $msTitle.click(function () {
                    var hiddenData = JSON.parse($(".js-ms-title").find(".hiddenData").val());
                    $(".js-ms-form").show();
                    setTemp(hiddenData);
                });

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
            album: function (_this, data) {
                //添加相册模块
                $("#ms_album").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.albumCategory(data);
                });
                //相册样式
                $(document).on('change', 'input[name="albumStyle"]', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.style = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //相册来源
                $(document).on('change', 'input[name="albumtypeStyle"]', function (e) {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.albumType = $(this).val();
                    _this.albumCategory(hiddenData);
                });
                //选择门店相册分类
                $(document).on('change', 'input[name="storeCategory"]', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.storeCategoryType = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //选择通用相册分类
                $(document).on('change', 'input[name="commonCategory"]', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.commonCategoryId = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
            },
            banner: function (_this, data) {
                //设置高度
                setTimeout(function () {
                    _this.runSetHeight();
                }, 500);

                //添加图片广告模块
                $("#ms_banner").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                });
                //图片广告样式
                $(document).on('click', '.js-r-banner-style-ul li', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    $(this).addClass("active").siblings().removeClass('active');
                    hiddenData.style = $(this).attr('data-index');
                    _this.editTpl(hiddenData);
                    _this.runSetHeight();
                });
                //图片间隙输入框改变
                $(document).on('change', '.bars_input', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.margin = $(this).val() > 30 ? 30 : $(this).val() < 0 ? 0 : $(this).val();
                    _this.editTpl(hiddenData);
                    _this.runSetHeight();
                });
                //图片间隙
                $(document).on('mousedown', '.banner-slider-btn', function (event) {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        self = $(this);
                    ff(this, event, 0, 30, function (pos, x) {
                        hiddenData.margin = pos;
                        _this.editLeftTpl(hiddenData);
                        _this.runSetHeight();
                    });
                });
                //模块里添加广告，控制10个
                $(document).on('click', '.js-add-banner', function () {
                    var length = $(this).parent().parent().find("dl").length,
                        initHiddenData = '';

                    if (length > 19) {
                        layer.msg('最多添加20个广告')
                    } else {
                        initHiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                        initHiddenData.list.push({
                            url: '',
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
                $(document).on('click', '.js-banner-close', function () {
                    var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".dl-horizontal").index($(this).parent().parent());

                    $(this).parent().parent().remove();
                    initHiddenData.list.splice(index, 1);
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
            card: function (_this, data) {
                //添加开卡模块
                $("#ms_card").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                });
            },
            coupon: function (_this, data) {
                //添加门店模块
                $("#ms_coupon").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                });
                //优惠券样式
                $(document).on('change', 'input[name="couponStyle"]', function () {
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
                    if (hiddenData.list.length) {
                        $.each(hiddenData.list, function (i, o) {
                            $.each($("input[name='checkboxCoupon']"), function (i, o1) {
                                if (o.id == $(o1).val()) {  //如果优惠券id存在就把对应的id的input设置为选中状态
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
                            var time1 = '', time2 = '', date = '', d1 = '', d2 = '', newObj = '';
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
                $(document).on('click', ".js-coupon-del", function () {
                    var $editing = $(".editing").find(".hiddenData"),
                        index = $(".region-couponR .item").index($(this).parent());
                    hiddenData = JSON.parse($editing.val());

                    $(this).parent().remove(); //当前对象的li去掉
                    hiddenData.list.splice(index, 1); //删除数据
                    _this.editTpl(hiddenData);
                    $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
                });
            },
            guideLine: function (_this, data) {
                //添加模块
                $("#ms_guideLine").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor();  //设置颜色
                });

                //辅助线留白
                $(document).on('click', '.js-guideLine-padding', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.isPadding = $(this).prop("checked");
                    _this.editLeftTpl(hiddenData);
                });
                //辅助线样式
                $(document).on('change', 'input[name="borderstyle"]', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.borderStyle = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //辅助线边距
                $(document).on('change', 'input[name="guidLineMargin"]', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.margin = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
            },
            guidePadding: function (_this, data) {
                //添加模块
                $("#ms_guidePadding").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor();  //设置颜色
                });

                $(document).on('mousedown', '.guide-slider-btn', function (event) {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        self = $(this);
                    ff(this, event, 10, 100, function (pos, x) {
                        hiddenData.height = pos < 10 ? 10 : pos;
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

                    switch (ev.target.dataset.type) {
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
                $(document).on('change', 'input[name="alignCenterStyle"]', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.alignCenter = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //模块里添加文本导航
                $(document).on('click', '.js-add-headline', function () {
                    var $editing = $(".editing"),
                        hiddenData = JSON.parse($editing.find(".hiddenData").val());

                    hiddenData.isNavShow = true;
                    _this.editTpl(hiddenData);
                    hiddenData.options = [];
                    $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
                    _this.setColor();
                });
                //删除文本导航
                $(document).on('click', '.js-headline-close', function () {
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
                $(document).on('click', '.js-add-imageText', function () {
                    var length = $(this).parent().parent().find("dl").length,
                        initHiddenData = '';

                    initHiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                    initHiddenData.list.push({
                        "imgSrc": '',  //图文图片
                        "title": '',  //图文标题
                        "textarea": '', //文本
                        "linkIndex": '',  //跳转的链接
                        "inputValue": '',  //自定义链接的值
                        "url": '',  //广告自定义链接
                        "checkedId": '' //弹出框选中商品的值
                    });
                    _this.editTpl(initHiddenData);
                    _this.runSetHeight();
                });
                //图文样式
                $(document).on('change', 'input[name="imageTexttyle"]', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.style = $(this).val();
                    _this.editTpl(hiddenData);
                });
                //删除模块里添加图文项
                $(document).on('click', '.js-imageText-close', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(".dl-horizontal").index($(this).parent().parent());

                    $(this).parent().parent().remove();
                    hiddenData.list.splice(index, 1);
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
            nav: function (_this, data) {
                //添加图片导航模块
                $("#ms_nav").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor1(".js-dropdownList");  //设置颜色
                });
                //一排个数
                $(document).on('change', 'input[name="navCols"]', function (e) {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.cols = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //模块里添加广告，控制10个
                $(document).on('click', '.js-add-nav', function () {
                    var length = $(this).parent().parent().find("dl").length,
                        initHiddenData = '';

                    if (length > 9) {
                        layer.msg('最多添加10个图标')
                    } else {
                        initHiddenData = JSON.parse($(".editing").find(".hiddenData").val());
                        initHiddenData.list.push({
                            "url": "",
                            "imgSrc": "",
                            "title": "",
                            "defaultColor": "#ffc42c",
                            "defaultImage": "color1.png",
                            "linkIndex": "",
                            "inputValue": "",
                            "checkedId": ""
                        });
                        _this.editTpl(initHiddenData);
                    }
                });
                //图标样式
                $(document).on('change', 'input[name="navStyle"]', function (e) {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.style = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //获取上传图片的时候记录当前的索引
                $(document).on('click', 'a[href="#modalNav"]', function () {
                    picIndex = $(".ms-form .dl-horizontal").index($(this).parents(".dl-horizontal"));
                });
                $('#modalNav').on('shown.bs.modal', function () {
                    loopPicList();
                    if ($(".js-ul-switch li").eq(1).hasClass("active")) {
                        var img = $(".ui-switch1").find("img");
                        if (img.attr("data-value")) {
                            img.attr("src", _this.settings.upload_url + "/images/wechatapp_page_item/source/" + img.attr("data-value"))
                        }
                    }
                });
                //加载图片  弹出框“确定”按钮点击
                $("#btnNavSure").click(function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    //如果图标库显示的
                    if ($(".ui-switch0").is(":visible")) {
                        $(".js-pic-list li").each(function () {
                            if ($(this).hasClass("active")) {
                                hiddenData.list[picIndex].imgSrc = $(this).find("img").attr("data-value");
                            }
                        })
                    } else {
                        hiddenData.list[picIndex].imgSrc = $(".ui-switch1 img").attr("data-value");
                    }
                    $('#modalNav').modal('hide');
                    _this.editTpl(hiddenData);
                });
            },
            payTheBill: function (_this, data) {
                //添加开卡模块
                $("#ms_payTheBill").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                });
            },
            post: function (_this, data) {
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
            richText: function (_this, data) {
                var str_l = '';

                //添加富文本模块
                $("#ms_richText").click(function () {
                    //初始化数据
                    _this.addTpl(data);
                    _this.setInitSelected(".region:last"); //最后一个选中
                    _this.setColor();  //设置颜色
                });

                //是否全屏
                $(document).on('click', '.js-isFullscreen', function () {
                    var hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                    hiddenData.isFullScreen = $(this).prop("checked");
                    _this.editLeftTpl(hiddenData);
                });
            },
            store: function (_this, data) {
                //添加门店模块
                $("#ms_store").click(function () {
                    if ($(".region-store").length < 1) {
                        //初始化数据
                        _this.addTpl(data);
                        _this.setInitSelected(".region:last"); //最后一个选中
                    } else {
                        layer.msg('门店模块只能添加一个');
                    }
                });
                //门店添加
                $("#storeAll").on('show.bs.modal', function () {
                    var $editing = $(".editing").find(".hiddenData"),
                        hiddenData = JSON.parse($editing.val()),
                        $inputChecked = '',
                        $tr = '';

                    $(".storeBox").prop("checked", false);  //把所有门店input选中状态给清除
                    if (hiddenData.list.length) {
                        $.each(hiddenData.list, function (i, o) {
                            $.each($(".storeBox"), function (i, o1) {
                                if (o.storeId == $(o1).val()) {  //如果门店id存在就把对应的id的input设置为选中状态
                                    $(o1).prop("checked", true);
                                }
                            });
                        });
                    }

                    //门店添加
                    $("#btnStoreSure").click(function () {
                        $editing = $(".editing").find(".hiddenData");
                        hiddenData = JSON.parse($editing.val());
                        $inputChecked = $(".storeBox:checked");

                        //清空数组内容，然后再把选中的循环
                        hiddenData.list = [];
                        $inputChecked.each(function () {
                            $tr = $inputChecked.parents("tr");
                            if($(this).hasClass('js-single-ck')){
                                hiddenData.list.push(
                                    {
                                        "name": $(this).parent().find(".store-name").html(),
                                        "storeId": $(this).val()  //门店id
                                    }
                                );
                            }
                        });

                        _this.editTpl(hiddenData);
                        $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
                    });
                });
                //门店删除
                $(document).on('click', ".js-store-del", function () {
                    var $editing = $(".editing").find(".hiddenData"),
                        index = $(".r-store_list li").index($(this).parent());
                    hiddenData = JSON.parse($editing.val());

                    $(this).parent().remove(); //当前对象的li去掉
                    hiddenData.list.splice(index, 1); //删除数据
                    _this.editTpl(hiddenData);
                    $editing.val(JSON.stringify(hiddenData)); //把至赋值回给对象
                });
            },
            video: function (_this, data) {
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
            var str_l = '', tpl_l = '', _this = this;

            data.img_url = this.settings.upload_url + "/images/wechatapp_page_item/source/";   //加载链接选择内容
            data.color_url = this.settings.upload_url + "/images/page_set_color/source/";   //加载默认图标地址
            if (data.type == 'store' && data.list.length) {  //如果是门店，并且有值
                this.storeDataAdd(data); //第一个门店信息属性添加
            }

            //ajax 有延迟
            //setTimeout(function () {
            str_l = _this.tplFun(data, _this.settings.data_tpl[data.type][0]);
            delete data.img_url; //删除对象属性
            delete data.color_url;
            if (data.type == 'store' && data.list.length) {
                _this.storeDataDel(data); //删除第一个门店信息添加的属性
            }
            tpl_l = "<div class='region'>" +
                "<input type='hidden' class='hiddenData' value=\'" + JSON.stringify(data) + "\'>" +
                "<div class='js-control-group'>" + str_l +
                "</div><div class='actions'><div class='actions-wrap'><span class='action js-edit'>编辑</span><span class='action js-delete'>删除</span></div></div>" +
                "</div>";
            $(_this.settings.tpl_preview).append(tpl_l); //左边
            //},500);

            this.removeClass();
            $(".js-ms-form").show(); //右侧大框显示
            if (data.type == 'nav' || data.type == 'banner') {//加载上传图片
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
                        switch (data1.activity_type) {
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
        albumCategory: function (data) {  // 相册选择分类
            var v = data.albumType, storeCategoryType = data.storeCategoryType, commonCategoryId = data.commonCategoryId, _this = this;
            hiddenData = data;

            if (v == 1) {
                //门店相册
                $(".js-albumtype-category .control-input").html('<label class="mr20"><input type="radio" class="qkj-radio" name="storeCategory" value="1" checked> 环境</label><label><input type="radio" class="qkj-radio" name="storeCategory" value="2"> 其他</label>');
                $("input[name='storeCategory']").each(function (o) {
                    if ($(this).val() == storeCategoryType) {
                        $(this).prop("checked", true);
                        return false;
                    }
                });

                hiddenData.storeCategoryType = $("input[name='storeCategory']:checked").val();
                _this.editLeftTpl(hiddenData);
            } else if (v == 2) {
                //通用相册
                $.ajax({
                    type: 'get',
                    url: '/merchant/album/get-general-album.html',
                    data: '',
                    dataType: 'json',
                    success: function (data) {
                        var str = '';
                        list = data.data.list;
                        if (data.errCode == 0) {
                            //有可能会没有菜单
                            if (!Array.isArray(data.data.default_album_data)) {
                                str += '<label class="mr20"><input type="radio" class="qkj-radio" name="commonCategory" value="' + data.data.default_album_data.id + '" checked> ' + data.data.default_album_data.name + '</label>';
                            }

                            if (data.data.list.length) {
                                $.each(list, function (i) {
                                    str += '<label class="mr20"><input type="radio" class="qkj-radio" name="commonCategory" value="' + list[i].id + '"> ' + list[i].name + '</label>'
                                })
                            }
                        }
                        $('.js-albumtype-category .control-input').html(str);
                        //默认选中
                        $("input[name='commonCategory']").each(function (o) {
                            if ($(this).val() == commonCategoryId) {
                                $(this).prop("checked", true);
                                return false;
                            }
                        });

                        hiddenData.commonCategoryId = $("input[name='commonCategory']:checked").val();
                        _this.editLeftTpl(hiddenData);
                    }
                });
            }
        },
        compute: function (element) { //计算右边的高度
            var top = $(".editing").position().top; //获得相对偏移值
            $(element).parent().filter(':not(:animated)').animate({"margin-top": top});  //在新的动画开始前，先停止当前正在进行的动画
        },
        editLeftTpl: function (data) {  //编辑左侧模板
            var $hiddenId = $(".editing"),
                $controlGroup = $hiddenId.find('.js-control-group'),
                str_l = '', _this = this; //获得对应的左侧模板

            data.img_url = _this.settings.upload_url + "/images/wechatapp_page_item/source/";   //加载链接选择内容
            data.color_url = _this.settings.upload_url + "/images/page_set_color/source/";   //加载默认图标地址
            if (data.type == 'store') {
                this.storeDataAdd(data); //第一个门店信息属性添加
            }
            str_l = this.tplFun(data, _this.settings.data_tpl[data.type][0]); //获得对应的左侧模板
            $controlGroup.html(str_l).prev().val(JSON.stringify(data)); //左边

            delete data.img_url; //删除对象属性
            delete data.color_url;//删除对象属性
            if (data.type == 'store') {
                this.storeDataDel(data); //删除第一个门店信息添加的属性
            }
            $hiddenId.find(".hiddenData").val(JSON.stringify(data));
        },
        editTpl: function (data) { //编辑模板
            var str_l = '', str_form = '', $temp_l = $('.editing .js-control-group'), _this = this, $msForm = $(".js-ms-form");

            data.img_url = this.settings.upload_url + "/images/wechatapp_page_item/source/";   //加载链接选择内容
            data.color_url = this.settings.upload_url + "/images/page_set_color/source/";   //加载默认图标地址

            if (data.type == 'store' && data.list.length) {  //如果是门店，并且有值
                this.storeDataAdd(data); //第一个门店信息属性添加
            }

            str_l = _this.tplFun(data, _this.settings.data_tpl[data.type][0]); //获得对应的左侧模板
            $temp_l.html(str_l); //左边

            //判断是不是文本编辑器类型
            switch (data.type) {
                case "richText":
                    $(".js-ms-form").show();
                    this.richTextFun(data);
                    break;
                case "card":
                case "payTheBill":
                    $(".js-ms-form").hide();
                    break;
                default:
                    $(".js-ms-form").show();
                    if (!!data.options) {
                        data.options = this.settings.linkOptions();
                    }   //加载链接选择内容
                    str_form = this.tplFun(data, this.settings.data_tpl[data.type][1]);
                    $(this.settings.tpl_form).html(str_form); //右边
                    if (!!data.options) {
                        data.options = []
                    }  //清空加载链接内容
                    //颜色加载
                    if (data.type == 'search' || data.type == 'nav') {
                        this.setColor1(".js-dropdownList");
                    }
                    break;

            }
            this.compute(this.settings.tpl_form);  //计算高度
            if (data.type == 'nav' || data.type == 'banner' || data.type == 'imageText') { //加载上传图片
                this.uploadFun(data.list.length);
            }
            if (data.type == 'banner') { //热区图片上传
                $('#bannerAdd').uploadify({
                    uploader: _this.settings.upload_url + '/upload.php',// 服务器处理地址
                    swf: '/js/lib/uploadify/uploadify.swf',
                    buttonText: "选择图片",//按钮文字
                    height: 34,  //按钮高度
                    width: 82, //按钮宽度
                    fileSizeLimit: 2048,
                    fileTypeExts: '*.jpg;*.png;*.jpeg;',//允许的文件类型
                    fileTypeDesc: "请选择图片文件", //文件说明
                    formData: {'folder': _this.settings.folder, 'thumb': _this.settings.thumb}, //提交给服务器端的参数
                    onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                        eval("var jsondata = " + data + ";");
                        var key = jsondata['key'];
                        var fileName = jsondata['fileName'];

                        var path = _this.settings.upload_url + '/images/wechatapp_page_item/source/' + fileName;
                        //获取当前对象父元素的兄弟元素并赋值
                        obj = $("#" + file.id.substr(0, file.id.length - 2));
                        $parent = obj.parent().parent();
                        $parent.find("input").val(fileName);
                        $parent.find(".img").html('<img src="' + path + '" id="shareImg" class="img-responsive w100" />');

                        // 隐藏域取值/赋值
                        var initHiddenData = JSON.parse($msTitle.find(".hiddenData").val());
                        initHiddenData.src = fileName;
                        $msTitle.find(".hiddenData").val(JSON.stringify(initHiddenData));
                        //$('#shareImg').attr('src', path);
                    }
                });
            }
            delete data.img_url; //删除对象属性
            delete data.color_url;
            if (data.type == 'store' && data.list.length) {
                this.storeDataDel(data); //删除第一个门店信息添加的属性
            }
            $temp_l.prev().val(JSON.stringify(data)); //左边隐藏域赋值
        },
        storeDataAdd: function (storeData) {  //加载门店数据
            $.ajax({
                type: 'get',
                url: '/wechatapp/store-page/get-store-view.html',
                data: {'id': storeData.list[0].storeId},
                dataType: 'json',
                async: false,  //同步
                'success': function (ajaxdata) {
                    var data = ajaxdata.data;
                    storeData.list[0].full_address = data.province[data.address[0]] + data.city[data.address[1]] + data.region[data.address[2]] + data.full_address;
                    storeData.list[0].per_capita = data.per_capita;
                    storeData.list[0].service = data.service;
                    storeData.list[0].other_service = data.other_service;
                    if (data.open_time.length) {
                        var open_time = JSON.parse(data.open_time)[0];
                        console.log(open_time)
                        storeData.list[0].open_time_week = open_time.week;
                        storeData.list[0].open_time_time = open_time.time_area_start_hour + "-" + open_time.time_area_end;
                        storeData.list[0].is_all_day = open_time.is_all_day;
                    }
                }
            });
        },
        storeDataDel: function (storeData) {  //加载门店数据
            delete storeData.list[0].full_address;
            delete storeData.list[0].per_capita;
            delete storeData.list[0].service;
            delete storeData.list[0].other_service;
            delete storeData.list[0].open_time_week;
            delete storeData.list[0].open_time_time;
        },
        isToggle: function (element, attr, data) { //判断多选框
            if (element.prop("checked")) {
                data[attr] = true;
            } else {
                data[attr] = false;
            }
            this.editTpl(data)
        },
        richTextFun: function (data) { //文本编辑器内容改变
            var _this = this, str_form = '';

            //判断富文本编辑器是否为对象，是就销毁
            if (typeof _this.settings.ue == 'object') {
                UE.getEditor('container').destroy();  //销毁
            }

            //生成一个模块
            str_form = _this.tplFun(data, _this.settings.data_tpl[data.type][1]);
            $(_this.settings.tpl_form).html(str_form);
            //生成一个富文本对象
            _this.settings.ue = UE.getEditor('container', {
                initialFrameWidth: "100%",
                toolbars: [
                    ['bold', 'source', 'fontsize', 'paragraph', 'rowspacingtop', 'rowspacingbottom', 'lineheight', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', 'edittable', 'edittd', 'link', 'insertimage']
                ]
            });
            // 初始化现有存在的值
            _this.settings.ue.addListener('ready', function () {
                this.setContent(data.text);  //this是当前创建的编辑器实例
            });

            //当编辑器里的内容改变时执行方法
            _this.settings.ue.addListener("contentChange", function () {
                var $hiddenId = $(".editing"),
                    hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());

                //hiddenData.text = _this.settings.ue.getContent();
                hiddenData.text = _this.settings.ue.getContent().replace(/&quot;/g, '');
                $hiddenId.find(".hiddenData").val(JSON.stringify(hiddenData));
                _this.editLeftTpl(hiddenData);
            });
        },
        removeClass: function () { //删除样式
            $(".editing").removeClass('editing'); //清除所有选中的样式
        },
        runSetHeight: function () {  //给广告图设置最大高度的方法
            this.setInitHeight('.js-region-banner', ".slide-wrap");
        },
        setColor: function (element) {  //设置颜色值
            var self = $(element).length ? $(element) : $('.editing'),  //当前选中的对象
                hiddenData = JSON.parse(self.find(".hiddenData").val()),
                color = '';

            //背景颜色
            $(".colpick").remove();
            $('.color-set').each(function () {
                var value = $(this).attr("data-value");

                if (value == "1") {
                    color = hiddenData.defaultColor;
                } else if (value == "2") {
                    color = hiddenData.textColor;
                } else if (value == "3") {
                    color = hiddenData.borderColor;
                }

                $(this).colpick({
                    colorScheme: 'light',
                    layout: 'rgbhex',
                    color: color,
                    onSubmit: function (hsb, hex, rgb, el) {
                        var value = $(el).attr("data-value");

                        hiddenData = JSON.parse(self.find(".hiddenData").val());
                        if (value == "1") {  //背景颜色
                            hiddenData.defaultColor = '#' + hex;
                            if (hiddenData.type == 'post') {
                                self.find('.js-control-group .bg1').css('background-color', '#' + hex);
                            } else {
                                self.find('.js-control-group >div').css('background-color', '#' + hex);
                            }
                            $(el).css('background-color', '#' + hex);
                        } else if (value == "2") {  //文字颜色
                            hiddenData.textColor = '#' + hex;
                            self.find('.js-control-group >div').css('color', '#' + hex);
                            $(el).css('background-color', '#' + hex);
                        } else if (value == "3") {  //边框颜色
                            hiddenData.borderColor = '#' + hex;
                            self.find('.js-control-group .hr').css('border-top-color', '#' + hex);
                            $(el).css('background-color', '#' + hex);
                        }
                        self.find(".hiddenData").val(JSON.stringify(hiddenData));
                        $(el).colpickHide();  //隐藏
                    }
                });
            });

            //文字颜色
            $('.text-color').colpick({
                colorScheme: 'light',
                layout: 'rgbhex',
                color: hiddenData.textColor,
                onSubmit: function (hsb, hex, rgb, el) {
                    hiddenData = JSON.parse(self.find(".hiddenData").val());
                    hiddenData.textColor = '#' + hex;
                    self.find(".hiddenData").val(JSON.stringify(hiddenData));
                    self.find('.js-control-group >div').css('color', '#' + hex);
                    $(el).css('background-color', '#' + hex);
                    $(el).colpickHide();  //隐藏
                }
            });
        },
        setColor1: function (element) {  //设置颜色值
            var temp = '{{each colors color i}}<li class="bg-color{{i+1}}" data-index="{{i+1}}"><a href="javascript:;" class="js-dropdownItem" style="background-color:{{color}}">{{color}}</a></li>{{/each}}';
            var data = {
                colors: [
                    "#ffc42c", "#876cfd", "#fd7450", "#56b2f5", "#68df37", "#23dad8"
                ]
            };
            var html = this.tplFun(data, temp);

            $(element).html(html);
        },
        setInitSelected: function (element, _this) {  //模块之前切换后第一个元素选中
            if ($(element).length) {
                $(element).addClass('editing');
                var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val().replace('&quot;', '"'));
                this.editTpl(initHiddenData);
                if (_this && initHiddenData.type == 'banner') {
                    _this.runSetHeight();
                }
                if (_this && initHiddenData.type == 'discount') {
                    //编辑进来加载商品内容
                    _this.ajaxLoad({
                        'activity_type': _this.settings.activity_type, //活动类型
                        'activity_id': initHiddenData.activityId  //活动id
                    });
                }
                if (_this && initHiddenData.type == 'fightG') {
                    //编辑进来加载商品内容
                    _this.ajaxLoad({
                        'activity_type': _this.settings.fightG_type, //活动类型
                        'activity_id': initHiddenData.activityId  //活动id
                    });
                }
                if (_this && initHiddenData.type == 'album') {
                    //相册模块显示分类选项
                    _this.albumCategory(initHiddenData);
                }
            }
        },
        /*
         * 计算最大高度,并设置广告图最外框的高度
         * @param: 广告图最外框的样式
         * @param: 广告图要赋值高度的对象
         * */
        setInitHeight: function (arr, element) {
            var arrHeight = [];
            $(arr).each(function () {
                $(this).find("img").each(function () {
                    arrHeight.push($(this).height());
                });
                $(this).find(element).css("height", Math.max.apply(Math, arrHeight));
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
                $modalReserve,   //预约
                $modalWxapplet;   //小程序

            //自定义外链，显示外链输入框
            if (option.element.val() == "6") {
                option.element.next().show();
            } else {
                option.element.next().hide();
            }

            if(option.index == 1){
                hiddenData.list[index].linkIndex = option.element.val();
            }else{
                hiddenData.linkIndex = option.element.val();
            }

            //如果是7、8、9、12的话，
            switch (option.element.val()) {
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
                case "12":
                    $modalReserve = $("#modalReserve");
                    $modalReserve.modal();

                    setLinkVal($modalReserve,'ckReserve','reserve_','btnReservePage');
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

            if (option.type == 'banner') {
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
        setHotLinkSelect: function (option) {  //热点链接选择
            var hiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                index = $("#btnHotSure").attr("data-index"),
                radioChecked = '',
                _this = this,
                $modalHomePage,  //微页面
                $modalGoodsSale, //商品
                $modalGroupPage, //分组
                $modalReserve;   //预约

            //自定义外链，显示外链输入框
            if (option.element.val() == "6") {
                option.element.next().show();
            } else {
                option.element.next().hide();
            }

            hiddenData.list[index].linkIndex = option.element.val();

            //如果是7、8、9、12的话，
            switch (option.element.val()) {
                case "7":
                    $modalHomePage = $("#modalHomePage");
                    $modalHomePage.modal();

                    //如果id的值存在,则勾选弹出框的值
                    $("input[name='ckMall']").prop("checked", false);
                    if (option.id) {
                        $("#input_" + option.id).parents("tr").find("input").prop("checked", true);
                    }

                    //未点击确定的情况下关闭弹出框
                    $modalHomePage.on('hide.bs.modal', function () {
                        option.element.val("");
                    });

                    //弹出框“确定”按钮点击
                    $("#btnHomePage").click(function () {
                        radioChecked = $("input[name='ckMall']:checked");
                        //获取选择商城页面的id
                        hiddenData.list[index].checkedId = radioChecked.val();
                        option._window.editTpl(hiddenData);
                        if (option.type == 'banner') {
                            _this.runSetHeight();
                        }
                    });

                    break;
                case "8":
                    $modalGoodsSale = $("#modalGoodsSale");
                    $modalGoodsSale.modal();

                    //如果id的值存在,则勾选弹出框的值
                    $("input[name='ckShop']").prop("checked", false);
                    if (option.id) {
                        $("#shopInput_" + option.id).parents("tr").find("input").prop("checked", true);
                    }

                    //未点击确定的情况下关闭弹出框
                    $modalGoodsSale.on('hide.bs.modal', function () {
                        option.element.val("");
                    });

                    //弹出框“确定”按钮点击
                    $("#btnGoodsSale").click(function () {
                        radioChecked = $("input[name='ckShop']:checked");
                        //获取选择商城页面的id
                        hiddenData.list[index].checkedId = radioChecked.val();
                        option._window.editTpl(hiddenData);
                        if (option.type == 'banner') {
                            _this.runSetHeight();
                        }
                    });
                    break;
                case "9":
                    $modalGroupPage = $("#modalGroupPage");
                    $modalGroupPage.modal();

                    //如果id的值存在,则勾选弹出框的值
                    $("input[name='ckGroup']").prop("checked", false);
                    if (option.id) {
                        $("#group_" + option.id).parents("tr").find("input").prop("checked", true);
                    }

                    //未点击确定的情况下关闭弹出框
                    $modalGroupPage.on('hide.bs.modal', function () {
                        option.element.val("");
                    });

                    //弹出框“确定”按钮点击
                    $("#btnGroupPage").click(function () {
                        radioChecked = $("input[name='ckGroup']:checked");
                        //获取选择商城页面的id
                        hiddenData.list[index].checkedId = radioChecked.val();
                        option._window.editTpl(hiddenData);
                        if (option.type == 'banner') {
                            _this.runSetHeight();
                        }
                    });
                    break;
                case "12":
                    $modalReserve = $("#modalReserve");
                    $modalReserve.modal();

                    //如果id的值存在,则勾选弹出框的值
                    $("input[name='ckReserve']").prop("checked", false);
                    if (option.id) {
                        $("#reserve_" + option.id).parents("tr").find("input").prop("checked", true);
                    }

                    //未点击确定的情况下关闭弹出框
                    $modalReserve.on('hide.bs.modal', function () {
                        option.element.val("");
                    });

                    //弹出框“确定”按钮点击
                    $("#btnReservePage").click(function () {
                        radioChecked = $("input[name='ckReserve']:checked");
                        //获取选择商城页面的id
                        hiddenData.list[index].checkedId = radioChecked.val();
                        option._window.editTpl(hiddenData);
                        if (option.type == 'banner') {
                            _this.runSetHeight();
                        }
                    });
                    break;
                default:
                    this.editTpl(hiddenData);
            }

            if (option.type == 'banner') {
                _this.runSetHeight();
            }
        },
        tplFun: function (data, temp) { //加载模板方法
            var render = template.compile(temp),
                str = render(data);
            return str;
        },
        uploadFun: function (len) {  //上传图片
            var $editing = $(".editing"), length = '', _this = this;
            //循环加载上传软件
            setTimeout(function () {
                length = $(".ms-form .dl-horizontal").length;
                for (var i = 0, len = length; i < len; i++) {
                    $('#imgBtn_' + i).uploadify({
                        uploader: _this.settings.upload_url + '/upload.php',// 服务器处理地址
                        swf: '/js/lib/uploadify/uploadify.swf',
                        buttonText: "选择图片",//按钮文字
                        height: 34,  //按钮高度
                        width: 82, //按钮宽度
                        fileSizeLimit: 2048,
                        fileTypeExts: '*.jpg;*.png;*.jpeg;',//允许的文件类型
                        fileTypeDesc: "请选择图片文件", //文件说明
                        formData: {'folder': _this.settings.folder, 'thumb': _this.settings.thumb}, //提交给服务器端的参数
                        onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                            eval("var jsondata = " + data + ";");
                            var key = jsondata['key'], fileName = jsondata['fileName'], obj = '', path = '', hiddenData = '', index = '';

                            path = _this.settings.upload_url + '/images/wechatapp_page_item/source/' + fileName;
                            //获取当前对象父元素的兄弟元素并赋值
                            obj = $("#" + file.id.substr(0, file.id.length - 2));
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
                            }, 400)
                        }
                    });
                }
            }, 200);
        }
    };

    window.tpl_index = window.tpl_index || tpl_index;
})(window, jQuery);