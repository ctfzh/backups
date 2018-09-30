/**
 * 兑换页面自定义
 */

(function (window, $, undefined) {
    var tpl_index = function (options){
        var settings = $.extend({
            tpl_preview:'',  //左边模板位置
            tpl_form: '',    //右边模板位置
            data: null,      //左边数据
            data_tpl: {
                title:
                [' ',
                '<div class="bg-white p10 js-region-r mb15">' +
                    '<div class="form-group">' +
                        '<label class="control-label">页面名称 <em class="text-danger">*</em></label>' +
                        '<div class="control-input">' +
                            '<input type="text" class="form-control js-t-title" id="t_title" name="t_title" value="{{name}}" >'+
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
                            '<a href="javascript:;" id="imgBtnTitle" class="add-img w100 bg-white"><i class="icon-plus"></i> 添加图片</a>' +
                            '<img src="{{src}}" id="imgTitle" class="img-responsive w100" />' +
                            '<input type="hidden" id="imgHiddenTitle">' +
                        '</div>' +
                    '</div>'+
                '</div>'],
                banner: [
                    '<ul class="slide-wrap">' +
                        '<li><a href="javascript:;"><img src="{{src}}" class="img-responsive"></a></li>' +
                    '</ul>',
                    '<div class="form-group bg-white p10 js-region-r">' +
                        '<label class="control-label t15">首图</label>' +
                        '<div class="control-input">' +
                            '<dl class="dl-horizontal">' +
                                '<dt>' +
                                    '<div id="imgBtnBanner"></div>' +
                                    '<img src="{{src}}" id="imgBanner" class="img-responsive" />' +
                                    '<input type="hidden" id="imgHiddenBanner" value="{{src}}" class="js-upload-img">' +
                                '</dt>' +
                                '<dd>' +
                                    '<div class="form-group">' +
                                        '<label class="control-label">链接</label>' +
                                        '<div class="control-input">' +
                                            '{{if couponType}}' +
                                            '<span class="couponName">{{couponType}}</span> | ' +
                                            '<span class="name mr5">{{name}}</span>' +
                                            '<a href="javascript:;" class="js-modify-act inline-block">修改</a>' +
                                            '<input type="hidden" class="js-modify-act-input" value="{{couponType}}">'+
                                            '{{else}}' +
                                            '<a href="javascript:;" class="js-modify-act inline-block">添加链接</a>' +
                                            '<input type="hidden" class="js-modify-act-input" value="{{couponType}}">'+
                                            '{{/if}}' +
                                        '</div>' +
                                    '</div>' +
                                '</dd>' +
                            '</dl>' +
                        '</div>' +
                    '</div>'
                ],
                activeGroup: [
                    '<div class="ms-goods-list listStyle-1 bg">' +
                        '<div class="title pl-10 pr-10 js-banner-title">{{if title}}{{title}}{{else}}文本标签{{/if}}</div>' +
                        '<ul>' +
                            '{{ each list as value}}' +
                            '<li>' +
                                '<a href="javascript:;">' +
                                    '<div class="pic placeholder_auto"><img src="{{ value.src }}" alt=""></div>' +
                                    '<div class="info">' +
                                    '{{if value.title }}<div class="title">{{ value.title }}</div>{{else}}<div class="title">文本标签</div>{{/if}}' +
                                    '</div>' +
                                '</a>' +
                            '</li>' +
                        '{{ /each }}' +
                        '</ul>' +
                    '</div>',
                    '<div class="form-group bg-white p10 js-region-r">' +
                        '<label class="control-label t15">活动分组</label>' +
                        '<div class="control-input">' +
                            '<div class="form-group">' +
                                '<label class="control-label">标题名称</label>' +
                                '<div class="control-input">' +
                                    '<input type="text" class="form-control js-actG-title" value="{{title}}">' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label class="control-label">兑换活动</label>' +
                                '<div class="control-input">' +
                                    '{{each list as value index}}' +
                                    '<dl class="dl-horizontal">' +
                                        '<dt>' +
                                            '<a id="imgBtn_{{actG_index}}_{{index}}" class="uploadify"></a>' +
                                            '<img src="{{value.src}}" class="img-responsive"/>' +
                                            '<input type="hidden" id="imgHidden_{{actG_index}}_{{index}}" value="{{value.src}}" class="js-upload-img" />' +
                                        '</dt>' +
                                        '<dd>' +
                                            '<div class="form-group">' +
                                                '<label class="control-label">标题</label>' +
                                                '<div class="control-input">' +
                                                    '<input type="text" class="form-control js-act-title" data-index="{{index}}" value="{{value.title}}">' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="form-group">' +
                                                '<label class="control-label">链接</label>' +
                                                '<div class="control-input">' +
                                                    '{{if value.couponType}}' +
                                                    '<span class="couponName">{{value.couponType}}</span> | ' +
                                                    '<span class="name mr5">{{value.name}}</span>' +
                                                    '<a href="javascript:;" class="js-modify-act inline-block" data-index="{{index}}">修改活动</a>' +
                                                    '<input type="hidden" class="js-modify-act-input" value="{{value.couponType}}">'+
                                                    '{{else}}'+
                                                    '<a href="javascript:;" class="js-modify-act inline-block" data-index="{{index}}">添加活动</a>' +
                                                    '<input type="hidden" class="js-modify-act-input">'+
                                                    '{{/if}}' +
                                                '</div>' +
                                            '</div>' +
                                            '<a href="javascript:;" class="close close-bg js-act-close" data-index="{{index}}">×</a>' +
                                        '</dd>' +
                                    '</dl>' +
                                    '{{/each}}' +
                                    '<a href="javascript:;" class="add-banner js-add-act bg-gray-lighter"><i class="icon-plus"></i> 添加活动</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<a href="javascript:;" class="close close-bg js-actG-close">×</a>' +
                    '</div>'
                ]
            },
            url_img: '',
        }, options);

        this.settings = settings; //设置为该对象的属性
        this.init(settings);  //初始化
    };

    tpl_index.prototype = {
        init: function (opts) {
            var _this = this,
                //商品初始数据
                data_activeGroup = {
                    "type": "activeGroup",
                    "title": "",  //标题名称
                    "actG_index": "0",
                    "list": []
                },
                //首图初始数据
                data_banner = {
                    "type": "banner",
                    "src":"",
                    "url":"",
                    "couponType":"",
                    "name": ""
                };

            //判断数据第一项如果没有TITLE的话就插入到数组第一个里面
            if(opts.data[0].type != 'title'){
                opts.data.unshift({
                    type:'title',
                    name: '',  //店铺名字
                    description: '', //页面描述
                    src: '' //商品样式
                });
            }

            if(opts.data.length){
                //初始化左侧数据
                $.each(opts.data, function (i,o) { //加载数据
                    if(o.type == 'title'){
                        _this.addRightTpl(o,true,i);
                    }else{
                        _this.addLeftTpl(o,true,i);
                        _this.addRightTpl(o,true,i);
                    }
                });

                //初始化模块方法
                $.each(_this.module, function (name, method) { //加载模块里的功能
                    switch (name) {
                        case "title":
                            method(_this,opts.data[0]);
                            break;
                        case "banner":
                            method(_this, data_banner);
                            break;
                        case "goods":
                            method(_this, data_activeGroup);
                            break;
                    }
                });
            }

            //弹出框确定按钮
            $("#btnActiveSure").click(function () {
                var radioObj =  $('input[name="radioCoupon"]:checked'),   //弹出框里的值
                    radioHidden = '',  //弹出框里的值
                    index = $(this).attr("data-index"),   //获取索引值
                    hiddenObj = $(".region").eq(index-1).find(".hiddenData"),  //左侧隐藏域的对象
                    hiddenData = JSON.parse(hiddenObj.val()), //左侧隐藏域的值
                    modifyActCur = $(".js-modify-act-cur"),  //获得当前添加活动按钮
                    modifyActCurIndex = modifyActCur.attr("data-index");  //添加活动按钮的索引

                modifyActCur.next().val("1"); //给当前添加活动按钮的隐藏域赋值

                //如果弹出框的值存在就取值
                if(radioObj.next().val()){
                    radioHidden = JSON.parse(radioObj.next().val())
                }

                //当添加活动按钮的索引不存在，就说明不是活动分组
                if(!modifyActCurIndex){
                    hiddenData.couponType = radioHidden.type;
                    hiddenData.name = radioHidden.name;
                    hiddenData.activity_id = radioHidden.activity_id;
                }else{
                    hiddenData.list[modifyActCurIndex].couponType = radioHidden.type;
                    hiddenData.list[modifyActCurIndex].name = radioHidden.name;
                    hiddenData.list[modifyActCurIndex].activity_id = radioHidden.activity_id;
                }
                hiddenObj.val(JSON.stringify(hiddenData));  //赋值给左边的隐藏域里
                _this.addRightTpl(hiddenData,false,index);  //右侧重新生成模板


                //加载首图的上传方法
                if(hiddenData.type == "banner"){
                    $('#imgBtnBanner').uploadify({
                        uploader: _this.settings.upload_url + '/upload.php',// 服务器处理地址
                        swf: '/js/lib/uploadify/uploadify.swf',
                        buttonText: "选择图片",//按钮文字
                        height: 34,  //按钮高度
                        width: 82, //按钮宽度
                        fileSizeLimit: 2048,
                        fileTypeExts: '*.jpg;*.png;*.jpeg;',//允许的文件类型
                        fileTypeDesc: "请选择图片文件", //文件说明
                        formData: { 'folder' : 'page_set'}, //提交给服务器端的参数
                        onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                            eval("var jsondata = " + data + ";");
                            var key = jsondata['key'];
                            var fileName = jsondata['fileName'];

                            var path = _this.settings.url_img + fileName;
                            //获取当前对象父元素的兄弟元素并赋值
                            obj = $("#" + file.id.substr(0,file.id.length-2));
                            $parent = obj.parent().parent();
                            $parent.find("input").val(fileName);  //隐藏域的值
                            $parent.find("img").attr('src', path); //图片的值

                            // 隐藏域取值/赋值
                            var actG_index = _this.getIndex(".js-region-r", obj.parents(".js-region-r"))-1,
                                hiddenObj = $(".region").eq(actG_index).find(".hiddenData"),  //左侧隐藏域的对象
                                hiddenData = JSON.parse(hiddenObj.val());//左侧隐藏域的值  //获取当前左侧的隐藏域值
                            hiddenData.src = fileName;

                            _this.addLeftTpl(hiddenData, false, actG_index);
                            _this.setImgUrl($(".mall-set")); //给图片加完整链接
                            $(".region").eq(actG_index).find(".hiddenData").val(JSON.stringify(hiddenData));  //给当前左侧的隐藏域赋值
                        }
                    });
                }

            });
        },
        module:{
            title: function (_this,data) {
                var $msTitle = $(".js-ms-title");

                function setTemp(data){
                    $msTitle.find(".hiddenData").val(JSON.stringify(data));
                    //加载首图的上传方法
                    $('#imgBtnTitle').uploadify({
                        uploader: _this.settings.upload_url + '/upload.php',// 服务器处理地址
                        swf: '/js/lib/uploadify/uploadify.swf',
                        buttonText: "选择图片",//按钮文字
                        height: 34,  //按钮高度
                        width: 82, //按钮宽度
                        fileSizeLimit: 2048,
                        fileTypeExts: '*.jpg;*.png;*.jpeg;',//允许的文件类型
                        fileTypeDesc: "请选择图片文件", //文件说明
                        formData: { 'folder' : 'page_set'}, //提交给服务器端的参数
                        onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                            eval("var jsondata = " + data + ";");
                            var key = jsondata['key'];
                            var fileName = jsondata['fileName'];

                            var path = _this.settings.url_img + fileName;
                            //获取当前对象父元素的兄弟元素并赋值
                            obj = $("#" + file.id.substr(0,file.id.length-2));
                            $parent = obj.parent().parent();
                            $parent.find("input").val(fileName);  //隐藏域的值
                            $parent.find("img").attr('src', path); //图片的值

                            var path = _this.settings.upload_url + '/images/page_set/source/' + fileName;
                            $('#imgHiddenTitle').val(fileName);

                            // 隐藏域取值/赋值
                            var initHiddenData = JSON.parse($msTitle.find(".hiddenData").val());
                            initHiddenData.src = fileName ;
                            $msTitle.find(".hiddenData").val(JSON.stringify(initHiddenData));
                            $('#imgTitle').attr('src', path);

                            _this.setImgUrl($(".mall-set")); //给图片加完整链接
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
            goods: function (_this,data) {
                //添加活动组
                $(document).on('click', '.js-add-activeG', function () {
                    //获取当前右侧的活动数减1
                    data.actG_index = parseInt($(".js-region-r").length) - 2;  //减去前两个元素
                    _this.addLeftTpl(data, true);
                    _this.addRightTpl(data,true);
                });

                //删除活动组
                $(document).on('click', '.js-actG-close', function () {
                    var actG_index = _this.getIndex(".js-region-r", $(this).parents(".js-region-r"))-1;
                    $(".region").eq(actG_index).remove();
                    $(this).parents(".js-region-r").remove();
                });

                //添加活动
                $(document).on('click', '.js-add-act', function () {
                    var index = _this.getIndex(".js-region-r", $(this).parents(".js-region-r")),
                        hiddenObj = $(".region").eq(index-1).find(".hiddenData"),  //左侧隐藏域的对象
                        hiddenData = JSON.parse(hiddenObj.val());//左侧隐藏域的值

                    hiddenData.list.push({
                        src:'qrcode_default.jpg',
                        title: '',
                        url:'',
                        activity_id: '',
                        couponType: '',
                        name: ''
                    });
                    _this.addLeftTpl(hiddenData, false, index-1);
                    _this.addRightTpl(hiddenData, false, index);
                });

                //删除活动
                $(document).on('click', '.js-act-close', function () {
                    var actG_index = _this.getIndex(".js-region-r", $(this).parents(".js-region-r")),
                        act_index = $(this).attr("data-index"),
                        hiddenObj = $(".region").eq(actG_index-1).find(".hiddenData"),  //左侧隐藏域的对象
                        hiddenData = JSON.parse(hiddenObj.val());//左侧隐藏域的值

                    hiddenData.list.splice(act_index,1);
                    _this.addLeftTpl(hiddenData, false, actG_index-1);
                    _this.addRightTpl(hiddenData, false, actG_index);
                });

                //活动组标题添加
                $(document).on('change', '.js-actG-title', function () {
                    var index = _this.getIndex(".js-region-r", $(this).parents(".js-region-r")),
                        hiddenObj = $(".region").eq(index-1).find(".hiddenData"),  //左侧隐藏域的对象
                        hiddenData = JSON.parse(hiddenObj.val()); //左侧隐藏域的值

                    hiddenData.title = $(this).val();
                    hiddenObj.val(JSON.stringify(hiddenData));  //赋值给左边的隐藏域里
                    _this.addLeftTpl(hiddenData,false,index-1);
                    _this.setImgUrl($(this).parents(".dl-horizontal")); //给右侧对应的图片加完整链接
                    _this.setImgUrl($(".region").eq(index-1)); //给左侧对应的图片加完整链接
                });

                //活动组下的某个活动标题添加
                $(document).on('change', '.js-act-title', function () {
                    var actG_index = _this.getIndex(".js-region-r", $(this).parents(".js-region-r")),
                        act_index = $(this).attr("data-index"),
                        hiddenObj = $(".region").eq(actG_index-1).find(".hiddenData"),  //左侧隐藏域的对象
                        hiddenData = JSON.parse(hiddenObj.val());//左侧隐藏域的值

                    hiddenData.list[act_index].title = $(this).val();
                    hiddenObj.val(JSON.stringify(hiddenData));  //赋值给左边的隐藏域里
                    _this.addLeftTpl(hiddenData,false,actG_index-1);
                    _this.setImgUrl($(this).parents(".dl-horizontal")); //给右侧对应的图片加完整链接
                    _this.setImgUrl($(".region").eq(actG_index-1)); //给左侧对应的图片加完整链接
                });

                //修改链接
                _this.openModal();
            },
            banner: function (_this,data) {
                //加载首图的上传方法
                $('#imgBtnBanner').uploadify({
                    uploader: _this.settings.upload_url + '/upload.php',// 服务器处理地址
                    swf: '/js/lib/uploadify/uploadify.swf',
                    buttonText: "选择图片",//按钮文字
                    height: 34,  //按钮高度
                    width: 82, //按钮宽度
                    fileSizeLimit: 2048,
                    fileTypeExts: '*.jpg;*.png;*.jpeg;',//允许的文件类型
                    fileTypeDesc: "请选择图片文件", //文件说明
                    formData: { 'folder' : 'page_set'}, //提交给服务器端的参数
                    onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                        eval("var jsondata = " + data + ";");
                        var key = jsondata['key'];
                        var fileName = jsondata['fileName'];

                        var path = _this.settings.url_img + fileName;
                        //获取当前对象父元素的兄弟元素并赋值
                        obj = $("#" + file.id.substr(0,file.id.length-2));
                        $parent = obj.parent().parent();
                        $parent.find("input").val(fileName);  //隐藏域的值
                        $parent.find("img").attr('src', path); //图片的值

                        // 隐藏域取值/赋值
                        var actG_index = _this.getIndex(".js-region-r", obj.parents(".js-region-r"))-1,
                            hiddenObj = $(".region").eq(actG_index).find(".hiddenData"),  //左侧隐藏域的对象
                            hiddenData = JSON.parse(hiddenObj.val());//左侧隐藏域的值  //获取当前左侧的隐藏域值
                        hiddenData.src = fileName;

                        _this.addLeftTpl(hiddenData, false, actG_index);
                        _this.setImgUrl($(".mall-set")); //给图片加完整链接
                        $(".region").eq(actG_index).find(".hiddenData").val(JSON.stringify(hiddenData));  //给当前左侧的隐藏域赋值
                    }
                });

                //修改链接
                _this.openModal();
            }
        },
        addLeftTpl: function (data, flag, index) { //添加左侧模板
            var str_l = this.tplFun(data, this.settings.data_tpl[data.type][0]),
                tpl_l = "<div class='region'>" +
                    "<input type='hidden' class='hiddenData' value=\'"+ JSON.stringify(data) +"\'>" +
                    "<div class='js-control-group'>" + str_l +
                    "</div>",
                $region = $(".region"),
                $regionActive = $region.eq(index);
            if(flag){
                $(this.settings.tpl_preview).append(tpl_l); //左边
            }else{
                if($regionActive){
                    $region.eq(index).before(tpl_l);
                }
                $region.eq(index).remove();
            }
        },
        addRightTpl: function (data, flag,index) { //添加右侧模板
            var str_r = this.tplFun(data, this.settings.data_tpl[data.type][1]),
                $regionR = $(".js-region-r"),
                $regionActive = $regionR.eq(index),
                _this = this;

            //如果是true就新插入，否则就替换对应位置的对象
            if(flag){
                $(this.settings.tpl_form).append(str_r); //右边
            }else{
                if($regionActive){
                    $regionR.eq(index).before(str_r);
                }
                $regionR.eq(index).remove();
            }
            if(data.type == 'activeGroup'){//加载上传图片
                this.uploadFun(data.list.length, index-1)
            }

            setTimeout(function () {
                _this.setImgUrl($(".mall-set")); //给图片加完整链接
            },300)
        },
        getIndex: function (element,_this) { //获得索引值
            return $(element).index(_this);
        },
        openModal: function () {  //活动弹出框，并给弹出框按钮的索引
            $(document).on('click', '.js-modify-act', function () {
                var index = $(".js-region-r").index($(this).parents(".js-region-r"));  //获取索引值
                //清除所有之前已经添加的样式，然后把当前元素添加上去
                $(".js-modify-act").removeClass("js-modify-act-cur");
                $(this).addClass("js-modify-act-cur");
                $("#modalActive").modal();  //弹出弹出框
                $("#btnActiveSure").attr("data-index", index);  //给弹出框按钮赋索引值
            });
        },
        setImgUrl: function (element) {  //给图片加完整链接
            var _this = this;
            //给图片加链接, 如果已经加完整链接了就不需要再加
            $(element).find("img").each(function () {
                if($(this).attr("src") && $(this).attr("src").indexOf("http") < 0){
                    $(this).attr("src", _this.settings.url_img + $(this).attr("src"));
                }
            })
        },
        uploadFun: function (len, index) { //图片上传插件
            var length = '',
                _this = this;
            //循环加载上传软件
            setTimeout(function () {
                length = $(".ms-form .dl-horizontal").length;
                for(var i = 0,len=length; i<len; i++) {
                    $('#imgBtn_'+ (parseInt(index)-1) + '_' + i).uploadify({
                        uploader: _this.settings.upload_url + '/upload.php',// 服务器处理地址
                        swf: '/js/lib/uploadify/uploadify.swf',
                        buttonText: "选择图片",//按钮文字
                        height: 34,  //按钮高度
                        width: 82, //按钮宽度
                        fileSizeLimit: 2048,
                        fileTypeExts: '*.jpg;*.png;*.jpeg;',//允许的文件类型
                        fileTypeDesc: "请选择图片文件", //文件说明
                        formData: { 'folder' : 'page_set'}, //提交给服务器端的参数
                        onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理\
                            eval("var jsondata = " + data + ";");
                            var key = jsondata['key'];
                            var fileName = jsondata['fileName'];
                            var obj = '';

                            var path = _this.settings.url_img + fileName;
                            //获取当前对象父元素的兄弟元素并赋值
                            obj = $("#" + file.id.substr(0,file.id.length-2));
                            $parent = obj.parent().parent();
                            $parent.find("input").val(fileName);  //隐藏域的值
                            $parent.find("img").attr('src', path); //图片的值

                            // 隐藏域取值/赋值
                            var actG_index = _this.getIndex(".js-region-r", obj.parents(".js-region-r"))-1,
                                hiddenObj = $(".region").eq(actG_index).find(".hiddenData"),  //左侧隐藏域的对象
                                hiddenData = JSON.parse(hiddenObj.val());//左侧隐藏域的值  //获取当前左侧的隐藏域值

                            act_index = obj.parent().attr("id").split("_")[2];
                            hiddenData.list[act_index].src = fileName;

                            _this.addLeftTpl(hiddenData, false, actG_index);
                            _this.setImgUrl($(".mall-set")); //给图片加完整链接
                            $(".region").eq(actG_index).find(".hiddenData").val(JSON.stringify(hiddenData));  //给当前左侧的隐藏域赋值
                        }
                    });
                }
            },200);
        },
        tplFun: function (data,temp) { //加载模板方法
            var render = template.compile(temp),
                str = render(data);
            return str;
        }
    };

    window.tpl_index = window.tpl_index || tpl_index;
})(window, jQuery);