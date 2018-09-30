/*
* 描述：主要存放公共实现方式
* */
$(function () {
    //模拟滚动条
    $("#siderbar, #mSiderbar").niceScroll({
        cursorcolor: "#5e5e5e",   //光标颜色
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
        touchbehavior: false,//使光标拖动滚动像在台式电脑触摸设备
        cursorwidth: "3px",  //像素光标的宽度
        cursorborder: "0",   //游标边框css定义
        cursorborderradius: "5px", //以像素为光标边界半径
        autohidemode: false //是否隐藏滚动条
    });

    // 项之前的选中切换
    util.selectActive(".jsSelLibPic", "active");

    //排序选择
    $("#jsSort .storeSort").click(function(){
        var $i = $(this).find("i"),
            className = $i.attr("class") == "icon-sortdown" ? "icon-sortup" : "icon-sortdown";
        if($(this).hasClass("active")){
            $i.attr("class",className);
        }
        $(this).addClass("active").siblings("button").removeClass("active");
    });

    /*
     * 门店选择
     * */
    //点击箭头，父级的next对象是否有隐藏显示，
    $(".rbArrow").click(function(){
        var parent = $(this).parent(),
            next = parent.siblings();
        if(parent && !parent.hasClass('treeAll')){
            if(next.is(":visible")){
                next.hide();
            }else{
                next.show();
            }
        }
    });
    //点击多选框，则父框下的所有多选框都选中或取消
    $(".parentsBox,.childBox,.parentBox").click(function(){
        if($(this).parent().hasClass('treeAll')){
            if($(this).prop("checked")){
                $(this).parent().find("input").prop("checked", true)
            }else{
                $(this).parent().find("input").prop("checked", false)
            }
        }else{
            if($(this).prop("checked")){
                $(this).parent().parent().find("input").prop("checked", true)
            }else{
                $(this).parent().parent().find("input").prop("checked", false)
            }
        }
    });

    //点击确定门店
    $("#btnStoreSure").click(function(){
        var $storeBox = $(".storeBox"),
            value = [],
            name = '',
            index = $(this).attr("data-index");
        $storeBox.each(function(){
            if($(this).prop("checked")){
                value.push($(this).val())
            }
        });

        if(index && $storeBox.eq(0).attr("type") ==  "radio"){
            name = $(".storeBox:checked").parent().find(".store-name").html(); //获取当前单选框选中的对象

            $("#inputStoreSel"+ index).val("");  //清空val值
            if(!value[0]){ //全选   //$storeBox.eq(0).prop("checked")
                $('#storeSel'+index).html('全部门店');
            }else if(value.length > 0){ //非全选
                $('#storeSel'+index).html('已选 '+ name +' 门店');
                $("#inputStoreSel"+ index).val(value);
            }else{  //没选的情况下
                $('#storeSel'+index).html('选择门店');
            }
            $('#storeAll').modal('hide');
        }else{
            $("#inputStoreSel").val(value);
            $('#storeAll').modal('hide');
            if($storeBox.length == value.length){
                $('#storeSel').html('全部门店');
            }else if(value.length > 0){
                $('#storeSel').html('已选' + value.length + '家门店');
            }else{
                $('#storeSel').html('选择门店');
            }
        }
    });

    //投放弹出框
    (function ($) {
        //公众号菜单模板
        var temp1 = '<div class="QRLaunch-copy"><div class="form">' +
            '<input type="text" class="text" value="">' +
            '<span class="input-copy js-inputCopy">复制</span>' +
            '</div>' +
            '<p class="mt15">复制以上小程序路径添加到微信公众号自定义菜单中即可</p></div>';

        //发送给微信好友或群模板
        var temp3 = '<div class="QRLaunch-wxgroup">' +
            '<p>请扫描上方的小程序码进入小程序，点击转发右上角 “更多” 按钮，在点击下方 “转发” 给好友或群即可</p>' +
            '</div>';

        //投放控件弹出框
        $(".js-launch").click(function () {
            layer.open({
                type: 1,
                title: '',
                shadeClose: true,
                area: ['424px'],
                content: $(".QRLaunch-temp").html()
            });
        });

        //菜单切换
        $(document).on("click",".js-QRLaunch-menu li",function () {
            var index = $(this).index()+1;
            $(this).addClass("active").siblings().removeClass("active");
            $(".js-QRLaunch-con").hide();
            $(".QRLaunch-con"+index).show();
        });

        //公众号菜单点击效果
        $(document).on("click",".js-QRLaunch-pulick",function () {
            layer.open({
                type: 1,
                title: '',
                shadeClose: true,
                area: ['424px'],
                content: temp1
            });
        });
        //复制链接
        $(document).on('click', '.js-inputCopy', function () {
            $(this).prev().select();
            document.execCommand("Copy"); // 执行浏览器复制命令
            layer.msg('复制成功');
        });

        //分享到朋友圈点击效果
        $(document).on("click",".js-QRLaunch-share",function () {
            layer.open({
                type: 1,
                title: '',
                shadeClose: true,
                area: ['400px'],
                content: $(".QRLaunch-temp2").html()
            });
        });

        //发送给微信好友或群点击效果
        $(document).on("click",".js-QRLaunch-wxgroup",function () {
            layer.open({
                type: 1,
                title: '',
                shadeClose: true,
                area: ['400px'],
                content: temp3
            });
        });

        //下载小程序码
        $(document).on("click",".js-QRLaunch-download",function () {
            layer.open({
                type: 1,
                title: '请选择所需尺寸下载',
                shadeClose: true,
                area: ['500px'],
                content: $(".QRLaunch-temp4").html()
            });
        });

    })(jQuery);

});

/*
* 设置默认值
* @param element: 储存值的隐藏域id
* */
function setStoreValue(element) {
    var $inputStoreSel = $(element);
    if($inputStoreSel.length>0 && $inputStoreSel.val() != ''){
        var arr = $inputStoreSel.val().split(","); //分成数组
        if(!arr[arr.length-1]){
            arr.splice(arr.length-1,1);
        }

        $("#storeSel").html('已选' + arr.length + '家门店'); //

        $(".storeBox").each(function(index,ele){
            var ele = $(ele);
            var val = $(ele).val();
            ele.prop("checked",false);
            $(arr).each(function(index1,ele1){
                if(ele1 == val){
                    ele.prop("checked",true)
                }
            })
        })
    }else{
        $(".storeBox").prop("checked",false);
    }
}

//选取优惠券,并插入到table里
(function (window, $, undefined) {
    function couponAddMethod(options) {
        var defaults = {
            btn: '', //弹出框按钮点击对象
            checkboxName: '',  //多选框的name对象
            table: '', // table放置数据的地方
            th: '', //要遍历的thead值
            inputHiddenId: '', //放置选中对象的id组合
            numID: '' // input输入框验证
        };

        var opts = $.extend({}, defaults, options);

        this.init(opts);
    }

    couponAddMethod.prototype = {
        init: function (opts) {
            var _this = this;

            //弹出框按钮点击事件
            $(opts.btn).on('click', function () {
                //选中的id组合在一起放入一个隐藏域里
                $(opts.inputHiddenId).val(_this.combId(opts.checkboxName));
                //生成一个tr，插入table里
                $(opts.table).html(_this.createTr(opts.checkboxName, opts.th));
                //var thead =;
            });

            //删除tr, 删除后隐藏域值变更
            $(document).on('click', '.jsBCDelTR', function () {
                _this.delTr(opts.inputHiddenId, $(this));
            });

            //数量不能大于限制值,库存,只能输入数字
            $(document).on('change', opts.numID, function () {
                var data = $(this).attr("data-value").split(",");

                if($(this).val() && !util.check.digit($(this).val())){
                    layer.msg('只能输入数字');
                }else{
                    if(data){
                        if($(this).val() > parseInt(data[0])){
                            layer.msg('单张券的数量不能大于领取限制');
                        }else if($(this).val() > parseInt(data[1])){
                            layer.msg('单张券的数量不能大于库存');
                        }else{
                            _this.changeTdHidden($(this).next(),$(this).val())
                        }
                    }
                }
            });

            //出现弹出框时对弹出框进行初始判断勾选   //新增
            $('#modalCoupon').on('shown.bs.modal', function () {
                _this.changeCheckbox(opts.inputHiddenId, opts.checkboxName);
            })
        },
        changeTdHidden: function (that,num) { //当数量改变后，调用该方法调整隐藏域里的num值
            var obj = $.parseJSON(that.val()); //字符串转成json 对象
            obj.num = num;
            obj = JSON.stringify(obj);
            that.val(obj);
        },
        changeCheckbox: function (inputHiddenId, checkboxName) { // 把隐藏域coupon_id里有的值，显示弹出框默认勾选上
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
        },
        createTr: function (name, th) { //返回table里的值
            var checkbox = $('input[name="' + name + '"]:checked');
            var valueObj = '',
                table = '',
                thead = '',
                tbody = '',
                tdHidden = {}; //每个tr里的对象--主要包括;
            $.each(checkbox, function () {
                valueObj = $.parseJSON($(this).next().val()); //将json字符串转换成json对象
                //console.log(valueObj)
                tdHidden.card_id = $(this).val();
                tdHidden.num = 1;
                tdHidden = JSON.stringify(tdHidden);  //将json对象转换成json字符串
                for(key in valueObj){
                    if(key == 'inputType'){
                        tbody += '<td>'+
                            '<input type="text" value="1" class="form-control jsBCInputNum" size="1" maxlength="5" data-value="' + valueObj.limit + ',' + valueObj.stock + '" />' +
                            '<input type="hidden" value=\''+ tdHidden +'\' />'+
                            '</td>';
                    }else{
                        tbody += '<td>'+ valueObj[key] + '</td>';
                    }
                }
                tbody = '<tr>'+ tbody + '<td><a href="javascript:;" class="jsBCDelTR" data-value="' + $(this).val() + '">删除</a></td></tr>';
                tdHidden = {};  //对象初始化
            });

            theadArr = th.split(",");
            for(var i=0; i<theadArr.length; i++){
                console.log(theadArr[i])
                thead += '<th>' + theadArr[i] + '</th>';
            }

            table = '<thead>'+ thead +'</thead>' + '<tbody>'+ tbody +'</tbody>';

            return table;
        },
        delTr: function (inputHiddenId, e) { //删除tr
            var id = e.attr("data-value") + ',';
            e.parents("tr").remove();
            $(inputHiddenId).val($(inputHiddenId).val().replace(id, ''))
        }
    };
    window.couponAddMethod = window.couponAddMethod || couponAddMethod;
})(window, jQuery);

//选择商品
!(function (window, $, undefined) {
    function shopSelect(options) {
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

    shopSelect.prototype = {
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

            //全选/单选
            util.ckAll('.js-single-ck','.js-all-ck');

            //出现弹出框时对弹出框进行初始判断勾选
            $('#modalGoodsSale').on('shown.bs.modal', function () {
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
    window.shopSelect = window.shopSelect || shopSelect;
})(window, jQuery);
