/**
 * 左右菜单门店选择
 */

(function () {
    //全选
    $(".all-check").click(function () {
        if($(this).prop("checked")){
            $(this).parent().next().find(".single-check").prop("checked",true);
        }else{
            $(this).parent().next().find(".single-check").prop("checked",false);
        }
    });
    //取消
    $(document).on("click",".single-check",function () {
        var index = $(this).parent().parent().attr("class").split("_")[1];
        if(isAllSelect($(this))){
            $(this).parent().parent().parent().prev().find("input").prop("checked",true);
        }else{
            $(this).parent().parent().parent().prev().find("input").prop("checked",false);
        }

        if($(this).prop("checked")){
            $(this).parent().next().find(".single-check").prop("checked",true);
            if(index == 2 && $(this).parents(".tree").find(".single-check_1").length == $(this).parents(".tree").find(".single-check_1:checked").length){
                $(this).parents(".level_1").parent().prev().find("input").prop("checked",true);
            }
        }else{
            $(this).parent().next().find(".single-check").prop("checked",false);
            if(index == 2){
                $(this).parents(".level_1").parent().prev().find("input").prop("checked",false);
            }
        }
    });

    function isAllSelect(o) {
        var li_parent = o.parent().parent(),
            index = li_parent.attr("class").split("_")[1],  //所属层级
            all_check = o.parents(".tree").find(".single-check_" + index), //所有checkbox
            all_checked = o.parents(".tree").find(".single-check_" + index + ":checked");  //所有选中的checkbox

        if(all_check.length == all_checked.length){
            return true;
        }else{
            return false;
        }
    }

    //添加选中的，当前项删除,右侧出现
    $(".js-select-bar-btn").click(function () {
        var clone = '';
        $(".js-selectBarL .single-check_1").each(function () {
            if($(this).prop("checked")){
                clone += $(this).parent().parent().prop("outerHTML");
                $(this).parent().parent().remove();
            }
        });
        $(".js-selectBarUlR").append(clone);
    });

    //删除后，当前项删除，左侧出现
    $(document).on("click",".js-selectBar-close",function () {
        var index = $(this).parent().find("input").val(); // 获取当前要删除的索引
        var $ul = $(".js-selectBarUlL");  //左侧容器
        var $li = $ul.find("li");  //左侧容器里所有对象
        var index_cur = ''; //获取左侧当前索引
        var index_after = ''; // 获取左侧后索引
        var $this = $(this); //当前删除对象;
        var html = $this.parent().parent().prop("outerHTML");  //获取当前删除的内容

        //如果左侧容器里是否有对象做不同的判断
        if($li.length){
            $li.each(function () {
                index_cur = parseInt($(this).attr("id").split("_")[1]);  //要转换成数字类型
                index_after = $(this).next().length ? parseInt($(this).next().attr("id").split("_")[1]) : '';

                //如果有下一个相邻的对象存在
                if(index_after){
                    if(index_cur < index && index < index_after){
                        $(this).after(html);
                        $this.parent().parent().remove();
                        return false;  //为了阻止循环多次
                    }
                }else{
                    //左侧的第一个索引比右侧删除的大就把右侧的插入到左侧前面,否则就插入到左侧的后面
                    if(index_cur > index){
                        $(this).before(html);
                        $this.parent().parent().remove();
                        return false;  //为了阻止循环多次
                    }else{
                        $(this).after(html);
                        $this.parent().parent().remove();
                        return false;  //为了阻止循环多次
                    }
                }
            })
        }else{
            $ul.append(html);
            $this.parent().parent().remove();
        }
    })

})();
