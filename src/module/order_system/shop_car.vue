<template>
    <div id="shopCar" class="shopCar">
        <div class="shopCarBox" @click="openShopCar">
            <div class="shopCar-left fl">
                <div class="shopCar-icon fl">
                    <div class="shopCar-num">{{$store.state.shopCarNum}}</div>
                </div>
                <div class="shopCar-price fl">
                        
                    <span class="shopCar-text">总价</span>  
                    <span class="shopCar-totalPrice">¥{{$store.state.shopCarPrice}}</span>          
                </div>       
            </div>
        </div>
        <div class="shopCar-right fl">
            <div class="take-out" v-if="isTakeOut">
                <!-- 外卖 -->
                <span>确认下单</span>
                <span>(满{{selfPayInfo.minFee}}起送)</span>
            </div>
            <a href="javascript:void(0)" class="order-btn" @click="placeAnOrder" v-else>确认下单</a>
        </div>
        <div class="shopCar-shade" v-show="shopCharIsShow" @click="openShopCar">
        </div>  
        <div class="shopCar-list" v-show="shopCharIsShow">
            <div class="shopCar-header">
                <div class="shopCar-title fl">购物车</div>
                <div class="shopCar-clean fr" @click="emptyCart"></div>
            </div>
            <div class="shopCar-content">
                <!-- 商品数据 -->
                <div class="goods" v-for="(goods,index) in $store.state.carGoodsList" v-bind:key="goods.goodsName + random()">
                    <div class="goodsName fl">
                        <div class="goodsNames">{{goods.goodsName}}</div>
                        <div class="tastes" v-if="goods.attrInfo">
                            {{goods.attrInfo}}
                        </div>
                    </div>
                    <div class="goodsPrice fl">
                        <span :class="goods.isVip != '0' && $store.state.isMember ? 'goodsDiscount' : ''">￥{{goods.price}}</span>
                        <span v-if="goods.isVip != '0'">{{getVipPrice(goods)}}</span>
                    </div>
                    <div class="goodsNum fl">
                        <addSubtract :item="goods" :index="index"  @goodsChange="goodsChange"></addSubtract>
                    </div>
                </div>
                <!-- 套餐数据 -->
                <div class="goods" v-for="(packages,index) in $store.state.carPackageList" v-bind:key="packages.packageName + random()">
                    <div class="packagesName fl">
                        <div class="packagesNames fl">{{packages.packageName}}</div>
                        <div class="goodsUpDown fl"></div>
                    </div>
                    <div class="goodsPrice fl">
                        <span :class="packages.isVip != '0' && $store.state.isMember  ? 'goodsDiscount' : ''">￥{{packages.price}}</span>
                        <span v-if="packages.isVip != '0'">{{getVipPrice(packages)}}</span>
                    </div>
                    <div class="goodsNum fl">
                        <addSubtract :item="packages" :index="index"  @goodsChange="goodsChange"></addSubtract>
                    </div>
                    <div class="package-goods fl" v-for="tag in packages.packageTag" v-bind:key="tag.tagName + random()">
                        <div class="package-tag">{{tag.tagName}}{{tag.goods.length}}选{{tag.totalNum}}</div>
                        <div class="tag-goods" v-for="goods in tag.goods" v-bind:key="goods.goodsName + random()">
                            <div class="package-name fl">{{goods.goodsName}}</div>
                            <div class="package-num fl">
                                x{{goods.num}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <transition name="fade">
            <component 
                :is="isShowPay"
                @close="closeWin" 
                @choicePay="changePay"
                :list="selfPay"
            >
            </component>
        </transition>
    </div>
</template>

<script>
import utils from "src/verdor/utils";
import storage from "src/verdor/storage";
import store from "./details_store";
import orderHttp from "./order_http";
import http from 'src/manager/http';

let orderData = null;


export default {
    data(){
        return {
            shopCharIsShow : false, // 购物车详情是否显示
            shopCarNum : 0, // 购物车总数量
            totalPrice : 0, // 购物车总价格
            carGoodsList : [], // 购物车商品列表
            carPackageList : [], // 购物车套餐列表
            randKey: storage.session('randKey') || utils.getOnlyId(16), // 红桌台下单随机值
            shopId : storage.session('wechatShop') ? storage.session('wechatShop').shopId :  storage.session('select-shop').id, // shopId
            payUrlData : {}, // 支付链接
            isPay : true, // 商品是否开通在线支付
            selfPay : storage.session('SelfHelpConfig') ? storage.session('SelfHelpConfig').pay : [], // 支付方式
            selfPayInfo : {}, // 选择的支付方式详细信息
            isShowPay : '', // 是否渲染支付列表组件
            isTakeOut : false // 是否为外卖
        };
    },
    props : [],
    methods : {
        closeWin(){
            this.isShowPay = '';
        },
        random(){
            return Math.random();
        },
       openShopCar : function(){
           // 打开购物车
           if(this.$store.state.carGoodsList.length  || this.$store.state.carPackageList.length){
                this.shopCharIsShow = !this.shopCharIsShow;
                this.$store.commit("setOverHide",this.shopCharIsShow);
           }
       },
       emptyCart : function(){
           // 清空购物车
           this.shopCharIsShow = false;
           this.$store.commit("setOverHide",this.shopCharIsShow);
           this.$store.commit("resetShopCar");
       },
       goodsChange : function(item){
           // 购物车数据发生改变
           if(item.isGoods){
               // 处理商品
                let goods = {
                    'data' : utils.deepCopy(item),
                    'operateType' : 'splice',
                    'operateObj' : 'carGoodsList'
                }
                this.$store.commit("setCarList",goods);
           }else{
               // 处理套餐
                let packages = {
                    'data' : utils.deepCopy(item),
                    'operateType' : 'splice',
                    'operateObj' : 'carPackageList'
                }
                this.$store.commit("setCarList",packages);
           }
       },
       watchGoods : function(){
            if(this.$store.state.carGoodsList.length == 0  && this.$store.state.carPackageList.length == 0){
                this.shopCharIsShow = false;
                this.$store.commit("setOverHide",this.shopCharIsShow);
           }else{

           }
       },
       getVipPrice : function(goods){
           // 获取会员价格
           return (goods.isVip == "1") ? goods.vipPrice : (goods.price * this.$store.state.memberDiscount).toFixed(2);
       },
       placeAnOrder : function(){
           // 下单
           var goods = utils.deepCopy(this.$store.state.carGoodsList);
           var packages = utils.deepCopy(this.$store.state.carPackageList);
           let sumPrice = this.$store.state.shopCarPrice

           storage.session('goods',goods)
           storage.session('packages',packages)
           storage.session('sumPrice',sumPrice)
            if(this.isPay === false){
                store.commit("setWin",{title:"提示信息:",content:"该店尚未开通支付"});
                return false;
            }

           if(goods.length === 0 && packages.length === 0){
               store.commit("setWin",{title:"提示信息:",content:"请选择菜品后提交"});
               return false;
           }

           var reservationInfo = storage.session('reservationInfo'); // 预约信息
           var selectShop = storage.session('select-shop'); // 自助模式信息


            if(reservationInfo){
                // 跳转至预约界面
                if(!process.env.ASSET_PATH){
                    // 存在则为开发坏境
                    window.location.href = this.payUrlData.bespeakdetail;
                }else{
                    this.$router.push("/bespeakDetail");
                }
            }else{
                if(selectShop){
                    // 跳转至自助模式结账
                    if(this.selfPay && this.selfPay.length > 0){
                        if(this.selfPay.length == 1){
                            // 如果自助模式只有一种支付方式则不显示弹框 支付直接进入支付页面
                            if(this.selfPay[0].type === '2'){
                                if(Number(this.$store.state.shopCarPrice) < Number(this.selfPay[0].minFee)){
                                    this.$store.commit("setWin",{content: '未满足起送费'});
                                    return false;
                                }
                            }
                            storage.session('selectPayWay',this.selfPay[0]);
                            if(!process.env.ASSET_PATH){
                                // 存在则为开发坏境
                                window.location.href = this.payUrlData.payUrl;
                            }else{
                                this.$router.push("/pay");
                            }
                        }else{
                            // 如果自助模式有一种以上支付方式则显示弹框，选择支付类型
                            this.isShowPay = 'pay-list';
                        }
                    }else{
                        if(!process.env.ASSET_PATH){
                            // 存在则为开发坏境
                            window.location.href = this.payUrlData.payUrl;
                        }else{
                            this.$router.push("/pay");
                        }
                    }
                }else{
                    // 红桌台下单
                    var subInfo = orderData.getCurrentTableUpdata(goods, packages);
                    var orderStatus; // 订单状态,1:成功，2:报错失败，3:桌台待确认，4:已存在订单不能提交，5:超时处理
                    var sendInfo = {};
                    var tableInfo = storage.session("orderInfo");
                    sendInfo.data = subInfo;
                    sendInfo.tableId = tableInfo.tableId;
                    sendInfo.person = tableInfo.num;
                    sendInfo.tableName = tableInfo.areaNmae + "_" + tableInfo.tableName;
                    sendInfo.randKey = this.randKey;//随机值
                    sendInfo.shopId = this.shopId;
                    orderHttp.newWechatOrder(sendInfo,(json)=>{
                        tableInfo.orderDate = utils.format(new Date(Number(json.time) * 1000),'yyyy-MM-dd hh:mm')
                        tableInfo.oid = json.data;
                        storage.session("orderInfo", tableInfo);
                        orderStatus = (json.error ? '2' : '1'); 
                        storage.session('orderStatus',{
                            "orderStatus" : orderStatus,
                            "errorMsg" :  json.error ? json.error.message : "下单失败"
                        });
                        this.$router.push("/osuccess");
                    },(json)=>{
                        if(json.error.code == '3805' || json.error.code == '3829'){
                            //已存在订单不能提交
                            orderStatus = '4';
                        }else if(json.error.code == '3827'){
                            //该桌台待确认,请联系服务员确认
                            orderStatus = '3';
                        }else if(json.error.code == '2822'){
                            // 商品库存不足
                            orderStatus = '2';
                        }else if(json.error.code){
                            // code存在
                            orderStatus = '2';
                        }else{
                            // 超时或后端返回数据错误
                            orderStatus = '5';
                        }
                        storage.session('orderStatus',{
                            "orderStatus" : orderStatus,
                            "errorMsg" : json.error.message
                        });
                        this.$router.push("/osuccess");
                    });
                    storage.session('goodsData',JSON.parse(sendInfo.data));
                    storage.session('randKey',sendInfo.randKey);
                }
            }
       },
       async payUrlFun() {
         // 获取链接地址
            if (storage.session("isWechatOrder") == 1) {
                // 是否为微信点餐
                this.isPay = true;
                storage.session("isWechatOrder", 0);
            } else {
                // 自助模式点餐
                this.payUrlData = await http.payUrl({data:{
                    type : 0,
                    shopId : this.shopId
                }});

                if(this.payUrlData.payUrl==''){
                    this.isPay = false;
                    this.$store.commit("setWin",{content: '该商家尚未开通支付'});
                }
            }
        },
        changePay (obj){
            console.log(11);
            // 自助模式选择了支付方式
            if(obj.type === '2'){
                if(this.$store.state.shopCarPrice < obj.minFee){
                    this.$store.commit("setWin",{content: '未满足起送费'});
                    return false;
                }
            }
            storage.session('selectPayWay',obj);
            if(!process.env.ASSET_PATH){
                // 存在则为开发坏境
                window.location.href = this.payUrlData.payUrl;
            }else{
                this.$router.push("/pay");
            }
            storage.session('selectPayWay',obj);
            
        }
    },
    async mounted(){
        orderData = await import(/* webpackChunkName:'order_data' */'./order_data.js');
        orderData = orderData.default;
        
        if(this.selfPay.length === 1 && this.selfPay[0].type === "2"){
            // 如果自助模式支付方式为一种，并且type为2，则为外卖。
            this.isTakeOut = true;
            this.selfPayInfo = this.selfPay[0];
        }

        this.payUrlFun();
    },
    components: {
        addSubtract : () => import(/* webpackChunkName: "addSubtract" */ "../../components/add_subtract"),
        payList : () => import(/* webpackChunkName: "payList" */ "../../components/pay_list")
    },
    computed : {
        goodsCarChange(){
            return this.$store.state.carGoodsList;
        },
        packagesCarChange(){
            return this.$store.state.carPackageList;
        },
        shopCarPriceChange(){
            return this.$store.state.shopCarPrice;
        }
    },
    watch : {
        'goodsCarChange' : {handler : function(){
            this.watchGoods();
        },deep : true},
        'packagesCarChange' : {handler : function(){
            this.watchGoods();
        },deep : true},
        'shopCarPriceChange' :{handler : function(){
            if(this.selfPay.length === 1 && this.selfPay[0].type === "2"){
                this.isTakeOut = this.selfPayInfo.minFee > this.$store.state.shopCarPrice;
            }
        },deep : true}
    },
    store
}
</script>

<style lang="less" scoped>
@import '../../res/css/base.less';
.shopCar{
    .px2rem(width,750);
    .px2rem(height,100);
    .px2rem(line-height,100);
    position : fixed;
    left : 0;
    bottom : 0;
    background-color : rgba(0,0,0,0.4);
    color : #FFFFFF;
    .px2rem(font-size,32);
    text-align : center;
    z-index : 99;
    .shopCar-left{
        .px2rem(width,540);
        .px2rem(height,100);
        overflow : hidden;
        .shopCar-icon{
            .px2rem(width,140);
            height : 100%;
            background : url(../../res/images/tab-icon-gouwuche.png) center center no-repeat transparent;
            background-size : 1.066rem 1.066rem;
            position : relative;
            .shopCar-num{
                .px2rem(width,40);
                .px2rem(height,40);
                .px2rem(line-height,40);
                text-align : center;
                background-color : #ff463b;
                border-radius : 50%;
                position : absolute;
                .px2rem(right,18);
                .px2rem(top,6);
                .px2rem(font-size,22);
                overflow : hidden;
                text-overflow : ellipsis;
                white-space : nowrap;
            }
        }
        .shopCar-price{
            .px2rem(width,400);
            height:100%;
            .text-overflow;
            text-align : right;
            .px2rem(padding-right,40);
            box-sizing : border-box;
            .shopCar-text{
                .px2rem(font-size,28);
            }
            .shopCar-totalPrice{
                .px2rem(font-size,28);
            }
        }
    }
    .shopCar-right{
        .px2rem(width,210);
        .px2rem(height,100);
        overflow : hidden;
        .order-btn{
            background-color : #f5a623;
            height: 100%;
            width: 100%;
            .px2rem(font-size,32);
        }
        .take-out{
            height: 100%;
            width: 100%;
            border-left : 1px solid #fff;
            box-sizing : border-box;
            span:last-child{
                .px2rem(font-size,16);
                display : block;
                width:100%;
                .px2rem(height,40);
                .px2rem(line-height,20);
            }
            span:first-child{
                .px2rem(font-size,36);
                display : block;
                 width:100%;
                .px2rem(height,60);
                .px2rem(line-height,70);
            }
        }
    }
    .shopCar-shade{
        height:100%;
        .px2rem(width,750);
        position : fixed;
        top : 0;
        right : 0;
        background-color : rgba(0, 0, 0, 0.3);
        z-index : 55;
    }
    .shopCar-list{
        .px2rem(width,750);
        background-color : #FFF;
        position : absolute;
        .px2rem(bottom,100);
        left : 0;
        z-index : 66;
        overflow : scroll;
        .shopCar-header{
            .px2rem(width,750);
            .px2rem(font-size,28);
            .px2rem(height,86);
            padding : 0 0.4rem;
            .px2rem(line-height,86);
            border-bottom : 1px solid #DDDDDD;
            color : #666666;
            overflow : hidden;
            .shopCar-title{
                .px2rem(width,110);
                .px2rem(height,30);
                .px2rem(line-height,30);
                text-align : center;
                .px2rem(margin-top,28);
                border-left : 0.106666rem solid #F5A623;
            }
            .shopCar-clean{
                .px2rem(width,50);
                .px2rem(height,40);
                background : url(../../res/images/pop-icon-del.png) center center no-repeat transparent;
                background-size : 0.49333rem 0.52rem;
                margin-top : 0.266rem;
            }
        }
        .shopCar-content{
            max-height : 9.3333rem;
            width : 10rem;
            overflow-y : scroll;
            .goods{
                width: 9.2rem;
                height: 1.52rem;
                line-height: 1.52rem;
                border-bottom : 1px solid #DDDDDD;
                background-color : #fff;
                margin : 0 auto;
                .goodsName{
                     width: 3.733333rem;
                    height: 100%;
                    font-size : 0.45333rem;
                    color : #333;
                    font-weight : 300;
                    max-height : 1.50rem;
                    line-height : 0.7rem;
                    vertical-align : middle;
                    overflow : hidden;
                    display : -webkit-box;
                    -webkit-box-pack : center;
                    -webkit-box-align : start;
                    word-break : break-all;
                    -webkit-line-clamp : 1;
                    -webkit-box-orient : vertical;
                    text-overflow : ellipsis;
                    font-weight : 300;
                }
                .goodsPrice{
                    width: 3.2rem;
                    height: 100%;
                    color : #FF463B;
                    font-size : 0.373rem;
                    text-align : center;
                }
                .goodsNum{
                    width: 2.2666rem;
                    height: 100%;
                    font-size : 0.42666rem;
                    color : #333;
                }
                .goodsDiscount{
                    text-decoration: line-through;
                    font-style: italic;
                    color : #aba6a6;
                }
                .goodsName,.goodsPrice{
                    .text-overflow;
                    text-align : left;
                }
                .goodsUpDown{
                     width: 1rem;
                    height: 100%;
                    background : url(../../res/images/icon-xiala.png) center center no-repeat transparent;
                    background-size : 0.5866rem 0.5866rem;
                }
                .packagesName{
                     width: 4.666666rem;
                    height: 100%;
                    font-size : 0.45333rem;
                    color : #333;
                    font-weight : 300;
                    max-height : 1.50rem;
                }
                .packagesNames{
                    width: auto;
                    height: 100%;
                    max-width : 4rem;
                    color : #333333;
                    text-align : left;
                    .text-overflow;
                }
                .goodsNames{
                    width: 100%;
                    height: 0.9333rem;
                    line-height : 0.9333rem;
                    .text-overflow;
                }
                .tastes{
                    width: 100%;
                    height: 0.56rem;
                    line-height : 0.56rem;
                    font-size : 0.34666rem;
                    color : #999999;
                    .text-overflow;
                }
            }
            .package-goods{
                width: 100%;
                height: auto;
                font-size : 0.34666;
                line-height : 0.533rem;
                padding : 0 0.4rem;
                background-color : #EFEFEF;
                text-align : left;
                // margin-top : -1px;
                color : #333;
                overflow : hidden;
                .package-tag{
                    color : #954442;
                }
                .package-num{
                    text-align : center;
                    width: 1rem;
                    height: 100%;
                }
                .package-name{
                     width: 7.2rem;
                    height: 100%;
                    .text-overflow;
                }
            }
        }
    }
}
</style>