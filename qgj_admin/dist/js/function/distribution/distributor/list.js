/**
 * 分销商列表
 */

$(function () {

    //备注
    $(".js-remark").click(function () {
        var id = $(this).attr("data-id");
        layer.prompt({title: '备注', formType: 2}, function(pass, index){
            //提交内容
            layer.close(index);
        });
    });

    //驳回理由
    $(".js-reject").click(function () {
        var id = $(this).attr("data-id");
        layer.prompt({title: '驳回分销申请', value: '', formType: 2}, function(pass, index){
            //提交内容
            layer.close(index);
        });
    });

});