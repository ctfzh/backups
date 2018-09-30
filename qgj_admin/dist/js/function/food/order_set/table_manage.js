/**
 * 桌台设置
 */

$(function () {

    //下载桌台码桌台类型  全选/单选
    util.ckAll('.js-single-ck','.js-all-ck');

    //删除区域提示
    $(".js-area-del").click(function () {
        layer.msg("请清空当前区域桌台后进行删除操作");
    });

    //桌台排序
    $(".sortable").sortable({
        stop: function( event, ui ) {
            $(ui.item).trigger('click');
        }
    });

    //桌台类型创建
    $(document).on('click', '.js-tableType-add', function () {
        var temp = '<div class="item mb10"><input type="text" class="form-control form-control-inline mr20" placeholder="请输入不超过6个字" maxlength="6"> <a href="javascript:;" class="text-primary js-tableType-del">删除</a></div>';

        $(this).before(temp);
        if($(this).parent().find(".item").length == 8){
            $(this).hide();
        }
    });

    //桌台类型删除
    $(document).on('click', '.js-tableType-del', function () {
        $(this).parent().parent().find(".js-tableType-add").show();
        $(this).parent().remove();
    });

    //删除桌台
    $(".js-table-del").click(function () {
        layer.confirm('确定删除该桌台？',{
            title:'删除桌台'
        },function () {
            
        })
    })
});