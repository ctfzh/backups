/**
 * 预约列表
 */


$(function () {
    //门店选址后，如果门店大于1家就显示门店，否则隐藏
    $("#btnStoreSure").click(function () {
        var len = $(".storeBox:checked").length;
        if(len > 1){
            $(".js-ms-store").show();
        }else{
            $(".js-ms-store").hide().removeClass("show");
        }

        //有选中门店就把错误提示关闭，否则开启
        if(len > 0){
            $("#inputStoreSel-error").hide();
        }else{
            $("#inputStoreSel-error").show();
        }
    });
});

//预约输入框验证
function isValidateReserve(data) {
    var flag = true;

    if(!data.head.name){
        layer.msg("请填写页面名称");
        $(".js-ms-title").click();
        flag = false;
        return false;
    }

    $.each(data.body, function (i,o) {
        if(o.hasOwnProperty("name") &&  o.name == ''){
            if(o.type=='input'){
                layer.msg("请添加输入框名称");
            }else if(o.type == 'dropdown'){
                layer.msg("请添加列表项名称");
            }else if(o.type == 'checkBox'){
                layer.msg("请添加选择项名称");
            }else if(o.type == 'time'){
                layer.msg("请添加选择框名称");
            }
            $(".region").eq(i).click();
            flag = false;
            return false;
        }
    });
    return flag;
}

/*
 * 原理：点击右侧，抓取左侧对应选中的对象的隐藏域里的值，然后把当前的至替换掉隐藏域的值，然后再生成html，嵌入到页面上
 * */
!(function (window, $, undefined) {
    var tpl_index = function (options){
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
                            '<input type="text" class="form-control js-t-title" id="t_title" name="t_title" value="{{name}}"  maxlength="10" placeholder="最多10个字">' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="control-label">分享标题</label>' +
                        '<div class="control-input">' +
                            '<input type="text" class="form-control js-shareTitle" value="{{shareTitle}}" placeholder="用户通过微信分享给朋友时显示，最多30个字" maxlength="30">' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="control-label">分享图片</label>' +
                        '<div class="control-input">' +
                            '<a href="javascript:;" id="titleImg0" class="add-img w100 bg-white"><i class="icon-plus"></i> 添加图片</a>' +
                            '<div class="img clearfix">{{if shareSrc}}<img src="{{img_url}}{{shareSrc}}" id="titleImg0" class="img-responsive w100" />{{/if}}</div>' +
                            '<input type="hidden" id="titleImgHidden0">' +
                            '<div class="text-gray-light lh-noraml">在小程序页面转发时使用，请添加宽高比为5:4的图片，不超过2M</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="control-label">背景颜色</label>' +

                        '<div class="control-input">' +
                            '<label class="w100"><input type="radio" name="coverRadio" {{if bgType=="2"}}checked{{/if}} data-index="2"> 颜色</label>' +
                            '<label class="w100"><input type="radio" name="coverRadio" {{if bgType=="1"}}checked{{/if}} data-index="1"> 图片</label>' +
                            '<div class="card-cover" id="js-card-cover-type2" {{if bgType=="1"}} style="display: none" {{/if}}>' +
                                '<input type="text" class="color-set w48 form-control form-control-inline" readonly style="background-color:{{defaultColor}}" data-value="1" /><span class="reset-color" data-value="#fafafa">重置</span></div>' +
                            '<div class="card-cover" id="js-card-cover-type1" {{if bgType=="2"}}style="display: none"{{/if}}>' +
                                '<a href="javascript:;" id="titleImg1" class="add-img w100 bg-white"><i class="icon-plus"></i> 添加图片</a>' +
                                '<div class="img">{{if bgSrc}}<img src="{{img_url}}{{bgSrc}}" id="titleImg1" class="img-responsive w100" />{{/if}}</div>' +
                                '<input type="hidden" id="titleImgHidden1">' +
                            '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
                img: [
                    '<div class="region-banner js-region-banner">' +
                        '{{if list.length}}' +
                            '<ul class="slide-wrap">' +
                            '<li><a href="javascript:;"><img src="{{if list[0]}}{{img_url}}{{list[0]}}{{else}}{{defaultImg}}{{/if}}"></a></li>' +
                            '</ul>' +
                            /*'{{if list.length > 1}}<ul class="thumbnail">{{each list value}}<li></li>{{/each}}</ul>{{/if}}' +*/
                        '{{else}}' +
                            '<ul class="slide-wrap" style="height:80px;">' +
                            '<li><a href="javascript:;"><img src="../../../img/mall/page_set/banner_default.jpg"></a></li>' +
                            '</ul>' +
                        '{{/if}}' +
                    '</div>',

                    '<div class="form-horizontal r-img-wrap">' +
                        '<h5 class="mb10 border-b pb10 text-dark">图片广告</h5>' +
                        '<ul class="image-list js-pic-list">' +
                            '{{each list value index}}' +
                                '<li data-index="{{index}}" class="sort"><img src="{{img_url}}{{value}}"><a href="javascript:;" class="close close-bg js-img-del">×</a></li>' +
                            '{{/each}}' +
                            '<li><a href="javascript:;" class="add-pic" id="imgAdd">添加图片</a><input type="hidden" id="imgHidden_2"></li>' +
                        '</ul>' +
                        '<div class="text-gray-light">最多添加5个图片，可添加格式为jpg,jpeg,png的图片。</div>' +
                    '</div>'
                ],
                checkBox: [
                    '<div class="region-checkBox"><div class="panel panel-default">' +
                    '<div class="panel-heading">{{if name}}{{name}}{{else}}选择项名称{{/if}}</div>' +
                    '<div class="panel-body">' +
                    '{{each list value index}}<label class="show mb10">' +
                    '{{if mode == "1"}}<input type="radio" class="qkj-radio" value="{{index}}">{{else}}<input type="checkbox" class="qkj-checkbox" value="{{index}}">{{/if}} {{if value}}{{value}}{{else}}选项{{index}}{{/if}}</label>' +
                    '{{/each}}' +
                    '</div> '+
                    '</div></div>',

                    '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<label class="control-label">选择项名称</label>' +
                    '<div class="control-input">' +
                    '<input type="text" class="form-control form-control-inline mr20 js-name w200" value="{{name}}" maxlength="10" placeholder="最多10个字">' +
                    '<label><input type="checkbox" class="qkj-checkbox js-required" {{if isRequired=="1"}}checked{{/if}}> 必填</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">选择模式</label>' +
                    '<div class="control-input">' +
                    '<label class="w80"><input type="radio" name="checkBoxName" class="qkj-radio" value="1" {{if mode=="1"}}checked{{/if}}> 单选</label>' +
                    '<label class="w80"><input type="radio" name="checkBoxName" class="qkj-radio" value="2" {{if mode=="2"}}checked{{/if}}> 多选</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">列表选项</label>' +
                    '<div class="control-input">' +
                    '{{each list value index}}<div class="mb10"><input type="text" class="form-control form-control-inline mr20 js-select-option w200" data-index="{{index}}" value="{{value}}" placeholder="请输入内容"> {{if index>0}}<a href="javascript:;" class="text-primary js-select-option-del">删除</a>{{/if}}</div>{{/each}}' +
                    '<a href="javascript:;" class="btn btn-outlined js-select-option-add">添加选项</a>'+
                    '</div>' +
                    '</div>' +
                    '</div>'
                ],
                dropdown: [
                    '<div class="region-dropdown tpl-arrow-right"><input type="text" class="form-control" value="{{name}}" placeholder="列表项名称"><i class="icon-arrow-right"></i></div>',

                    '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<label class="control-label">列表项名称</label>' +
                    '<div class="control-input">' +
                    '<input type="text" class="form-control form-control-inline mr20 js-name w200" value="{{name}}" maxlength="10" placeholder="最多10个字">' +
                    '<label><input type="checkbox" class="qkj-checkbox js-required" {{if isRequired=="1"}}checked{{/if}}> 必填</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="control-label">列表选项</label>' +
                    '<div class="control-input">' +
                    '{{each list value index}}<div class="mb10"><input type="text" class="form-control form-control-inline mr20 js-dropdown-select-option w200" data-index="{{index}}" value="{{value}}" placeholder="请输入内容"> {{if index>0}}<a href="javascript:;" class="text-primary js-dropdown-select-option-del">删除</a>{{/if}}</div>{{/each}}' +
                    '<a href="javascript:;" class="btn btn-outlined js-dropdown-select-option-add">添加选项</a>'+
                    '</div>' +
                    '</div>' +
                    '</div>'
                ],
                input: [
                    '<div class="region-input"><input type="text" class="form-control" value="{{name}}" placeholder="输入框名称"></div>',

                    '<div class="form-horizontal">' +
                        '<div class="form-group">' +
                            '<label class="control-label">输入框名称</label>' +
                            '<div class="control-input">' +
                                '<input type="text" class="form-control form-control-inline mr20 js-name" value="{{name}}" maxlength="10" placeholder="最多10个字">' +
                                '<label><input type="checkbox" class="qkj-checkbox js-required" {{if isRequired=="1"}}checked{{/if}}> 必填</label>' +
                            '</div>' +
                        '</div>' +

                        '<div class="form-group mb0">' +
                            '<label class="control-label">输入框类型</label>' +
                            '<div class="control-input">' +
                                '<label class="mr10"><input type="radio" class="qkj-radio" name="inputName" value="1" {{if option=="1"}}checked{{/if}}> 姓名</label>' +
                                '<label class="mr10"><input type="radio" class="qkj-radio" name="inputName" value="2" {{if option=="2"}}checked{{/if}}> 手机</label>' +
                                '<label class="mr10"><input type="radio" class="qkj-radio" name="inputName" value="3" {{if option=="3"}}checked{{/if}}> 数字</label>' +
                                '<label class="mr10"><input type="radio" class="qkj-radio" name="inputName" value="4" {{if option=="4"}}checked{{/if}}> 邮箱</label>' +
                                '<label><input type="radio" class="qkj-radio" name="inputName" value="5" {{if option=="5"}}checked{{/if}}> 文本</label>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                ],
                time: [
                    '<div class="region-time tpl-arrow-right"><input type="text" class="form-control" value="{{name}}" placeholder="选择框名称"><i class="icon-arrow-right"></i></div>',

                    '<div class="form-horizontal">' +
                        '<h5 class="mb10 border-b pb10 pl-10 text-dark">时间选择框</h5>' +
                        '<div class="form-group mb0">' +
                            '<label class="control-label">选择框名称</label>' +
                            '<div class="control-input">' +
                            '<input type="text" class="form-control form-control-inline mr20 js-name w200" value="{{name}}" maxlength="10" placeholder="最多10个字">' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                ]
            }
        }, options);

        this.settings = settings; //设置为该对象的属性
        this.init(settings);  //初始化
    };

    tpl_index.prototype = {
        init: function (opts) {
            var _this = this,
                data_img = { //广告初始数据
                    "id":"1",
                    "type": "img",
                    "list": []
                },
                data_checkBox = {
                    "id":"1",//对应关系id，以此类推
                    "type":"checkBox",
                    "name":"",
                    "isRequired":"",
                    "mode":"1",//1：radio, 2：check_box
                    "list":['','','']
                },
                data_dropdown = {
                    "id":"1",//对应关系id，以此类推
                    "type":"dropdown",
                    "name":"",
                    "isRequired":"",
                    "list":['','','']  //默认三个
                },
                data_input = {
                    "id":"1",//对应关系id，以此类推
                    "type":"input",//input,check_box,dropdown,time
                    "name":"",
                    "isRequired":"2",//1是2否
                    "option":"1"//1姓名，2手机，3数组，4邮箱，5文本
                },
                data_time = {
                    "id":"1",//对应关系id，以此类推
                    "type":"time",
                    "name":"",
                    "isRequired":"1"
                };

            //初始化数据
            if(opts.data.body.length){
                $.each(opts.data.body, function (i,o) { //加载数据
                    _this.addTpl(o);
                });
            }
            if(!$.isEmptyObject(opts.data)){
                //初始化模块方法
                $.each(_this.module, function (name, method) { //加载模块里的功能
                    switch (name){
                        case "title":
                            method(_this,opts.data.head);
                            break;
                        case "img":
                            method(_this,data_img);
                            break;
                        case "button":
                            method(_this,opts.data.button);
                            break;
                        case "checkBox":
                            method(_this,data_checkBox);
                            break;
                        case "dropdown":
                            method(_this,data_dropdown);
                            break;
                        case "input":
                            method(_this,data_input);
                            break;
                        case "time":
                            method(_this,data_time);
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
                _this.runSetHeight();
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

            //标题添加
            $(document).on('keyup', '.js-name', function () {
                $hiddenId = $(".editing");
                hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                hiddenData.name = $(this).val();
                _this.editLeftTpl(hiddenData);
            });

            //下拉列表项
            $(document).on('keyup', '.js-select-option', function () {
                var hiddenData, $hiddenId,index;

                index = $(this).attr("data-index");
                $hiddenId = $(".editing");
                hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                hiddenData.list[index] = $(this).val();
                _this.editLeftTpl(hiddenData);
            });
            //删除列表项
            $(document).on('click', '.js-select-option-del', function () {
                var hiddenData, $hiddenId,index;

                index = $(this).prev().attr("data-index");
                $hiddenId = $(".editing");
                hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                hiddenData.list.splice(index,1);
                $(this).parent().remove();
                _this.editLeftTpl(hiddenData);
            });
            //添加列表项
            $(document).on('click', '.js-select-option-add', function () {
                var hiddenData, $hiddenId;

                $hiddenId = $(".editing");
                hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                if(hiddenData.list.length < 8){
                    hiddenData.list.push('');
                }else{
                    layer.msg("列表项最多只能添加8个!")
                }
                _this.editTpl(hiddenData);
            });

            //必填项操作
            $(document).on('change', '.js-required', function () {
                var hiddenData, $hiddenId;

                $hiddenId = $(".editing");
                hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                hiddenData.isRequired = $(this).prop("checked")?"1":"2";
                _this.editLeftTpl(hiddenData);
            });
        },
        module:{
            title: function (_this,data) {
                var $msTitle = $(".js-ms-title"),
                    hiddenData = "";

                function setTemp(data){
                    var str_form = '',top = $msTitle.position().top; //获得相对偏移值
                    //判断旧版本完整链接
                    if((data.shareSrc && data.shareSrc.indexOf("https") < 0) || (data.bgSrc && data.bgSrc.indexOf("https") < 0)){
                        data.img_url = _this.settings.upload_url + "/images/" + _this.settings.folder + "/source/";   //加载链接选择内容
                    }
                    str_form = _this.tplFun(data, _this.settings.data_tpl[data.type]);
                    if((data.shareSrc && data.shareSrc.indexOf("https") < 0) || (data.bgSrc && data.bgSrc.indexOf("https") < 0)){
                        delete data.img_url; //删除对象属性
                    }

                    _this.removeClass();
                    $msTitle.find("span").html(data.name);  //给title赋值
                    $msTitle.find(".hiddenData").val(JSON.stringify(data));
                    $(_this.settings.tpl_form).html(str_form).parent().filter(':not(:animated)').animate({"margin-top": top}); //右边
                    _this.setColor(".js-ms-title");  //设置颜色
                    $(".add-img").each(function (i) {
                        $("#titleImg"+i).uploadify({
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
                                var key = jsondata['key'];
                                var fileName = jsondata['fileName'];

                                var path = _this.settings.upload_url + '/images/'+ _this.settings.folder +'/source/' + fileName;
                                //获取当前对象父元素的兄弟元素并赋值
                                obj = $("#" + file.id.substr(0,file.id.length-2));
                                $parent = obj.parent().parent();
                                $parent.find("input").val(fileName);
                                $parent.find(".img").html('<img src="'+path+'" id="titleImg'+ i +'" class="img-responsive w100" />');

                                // 隐藏域取值/赋值
                                var initHiddenData = JSON.parse($msTitle.find(".hiddenData").val());
                                if(i == 0){
                                    initHiddenData.shareSrc = fileName ;
                                }else{
                                    initHiddenData.bgSrc = fileName ;
                                }
                                $msTitle.find(".hiddenData").val(JSON.stringify(initHiddenData));
                            }
                        });
                    });
                }
                setTemp(data);

                //点击左侧事件
                $msTitle.click(function () {
                    var hiddenData = JSON.parse($(".js-ms-title").find(".hiddenData").val());
                    $(".js-ms-form").show();
                    setTemp(hiddenData);
                });

                // 颜色/图片切换
                $(document).on('click', "input[name='coverRadio']", function (e) {
                    var hiddenData = JSON.parse($msTitle.find(".hiddenData").val()),
                        index = parseInt($(this).attr('data-index'));

                    $(".card-cover").hide();
                    $("#js-card-cover-type" + index).show();
                    hiddenData.bgType = e.target.dataset.index;
                    $msTitle.find(".hiddenData").val(JSON.stringify(hiddenData));
                });

                //页面名称
                $(document).on('change', '.js-t-title', function () {
                    var hiddenData = JSON.parse($msTitle.find(".hiddenData").val());

                    $msTitle.find('span').html($(this).val());
                    hiddenData.name = $(this).val();
                    $msTitle.find(".hiddenData").val(JSON.stringify(hiddenData));
                    $(this).next().hide(); //隐藏错误提示
                });
                //分享标题
                $(document).on('change', '.js-shareTitle', function () {
                    var hiddenData = JSON.parse($msTitle.find(".hiddenData").val());

                    hiddenData.shareTitle = $(this).val();
                    $msTitle.find(".hiddenData").val(JSON.stringify(hiddenData));
                });
            },
            img: function (_this,data) {
                //设置高度
                setTimeout(function(){
                    _this.runSetHeight();
                }, 500);

                //添加图片广告模块
                $("#ms_img").click(function () {
                    var length = $(".region").length;  //获取模块个数
                    if(length < 20){
                        _this.computeID();  //更新最大值id
                        data.id = ++_this.settings.id;
                        //初始化数据
                        _this.addTpl(data);
                        _this.setInitSelected(".region:last"); //最后一个选中
                    }else{
                        layer.msg("最多能添加20个模块")
                    }
                });
                //模块里添加广告，控制5个
                $(document).on('click', '#imgAdd',function () {
                    var length = $(this).parents("ul").find("li").length;

                    if(length > 4){
                        layer.msg('最多添加5个广告')
                    }
                });
                //删除模块里添加广告项
                $(document).on('click', '.js-img-del',function () {
                    var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val()),
                        index = $(this).parent().attr("data-index");

                    $(this).parent().remove();
                    initHiddenData.list.splice(index,1);
                    _this.editTpl(initHiddenData);
                    _this.runSetHeight();
                });
            },
            button: function (_this,data) {
                var $msButton = $(".js-ms-button"), html='',top=0;

                $msButton.find("a").html(data.name);  //给按钮名字赋值
                $msButton.find(".hiddenData").val(JSON.stringify(data));

                //点击左侧事件
                $msButton.click(function () {
                    var hiddenData = JSON.parse($msButton.find(".hiddenData").val());
                    html = '';
                    top = $(this).position().top; //获得相对偏移值

                    $(".js-ms-form").show();
                    _this.removeClass();
                    $(this).find("a").html(hiddenData.name);  //给按钮名字赋值
                    html = template('tplButton',hiddenData);
                    $(_this.settings.tpl_form).html(html).parent().filter(':not(:animated)').animate({"margin-top": top}); //右边清除原来动画，再加top
                });

                //按钮名称
                $(document).on('change', '.js-button-name', function () {
                    hiddenData = JSON.parse($msButton.find(".hiddenData").val());
                    hiddenData.name = $(this).val();
                    setTimeout(function () {
                        tplButton(hiddenData);
                    },50)
                });
                //按钮名称
                $(document).on('change', '.js-button-successTip', function () {
                    hiddenData = JSON.parse($msButton.find(".hiddenData").val());
                    hiddenData.successView = $(this).val();
                    setTimeout(function () {
                        tplButton(hiddenData);
                    },50)
                });

                //重新编译模板
                function tplButton(data) {
                    $msButton.find(".hiddenData").val(JSON.stringify(hiddenData));
                    $msButton.find("a").html(data.name);  //给按钮名字赋值
                    html = template('tplButton',hiddenData);
                    $(_this.settings.tpl_form).html(html);
                }

            },
            input: function (_this,data) {
                var hiddenData, $hiddenId,length;

                //添加模块
                $("#ms_input").click(function () {
                    length = $(".region").length;  //获取模块个数
                    if(length < 20) {
                        _this.computeID();  //更新最大值id
                        data.id = ++_this.settings.id;
                        //初始化数据
                        _this.addTpl(data);
                        _this.setInitSelected(".region:last"); //最后一个选中
                    }else{
                        layer.msg("最多能添加20个模块")
                    }
                });

                //输入框标题
                $(document).on('change', '.js-input-required', function () {
                    $hiddenId = $(".editing");
                    hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                    hiddenData.isRequired = $(this).prop("checked")?"1":"2";
                    _this.editLeftTpl(hiddenData);
                });
                //输入框类型选择
                $(document).on("change", "input[name='inputName']", function (e) {
                    $hiddenId = $(".editing");
                    hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                    hiddenData.option = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
            },
            dropdown: function (_this,data) {
                //添加模块
                $("#ms_dropdown").click(function () {
                    var length = $(".region").length;  //获取模块个数
                    if(length < 20) {
                        _this.computeID();  //更新最大值id
                        data.id = ++_this.settings.id;

                        //初始化数据
                        //data.id = ++_this.settings.id;
                        _this.addTpl(data);
                        _this.setInitSelected(".region:last"); //最后一个选中
                    }else{
                        layer.msg("最多能添加20个模块")
                    }
                });

                //下拉列表项
                $(document).on('keyup', '.js-dropdown-select-option', function () {
                    var hiddenData, $hiddenId,index;

                    index = $(this).attr("data-index");
                    $hiddenId = $(".editing");
                    hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                    hiddenData.list[index] = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
                //删除列表项
                $(document).on('click', '.js-dropdown-select-option-del', function () {
                    var hiddenData, $hiddenId,index;

                    index = $(this).prev().attr("data-index");
                    $hiddenId = $(".editing");
                    hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                    hiddenData.list.splice(index,1);
                    $(this).parent().remove();
                    _this.editLeftTpl(hiddenData);
                });
                //添加列表项
                $(document).on('click', '.js-dropdown-select-option-add', function () {
                    var hiddenData, $hiddenId;

                    $hiddenId = $(".editing");
                    hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                    if(hiddenData.list.length < 20){
                        hiddenData.list.push('');
                    }else{
                        layer.msg("列表项最多只能添加20个!")
                    }
                    _this.editTpl(hiddenData);
                });
            },
            checkBox: function (_this,data) {
                var hiddenData, $hiddenId,index;

                //添加模块
                $("#ms_checkBox").click(function () {
                    var length = $(".region").length;  //获取模块个数
                    if(length < 20) {
                        _this.computeID();  //更新最大值id
                        data.id = ++_this.settings.id;

                        //初始化数据
                        //data.id = ++_this.settings.id;
                        _this.addTpl(data);
                        _this.setInitSelected(".region:last"); //最后一个选中
                    }else{
                        layer.msg("最多能添加20个模块")
                    }
                });


                //输入框类型选择
                $(document).on("change", "input[name='checkBoxName']", function (e) {
                    $hiddenId = $(".editing");
                    hiddenData = JSON.parse($hiddenId.find(".hiddenData").val());
                    hiddenData.mode = $(this).val();
                    _this.editLeftTpl(hiddenData);
                });
            },
            time: function (_this,data) {
                //添加模块
                $("#ms_time").click(function () {
                    var length = $(".region").length;  //获取模块个数
                    if(length < 20) {
                        _this.computeID();  //更新最大值id
                        data.id = ++_this.settings.id;

                        _this.addTpl(data);
                        _this.setInitSelected(".region:last"); //最后一个选中
                    }else{
                        layer.msg("最多能添加20个模块")
                    }
                });
            }
        },
        addTpl: function (data) { //添加左侧模板
            var str_l = '', tpl_l ='',_this = this;

            data.img_url = _this.settings.upload_url + "/images/" + _this.settings.folder + "/source/";   //加载链接选择内容
            data.color_url = this.settings.upload_url + "/images/page_set_color/source/";   //加载默认图标地址

            str_l = _this.tplFun(data, _this.settings.data_tpl[data.type][0]);
            delete data.img_url; //删除对象属性
            delete data.color_url;
            tpl_l = "<div class='region'>" +
                "<input type='hidden' class='hiddenData' value=\'"+ JSON.stringify(data) +"\'>" +
                "<div class='js-control-group'>" + str_l +
                "</div><div class='actions'><div class='actions-wrap'><a href='javascript:;' class='close close-bg js-delete'>×</a></div></div>" +
                "</div>";
            $(_this.settings.tpl_preview).append(tpl_l); //左边

            this.removeClass();
            $(".js-ms-form").show(); //右侧大框显示
        },
        compute: function (element) { //计算右边的高度
            var top = $(".editing").position().top; //获得相对偏移值
            $(element).parent().filter(':not(:animated)').animate({"margin-top": top});  //在新的动画开始前，先停止当前正在进行的动画
        },
        computeID: function () { //计算右边的高度
            var arr_ID = [], id, val;

            //循环所有隐藏域，然后取值，有id的就存入数组
            $(".hiddenData").each(function () {
                val = $(this).val();
                if(val){
                    id = parseInt(JSON.parse(val).id);
                    if(id){
                        arr_ID.push(id);
                    }
                }
            });
            this.settings.id = arr_ID.length ? Math.max.apply(null, arr_ID) : "0";  //获取最大值,如果一开始数组为空，则赋予一个默认值

        },
        editLeftTpl: function (data) {  //编辑左侧模板
            var $hiddenId = $(".editing"),
                $controlGroup = $hiddenId.find('.js-control-group'),
                str_l = '', _this = this; //获得对应的左侧模板

            data.img_url = _this.settings.upload_url + "/images/" + _this.settings.folder + "/source/";   //加载链接选择内容
            data.color_url = _this.settings.upload_url + "/images/page_set_color/source/";   //加载默认图标地址
            str_l = this.tplFun(data, _this.settings.data_tpl[data.type][0]); //获得对应的左侧模板
            $controlGroup.html(str_l).prev().val(JSON.stringify(data)); //左边

            delete data.img_url; //删除对象属性
            delete data.color_url;//删除对象属性
            $hiddenId.find(".hiddenData").val(JSON.stringify(data));
        },
        editTpl: function (data) { //编辑模板
            var str_l = '',str_form = '', $temp_l = $('.editing .js-control-group'), _this = this, $msForm = $(".js-ms-form");

            data.img_url = _this.settings.upload_url + "/images/" + _this.settings.folder + "/source/";   //加载链接选择内容
            data.color_url = this.settings.upload_url + "/images/page_set_color/source/";   //加载默认图标地址

            str_l = _this.tplFun(data, _this.settings.data_tpl[data.type][0]); //获得对应的左侧模板
            $temp_l.html(str_l); //左边

            //判断是不是文本编辑器类型
            $(".js-ms-form").show();
            if(!!data.options){data.options = this.settings.linkOptions;}   //加载链接选择内容
            str_form = this.tplFun(data, this.settings.data_tpl[data.type][1]);
            $(this.settings.tpl_form).html(str_form); //右边
            if(!!data.options){data.options = []}  //清空加载链接内容

            this.compute(this.settings.tpl_form);  //计算高度
            if(data.type == 'img'){ //加载图片广告
                if(data.list.length < 5){   //图片超过5个就不加载图片上传插件
                    $('#imgAdd').uploadify({
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

                            path = _this.settings.upload_url + '/images/'+ _this.settings.folder +'/source/' + fileName;
                            //获取当前对象父元素的兄弟元素并赋值
                            obj = $("#" + file.id.substr(0,file.id.length-2));
                            $parent = obj.parent().parent();
                            $parent.find("input").val(fileName);

                            // 隐藏域取值/赋值
                            hiddenData = JSON.parse($(".editing").find(".hiddenData").val());

                            hiddenData.list.push(fileName);
                            $(".editing").find(".hiddenData").val(JSON.stringify(hiddenData));
                            _this.editTpl(hiddenData);

                            setTimeout(function () {
                                _this.runSetHeight();
                            },400)
                        }
                    });
                }

                //排序
                $(".js-pic-list").sortable({
                    items: ".sort",
                    stop: function( event, ui ) {
                        var img = $(ui.item).parent().find("img"), li_arr = [];
                        img.each(function (i) {
                            li_arr.push($(this).attr("src").split("source/")[1]);  //截取源文件
                            $(this).parent().attr("data-index",i);  //重新定义索引值
                        });
                        data.list = li_arr;
                        _this.editLeftTpl(data);  //重新给左边的赋值
                        _this.runSetHeight(); //重新计算广告的高度
                    }
                });
            }
            delete data.img_url; //删除对象属性
            delete data.color_url;
            $temp_l.prev().val(JSON.stringify(data)); //左边隐藏域赋值
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
        setInitSelected: function (element,_this) {  //模块之前切换后第一个元素选中
            if($(element).length){
                $(element).addClass('editing');
                var initHiddenData = JSON.parse($(".editing").find(".hiddenData").val().replace('&quot;','"'));
                this.editTpl(initHiddenData);
            }
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
                _this = this;

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
                            _this.runSetHeight();
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
                            _this.runSetHeight();
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
                            _this.runSetHeight();
                        }
                    });
                    break;
                default:
                    this.editTpl(hiddenData);
            }

            if(option.type == 'banner'){
                _this.runSetHeight();
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

                            path = _this.settings.upload_url + '/images/'+ _this.settings.folder +'/source/' + fileName;
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

    window.tpl_index = window.tpl_index || tpl_index;
})(window, jQuery);