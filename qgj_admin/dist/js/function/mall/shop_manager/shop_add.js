/*
*  商品添加管理
* */

$(function () {
    //商品一组规则的关闭按钮隐藏显示
    $(".js-sku-sub-group").hover(
        function () {
            $(".js-delete-sku-group").show();
        },
        function () {
            $(".js-delete-sku-group").hide();
        }
    );
    //商品单个规则的关闭按钮隐藏显示
    $(".js-sku-bd-list .sku-item").hover(
        function () {
            $(".js-delete-sku-item").show();
        },
        function () {
            $(".js-delete-sku-item").hide();
        }
    );
    //商品规则下拉选择
    //var data = [{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' }, { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }];
    $(".js-example-basic-single").select2();
    $(".js-example-basic-single").on("change",function (e) {
        console.log($(".js-example-basic-single").select2("data"))
    });

});