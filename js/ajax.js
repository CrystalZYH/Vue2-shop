//var ajaxuUrl = //root + "/business/padLifeCircleRest/findShopManageByShopCategory";
var ajaxUrl = "data/data.json";

$(function(){
    init();
})
    
function init() {
    event();
    getdata() ;
}
function getdata() {
    $.ajax({
        accessToken: accessToken, appKey: appKey,
        type: "post",
        dataType: "json",
        url: ajaxUrl,
        data: {
            shopCategoryId: shopCategoryId,
            pageSize: pageSize,
            orderColum: "sortId"
        },
        success: function (res) {
            isLoading = true;
            //根据大的分类获取子类信息
            var templateTypeList = template("templateTypeList", res);
            $(".main-nav")[0].innerHTML += templateTypeList;
            var $items = $(".main-nav div");
            $items.on("click", function () {
                sortId = "";
                $items.removeClass("active");
                $(this).addClass("active");
                childrenid = $(this).attr("id");
                //销售，评分恢复默认状态
                $(".J_xlpaixu").find("img").removeClass();
                $(".J_xlpaixu").find("img").addClass("default");
                $(".J_xlpaixu").find("img").attr("src", "../img/default.png");
                $(".J_pfpaixu").find("img").removeClass();
                $(".J_pfpaixu").find("img").addClass("default");
                $(".J_pfpaixu").find("img").attr("src", "../img/default.png");
                // 根据店铺分类获取该分类下的店铺信息
                $.slAjax({
                    accessToken: accessToken, appKey: appKey,
                    type: "post",
                    dataType: "json",
                    url: ajaxUrl,
                    data: {
                        shopCategoryId: childrenid,
                        pageSize: pageSize,
                        orderColum: "sortId"
                    },
                    success: function (res) {
                        //获取全部店铺
                        if (res.content.shopManage == "") {
                            $(".main-itemlist .grid")[0].innerHTML = "<img src='../img/noshop.png' class='noshop'>";
                        } else {
                            var contentSize = res.content.shopManage.length;
                            sortId = res.content.shopManage[contentSize - 1].id;
                            var templateShopListHtml = template("templateShopList", res);
                            $(".main-itemlist .grid")[0].innerHTML = templateShopListHtml;
                        }
                    }
                })
            });

        }
    })
}
//点击事件定义委托
function event() {
    $(".main-itemlist ").on("click",".item", function () {
        var shopId = $(this).data("shopid");
        alert("shopid")
       // window.location.href = "dpxq.html?shopId=" + shopId + "&shopCartSum=" + shopCartSum + "&shopCartPrice=" + shopCartPrice + "&communityId=" + communityId + "&userId=" + userId + "&getShopCategoryId=" + shopCategoryId + "&shoptypename=" + shoptypename + "&mobile=" + mobile;
    });
}

//页面滚动
function scroll() {
    $(window).scroll(function (event) {
        var winPos = $(document).scrollTop();//滚动条滚动高度
        var docHeight = $(document).height();//文档高度
        var winHeight = $(window).height();//窗口可视高度
        var doc_win = docHeight - winHeight;
        if (doc_win - winPos == 0 && isLoading) {
            isLoading = false;
            $.axjax({
                accessToken: accessToken, appKey: appKey,
                type: "post",
                dataType: "json",
                url: ajaxUrl,
                data: {
                    shopCategoryId: childrenid,
                    sortId: sortId,
                    pageSize: pageSize,
                    orderColum: "sortId"
                },
                success: function (res) {
                    console.log(res);
                    if (res.content.shopManage != null && res.content.shopManage.length > 0) {
                        $(".main-itemlist .grid .mui-loading").remove();
                        var templateShopListHtml = template("templateShopList", res);
                        $(".main-itemlist .grid").append(templateShopListHtml);
                        isLoading = true;
                        var contentSize = res.content.shopManage.length;
                        sortId = res.content.shopManage[contentSize - 1].id;
                    } else {
                        $(".main-itemlist .grid .mui-loading").remove();
                        $(".main-itemlist .grid ").append('<div class="tips">已经是最后一页了</div>');
                        isLoading = false;
                    }
                    getdata() ;
                }
            })
        }
    });
}


function raty() {
    $('.item-raty-box').raty({
        size: 20,
        readOnly: true,
        showHalf: true,
        score: function () {
            return $(this).attr('data-score');
        }
    });
}

