/**
 * 快递配送添加
 */

//表单验证
var validate = $("#form").validate({
    debug: false, //调试模式为true则只本地调试
    rules:{
        name:{
            required: true
        },
        type:{
            required: true
        }
    },
    messages:{
        name:{
            required: '请输入模板名称'
        },
        type:{
            required: '请选择计费方式'
        }
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent());
    },
    errorClass: "text-danger",
    ignore: ''
});

(function (window, $) {
    $("#button").click(function () {
        if(validate.form()){
            $("#form").submit();
            $("#button").attr('disabled', 'disabled');
        }
    });

    function editorArea(options){
        var defaults = {
            wrap: ".ae-col-level",  //最外层框
            provice: '.js-ck-province', //
            city: '.js-ck-city',
            eleArrow: '.js-icon-arrow',
            tbody: '#delivery_tbody',
            sure: '#btnDeliverySure',
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
            $("#delivery_add").click(function () {
                $("#btnDeliverySure").attr("data-value","0");

                //重新设置多选框
                $(".js-hidden-json").each(function(i,obj){
                    _this.setCheckbox($(obj).val(),true); //市多选框都禁用
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
                    provLength = 0,
                    dataValue = $(this).attr("data-value"),
                    index = '';

                $(".js-ck-province").each(function () {
                    var thisCityCK = $(this).parents("li").find(city),
                        cityLength = '',
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
                            cityLength++;
                            textInner += $(this).next().html()+",";
                        }
                    });

                    if(cityLength){
                        jsonCode[codeParent] = jsonCity;
                        jsonName[nameParent] = jsonTextCity;

                        if(cityLength == 1){
                            text += textInner.substr(0,textInner.length-1)+"、";
                        }else{
                            text += $(this).next().html() + '<span class="text-gray-light">('+ textInner.substr(0,textInner.length-1)+ ')</span>' +"、"
                        }
                    }
                    provLength = parseInt(provLength) + cityLength;
                });

                console.log($(city).length)
                console.log($(city+":checked").length)
                console.log(provLength)

                if($(city).length == provLength){
                    text = "全国"+",";
                }

                if(!_this.isEmptyObject(jsonCode)){
                    if(dataValue == '0'){ //新增地区
                        //index = $(".js-td-edit").length;
                        index = !$(".js-hidden-json:last").attr("name") ? 0 : parseInt($(".js-hidden-json:last").attr("data-value"))+1;
                        temp = "<tr>" +
                            "<td class='js-td-edit'>"+ text.substr(0,text.length-1) +" <a href='#modal_delivery' data-toggle='modal' class='js-single-edit inline-block'>编辑</a><a href='javascript:;' class='js-single-del ml10'>删除</a>" +
                            "<input type='hidden' name='tem_arr["+ index +"][region_code]' data-value='"+ index +"' class='js-hidden-json inline-block' value='"+ JSON.stringify(jsonCode) +"' />" +
                            "<input type='hidden' name='tem_arr["+ index +"][region_name]' value='"+ JSON.stringify(jsonName) +"' /></td>" +
                            "<td><input type='text' name='tem_arr["+ index +"][first_amount]' id='first_fee"+index+"' class='form-control w100 required' value='1'></td>" +
                            "<td><input type='text' name='tem_arr["+ index +"][first_fee]' class='form-control w100 required'></td>" +
                            "<td><input type='text' name='tem_arr["+ index +"][additional_amount]' class='form-control w100 required'></td>" +
                            "<td><input type='text' name='tem_arr["+ index +"][additional_fee]' class='form-control w100 required'></td>" +
                            "</tr>";

                        $(opts.tbody).append(temp);
                        addRules(index);
                    }else{ //编辑地区
                        index = $(this).attr("data-index");

                        $(".js-td-edit").eq(index).html(
                            text.substr(0,text.length-1) +" <a href='#modal_delivery' data-toggle='modal' class='js-single-edit inline-block'>编辑</a><a href='javascript:;' class='js-single-del ml10 inline-block'>删除</a>" +
                            "<input type='hidden' name='tem_arr["+ index +"][region_code]' data-value='"+ index +"' class='js-hidden-json' value='"+ JSON.stringify(jsonCode) +"' />" +
                            "<input type='hidden' name='tem_arr["+ index +"][region_name]' value='"+ JSON.stringify(jsonName) +"' />"
                        )
                    }
                }else{
                    layer.msg('请选择区域');
                }

                provLength = 0;
                $("#modal_delivery").modal('hide');
            });

            //编辑操作
            $(document).on('click','.js-single-edit',function (i){
                //var index = $('.js-single-edit').index($(this)); //获取当前的索引值
                var index = $(this).parent().find(".js-hidden-json").attr("data-value"); //获取当前的索引值
                _this.clear(wrap); //恢复初始状态


                //设置属性值
                $("#btnDeliverySure").attr({
                    "data-value":"1",
                    "data-index":index
                });

                $(".ck-single").prop('checked', false).attr("disabled",false); //默认清空选中和禁用

                //先设置多选框的状态都禁用
                $(".js-hidden-json").each(function(i,obj){
                    _this.setCheckbox($(obj).val(),true); //多选框都禁用
                });
                //当前的编辑内容相关的多选框都不禁用
                _this.setCheckbox($(this).parent().find(".js-hidden-json").val(),false);
                _this.setDisabled(); //判断省的多选框是否需要禁用
                _this.setSelectNum(); //选中个数显示
            });

            //删除操作
            $(document).on('click','.js-single-del',function (i){
                //var index = $('.js-single-del').index($(this)); //获取当前的索引值
                $(this).parent().parent().remove();
                _this.cancelCheckbox($(this).next().val()); //恢复未选中状态
            });
        },
        setSelectNum: function () {//选中个数在页面上显示出来
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
        cancelCheckbox: function (v) { //取消当前的多选框的选中状态
            var dataEdit = v ? JSON.parse(v) : '';  //转换成对象
            if(!dataEdit){
                return false;
            }

            //循环删除的项，把已选中的项都去除
            for(var i in dataEdit){
                for(var j=0,len=dataEdit[i].length; j < len; j++){//循环已选中的市的值
                    var city = $(".js-city"+dataEdit[i][j]),
                        parent = city.parents('.ae-col-city');

                    city.prop("checked", false); //取消选中
                    city.attr('disabled',false); //取消禁用

                    //如果一个都没有选中的则把省的选中改成false，并去除disabled
                    if(parent.find('.js-ck-city:checked').length < 1){
                        $(".js-province"+ dataEdit[i][j].substr(0,2)+"0000").prop("checked", false).removeAttr("disabled");
                    }
                }
            }
        },
        setCheckbox: function (v, flag) {  //设置多选框是否选中状态
            var dataEdit = v ? JSON.parse(v) : '';  //转换成对象
            if(!dataEdit){
                return false;
            };

            for(var i in dataEdit){
                for(var j=0,len=dataEdit[i].length; j < len; j++){//循环已选中的市的值
                    var city = $(".js-city"+dataEdit[i][j]),
                        parent = city.parents('.ae-col-city');

                    city.prop("checked", true); //选中
                    if(!flag){
                        city.attr('disabled',false);
                    }else{
                        city.attr('disabled',true); //禁用
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
        createTemp: function(element, data){ //点击展开 加载省市的数据，再点击隐藏数据
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


//自定义方法
jQuery.validator.addMethod("isDiagit", function(value, element) {
    var diagit = /^[1-9]\d*$/;
    return this.optional(element) || (diagit.test(value));
}, "请输入正整数");

jQuery.validator.addMethod("isMoney", function(value, element) {
    var diagit = /^[0-9]+(.[0-9]{1,2})?$/;
    return this.optional(element) || (diagit.test(value));
}, "请输入正数，精确到小数点后两位");

//动态添加表单的验证规则
function addRules(index){
    $("input[name='tem_arr["+ index +"][region_code]']").rules("add",{
        messages:{required:"请选择配送城市"}
    });
    $("input[name='tem_arr["+ index +"][first_amount]']").rules("add",{
        isDiagit: true,
        messages:{required:"请填写首件数（重）量"}
    });
    $("input[name='tem_arr["+ index +"][first_fee]']").rules("add",{
        isMoney: true,
        messages:{required:"请填写首件（重）运费"}
    });
    $("input[name='tem_arr["+ index +"][additional_amount]']").rules("add",{
        isDiagit: true,
        messages:{required:"请填写续件数（重）量"}
    });
    $("input[name='tem_arr["+ index +"][additional_fee]']").rules("add",{
        isMoney: true,
        messages:{required:"请填写续件（重）运费"}
    });
}

$("#type_count").click(function () {
    $("#first_html").html('首件（个）');
    $("#additional_html").html('续件（个）');
});

$("#type_weight").click(function () {
    $("#first_html").html('首重（KG）');
    $("#additional_html").html('续重（KG）');
});

