/**
 * 门店收款账号设置
 */
$(function () {

    //收款账号选择弹出框
    $('#myModal1').on('show.bs.modal', function (event) { //显示弹出框
        //给“确定”按钮赋予索引值
        $("#btnSure").attr("data-index",event.relatedTarget.dataset.index);

    });
    $("#btnSure").click(function (e) {  //确定按钮点击事件
        var index = e.target.dataset.index; //1: 支付宝，2：微信


    })

});
