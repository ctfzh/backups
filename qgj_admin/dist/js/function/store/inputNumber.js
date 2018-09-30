inputNumberIe({
	"Id": "inputNumber",
	"Max": 0,
	"Min": 0,
	"Speed": 1
});
/**
 * 在IE里面兼容input type="number"
 * option.Id[需要兼容的input的id名]
 * option.Min[input可以输入的最小值]
 * option.Max[input可以输入的最大值]
 * option.Speed[input值每次改变的大小]
 */
function inputNumberIe(option){
	var $element = $("." + option.Id);
	$(".inputNumber-relative").css({
		"width": $element.outerWidth(),
		"height": $element.outerHeight()
	})
	$element.after('<div class="inputNumber-absolute"><div class="inputNumber-up"></div><div class="inputNumber-down"></div></div>');
	
	$.each($(".inputNumber-up"), function(i, n){
		$(n).on("mouseenter", function(){
			$(this).css("background-position","0 -17px");
		}).on("mouseleave", function(){
			$(this).css("background-position","0 0");
		}).on("mousedown", function(){
			$(this).css("background-position","0 -34px");
		}).on("mouseup", function(){
			$(this).css("background-position","0 0");
		}).on("click", function(){
			$element = $(this).parent().prev();
			option.Max = parseInt($element.attr("max"));
			option.Min = parseInt($element.attr("min"));
			option.Speed = parseInt($element.attr("step"));
			var inputNumberValue = $element.val() * 1;
			if(inputNumberValue){
				if(option.Max){
					if(inputNumberValue < option.Max){
						if(option.Speed && ((inputNumberValue + option.Speed) <= option.Max)){
							inputNumberValue += option.Speed;
						}else{
							return;
						}
					}else{
						return;
					}
				}else{
					if(option.Speed){
						inputNumberValue += option.Speed;
					}else{
						inputNumberValue++;
					}
				}
				$element.val(inputNumberValue);
			}else{
                if(option.Min){
                    if(option.Min != 0){
                        inputNumberValue = option.Min;
                        $element.val(inputNumberValue);
                    }else{
                        return;
                    }
                }else{
                    if(option.Max){
                        inputNumberValue = option.Max;
                        $element.val(inputNumberValue);
                    }else{
                        if(option.Speed && ((inputNumberValue + option.Speed) <= option.Max)){
                            inputNumberValue += option.Speed;
                            $element.val(inputNumberValue);
                        }else{
                            $element.val(1);
                        }
                    }
                }
			}
		});
	});
	
	$.each($(".inputNumber-down"), function(i, n){
		$(n).on("mouseenter", function(){
			$(this).css("background-position","0 -26px");
		}).on("mouseleave", function(){
			$(this).css("background-position","0 -9px");
		}).on("mousedown", function(){
			$(this).css("background-position","0 -43px");
		}).on("mouseup", function(){
			$(this).css("background-position","0 -9px");
		}).on("click", function(){
			$element = $(this).parent().prev();
			option.Max = parseInt($element.attr("max"));
			option.Min = parseInt($element.attr("min"));
			option.Speed = parseInt($element.attr("step"));
			var inputNumberValue = parseInt($element.val() * 1);
			if(inputNumberValue){
				if(option.Min){
					if(inputNumberValue > option.Min){
						if(option.Speed && ((inputNumberValue - option.Speed) >= option.Min)){
							inputNumberValue -= option.Speed;
						}else{
							return;
						}
					}else{
						return;
					}
				}else{
					if(option.Speed){
						inputNumberValue -= option.Speed;
					}else{
						inputNumberValue--;
					}
				}
				$element.val(inputNumberValue);
			}else{
                if(option.Max){
                    if(option.Max != 0){
                        inputNumberValue = option.Max;
                        $element.val(inputNumberValue);
                    }else{
                        return;
                    }
                }else{
                    if(option.Min){
                        inputNumberValue = option.Min;
						$element.val(inputNumberValue);
                    }else{
                        if(option.Speed && ((inputNumberValue - option.Speed) <= option.Min)){
                            inputNumberValue -= option.Min;
							$element.val(inputNumberValue);
                        }else{
							$element.val(-1);
                        }
                    }
                }
			}
		});
	});

	var scrollFunc = function (e) {  
        e = e || window.event;             
        if (e.wheelDelta > 0) { 
            //当滑轮向上滚动时执行的代码段 
			$element.siblings(".inputNumber-absolute").children().eq(0).trigger("click");
        }  
        if (e.wheelDelta < 0) { 
            //当滑轮向下滚动时执行的代码段
			$element.siblings(".inputNumber-absolute").children().eq(1).trigger("click");
        }   
    }
    //滚动滑轮触发scrollFunc方法 ie 谷歌  
    window.onmousewheel = scrollFunc;  
}