/**
 * 营销活动---累计消费次数满赠券
 */
$(function () {
    //活动时间切换
    util.radioToggle('time_active_type', '.js-times');

    //活动规则初始化
    activeRule('.js-add-rule','.js-del-rule')

});

//活动规则添加删除功能
function activeRule(addBtn, delBtn){
    //添加规则
    $(addBtn).click(function () {
        var data = $(this).prev() && $(this).prev().clone();
        //data.find("input,textarea").val('');
        data.children().eq(0).append('<a href="javascript:;" class="js-del-rule">删除规则</a>');
        $(this).before(data);
    });
    //删除规则
    $(document).on('click',delBtn,function () {
        $(this).parent().parent().remove();
    });
}