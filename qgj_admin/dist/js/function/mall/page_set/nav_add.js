/**
 * 导航页面自定义
 */

$(function () {
    // 滚动置顶
    util.setScrollFixed('.js-ms-prview');
});

!(function (window, $, undefined) {
    var tpl_index = function (options){
        var settings = $.extend({
            tpl_preview:'',  //左边模板位置
            tpl_form: '',    //右边模板位置
            data: null
        }, options);

        this.settings = settings; //设置为该对象的属性
        this.init(settings);  //初始化
    };

    tpl_index.prototype = {
        init: function (opts) {
            var _this = this;

            //数据初始化
            _this.initData(_this,opts.data);

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

            });
        },
        /*
        * 各个模块执行方法
        * @param: 全局对象
        * @param: 数据
        * @param: 类名字
        * */
        module: {
            navApply: function (_this,data, className) {
                var inputChildren = $("."+className).find("input"),
                    index = 0,
                    hiddenObj = $(".hidden-"+className),
                    hiddenData = '';

                inputChildren.click(function (e) {
                    index = _this.getIndex(inputChildren,$(this));
                    hiddenData = hiddenObj.val() ? JSON.parse(hiddenObj.val()) : data;

                    //赋值和存值
                    if($(this).prop("checked")){
                        hiddenData.list[index].checked = true;
                    }else{
                        hiddenData.list[index].checked = false;
                    }
                    $(".hidden-"+className).val(JSON.stringify(hiddenData));
                })
            },
            navSet: function (_this, data, className) {
                _this.colorFun(_this, data, className); //导航文字和背景颜色设置方法

                _this.navCon(_this, data, className); //导航内容设置

                _this.linkSelect(_this);  //链接初始

                _this.uploadFun(data.list.length, className); //上传图片加载

                _this.linkSelectValue(_this, data); //当linkIndex为7、8、9的时候重置链接显示值
                _this.uploadFun(data.list.length, className); //上传图片加载
                _this.setImgUrl($(".mall-set"),data.list.length,className); //给图片加完整链接
            }
        },
        //初始化数据
        initData: function(_this,data) {
            $.each(data, function (i,o) { //加载数据
                if(o.type == 'navApply'){
                    _this.tplFun("navApply",o,".navApply");
                    _this.module.navApply(_this,o,o.type);
                    $(".hidden-"+o.type).val(JSON.stringify(o));
                }else if(o.type == 'navSet'){
                    _this.tplFun("navSet", o,".js-nav-set"); //执行右侧值
                    _this.tplFun("navSetL", o,".js-nav-set-l"); //执行左侧值
                    _this.module.navSet(_this, o,o.type);
                    $(".hidden-"+o.type).val(JSON.stringify(o));
                }
            });
        },
        /*
         * 导航内容执行方法
         * @param: 全局对象
         * @param: 数据
         * @param: 类名字
         * */
        navCon: function (_this, data, className) {
            var hiddenObj = $(".hidden-"+className),
                hiddenData = '',
                index = 0;

            //标题
            $(document).on('change', '.js-nav-title', function () {
                hiddenData = hiddenObj.val() ? JSON.parse(hiddenObj.val()) : data;
                index = $(".nav-con .nav-item").index($(this).parents(".nav-item"));

                hiddenData.list[index].title = $(this).val();
                $(".hidden-"+className).val(JSON.stringify(hiddenData));

                //执行左侧值
                _this.tplFun("navSetL", hiddenData,".js-nav-set-l");
                _this.setImgUrl($(".mall-set"),data.list.length,className); //给图片加完整链接
            });

            //选择链接
            $(document).on('change', '.js-linkSelect-nav', function () {
                _this.setLinkSelect({
                    type: '',
                    element: $(this),
                    data: data,
                    className: className
                });
            });

            //自定义外链输入框变化
            $(document).on('click', '.js-banner-sure', function () {
                hiddenData = hiddenObj.val() ? JSON.parse(hiddenObj.val()) : data;
                index = $(".nav-con .nav-item").index($(this).parents(".nav-item"));

                hiddenData.list[index].url = $(this).prev().val();
                hiddenData.list[index].inputValue = $(this).prev().val();
                $(".hidden-"+className).val(JSON.stringify(hiddenData));

                //执行左侧值
                _this.tplFun("navSetL", hiddenData,".js-nav-set-l");
                _this.setImgUrl($(".mall-set"),data.list.length,className); //给图片加完整链接
            });

            //模块里添加到导航，控制5个
            $(document).on('click', '.js-nav-add',function () {
                var length = '',
                    hiddenData = '';


                hiddenData = hiddenObj.val() ? JSON.parse(hiddenObj.val()) : data;
                hiddenData.list.push({
                    "title": '名称',
                    "src": '',
                    "srcSelect": '',
                    "url": '',
                    "selected": false,
                    "isClose" : true,
                    "linkIndex": '',
                    "inputValue": '',
                    "checkedId": ''
                });

                $(".hidden-"+className).val(JSON.stringify(hiddenData));

                _this.tplFun("navSetL", hiddenData,".js-nav-set-l"); //执行左侧值
                _this.tplFun("navSet", hiddenData,".js-nav-set"); //执行右侧值

                _this.linkSelect(_this); //链接初始
                _this.uploadFun(hiddenData.list.length, className); //上传图片加载
                _this.setImgUrl($(".mall-set"),hiddenData.list.length,className); //给图片加完整链接
                template_com.methods.setColor(".js-dropdownList-title");  //设置颜色
                //$('.ui-sortable').sortable(); //重新定义一次排序，否则不能拖放了

            });

            //删除选择的链接
            $(document).on('click', '.js-del', function () {
                hiddenData = hiddenObj.val() ? JSON.parse(hiddenObj.val()) : data;
                index = $(".nav-con .nav-item").index($(this).parents(".nav-item"));

                hiddenData.list[index].linkIndex = '';
                hiddenData.list[index].checkedId = '';
                $(".hidden-"+className).val(JSON.stringify(hiddenData));

                _this.tplFun("navSet", hiddenData,".js-nav-set"); //执行右侧值
                _this.linkSelect(_this); //链接初始
                _this.uploadFun(data.list.length, className); //上传图片加载
                _this.setImgUrl($(".mall-set"),data.list.length,className); //给图片加完整链接
                template_com.methods.setColor(".js-dropdownList-title");  //设置颜色
            });

            //删除模块里导航项
            $(document).on('click', '.js-nav-item-del',function () {
                hiddenData = hiddenObj.val() ? JSON.parse(hiddenObj.val()) : data;
                index = $(".nav-con .nav-item").index($(this).parents(".nav-item"));

                $(this).parent().remove();
                hiddenData.list.splice(index,1);
                $(".hidden-"+className).val(JSON.stringify(hiddenData));

                _this.tplFun("navSetL", hiddenData,".js-nav-set-l"); //执行左侧值
                _this.tplFun("navSet", hiddenData,".js-nav-set"); //执行右侧值
                _this.linkSelect(_this); //链接初始
                _this.uploadFun(data.list.length, className); //上传图片加载
                _this.setImgUrl($(".mall-set"),data.list.length,className); //给图片加完整链接
                template_com.methods.setColor(".js-dropdownList-title");  //设置颜色
            });

            //排序
            /*$('.ui-sortable').sortable({
                update: function(event, ui){
                    //_this.initData(_this, data);
                    var originalData = hiddenObj.val() ? JSON.parse(hiddenObj.val()) : data,
                        updateData = [];

                    console.log(originalData);
                    $("."+ui.item[0].className).each(function () {
                        updateData.push(originalData.list.slice($(this).attr("data-index"),$(this).attr("data-index")+1));

                        console.log($(this).attr("data-index"))
                    })

                    //console.log(originalData);
                }
            });*/
        },
        linkSelect: function (_this) {
            //循环所有链接，然后赋值，并把索引值传参过去
            $('.js-linkSelect-nav').each(function () {
                _this.setLinks(_this, '.js-linkSelect-nav',$(this).attr("data-index"),$(this));
            });
        },
        /*
         * 颜色执行方法
         * @param: 全局对象
         * @param: 数据
         * @param: 类名字
         * */
        colorFun: function (_this, data, className) {
            var hiddenObj = $(".hidden-"+className),
                hiddenData = '',
                color = '',
                index = 0;

            // 颜色页面初始化
            template_com.methods.setColor(".js-dropdownList-title");  //设置颜色

            $(document).on('click','.js-DropdownBt-title',function (event) {
                if($(this).parent().hasClass('open')){
                    $(this).parent().removeClass('open');
                }else{
                    $(".js-colorpicker-title").removeClass('open');
                    $(this).parent().addClass('open');
                }
                util.stopPropagation(event);
            });
            $(document).on('click','.js-dropdownList-title li',function (e) { //点击每个颜色操作
                hiddenData = hiddenObj.val() ? JSON.parse(hiddenObj.val()) : data;  //获取隐藏域的值
                color = $(this).find("a").html();  //获取当前点击的颜色
                index = _this.getIndex(".nav-color .js-colorpicker-title",$(this).parents(".js-colorpicker-title"));

                //赋值和存值
                hiddenData.colors[index].color = color;
                $(".hidden-"+className).val(JSON.stringify(hiddenData));

                //删除样式并给子元素赋值颜色
                $(this).parent().parent()
                    .removeClass('open')
                    .find(".js-bt-label").css({'background-color': color}).html(color);

                //执行左侧值
                _this.tplFun("navSetL", hiddenData,".js-nav-set-l");
                _this.setImgUrl($(".mall-set"),data.list.length,className); //给图片加完整链接
            });
            $(document).click(function () { //点击颜色区域外的地方关闭颜色选择框
                $(".js-colorpicker-title").removeClass('open');
            });
        },
        // 当linkIndex为7、8、9的时候重置链接显示值, 主要是解决当编辑进来后显示的值不对
        linkSelectValue: function (_this, data) {
            var $checkedId = '';
            for(var v in data.list ){
                $checkedId = $(".span_"+ data.list[v].checkedId);
                switch (data.list[v].linkIndex){
                    case 7:
                        $checkedId.html($("#input_"+data.list[v].checkedId).html());
                        break;
                    case 8:
                        $checkedId.html($("#shopInput_"+data.list[v].checkedId).html());
                        break;
                    case 9:
                        $checkedId.html($("#group_"+data.list[v].checkedId).html());
                        break;
                }
            }
        },
        /*
        * 设置导航链接,
         * @param: 全局对象
         * @param: 类名字
         * @param: 索引值
         * @param: 当前这个select对象
        * */
        setLinks: function (_this,className,index,curSelect) {
            var linksTemp = '<option value="">设置页面链接地址</option>' +
                '{{each list as option i}}' +
                    '<option value="{{i+1}}">{{option}}</option>' +
                '{{/each}}',
                links = {
                    list: ['商城主页','会员中心','购物车','全部商品','在线客服','自定义外链','商城页面','商品','商品分组','积分商城']
                };
            _this.tplTempFun(linksTemp,className,links);
            setTimeout(function () {
                curSelect.val(index)
            });
        },
        getIndex: function (element,_this) { //获得索引值
            return $(element).index(_this);
        },
        setImgUrl: function (element,len, className) {  //给图片加完整链接
            var _this = this;

            _this.uploadFun(len,className);

            //给图片加链接, 如果已经加完整链接了就不需要再加
            $(element).find("img").each(function () {
                if($(this).attr("src") && $(this).attr("src").indexOf("http") < 0){
                    $(this).attr("src", _this.settings.uploadParam.url_img + $(this).attr("src"));
                }
            })
        },
        //图片上传插件
        uploadFun: function (len, className) {
            var length = '',
                _this = this;

            //循环加载上传软件
            setTimeout(function () {
                for(var i = 0; i<len; i++) {
                    _this.uploadify('#imgBtn_' + i + "_0",len, className,"1");
                    _this.uploadify('#imgBtn_' + i + "_1",len, className,"2");
                }
            },200);
        },
        //上传图片的方法
        uploadify: function(id,len, className, _src) {
            var _this = this;

            $(id).uploadify({
                uploader: _this.settings.uploadParam.upload_url,// 服务器处理地址
                swf: '/js/lib/uploadify/uploadify.swf',
                buttonText: "选择图片",//按钮文字
                height: 34,  //按钮高度
                width: 82, //按钮宽度
                fileSizeLimit: 2048,
                fileTypeExts: _this.settings.uploadParam.imageType,//允许的文件类型
                fileTypeDesc: "请选择图片文件", //文件说明
                formData: _this.settings.uploadParam.formData, //提交给服务器端的参数
                onUploadSuccess: function (file, data, response) {//一个文件上传成功后的响应事件处理
                    eval("var jsondata = " + data + ";");
                    var key = jsondata['key'];
                    var fileName = jsondata['fileName'];
                    var obj = '';

                    var path = _this.settings.uploadParam.url_img + fileName;
                    //获取当前对象父元素的兄弟元素并赋值
                    obj = $("#" + file.id.substr(0,file.id.length-2));
                    $parent = obj.parent().parent();
                    $parent.find("input").val(fileName);  //隐藏域的值
                    $parent.find("img").attr('src', fileName); //图片的值

                    // 隐藏域取值/赋值
                    var hiddenObj = $(".hidden-"+className),
                        hiddenData = '',
                        index = 0;

                    hiddenData = hiddenObj.val() ? JSON.parse(hiddenObj.val()) : data1;
                    index = $(".nav-con .nav-item").index(obj.parents(".nav-item"));
                    //"1"为不选中,否则选中
                    if(_src == "1"){
                        hiddenData.list[index].src = fileName
                    }else{
                        hiddenData.list[index].srcSelect = fileName
                    }
                    hiddenObj.val(JSON.stringify(hiddenData));

                    //执行左侧值
                    _this.tplFun("navSetL", hiddenData,".js-nav-set-l");
                    //执行右侧值
                    _this.tplFun("navSet", hiddenData,".js-nav-set");
                    //链接初始
                    _this.linkSelect(_this);
                    _this.setImgUrl($(".mall-set"),len,className); //给图片加完整链接
                    template_com.methods.setColor(".js-dropdownList-title");  //设置颜色 
                }
            });
        },
        //上传图片链接选择
        setLinkSelect: function (option) {
            var hiddenObj = $(".hidden-"+ option.className),
                hiddenData = hiddenObj.val() ? JSON.parse(hiddenObj.val()) : option.data,
                index = $(".nav-con .nav-item").index(option.element.parents(".nav-item")),
                radioChecked = '',
                _this = this;

            //自定义外链，显示外链输入框
            if(option.element.val() == "6"){
                option.element.next().show();
            }else{
                option.element.next().hide();
            }

            function setLS(name, id){
                radioChecked = $("input[name='" + name +"']:checked");
                hiddenData.list[index].checkedId = radioChecked.val();
                hiddenData.list[index].inputValue = radioChecked.parents("tr").find(id + radioChecked.val()).html();
                $(".hidden-"+option.className).val(JSON.stringify(hiddenData));

                _this.tplFun("navSet", hiddenData,".js-nav-set"); //执行右侧值
                _this.linkSelect(_this);
                _this.uploadFun(hiddenData.list.length, option.className); //上传图片加载
                _this.setImgUrl($(".mall-set"),hiddenData.list.length,option.className); //给图片加完整链接
                template_com.methods.setColor(".js-dropdownList-title");  //设置颜色
            }

            hiddenData.list[index].linkIndex = option.element.val();
            $(".hidden-"+option.className).val(JSON.stringify(hiddenData));

            //如果是7、8、9的话，
            switch (option.element.val()){
                case "7":
                    $("#modalHomePage").modal();
                    //未点击确定的情况下关闭弹出框
                    $("#modalHomePage").on('hide.bs.modal', function () {
                        option.element.val("");
                    });

                    //如果id的值存在,则勾选弹出框的值
                    $("input[name='ckMall']").prop("checked", false);

                    //弹出框“确定”按钮点击
                    $("#btnHomePage").click(function () {
                        setLS('ckMall', "#input_");
                    });

                    break;
                case "8":
                    $("#modalGoodsSale").modal();
                    //未点击确定的情况下关闭弹出框
                    $("#modalGoodsSale").on('hide.bs.modal', function () {
                        option.element.val("");
                    });

                    //如果id的值存在,则勾选弹出框的值
                    $("input[name='ckShop']").prop("checked", false);
                    if(option.id){
                        $("#shopInput_"+option.id).parents("tr").find("input").prop("checked", true);
                    }

                    //弹出框“确定”按钮点击
                    $("#btnGoodsSale").click(function () {
                        setLS('ckShop', "#shopInput_");
                    });

                    break;
                case "9":
                    $("#modalGroupPage").modal();
                    //未点击确定的情况下关闭弹出框
                    $("#modalGroupPage").on('hide.bs.modal', function () {
                        option.element.val("");
                    });

                    //如果id的值存在,则勾选弹出框的值
                    $("input[name='ckGroup']").prop("checked", false);
                    if(option.id){
                        $("#group_"+option.id).parents("tr").find("input").prop("checked", true);
                    }

                    //弹出框“确定”按钮点击
                    $("#btnGroupPage").click(function () {
                        setLS('ckGroup', "#group_");
                    });

                    break;
                default:
                    setLS();
            }
        },
        /*
        * 加载不是放在<script>中模板的执行方法
         * @param 模板script的id
        * @param 数据
        * @param 生成的模板要放置的位置
        * */
        tplTempFun: function (temp, container, data) {
            var html = template.render(temp,data);
            $(container).html(html);

            if($(".nav-item").length > 4){
                $(".js-nav-add").hide();
            }else{
                $(".js-nav-add").show();
            }
        },
        /*
         * 加载右侧模板方法
         * @param 模板script的id
         * @param 类型
         * @param 生成的模板要放置的位置
         * */
        tplFun: function (type, data, container) {
            var html = template(type, data);
            $(container).html(html);
        }
    };

    window.tpl_index = window.tpl_index || tpl_index;
})(window, jQuery);