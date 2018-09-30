/**
 * 商品库
 */

$(function () {
     //全选/单选
    util.ckAll('.js-single-ck','.js-all-ck');

    //有一个未勾选时，沽清和无限按钮为灰色不可点击状态，不可执行操作
    $(document).on('click', '.js-single-ck,.js-all-ck', function () {
        if($('.js-single-ck:checked').length> 0){
            $(".js-btn-disabled").removeAttr("disabled","disabled");
        }else{
            $(".js-btn-disabled").attr("disabled","disabled");
        }
    });

    //选择门店---全选/单选
    util.ckAll('.js-single-ck-store','.js-all-ck-store', '#hiddenStore');
    //有一个未选择门店情况下确定按钮为灰色不可点击状态，不可执行下一步操作
    $(document).on('click', '.js-single-ck-store,.js-all-ck-store', function () {
        if($('.js-single-ck-store:checked').length> 0){
            $("#btnSure").removeAttr("disabled","disabled");
        }else{
            $("#btnSure").attr("disabled","disabled");
        }
    });
});
