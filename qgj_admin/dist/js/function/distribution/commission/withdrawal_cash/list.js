/**
 * 提现管理
 */

$(function () {
    util.daterangepicker("time");

    //全选/单选
    util.ckAll('.js-single-ck','.js-all-ck');
    
    //批量审核
    $("#batchAudit").click(function () {
        layer.confirm('已选择20条提现，确定全部审核通过？', {
            btn: ['确定','取消'] //按钮
            ,title: '批量提现审核'
            ,area: ['420px'], //宽高
        }, function(index){
            //确定提交内容
            layer.close(index)
        });
    });

    //7日
    $("#sevenMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(6))
    });
    //30日
    $("#thirtyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(29))
    });
});