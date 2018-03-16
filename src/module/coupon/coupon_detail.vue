<template>
    <div id="my-coupon">
        <div class="content">
            <div class="content_t">
                <!-- 优惠券类型 -->
                <div class="less" style="background: #00a0ea;" v-if="info.type == 1 || info.type == 2">
                    <h1>减</h1>
                </div>
                <div class="less" style="background: #89b053;" v-if="info.type == 3 || info.type == 4">
                    <h1>折</h1>
                </div>
                <div class="less" style="background: #ca5040;" v-if="info.type == 5 ">
                    <h1>赠</h1>
                </div>
                <div class="less" style="background: #ebca0b;" v-if="info.type == 6 ">
                    <h1>代</h1>
                </div>
                <div class="qrcode" v-if = 'couponState'>
                    <img src="../../res/icon/erwweima.png" v-if="currentTime > info.endTime || info.status == 1" />
                    <img src="../../res/icon/erwweima.png" v-else  @click = "isCode()" />
                </div> 
                <div class="qrcode" v-if = 'codeState'>
                    <img src="../../res/icon/6_03.png" @click = "isCode()" />
                </div>
                <!-- 优惠券名称 -->
                <div class="name" style = "font-size: 0.4rem;" v-if = "info.couponName.length <= 15">
                    {{info.couponName}}
                </div>
                <div class="name" style = "font-size: 0.32rem;" v-if = "info.couponName.length >= 15 && info.couponName.length <= 36">
                    {{info.couponName}}
                </div>
                <div class="name" style = "font-size: 0.27rem;" v-if = "info.couponName.length >= 36 && info.couponName.length <= 60">
                    {{info.couponName}}
                </div>
                <!-- 优惠券类型 -->
                <div class="amount" v-if="info.type == 1 || info.type == 2 || info.type == 6">
                    <span>¥&nbsp;</span><h1>{{getRate(info)}}</h1>
                </div>
                <div class="amount" v-if="info.type == 3 || info.type == 4">
                    <h1>{{getRate(info)}}</h1>
                </div>
                <div class="amount" v-if="info.type == 5 && dishes.length <= 15">
                    <h1 style="font-size: 0.4rem;">{{dishes}}</h1>
                </div>
                <div class="amount"  v-if="info.type == 5 && dishes.length >= 15 && dishes.length <= 36">
                    <h1 style="font-size: 0.32rem;">{{dishes}}</h1>
                </div>
                <div class="amount"  v-if="info.type == 5 && dishes.length >= 36 && dishes.length <= 60">
                    <h1 style="font-size: 0.37rem;">{{dishes}}</h1>
                </div>
                <!-- 优惠券类型 -->
                <div class="coupon" v-if="info.type == 1 || info.type == 2">
                    满减优惠券
                </div>
                <div class="coupon" v-if="info.type == 3 || info.type == 4">
                    折扣优惠券
                </div>
                <div class="coupon" v-if="info.type == 5">
                    赠菜优惠券
                </div>
                <div class="coupon" v-if="info.type == 6">
                    代金券
                </div>
            </div>
            <div class="content_b" v-if = 'couponState'>
                <div class="immediate">
                    <a href="javascript:;" style="background: #999;" v-if = "currentTime > info.endTime">已过期</a>
                    <a href="javascript:;" style="background: #999;" v-if = "info.status == 1">已使用</a>
                    <a href="javascript:;" v-if= "info.status == 0 && currentTime < info.endTime " @click = "isCode()" :style = "bgStyle" >立即使用</a>
                    <div class="semicircle" style="left: -0.13rem;"></div>
                    <div class="semicircle" style="right: -0.13rem;"></div>
                </div>
                <div class="rlues clearfix">
                    <ul>
                        <li v-if="info.lowestConsume == 0 && (info.type == 1 || info.type == 2)">任意金额可用，最高减免{{getRate(info)}}元</li>
                        <li v-if="info.lowestConsume == 0 && (info.type == 3 || info.type == 4)">任意金额可用，最高折扣{{getRate(info)}}</li>
                        <li v-if="info.lowestConsume == 0 && info.type == 5">
                        <li v-if="info.lowestConsume == 0 && (info.type == 6)">任意金额可用，最高抵扣{{getRate(info)}}元</li>    
                        任意金额可用，赠送{{dishes}}</li>
                        <li v-if="info.lowestConsume != 0 && (info.type == 1 || info.type == 2)">支付金额满{{info.lowestConsume}}可用，最高减免{{getRate(info)}}元</li>
                        <li v-if="info.lowestConsume != 0 && (info.type == 3 || info.type == 4)">支付金额满{{info.lowestConsume}}可用，最高折扣{{getRate(info)}}</li>
                        <li v-if="info.lowestConsume != 0 && info.type == 5">
                        支付金额满{{info.lowestConsume}}可用，赠送{{dishes}}</li>
                        <li>本券仅限{{storename}}使用</li>
                        <li>有效期{{transformTime(info.startTime)}}至{{transformTime(info.endTime)}}</li>
                    </ul>
                    <div class="semicircle" style="left: -0.13rem;"></div>
                    <div class="semicircle" style="right: -0.13rem;"></div>
                </div>
                <div class="instructions" >
                    <h1>使用时段</h1>
                    <section v-if="info.useTime">
                        <span  v-for="(item,index) in lists" :key='index'>
                            {{item.name}}
                        </span>
                    </section>
                    <span v-if = "info.annotation != ''">备注:{{info.annotation}}</span>
                    <span v-else>备注:无</span>
                    <span v-if = "info.useKnow != ''">使用须知:{{info.useKnow}}</span>
                    <span v-else>使用须知:无</span>
                </div>
            </div>
            <div class="content_code" v-if = 'codeState'>
                <div class="coder">
                    <img :src="imgUrl + info.code" />
                    <p style="font-size: 0.4rem;">{{info.code}}</p>
                </div>
                <p>请出示上方二维码即可享受优惠</p>
            </div> 
        </div>  
    </div>
</template>
<script type="text/javascript">
import storage from "src/verdor/storage";
import utils from "src/verdor/utils";
import http from "src/manager/http";
import global from "src/manager/global";


export default {
    data() {
        return {
            codeState: false, //是否显示二维码
            couponState: true, //状态
            token: "",
            info: {
                shopId: "",
                vipId: "",
                code: "",
                couponId: "",
                activityId: "",
                couponName: "",
                startTime: "",
                endTime: "",
                status: "",
                type: "",
                gids: "",
                pids: "",
                param: "",
                useTime: "",
                lowestConsume: "",
                highestConsume: "",
                annotation: "",
                useKnow: "",
                lists: []
            },
            dishes: '', //赠菜优惠券赠送的菜品
            storename: '', //优惠券限用的店铺名称
            currentTime: Date.parse(new Date()) / 1000, //当前的时间
            imgUrl: '', //二维码地址
            "bgStyle": {
                'background': '#00a0ea'
            }
        }
    },
    methods: {
        isCode: function() { //显示二维码的状态
            this.codeState = !this.codeState;
            this.couponState = !this.couponState;
            this.getClass();

        },
        //把时间戳转化成***年**月**日
        transformTime: function(time) {
            return utils.format(new Date(Number(time) * 1000), 'yyyy-MM-dd');
        },
        getClass: function() { //根据优惠券的类型不一样改变按钮的颜色
            var num = this.info.type;
            if (num == 3 || num == 4) {
                this.bgStyle = {
                    'background': '#89b053'
                }
            } else if (num == 5) {
                this.bgStyle = {
                    'background': '#ca5040'
                }
            }

        },
        getRate: function(c) { //减免金额与折扣的转换
            if (c.type == 3 || c.type == 4) {
                var num = (c.param - 0) / 10;
                num += "折";
                return num;
            } else {
                return parseInt(c.param);
            }
        },
        async getParticulars() {
            let data = await http.getGoodsInfoByCouponId({
                data: { //获取优惠券
                    couponId: this.info.couponId,
                    shopId: this.info.shopId
                }
            }, false, true);
            this.dishes = data.data.goods;
            this.storename = data.data.shopName;
        },
        getUseTime: function() {
            
            var useTime = this.info.useTime;
            var info = "";
            var arr1 = []; //展示使用时段的数组
            if (useTime.type == "week") { //星期                  
                info += "";
            } else { //月份
                info += "每月";
            }
            var arr, val1, val2;
            if (!useTime.list) { //如果没有时间段就是无限制
                arr1.push({
                    name: '无限制'
                });
                info = '';
            } else {
                for (var i = 0; i < useTime.list.length; i++) {
                    //将week转换为string格式然后再进行分割
                    arr = String(useTime.list[i].week).split(',');
                    arr = arr.sort(function(a, b) {
                        return a - b;
                    })
                    info += this.getDate(arr);
                    info += " ";
                    //判断isNextDay是否为undefined，如果是则进行强制转换
                    //转换结果：当isNextDay是undefined时，转换为false，再进行判断
                    if (useTime.list[i].isNextDay == undefined) {
                        useTime.list[i].isNextDay = Boolean(useTime.list[i].isNextDay);
                    }
                    info += useTime.list[i].startslot;
                    info += "-";
                    (useTime.list[i].isNextDay == false) ? info += "次日" + useTime.list[i].endslot: info += useTime.list[i].endslot;
                    //解析数据，逐条显示
                    arr1.push({
                        name: info
                    });
                    //数据解析出来每次push之后都要清空一次
                    info = '';
                }
            }
            this.lists = utils.deepCopy(arr1);
            return info;
        },
        getDate: function(arr) {
            var res = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            var str = "";

            function findItem(item, arr) {
                var index = arr.indexOf(item);
                for (var i = index; i < arr.length; i++) {
                    if (arr[i + 1] - arr[i] != 1) {
                        var rs = "";
                        if (arr[i] - item == 0) {
                            rs = res[arr[i]];
                        } else if (arr[i] - item == 1) {
                            rs = res[item] + "," + res[arr[i]];
                        } else {
                            rs = res[item] + "到" + res[arr[i]];
                        }
                        if (i < arr.length - 1) {
                            rs += ","
                        }
                        return rs;
                    }
                }
            }
            for (var j = 0; j < arr.length; j++) {
                if (arr[j] - arr[j - 1] != 1) {
                    str += findItem(arr[j], arr)
                }
            }
            return str;
        }
    },
    mounted() {
        this.info = storage.session("couponDetail");
        this.token = storage.session("token");
        this.imgUrl = global.host + 'common/qrcode?&size=30&margin=1&text=';
        this.getUseTime();
        this.getClass();
        this.getParticulars();
        
        utils.setTitle("优惠券详情");

    }
} 
</script>
        <style type="text/css" scoped>
        #my-coupon{
            width: 100%;
            font-family:黑体;
            padding-top: 1.61rem;
            background: url('../../../src/res/images/saoma-bg.jpg') repeat;
            padding-bottom: 0.5rem;
            min-height: 100%;
        }
        #my-coupon .content{
            width: 9.44rem;
            height: auto;
            min-height: 13rem;
            border-radius: 0.1rem;
            background: #fff;
            margin: 0 auto;
        }
        #my-coupon .content .content_t{
            width: 100%;
            height: auto;
            padding-top: 0.29rem;
            position: relative;
        }
        #my-coupon .content .content_t .less{
            width: 1.86rem;
            height: 1.86rem;
            border-radius: 100%;
            text-align: center;
            line-height: 1.86rem;
            position: absolute;
            top: -0.93rem;
            left: 3.79rem;
        }
        #my-coupon .content .content_t .less h1{
            font-size: 0.8rem;
            color: #fff;
            font-weight: bold;
        }
        #my-coupon .content .content_t .qrcode{
            width: 100%;
            height: 0.69rem;
            margin-bottom: 0.26rem;
        }
        #my-coupon .content .content_t .qrcode img{
            width: 0.69rem;
            height: 0.69rem;
            margin-right: 0.35rem;
            float: right;
        }
        #my-coupon .content .content_t .name{
            width: 100%;
            height: auto;
            text-align: center;
            line-height: 0.4rem;
            font-size: 0.4rem;
            color: #797979;
            margin-bottom: 0.35rem;
        }
        #my-coupon .content .content_t .amount{
            width: 100%;
            height: auto;
            text-align: center;
            /* line-height: 0.7rem; */
            color: #000;
            margin-bottom: 0.22rem;
        }
        #my-coupon .content .content_t .amount span{
            font-size: 0.4rem;
            font-weight: bold;
        }
        #my-coupon .content .content_t .amount h1{
            font-size: 0.96rem;
            display: inline-block;
        }
        #my-coupon .content .content_t .coupon{
            width: 100%;
            height: auto;
            min-height: 0.45rem;
            text-align: center;
            line-height: 0.45rem;
            font-size: 0.48rem;
            color: #000;
        }
        #my-coupon .content .content_b{
            width: 100%;
            height: auto;
            min-height: 9rem;
            overflow: hidden;
        }
        #my-coupon .content .content_b .immediate{
            width: 100%;
            height: 2.37rem;
            border-bottom: 0.05rem dashed #d1d1d1;
            position: relative;
            text-align: center;
        }
        #my-coupon .content .content_b .immediate a{
            display: inline-block;
            width: 4.42rem;
            height: 1.26rem;
            border-radius: 0.1rem;
            text-align: center;
            line-height: 1.26rem;
            font-size: 0.48rem;
            color: #fff;
            margin-top: 0.52rem;
            text-decoration: none;
        }
        #my-coupon .content .content_b .semicircle{
            width: 0.26rem;
            height: 0.26rem;
            background: #1a1714;
            border-radius: 100%;
            position: absolute;
            bottom: -0.13rem;
        }
        #my-coupon .content .content_b .rlues{
            width: 100%;
            height: auto;
            clear: both;
            border-bottom: 0.05rem dashed #d1d1d1;
            position: relative;
        }
        #my-coupon .content .content_b .rlues ul{
            margin: 0.8rem 0 0.66rem 0.8rem;
            color: #494949;
        }
        #my-coupon .content .content_b .rlues ul li{
            margin-bottom: 0.26rem;
            list-style: disc;
            list-style-position: outside;
            font-size: 0.32rem;
        }
        #my-coupon .content .content_b .instructions{
            width: auto;
            height: auto;
            margin: 0.61rem 0.85rem 0.85rem 0.85rem; 
        }
        #my-coupon .content .content_b .instructions h1{
            font-size: 0.4rem;
            font-weight: bold;
            margin-bottom: 0.36rem;
        }
        #my-coupon .content .content_b .instructions span{
            display: block;
            font-size: 0.32rem;
            color: #828282;
        }
        #my-coupon .content .content_code{
            width: 100%;
            height: auto;
            min-height: 9rem;
            text-align: center;
            overflow: hidden;
        }
        #my-coupon .content .content_code .coder{
            width: 5.25rem;
            height: 5.25rem;
            margin: 0 auto;
            margin-top: 1rem;
            margin-bottom: 0.8rem;
        }
        #my-coupon .content .content_code .coder img{
            width: 100% ;
            height: 100%;
        }
        #my-coupon .content .content_code  p{
            font-size: 0.32rem;
            color: #8a8a8a;
        }
        </style>