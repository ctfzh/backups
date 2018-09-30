var theRequest = new Object(); //theRequest为i获取的参数集合
var edit_data = '';
//获取地址参数
(function() {
	var url = window.location.href.split("?");
	if(url.length > 1) {
		var strs = url[1].split('&');
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
		theRequest = theRequest;
	}
})($);

$(function() {
	//编辑页面标题
	if(theRequest.id) { //获取相应参数进行相关操作
		$('.title_print').text("编辑打印机");
	}

	//删除
	$(document).on('click', ".js-del", function() {
		var $timePickerItem = $(this).parents(".time-picker-item"),
			$self = $(this);
		var item = $(this).data("item");
		layer.confirm('确定删除吗？', {
			btn: ['确定', '取消'] //按钮
		}, function(index) {
			//要删除的json数据
			console.log(item)
		});

	});

	//打印机用途
	$(".print_type").change(function() {
		
		$('.link_type').prop('checked', 'false');
		$("#dashed_text").hide();
		//纸张宽度显示隐藏
		$(".bumf_input").eq(1).hide();
		$(".bumf_input").eq(0).show();
		$('.bumf_input input').prop('checked', 'false');
		$('.bumf_input:eq(0) input:eq(0)').prop('checked', 'true');

		if($(this).attr('data-index') == "1") {
			$("#dashed_text").show();
			$(".link").eq(0).hide();
			$(".link").eq(1).show();
			$('.link_type').eq(1).prop('checked', 'true');

		} else if($(this).attr('data-index') == "2") {
			$(".link").eq(1).hide();
			$(".link").eq(0).show();
			$('.link_type').eq(0).prop('checked', 'true');
			//纸张宽度显示隐藏
			$(".bumf_input").eq(0).hide();
			$(".bumf_input").eq(1).show();
			$('.bumf_input:eq(1) input:eq(0)').prop('checked', 'true');

		} else {
			$(".link").show();
			$('.link_type').eq(0).prop('checked', 'true');
		}
	});

	//打印机连接方式
	$(".link_type").change(function() {
		if($(this).attr('data-index') == "1") {
			$("#dashed_text").show();
		} else {
			$("#dashed_text").hide();
		}
	});

})