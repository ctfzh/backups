/**
 * 营销活动---支付即会员
 */
$(function () {
    util.daterangepicker("time",true);
    //7日
    $(".sevenMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input").val(util.getDayRange(7,-1))
    });
    //15日
    $(".fifthMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input").val(util.getDayRange(15,-1))
    });
    //30日
    $(".thirtyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $(this).parent().find("input").val(util.getDayRange(30,-1))
    });

    //支付即会员---选择收款账号弹出框
    $('#btnMPMSure').on('click', function () {
        var $checkbox = $('input[name="checkNname"]:checked');
        var value = getMPMId($checkbox);
        $(".MPMAccount-place").html(value.split("&")[0]);
        $(".js_MPMAccount_input").val(value.split("&")[1])
    });
    //删除微信商户号
    $(document).on('click', '.js_MPMAccount_del', function () {
        var $inputSel = $('.js_MPMAccount_input');
        var v = $(this).prev().html() + ",";
        var newVal = $inputSel.val().replace(v, '');
        $(this).parent().remove();
        $inputSel.val(newVal);
    });
    //得到微信商户号并赋值
    function getMPMId(checkboxArr) {
        var temp = '';
        var idArr = '';

        $.each(checkboxArr, function (i, event) {
            temp += '<li>微信商户号: <span>' + $(event).val() + '</span> <a href="javascript:;" class="ml5 js_MPMAccount_del">删除</a></li>';
            idArr += $(event).val() + ",";
        });

        return temp + '&' + idArr;
    }

    // 选择微信商户号弹出框显示时执行方法
    $('#modalMPMAccount').on('show.bs.modal', function () {
        setMPMId();
    });

    // 根据现有的值对弹出框进行勾选
    function setMPMId() {
        var v = $('.js_MPMAccount_input').val();
        var checkbox = $("#modalMPMAccount input").prop("checked",false);
        var vArr = v.split(",");
        for (var i = 0, len = vArr.length; i < len - 1; i++) {
            for (var j = 0, len1 = checkbox.length; j < len1; j++) {
                if (vArr[i] == checkbox[j].value) {
                    checkbox[j].checked = true;
                }
            }
        }
    }

});
