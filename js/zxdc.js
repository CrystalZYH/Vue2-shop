/**
 * 在线订餐 
 * 1.就是点击 上边的菜单分类 ，默认全部
 * 2.浏览器滚动就加载所点击分类的剩余数据
 * 3. 可以依据销量 价格排序
 * 4.  点击进入商品详情
 * 约定如下：
 * id 0 ，全部； 3 糕点西点； 8 特效小吃； 9西式快餐 ；10日韩料理 ；11下午茶
 *  data。json 为模拟数据 
 *  未完成
 */

new Vue({
    el: "#app",
    data: {
        catalogueList: [],
        selectedId: "",
        shopList: [],
        starflag: true,//打分升序
        orderflag: true,//销量升序
        isLoading:true
    },
    mounted: function () {
        this.$nextTick(function () {
            this.init();
            window.addEventListener('scroll', this.handleScroll);
        });
    },
    methods: {
        // 初始化 全部
        init: function () {
            this.$http.get("mock/data.json").then(response => { //== function(response)
                let res = JSON.parse(response.body);
                debugger
                if (res.code == "2000") {
                    this.catalogueList = res.content.fenlei;
                    this.catalogueList.unshift({
                        id: "0",
                        padImg: "./public/img/quanbu.png",
                        name: "全部"
                    });
                    this.shopList = res.content.shopManage;
                }
            })
        },
        selectCatalogue(item) {
            //selected;
            this.selectedId = item.id; //id 只为模拟后查询
            this.loadData();
        },
        loadData:function(){
            this.$http.get("data/data" + this.selectedId + ".json").then(response => {
                var res = JSON.parse(response.body);
                if (res.code == "2000") {
                    this.shopList = res.content.shopManage;
                    console.log("loading.....")
                }
               
            })
        },
        handleScroll:function(){
            if(window.scrollY>50){
                 this.loadData();
                //  alert("handleScroll");
                console.log(window.scrollY)
            }
        },
        entershop: function (item) {
            alert(item.name)
            console.log(item)
        }
    }
}); 