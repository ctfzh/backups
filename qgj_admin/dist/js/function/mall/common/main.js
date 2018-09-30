/*
* 商城公共方法
* */

// 判断页面设置里某些元素是否为空
function isValidate(data) {
    var flag = true;
    var checkTelephone = /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/; //验证手机号
    $.each(data, function (i,o) {
        console.log(o)
        switch (o.type){
            case 'title':
                if(!o.name){
                    layer.msg("请填写页面名称");
                    $(".js-ms-title").click();
                    flag = false;
                    return false;
                }
                break;
            case 'headline':
                if(!o.title){
                    layer.msg("请填写标题");
                    $(".region").eq(i-1).click();
                    flag = false;
                    return false;
                }else if(o.linkIndex == "13"){
                    if(!o.inputValue){
                        layer.msg("请输入联系电话");
                        $(".region").eq(i-1).click();
                        flag = false;
                        return false;
                    }else{
                        if(!checkTelephone.test(o.inputValue)){
                            layer.msg("请输入正确的联系电话");
                            $(".region").eq(i-1).click();
                            flag = false;
                            return false;
                        }
                    }
                }
                break;
            case 'post':
                if(!o.text){
                    layer.msg("请填写公告内容");
                    $(".region").eq(i-1).click();
                    flag = false;
                    return false;
                }
                break;
            case 'banner':
                if(o.list.length == 0){
                    layer.msg("请添加广告");
                    $(".region").eq(i-1).click();
                    flag = false;
                    return false;
                }else{
                    flag = isComValidate(o.list, i,o.type);
                    if(!flag){
                        return false;
                    }
                }
                break;
            case 'imageText':
                if(o.list.length == 0){
                    layer.msg("请添加图文");
                    $(".region").eq(i-1).click();
                    flag = false;
                    return false;
                }else{
                    flag = isComValidate(o.list, i);
                    if(!flag){
                        return false;
                    }
                }
                break;
            case 'nav':
                if(!o.list[0].linkIndex){
                    layer.msg("请选择链接");
                    $(".region").eq(i-1).click();
                    flag = false;
                    return false;
                }else if(!o.list[0].imgSrc){
                    layer.msg("请上传图片");
                    $(".region").eq(i-1).click();
                    flag = false;
                    return false;
                }else if(o.list[0].linkIndex == "13"){
                    if(!o.list[0].inputValue){
                        layer.msg("请输入联系电话");
                        $(".region").eq(i-1).click();
                        flag = false;
                        return false;
                    }else{
                        if(!checkTelephone.test(o.list[0].inputValue)){
                            layer.msg("请输入正确的联系电话");
                            $(".region").eq(i-1).click();
                            flag = false;
                            return false;
                        }
                    }
                }
                break;
            case 'fightG':
            case 'discount':
                if(!o.activityId || !o.list.length){
                    layer.msg("请选择活动商品");
                    $(".region").eq(i-1).click();
                    flag = false;
                    return false;
                }
                break;
            default:
                break;
        }
    });
    return flag;
}

//返回公共 图片/标题是否为空
function isComValidate(list, index,type){
    var flag1 = true;
    $.each(list, function (j,o1) {
        if(!o1.imgSrc){
            layer.msg("请上传图片");
            $(".region").eq(index-1).click();
            flag1 = false;
        }
        else if(!o1.title){
            if (type == 'banner'){
                return flag1;
            }
            layer.msg("请填写标题");
            $(".region").eq(index-1).click();
            flag1 = false;
        }
    });
    return flag1;
}
//返回公共 图片/标题/联系电话是否为空
// function isComValidate(list, index){
//     var flag1 = true;
//     var checkTelephone = /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/; //验证手机号
//     $.each(list, function (j,o1) {
//         if(!o1.imgSrc){
//             layer.msg("请上传图片");
//             $(".region").eq(index-1).click();
//             flag1 = false;
//         }
//         else if(o1.linkIndex == "13"){
//             if(!o1.inputValue){
//                 layer.msg("请输入联系电话");
//                 $(".region").eq(index-1).click();
//                 flag1 = false;
//             }else{
//                 if(!checkTelephone.test(o1.inputValue)){
//                     layer.msg("请输入正确的联系电话");
//                     $(".region").eq(index-1).click();
//                     flag1 = false;
//                 }
//             }
//         }
//     });
//     return flag1;
// }
//返回链接是否为空
function linkIndexValidate(list, index){
    var flag1 = true;
    $.each(list, function (j,o1) {
        if(!o1.linkIndex){
            layer.msg("请选择链接");
            $(".region").eq(index-1).click();
            flag1 = false;
         }
    });
    return flag1;
}

// 判断底部导航页面设置链接是否为空
function isValidateNav(data) {
    var flag = true;
    $.each(data, function (i,o) {
        switch (o.type){
            case 'navSet':
                flag = linkIndexValidate(o.list, i);
                break;
            default:
                break;
        }
    });
    return flag;
}

//滑动条
function ff(o,e,minVal,maxVal,callback) {
    var $guideBar = $(o).parents(".js-guideBar");  //最上面的对象
    var $bar = $guideBar.find('.scale');  //滑动区域对象
    var $btn = $(o);  //滑动对象
    var $minObj = $guideBar.find(".bars_10"); //初始值
    var $step = $(o).prev();
    var l = $(o).position().left;
    var x = (e || window.event).clientX;
    var max = $bar.width() - $(o).width();  //滑动条最大值

    document.onmousemove = function (e) {
        var thisX = (e || window.event).clientX,
            to = Math.min(max, Math.max(0, Math.max(0, l+(thisX - x)) ));  //获取最小差值

        $btn.css("left", to);
        ondrag(Math.round(Math.max(0, to / max) * maxVal), to);
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); //范围选中状态去除
        callback(Math.round(Math.max(0, to / max) * maxVal), to);  //回调方法
    };
    document.onmouseup = new Function('this.onmousemove=null');

    function ondrag(pos, x) {
        $step.css("width", Math.max(0, x) + 'px');
        if($minObj.val()){
            $minObj.val(Math.ceil(pos<minVal?minVal:pos) + ''); //最小高度为10
        }else{
            $minObj.html(Math.ceil(pos<minVal?minVal:pos) + ''); //最小高度为10
        }
    }
}
