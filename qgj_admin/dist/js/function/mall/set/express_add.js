/**
 * 快递模板添加
 */

$(function () {

    //保存按钮，并把”顶端20px、距左边180px、宽100px、高25px“放入到数据里，最后放到一个大数组里，赋值给隐藏域
    $("#js-print-save").click(function () {
        var arrs = [];
        var arr = [];
        $(".tempLable").each(function (i,o) {
            arr = [];
            arr.push($(this).css("top"));
            arr.push($(this).css("left"));
            arr.push($(this).css("width"));
            arr.push($(this).css("height"));
            arr.push($(this).attr("data-index"));
            arrs.push(arr);
        });

        $("#jsInputPrintData").val(arrs);
    });

    $('.tempLable').hover(
        function(){$(this).find("div").show();},
        function(){$(this).find("div").hide();}
    );

    //左边多选框点击事件
    $("input:checkbox").each(function(i){
        $(this).click(function(){
            var id = $(this).attr("id").split("_");
            if($(this).is(':checked')){
                $('#'+id[1]).show();
                $('#'+$(this).attr("id")+'c').val('checked');
            }else{
                $('#'+id[1]).hide();
                $('#'+$(this).attr("id")+'c').val("unchecked");
            }
        })
    });

    //所属物流公司
    $('#Delitemp_type').change(function(){
        if($(this).val() == '0'){
            $('#bgDiv').attr('class','tmp_com tmp_sf');
        }
        if($(this).val() == '1'){
            $('#bgDiv').attr('class','tmp_com tmp_yt');
        }
        if($(this).val() == '2'){
            $('#bgDiv').attr('class','tmp_com tmp_st');
        }
        if($(this).val() == '3'){
            $('#bgDiv').attr('class','tmp_com tmp_yd');
        }
        if($(this).val() == '4'){
            $('#bgDiv').attr('class','tmp_com tmp_ems');
        }
        if($(this).val() == '5'){
            $('#bgDiv').attr('class','tmp_com tmp_ht');
        }
        if($(this).val() == '6'){
            $('#bgDiv').attr('class','tmp_com tmp_lb');
        }
        if($(this).val() == '7'){
            $('#bgDiv').attr('class','tmp_com tmp_qf');
        }
        if($(this).val() == '8'){
            $('#bgDiv').attr('class','tmp_com tmp_tt');
        }
        if($(this).val() == '9'){
            $('#bgDiv').attr('class','tmp_com tmp_zjs');
        }
        if($(this).val() == '10'){
            $('#bgDiv').attr('class','tmp_com tmp_zt');
        }
        if($(this).val() == '11'){
            $('#bgDiv').attr('class','tmp_com tmp_ys');
        }
    });
});

function boxCheck(dragDivId){
    if(dragDivId.is(':checked')){
        $(dragDivId+'c').value = "checked";
    }else{
        $(dragDivId+'c').value = "unchecked";
    }
}

//拖放对象
function aa(containerDiv, dragDivId, rRightDown, rLeftDown, rRightUp, rLeftUp, rRight, rLeft, rUp, rDown){
    var rs = new Resize(dragDivId, { Max: true, Scale: false, Min: false,onResize: function(){$(dragDivId+'w').value = $(dragDivId).offsetWidth + "," + $(dragDivId).offsetHeight; }});
    rs.Set(rRightDown, "right-down");
    rs.Set(rLeftDown, "left-down");
    rs.Set(rRightUp, "right-up");
    rs.Set(rLeftUp, "left-up");
    rs.Set(rRight, "right");
    rs.Set(rLeft, "left");
    rs.Set(rUp, "up");
    rs.Set(rDown, "down");
    rs.mxRight = 800;
    rs.mxBottom = 300;

    var drag = new Drag(dragDivId, {mxContainer: containerDiv, Limit: true, onMove: function(){ $(dragDivId+"x").value = $(dragDivId).offsetLeft+","+ $(dragDivId).offsetTop; }});
}