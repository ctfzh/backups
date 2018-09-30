/*
 * 备注
 * 
 */

$(function() {

	//删除成功提示
	$('.js-del').on('click', function() {
		layer.msg('删除成功', {
			time: 1000
		}, function() {
			//回调
		})
	});


	//排序值编辑
	util.setSeqNum(".seq-num", function(value, index) {
		console.log(value) //返回值
		console.log(index) //索引
	});
	
	
	    //打开弹出框事件
    $('#modal_remark').on('show.bs.modal', function (event) {
        var type = event.relatedTarget.dataset.type;
        if (type == 'edit') {
        	var item = event.relatedTarget.dataset.item;
        	item = JSON.parse(item);
        	var remark_id = item.id;
        		$(".remark_text").text(item.name);
        		$(".item_id").val(item.id);
            $('.modal-title').text('编辑备注');
        } else {
            $('.modal-title').text('新建备注');
        		$(".remark_text").text('');
        		$(".item_id").val('');
        }
    });
});