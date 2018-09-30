// 会员等级
$(function () {
    //会员信息必填信息和选填信息的相互隐藏显示
    util.togglePersonData(".ck-personData");

    //商城会员等级
    $("input[name='mallMGck']").click(function () {
        if($(this).prop("checked")){
            $(".mall-member-grade").show();
        }else{
            $(".mall-member-grade").hide();
        }
    });
    //商城积分赠送
    $("input[name='mallGPck']").click(function () {
        if($(this).prop("checked")){
            $(".mall-give-point").show();
        }else{
            $(".mall-give-point").hide();
        }
    })
});