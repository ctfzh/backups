/*
 * 支付方式
 * 
 */

$(function() {

	//排序值编辑
	util.setSeqNum(".seq-num", function(value, index) {
		console.log(value) //返回值
		console.log(index) //索引
	});

	//功能闭合开关
	$('.status').on('click', function() {
			var value = 2;
			if($(this).is(':checked')) {
				value = 1;
			}
			$(this).next().val(value);
		});

		//打开弹出框事件
	  $('#modal_payment').on('show.bs.modal', function (event) {
	      var type = event.relatedTarget.dataset.type;
	      if (type == 'edit') {
	      	var item = event.relatedTarget.dataset.item;
	      	item = JSON.parse(item);
	      	var remark_id = item.id;
	      		$(".form-control").val(item.name);
	      		$(".item_id").val(item.id);
	          $('.modal-title').text('编辑支付方式');
	      } else {
	          $('.modal-title').text('新建支付方式');
	      		$(".form-control").val('');
	      		$(".item_id").val('');
	      }
	  });
	  
	  	//删除
	$(document).on('click', ".js-del", function() {
		var $timePickerItem = $(this).parents(".time-picker-item"),
			$self = $(this);
		var item = $(this).data("item");
		layer.confirm('确定删除吗？', {
			btn: ['确定', '取消'] //按钮
		}, function(index) {
			layer.msg('删除成功 id=' + item.id, {
				time: 1000
			}, function() {
				//回调
			})
			//要删除的json数据
			console.log(item)
		});

	});
});