/*异业联盟*/

$(function () {
    // 帮助提示
    var layerIndex = '';
    $(".qgj-help").hover(
        function () {
            layerIndex = layer.tips($(this).attr("data-value"), $(this), {
                tips: [1, '#232323'],
                area: "270px",
                time: 0
            });
        },
        function () {
            layer.close(layerIndex);
        }
    );
});