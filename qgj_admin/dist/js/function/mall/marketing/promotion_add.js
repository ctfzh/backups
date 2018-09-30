/**
 * 促销添加页
 */

$(function () {
    //时间选择
    $("#time").daterangepicker({
        timePicker: false,
        singleDatePicker: false,
        format: "YYYY/MM/DD",
        minDate: moment()
    })

    //商品选择 modalGoodsSale
    var t = new shopSelect({
        btn: '#btnGoodsSale',
        checkboxName: 'ckShop',
        inputHiddenId: '#goodsSale_id',
        inputHiddenTempId: '#goodsSaleTemp_id'
    });

    //优惠门槛选择
    $(".pro-threshold").on("change", function () {
        var index = parseInt($(this).val()) - 1;
        $(this).parent().find('.div-option').hide().eq(index).show();
    });

    //促销类型
    $(".pro-type").click(function () {
        var parent = $(this).parents("dl").parent();
        if($(this).prop("checked")){
            parent.find(".pro-type").prop("checked", false);
            parent.find(".pro-type-dl dd").hide();
            $(this).prop("checked", true);
            $(this).parents("dt").next().show();
        }else{
            $(this).parents("dt").next().hide();
        }
    });

    //包邮
    $(".js-free-shipping").click(function () {
        var $next = $(this).parents("dt").next();
        if($(this).prop("checked")){
            $next.show();
        }else{
            $next.hide();
        }
    });

    //表单提交
    $("#button").click(function () {
        if(validate.form()){
            //提交操作
            $("#myform").submit();
        }
    });

    var isValidDigit = util.check.validDigit();
    var isNaturalNumber = util.check.naturalNumber();
    $.validator.addMethod("checkDiscountBit",function(value,element,params){
        var checkCode = /^([1-9])(\.\d)?$/;
        return this.optional(element)||(checkCode.test(value));
    },"请输入正确的折扣,填写1-9.9之间的数字");
    var validate = $("#myform").validate({
        debug: false, //false状态表单就能提交
        rules:{
            name:{
                required: true,
                rangelength: [1,20]
            },
            time:{
                required: true
            },
            thershold_money:{
                required: true,
                isNaturalNumber: true
            },
            thershold_count:{
                required: true,
                isValidDigit: true
            },
            and_thershold_money:{
                required: true,
                isNaturalNumber: true
            },
            and_thershold_count:{
                required: true,
                isValidDigit: true
            },
            discount_type:{
                required: true
            },
            discount_money: {
                required: true,
                isNaturalNumber: true
            },
            discount_percent: {
                required: true,
                checkDiscountBit: true
            }
        },
        messages:{
            name:{
                required: '请填写活动名称',
                rangelength: '活动名称必须在 1-20 个字内'
            },
            time:{
                required: '请填写活动时间'
            },
            thershold_money:{
                required: '请输入金额',
                isNaturalNumber: '请输入正确的金额'
            },
            thershold_count:{
                required: '请输入件数',
                isValidDigit: '请输入正确的件数'
            },
            and_thershold_money:{
                required: '请输入金额',
                isNaturalNumber: '请输入正确的金额'
            },
            and_thershold_count:{
                required: '请输入件数',
                isValidDigit: '请输入正确的件数'
            },
            discount_type: {
                required:"请选择优惠类型"
            },
            discount_money: {
                required:"请输入满减金额",
                isNaturalNumber: '请输入正确的满减金额'
            },
            discount_percent: {
                required:"请输入折扣"
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
        },
        errorClass: "text-danger"
    });
});

//包邮区域选择
!(function (window, $) {
    function editorArea(options){
        var defaults = {
            wrap: ".ae-col-level",  //最外层框
            provice: '.js-ck-province', //
            city: '.js-ck-city',
            eleArrow: '.js-icon-arrow',
            tbody: '#delivery_tbody',
            addArea: '',  //设置包邮地区按钮
            sure: '#btnDeliverySure',
            modal_delivery: '#modal_delivery', //弹出框id
            data:''
        };
        var opts = $.extend({},defaults, options);
        this.init(opts);
    }

    editorArea.prototype = {
        init:function(opts){
            var _this = this,
                data = opts.data,
                wrap = opts.wrap,
                province = opts.province,
                city = opts.city,
                eleArrow = opts.eleArrow,
                addArea = opts.addArea,
                sure = opts.sure;

            //初始化
            this.createTemp(wrap, data);

            //箭头展开/隐藏
            $(document).on('click',eleArrow,function () {
                var parentLi = $(this).parent().parent();

                if(parentLi.hasClass('active')){
                    parentLi.removeClass('active');
                }else{
                    _this.clear(wrap); //恢复初始状态
                    parentLi.addClass('active');
                }
            });

            //关闭所有弹出框
            $(document).on('click','.js-ae-close',function () {
                _this.clear(wrap); //恢复初始状态
            });

            //创建新的内容
            $(addArea).click(function () {
                $("#btnDeliverySure").attr("data-value","0");

                //重新设置多选框
                $(".js-hidden-json").each(function(i,obj){
                    _this.setCheckbox($(obj).val(),true); //多选框都禁用
                });
                _this.setDisabled(); //判断省的多选框是否需要禁用
                _this.setSelectNum(); //选中个数显示

            });

            //全选操作
            $(document).on('click', '.js-ck-province', function (){
                var thisCityCK = $(this).parents("li").find(city), //获得当前的所有市的选择框
                    selectNum = $(this).parent().find(".js-selectNum"),
                    length = '';

                if($(this).prop("checked")){
                    thisCityCK.each(function () {
                        if(!$(this).is(':disabled')){
                            $(this).prop("checked",true);
                        }
                    });
                }else{
                    thisCityCK.each(function () {
                        if(!$(this).is(':disabled')){
                            $(this).prop("checked",false);
                        }
                    });
                }

                length = $(this).parent().parent().next().find('.js-ck-city:checked').length;
                //选中个数
                if(length){
                    selectNum.html('('+length+')');
                }else{
                    selectNum.html('');
                }
            });

            //单选操作
            $(document).on('click',city,function () {
                var provinceCK = $(this).parents(".ae-col-city").prev().find(".js-ck-province"), //获得当前所在的省
                    colCity = $(this).parents(".ae-col-city"),  //获得外层对象
                    cityCK = colCity.find(".js-ck-city"),
                    cityCKChecked = colCity.find(".js-ck-city:checked"),
                    selectNum = colCity.prev().find(".js-selectNum"),
                    length = cityCKChecked.length;  //选中的个数

                if(!$(this).prop("checked")){ //不选中则全选取消
                    provinceCK.prop("checked",false);
                }
                if(cityCK.length == length){
                    provinceCK.prop("checked",true);
                }

                //选中个数
                if(length){
                    selectNum.html('('+length+')');
                }else{
                    selectNum.html('');
                }

            });

            //弹出框确定操作
            $(sure).on('click', function () {
                var jsonCode = {},  //存放code
                    codeParent = '',
                    jsonName = {}, //存放name
                    nameParent = '',
                    thisCityCK = '',
                    temp = '',
                    text = '',
                    dataValue = $(this).attr("data-value"),
                    index = '';

                $(".js-ck-province").each(function () {
                    var thisCityCK = $(this).parents("li").find(city),
                        length = '',
                        jsonCity = [],
                        jsonTextCity = [],
                        textInner = '',
                        codeParent = $(this).attr('data-value'),
                        nameParent = $(this).next().html();

                    thisCityCK.each(function () {
                        //如果是选中的，并且是非禁止的，就存入
                        if($(this).prop("checked") && !$(this).is(":disabled")){
                            jsonCity.push($(this).attr('data-value'));  //存入code
                            jsonTextCity.push($(this).next().html());    //存入name
                            length++;
                            textInner += $(this).next().html()+",";
                        }
                    });

                    if(length){
                        jsonCode[codeParent] = jsonCity;
                        jsonName[nameParent] = jsonTextCity;
                        if(length == 1){
                            text += textInner.substr(0,textInner.length-1)+"、";
                        }else{
                            text += $(this).next().html() + '<span class="text-gray-light">('+ textInner.substr(0,textInner.length-1)+ ')</span>' +"、"
                        }
                    }
                });

                if(!_this.isEmptyObject(jsonCode)){
                    if(dataValue == '0'){ //新增地区
                        index = $(".js-td-edit").length;
                        temp = "<div>" +
                            "<div class='js-td-edit'>"+ text.substr(0,text.length-1) +" <a href='#modal_delivery' data-toggle='modal' class='js-single-edit'>编辑</a>" +
                            "<input type='hidden' name='tem_arr["+ index +"][region_code]' class='js-hidden-json' value='"+ JSON.stringify(jsonCode) +"' />" +
                            "<input type='hidden' name='tem_arr["+ index +"][region_name]' value='"+ JSON.stringify(jsonName) +"' /></div>" +
                            "</div>";

                        $(opts.tbody).append(temp);
                    }else{ //编辑地区
                        index = $(this).attr("data-index");

                        $(".js-td-edit").eq(index).html(
                            text.substr(0,text.length-1) +" <a href='#modal_delivery' data-toggle='modal' class='js-single-edit'>编辑</a>" +
                            "<input type='hidden' name='tem_arr["+ index +"][region_code]' class='js-hidden-json' value='"+ JSON.stringify(jsonCode) +"' />" +
                            "<input type='hidden' name='tem_arr["+ index +"][region_name]' value='"+ JSON.stringify(jsonName) +"' />"
                        )
                    }
                    $(addArea).hide(); //隐藏设置包邮地区
                }else{
                    layer.msg('请选择区域');
                }
                $("#modal_delivery").modal('hide');
            });

            //编辑操作
            $(document).on('click','.js-single-edit',function (i){
                var index = $('.js-single-edit').index($(this)); //获取当前的索引值
                _this.clear(wrap); //恢复初始状态

                //设置属性值
                $("#btnDeliverySure").attr({
                    "data-value":"1",
                    "data-index":index
                });

                $(".ck-single").prop('checked', false).attr("disabled",false); //默认清空选中和禁用

                //设置多选框的状态
                $(".js-hidden-json").each(function(i,obj){
                    _this.setCheckbox($(obj).val(),true); //多选框都禁用
                });
                _this.setCheckbox($(this).next().val(),false); //当前的编辑内容相关的多选框都不禁用
                _this.setDisabled(); //判断省的多选框是否需要禁用
                _this.setSelectNum(); //选中个数显示
            });
        },
        setSelectNum: function () {//选中个数显示方法
            var parent = '',
                length = 0;

            $(".js-ck-province").each(function () {
                parent = $(this).parents("li");
                length = parent.find(".js-ck-city:checked").length;
                selectNum = $(this).parent().find(".js-selectNum");

                //选中个数
                if(length){
                    selectNum.html('('+length+')');
                }else{
                    selectNum.html('');
                }
            });
        },
        setCheckbox: function (v, flag) {  //设置多选框是否选中状态
            var dataEdit = v ? JSON.parse(v) : '';  //转换成对象
            if(!dataEdit){
                return false;
            }

            for(var i in dataEdit){
                for(var j=0,len=dataEdit[i].length; j < len; j++){//循环已选中的市的值
                    var city = $(".js-city"+dataEdit[i][j]),
                        parent = city.parents('.ae-col-city');

                    city.prop("checked", true); //选中
                    city.attr('disabled',true); //禁用
                    if(!flag){
                        city.attr('disabled',false);
                    }
                    if(parent.find('.js-ck-city:checked').length == parent.find('.js-ck-city').length){
                        $(".js-province"+ dataEdit[i][j].substr(0,2)+"0000").prop("checked", true);
                    }
                }
            }
        },
        setDisabled: function () {  //判断省的多选框是否需要禁用
            var parent = '';
            //市全部禁用时，省也禁用
            $(".js-ck-province").each(function () {
                if($(this).prop("checked")){
                    parent = $(this).parents("li");
                    if(parent.find(".js-ck-city:disabled").length == parent.find(".js-ck-city").length){
                        $(this).attr("disabled", true);
                    }
                }
            });
        },
        createTemp: function(element, data){ //点击展开 加载数据，再点击隐藏数据
            var temp = '';

            $.each(data,function (i, value) {
                var code1 = value[value.code],//市区
                    tempCity = '';

                //循环二级数据
                $.each(code1,function (index, obj) {
                    tempCity += '<li>' +
                        '<label><input type="checkbox" class="ck-single js-ck-city js-city'+ obj.code +'" data-value="'+ obj.code +'"> <span class="name">'+ obj.name +'</span></label>' +
                        '</li>';
                });

                temp += '<li>' +
                    '<div class="ae-col-title js-ae-col-title">' +
                    '<label><input type="checkbox" class="ck-single js-ck-province js-province'+ value.code +'" data-value="'+ value.code +'"> <span class="name">'+ value.name +'</span><span class="js-selectNum text-danger"></span></label>' +
                    ' <i class="icon-arrow-down js-icon-arrow"></i>' +
                    '</div>' +
                    '<div class="ae-col-city"><ul>' + tempCity +
                    '</ul><a href="javascript:;" class="close js-ae-close">关闭</a>' +
                    '</div>' +
                    '</li>'
            });

            $(element).html(temp);
        },
        clear: function (wrap) { //清除其他打开的框
            $(wrap).children().each(function () {
                $(this).removeClass('active');
                $(this).find(".js-icon-arrow").removeClass('icon-arrow-up');
            })
        },
        isEmptyObject: function (obj) {  //判断对象是否为空
            for(var key in obj){
                return false;
            }
            return true;
        }
    };

    window.editorArea = window.editorArea || editorArea;
})(window, jQuery);

//选择商品
!(function (window, $, undefined) {
    function couponAdd(options) {
        var defaults = {
            btn: '', //弹出框按钮点击对象
            checkboxName: '',  //多选框的name对象
            place: '', //放置数据的地方
            inputHiddenId: '', //放置选中对象的id组合,
            inputHiddenTempId: '',
            numID: '' // input输入框验证
        };

        var opts = $.extend({}, defaults, options);

        this.init(opts);
    }

    couponAdd.prototype = {
        init: function (opts) {
            var _this = this;

            //选择显示隐藏
            $("input[name='goods_type']").click(function () {
                if($(this).attr("data-index") == "0"){
                    $("a[href='#modalGoodsSale']").hide();
                }else{
                    $("a[href='#modalGoodsSale']").show();
                }
            });

            //弹出框按钮点击事件
            $(opts.btn).on('click', function () {
                var value = _this.combId(opts.checkboxName);
                var length = value ? value.split(",").length - 1 : 0;
                //选中的id组合在一起放入一个隐藏域里
                $(opts.inputHiddenId).val(value);
                $("#shopNum").html(length)
            });

            //出现弹出框时对弹出框进行初始判断勾选
            $('#modalCoupon').on('shown.bs.modal', function () {
                _this.changeCheckbox(opts.inputHiddenId, opts.checkboxName);
            });

            //点击   inputHiddenTempId: ''
            $('input[name="' + opts.checkboxName + '"]').on('click', function () {
                if($(this).prop("checked")){
                    $(opts.inputHiddenTempId).val()
                }
            });

        },
        changeCheckbox: function (inputHiddenId, checkboxName) { // 把隐藏域里有的值，显示弹出框默认勾选上
            var val = $(inputHiddenId).val();
            var checkbox = $('input[name="' + checkboxName + '"]');
            checkbox.prop("checked", false);

            if(val){
                val = val.substring(0,val.length-1).split(",");
                for(var i = 0, len=val.length; i < len; i++){
                    for(var j =0, len1 = checkbox.length; j < len1; j++){
                        if($(checkbox[j]).val() == val[i]){
                            $(checkbox[j]).prop("checked", true);
                        }
                    }
                }
            }
        },
        combId: function (name) { //组合id 然后赋值给文本编辑器
            var idArr = '';
            var checkbox = $('input[name="' + name + '"]:checked');
            $.each(checkbox, function () {
                idArr += $(this).val() + ',';
            });

            return idArr;
        }
    };
    window.couponAdd = window.couponAdd || couponAdd;
})(window, jQuery);