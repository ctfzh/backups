/**
 * 微信小程序.
 */
// 优惠券删除
(function () {

    // 点击“添加优惠券”按钮后，隐藏域的值的更新，弹出框多选框选中状态的更新
    $(document).on("click",".js-coupon-sel", function () {
        var $inputStoreSel = $("#inputCouponId");
        var v = $(this).attr("data-value")+",";
        var newVal = $inputStoreSel.val().replace(v, '');
        $(this).parents("tr").remove();
        $inputStoreSel.val(newVal);
    });

    //弹出框按钮点击 把选中的优惠券添加到指定的表格中
    $("#btnCouponSure").click(function(){
        var $storeBox = $(".storeBox");
        var value = "";
        var tr = "";
        $storeBox.each(function(){
            if($(this).prop("checked")){
                var td = "";
                value += $(this).val() + ',';
                //循环除了勾选框的兄弟节点
                $(this).parent().siblings().each(function(){
                    td += '<td>'+ $(this).html()+'</td>';
                });
                tr += '<tr>' + td + '<td><a href="javascript:;" class="text-blue js-coupon-sel" data-value="'+ $(this).val() +'">删除</a></td></tr>'
            }
        });

        $(".storeTbody").html("").append(tr);
        $("#inputCouponId").val(value);
        tr = "";
    });

})();
