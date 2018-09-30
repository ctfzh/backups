/*
 *  优惠券模块
 * */

//固定时间
$("#cStaticTimeInput").daterangepicker({
    timePicker: false,
    singleDatePicker: false,
    format: "YYYY/MM/DD",
    autoUpdateInput:true,
    opens: 'left',
    minDate: moment()
});
$("#cStaticTimeInput").on('apply.daterangepicker',function(ev, picker){
    $("#jsHiddenBegintime").val(picker.startDate.format('YYYY/MM/DD 00:00:00'));
    $("#jsHiddenEndtime").val(picker.endDate.format('YYYY/MM/DD 23:59:59'));
});


$(function () {
    //7日
    $("#sevenMoment").click(function () {
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(6));
    });
    //15日
    $("#halfMonthMoment").click(function () {
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(14));
    });
    //30日
    $("#thirtyMoment").click(function () {
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(29));
    });

    //备注修改
    $(".remark-group").each(function () {
        util.remarkClick($(this),'库存');
    });

    // 滚动置顶
    util.setScrollFixed('.jsMenuList', 'menuListFixed', 0.02);

    /*
     * 添加优惠券
     * */
    // 颜色选择
    $("input[name='coverRadio']").click(function () {
        var index = parseInt($(this).attr('data-index')) + 1;
        $(".card-cover").hide();
        $("#js-card-cover-type" + index).show();
    });
    $(".js-DropdownBt").click(function (e) {
        util.stopPropagation(e);
        $(this).parent().addClass('open');
    });
    $(".js-dropdownList li").click(function (e) {
        $(this).parent().parent().removeClass('open');
        var color = $(this).find("a").attr('data-value');
        $(".js-bt-label").css({'background-color': color});
        $(".jsMenuList").css({'background-color': color}).find('.btn').css({
            'background-color': color,
            'border-color': color
        });
    });
    $(document).click(function () {
        $("#js-colorpicker").removeClass('open');
    });

    //商户名称
    $("#inputCardName").on('keyup keydown', function () {
        $(".logo-area .text").html($(this).val());
    });
    //主标题
    $("#couponTitleInput").on('keyup keydown', function () {
        $("#couponTiltleText").html($(this).val()).show();
        util.textLimit($(this));
    });
    //副标题
    $("#couponSubtitleInput").on('keyup keydown', function () {
        $("#couponSubtiltleText").html($(this).val()).show();
        util.textLimit($(this));
    });
    //封面介绍
    $("#abstract").on('keyup keydown', function () {
        $(".jsCoverPreview .title").html($(this).val());
        util.textLimit($(this));
    });
    //投放优惠券选择
    $("input[name='radioThrow']").on('change', function () {
        //console.log($(this).index())
    });

    $("#btnSure").click(function () {
        if($("input[name='radioThrow']:checked").val()== 1){
            location.href = '../../channel/menu.html?id=1';
        }
    });
    /*
    * 设置优惠券时间
    * @获取日期方法  getDate()
    * @获取周期方法  getWeek()
    * @获取时间点方法  getTime()
    * */
    (function () {
        // function getDate(index){
        //     var dateV = '';
        //     var index = index || $("input[name='couponvalidtime']:checked").attr("data-index");
        //     if(index == 0){
        //         if($("#cStaticTimeInput").val()){
        //             dateV = ($("#jsHiddenBegintime").val() + "-" + $("#jsHiddenEndtime").val())
        //         }else{
        //             dateV = moment().startOf('day').format('YYYY/MM/DD') + "-" + moment().startOf('day').format('YYYY/MM/DD');
        //         }
        //     }else{
        //         var fromDay = $(".couponvalidtimeSel").eq(0).val();
        //         var fixedDay = $(".couponvalidtimeSel").eq(1).val();
        //         dateV = moment().add('days',fromDay).format('YYYY/MM/DD');
        //         var d2 = new Date(fromDay);
        //     }
        //     return dateV;
        // }
        // function getWeek(){
        //
        // }
        // function getTime(){
        //
        // }

        //有效期选择
        $("input[name='time_type']").change(function () {
            if ($(this).attr('data-index') == "1") {
                $("#cStaticTimeInput").attr('disabled', 'disabled');
                $(".couponvalidtimeSel").removeAttr('disabled');
            } else {
                $(".couponvalidtimeSel").attr('disabled', 'disabled');
                $("#cStaticTimeInput").removeAttr('disabled');
            }
        });
    })();

    //可用时段
    (function () {
        var $addTimePeriod = $(".js-add-time-period"); //添加时间操作对象
        var $delTimePeriod = $(".js-del-time-period"); //删除时间操作对象
        var $jsTimeLabel = $(".jsTimeLabel");

        // 可用时段切换
        util.radioToggle('time_limit_type','.js-times');

        //时间添加
        $(document).on("click", ".js-add-time-period", function () {
            var $timeRange = $(this).prev().prev();

            var temp = '<span class="mr10">' +
                '<input type="text" class="form-control w100 inline-block">' +
                ' 至 ' +
                '<input type="text" class="form-control w100 inline-block">' +
                '</span>';

            if (!$timeRange.children().length) {
                $jsTimeLabel.show();
                $delTimePeriod.show();
            } else if ($timeRange.children().length == 1) {
                $addTimePeriod.hide();
                $timeRange.append(temp);
            } else {
                $timeRange.append(temp);
            }
        });
        $(document).on("click", ".js-del-time-period", function () {
            var children = $(this).prev().children();

            $addTimePeriod.show();
            if (children.length) {
                children.eq(children.length - 1).remove();
            }
            if (children.length == 1) {
                $delTimePeriod.hide();
                $jsTimeLabel.hide();
            }
        });
    })();

    // 商户介绍(选填)
    (function () {
        var $jsCardMInfo = $("#jsCardMInfo");

        $jsCardMInfo.click(function () {
            if ($(this).attr("data-index") == "0") {
                $(this).attr("data-index", "1").html("展开");
                $(this).parent().parent().children(".form-group").hide();
            } else {
                $(this).attr('data-index', "0").html("收缩");
                $(this).parent().parent().children(".form-group").show();
            }
        });
    })();

    //图文介绍
    (function () {
        // 文字限制
        $(".jsCdATextarea").on('keyup keydown', function () {
            util.textLimit($(this))
        });

        //添加
        $(".card-article-add").click(function () {
            initAddPic(0);
            $(".js-card-article-editor").show();
        });

        //取消
        $(".jsCdATCancel").click(function () {
            initAddPic(1);
            $(".js-card-article-editor").hide();
        });

        //图片编辑
        $(document).on("click", "#jsCardArticleEdit", function () {
            initAddPic(0, $(".jsCardArticlePicImg").attr("src"));
            $(".js-card-article-editor").show();
        });

        // 添加图文信息清空
        function initAddPic(num, src) {
            var src = src || '';
            var $cardArticleAdd = $(".card-article-add");
            var $cdArticleImg = $(".card-article-img");
            if (num == 0) {
                $cardArticleAdd.addClass('editting').css("cursor", "default");
            } else {
                $cardArticleAdd.removeClass('editting').css("cursor", "pointer");
            }
            $cdArticleImg.removeClass("cd-article-has-img").find("img").attr("src", src);
            if (src) {
                $cdArticleImg.addClass("cd-article-has-img");
            }
        }
    })();

    // //入口操作
    (function () {
        var $jsEditUrlLeft = $("#jsEditUrlLeft"); //左侧插入对象
        var $jsEdidUrlAdd = $("#jsEdidUrlAdd"); //添加入口对象
        var temp = '<li class="list-group-item">' +
            '<div class="pull-right tips-pre"><span>引导语</span> <i class="icon-arrow-right font-bold"></i> </div>' +
            '<span class="js_url_name">自定义入口(选填)</span>' +
            '</li>';
        var cloneEditUrl = '';
        var length = 0;

        // 添加入口
        $jsEdidUrlAdd.click(function () {
            clone();
            if ($(this).parent().parent().children().length < 4) {
                $(this).parent().before(cloneEditUrl);
                $jsEditUrlLeft.append(temp);
            } else {
                layer.msg('已经达到添加的上限');
            }

            $("#jsEditUrlLeft").show();
        });

        // 字数限制
        $(document).on("keyup keydown", ".js-textlimit0", function (e) {
            var index = $(".js-textlimit0").index($(this));
            var value = $(this).val();
            util.textLimit($(this));
            $(".js_url_name").eq(index).html(value);
        });
        $(document).on("keyup keydown", ".js-textlimit1", function () {
            var index = $(".js-textlimit0").index($(this));
            var value = $(this).val();
            util.textLimit($(this));
            $(".tips-pre").eq(index).find("span").html(value);
        });

        // 删除入口
        $(document).on("click", ".jsEditUrlDel", function () {
            length = $(".edit-url-item").length;
            if (length > 1) {
                $jsEditUrlLeft.children().eq(length - 1).remove();
                $(this).parent().parent().remove();
            }
        });

        function clone() {
            length = $(".edit-url-item").length;
            cloneEditUrl = $(".edit-url-item").eq(0).clone();
            cloneEditUrl.find('input[type="text"]').val(''); //清除所有空
            cloneEditUrl.find('.title').prepend('<a href="javascript:;" class="pull-right jsEditUrlDel">删除</a>');
            cloneEditUrl.find('input[type="radio"]').each(function (index) {
                var index = 3 * length + index + 1;
                $(this).attr("name", "jumpType" + length)
                    .attr('id', 'js-jump' + index);
                $(this).parent().attr("for", 'js-jump' + index);
            });

            switch (length) {
                case 0:
                    cloneEditUrl.find(".name").html("入口一");
                    break;
                case 1:
                    cloneEditUrl.find(".name").html("入口二");
                    break;
                case 2:
                    cloneEditUrl.find(".name").html("入口三");
                    break;
            }
            return cloneEditUrl;
        }

    })();

    // 门店删除
    (function () {
        $('#addStore').click(function () {
            setStoreValue("#inputStoreSel"); //设置初始值
        });

        $("input[name='storeType']").click(function () {
            if($(this).attr("data-index") == 1){
                $("#storeTable").show();
                $(this).next().show();
            }else{
                $("#storeTable").hide();
                $(this).parent().next().find("a").hide();
            }
        });

        $(document).on("click",".js-coupon-store-sel", function () {
            var $inputStoreSel = $("#inputStoreSel");
            var v = $(this).attr("data-value")+",";
            var newVal = $inputStoreSel.val().replace(v, '');
            $(this).parents("tr").remove();
            $inputStoreSel.val(newVal);
        });

        $("#btnCStoreSure").click(function(){
            var $storeBox = $(".storeBox");
            var value = "";
            var tr = "";
            $storeBox.each(function(){
                if($(this).prop("checked")){
                    value += $(this).val() + ',';
                    tr += '<tr><td>'+ $(this).parent().find(".store-name").html() + '</td>'+
                    '<td>'+ $(this).parent().find(".meta").html() + '</td>'+
                    '<td><a href="javascript:;" class="text-blue js-coupon-store-sel" data-value="'+ $(this).val() +'">删除</a></td></tr>';
                }
            });

            $("#storeTbody").html("").append(tr);
            $("#inputStoreSel").val(value);
            //$('#storeAll').modal('hide');
            tr = "";
        });

    })();

    //商品选择 modalGoodsSale
    var t = new couponAdd({
        btn: '#btnGoodsSale',
        checkboxName: 'ckShop',
        inputHiddenId: '#goodsSale_id'
    });
});

// 设置时间
function setTime(date, dateV, time, timeV, week, weekV) {
    $(date).html(dateV);
    $(time).html(timeV);
    $(week).html(weekV);
}

//选择商品
!(function (window, $, undefined) {
    function couponAdd(options) {
        var defaults = {
            btn: '', //弹出框按钮点击对象
            checkboxName: '',  //多选框的name对象
            place: '', //放置数据的地方
            inputHiddenId: '', //放置选中对象的id组合
            numID: '' // input输入框验证
        };

        var opts = $.extend({}, defaults, options);

        this.init(opts);
    }

    couponAdd.prototype = {
        init: function (opts) {
            var _this = this;

            //选择显示隐藏
            $("input[name='goodType']").click(function () {
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
            })
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