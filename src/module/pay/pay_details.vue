<template>
    <div class="pay-details" id="paydetails" style="padding: 0;">
    <!--<div class="pay-title">
        <span class="fl previousPage" v-if="isPay"></span>订单详情
    </div>-->
    <div class="pay-subhead">
        <div class="pay-tit">基本信息</div>
    </div>
    <div class="pay-concent">
        <div class="pay-box">
            <div class="pay-shouBox">
                <span class="fl" style="width: 30%;">姓名</span>
                <input type="text" value="姓名" style="width: 70%;" readonly="readonly" v-model="name" />
            </div>
        </div>
        <div class="pay-box" >
            <div class="pay-shouBox">
                <span class="fl" style="width: 30%;">手机号</span>
                <input type="text"  style="width: 70%;" readonly="readonly" v-model="phone" />
            </div>
        </div>
        <div class="pay-box" v-if="types == '1'">
            <div class="pay-shouBox">
                <span class="fl" style="width: 30%;">桌台号</span>
                <input type="text"  style="width: 70%;" readonly="readonly" v-model="tableName" />
            </div>
        </div>
        <div class="pay-box">
            <div class="pay-shouBox">
                <span class="fl" style="width: 30%;">备注</span>
                <input type="text"  style="width: 70%;" readonly="readonly" v-model="remark" />
            </div>
        </div>
        <div class="pay-box">
            <div class="pay-shouBox">
                <span class="fl" style="width: 30%;">发票抬头</span>
                <input type="text"  style="width: 70%;" readonly="readonly" v-model="involicHeader" />
            </div>
        </div>
        <!--地址信息-->
         <div class="pay-box" >
            <div class="pay-shouBox">
                <span class="fl" style="width: 30%;">地址</span>
                <input type="text"  style="width: 70%;" readonly="readonly" v-model="address" />
            </div>
        </div>
    </div>
    <div class="pay-concent">
        <div class="pay-subhead">
            <div class="pay-sub fl">商品详情</div>
            <div class="pay-sum fl">￥{{price}}</div>
        </div>
        <div class="pay-list" v-for="(goods,i) in goodsList" :key="i">
            <goods-list :goods="goods" :isMember="Boolean(memberInfo)" :memberDiscount="discount"></goods-list>
        </div>
        <package-list v-for="(packages,index) in packagesList" :packages="packages" :key="index+'_'" :isMember="Boolean(memberInfo)" :memberDiscount="discount"></package-list>
        <div class="pay-list" style="height: auto;" v-if="types == '2' || types == '4'">
            <div class="pay-goods">
                <div class="pay-name fl">
                	<template v-if="types == '2'">
                		配送费
                	</template>
                	<template v-if="types == '4'">
                		快递费
                	</template>
                </div>
                <div class="pay-num fl"></div>
                <div class="pay-sum fl">￥{{moveFee}}</div>
            </div>
        </div>
    </div>
    <div class="pay-concent" v-if="usedPoInt >= 1 || couponTypeName">
            <div class="pay-subhead">
                <div class="pay-sub fl">优惠方式</div>
            </div>
            <div class="pay-list">
                <div class="pay-goods coupon" v-if="couponTypeName">
                    <span class="fl">优惠券</span>
                    <div class="fr" style="width:1.2rem">
                        <div  style="color: #ff5d42;text-indent: 0;" v-if="couponTypeName">{{couponTypeName}}</div>
                        <div class="fl" v-else>未使用优惠券</div>                        
                    </div>
                </div>
                <div class="pay-goods" v-if="usedPoInt >= 1" style="border-top: 1px solid #ddd">
                    <div class="pay-integral fl">
                       <span class="fl integral-icon"></span>
                       <span class="fl">积分抵扣</span>
                       <span class="fl integral-explain">(已使用{{usedPoInt}}积分，抵扣{{pointCash}})元</span>
                       <span class="fl integral-tip" @click="isOpenColseWin('open')"></span>
                    </div>
                    <div class="pay-integral fl" style="width: 15%;">
                        <span v-bind:class="[isIntegral ? 'integral-on' : 'integral-off']" @click="isUsingIntegral"></span>
                    </div>
                </div>
            </div>
    </div>
    <!--<a href="javascript:void(0)" class="pay-btn" @click="isPays" v-if="isPay == false">立即支付￥{{price}}</a>-->
    <div class="pay-bottom" v-if="isPay == false">
    	<span class="fl">待支付&nbsp;￥{{price}}</span>
    	<!--<span class="fl preferential">|&nbsp;优惠&nbsp;￥34</span>-->
    	<a href="javascript:void(0)" class="fr pay-btn" @click="isPays">去支付</a>
    </div>
    <div class="payWin" v-if="isPayWin">
        <div class="payTip">
            <div class="payConcent">
                <div class="payTit">支付规则</div>
                <div class="payBox">
                    <ul>
                        <li v-for="(item,index) in customContentList" :key="index">{{item.content}}</li>
                        <li>等待时间约{{startTime}}~{{endTime}}分钟</li>
                    </ul>
                </div>
            </div>
            <div class="payFooter">
                <a href="javascript:void(0)" class="cancel" @click="winHandle()">取消</a>
                <a href="javascript:void(0)" class="confirm" @click="winHandle('confirm')">确认支付</a>
            </div>
        </div>
    </div>
    <div class="integralWin" v-if="isIntegralWin">
        <div class="integral-box">
            <div class="integral-header">积分使用规则</div>
            <div class="integral-content">
                <ul>
                    <li>积分抵扣比例为{{integralConfig.point}}:{{integralConfig.pointCash}}</li>
                    <li v-if="integralConfig.maxRule == '1' || integralConfig.maxRule == '2'">积分抵扣最多为订单金额{{integralConfig.pointCash}}%</li>
                    <li v-if="integralConfig.maxRule == '3' && point >= integralConfig.point ">积分抵扣最多为{{maxPoint / integralConfig.point * integralConfig.pointCash}}元</li>
                    <li v-if="point >= integralConfig.point ">最多可使用积分{{maxPoint}}</li>
                    <li v-if="integralConfig.pointUseRule != '2' && integralConfig.pointUseRule != '0'">人均消费满{{consumeConfig.averageConsum}}元可使用</li>
                    <li v-if="integralConfig.pointUseRule != '1' && integralConfig.pointUseRule != '0'">总消费满{{consumeConfig.totalConsum}}元可使用</li>
                </ul>
            </div>
            <div class="integral-footer" @click="isOpenColseWin">关闭</div>
        </div>
    </div>
</div>
</template>

<script>
    import utils from "src/verdor/utils";
    import storage from "src/verdor/storage";
    import http from "src/manager/http";

    var payType = utils.getQueryString('payType');
        var code = utils.getQueryString('code')||'test';
        
    export default{
        data(){
            return{
                oid: '',
				shopId: '',
				token: '',
				name: '',
				phone: '',
				price: '',
				tableName: '',
				remark: '',
				involicHeader: '',
				address:'',
				fid: '',
				goodsList: [], //商品列表
				goods : [], //详情商品
				packagesList: [], //套餐列表
				isPay: false,
				tableId: '',
				goodsInfo: {},
				openId: '',
				isPayWin: false,
				isIntegralWin : false, //是否打开规则弹窗
                integralConfig : {}, //积分规则配置
                isIntegral : true, //是否使用积分
                point : '', //已有积分
                maxPoint : '', //最大可使用积分
                points : '', //使用积分
                consumeConfig : {}, //消费配置
                userExp : '', //可使用积分
                totalPrice : '',//订单总价
                realPrice : '', //订单实际价格
                usedPoInt : '', //已使用积分
                pointCash : '', //积分抵扣金额
                orderStatus : '', //订单状态
                status : '', //是否开启广场模式 默认为0 1为开启
                SquareConfig : {}, //广场模式配置
                isName : false, //是否可输入姓名 
                isPhone : false , //是否可输入手机号
                isAddress : false,//是否可输入地址信息
                isInvolicHeader : false, //是否可输入发票抬头
                startTime : '',//开始时间
                endTime : '', //结束时间
                customContentList : [], //支付规则数组
                getTime : '', // 自取时间
                itin : '', // 税号
                paymentName :  '', // 支付方式名称
                types : '', // 模式类型
                typeId : '', // 结账类型id
                moveFee : '', // 运费 or 快递费
                couponTypeName : '', // 使用优惠券类型金额
                couponInfo : {}, // 使用的优惠券信息
                priceInfo : '',
                memberInfo : null, // 自助模式取memberInfo，微信点餐取wechatShop  
                discount : null, // 获取会员等级折扣 
            }
        },
        computed: {
            phones: {
                get: function() {
                    return this.phone;
                },
                set: function(newValue) {
                    this.phone = newValue.replace(intReg, '');
                    if(this.phone.length > 11){
                        this.phone = this.phone.substring(0,11);
                    }
                }
            },
            pointss: {
                get: function() {
                    return this.points;
                },
                set: function(newValue) {
                    this.points = String(this.points);
                    this.points = (this.points > this.maxPoint) ? this.maxPoint : this.points;
                }
            }
        },
        methods: {
            async showWctDetail() {
                let data = await http.showOrderDetailPost({data:{
                    oid: this.oid,
                    shopId: this.shopId,
                    merchId:storage.session("select-shop").merchId
                }});
                this.name = data.name;
                this.phone = data.phone;
                this.price = data.price;
                this.totalPrice = data.price;
                this.tableName = data.tableName;
                this.remark = data.remark;
                this.involicHeader = data.invoiceHeader;
                this.address = data.address;
                this.fid = data.fid;
                this.goodsList = data.goodsData.goods;
                this.tableId = data.tableId;
                this.goodsInfo = utils.deepCopy(data.goodsData);
                this.packagesList = data.goodsData.package;
                this.realPrice = data.originalPrice;
                this.isIntegral = this.isPay;
                this.usedPoInt = data.point;
                this.pointCash = data.pointCash;
                this.getTime  = data.getTime;
                this.itin  = data.itin;
                this.types  = data.type;
                this.paymentName  = data.paymentName;
                this.typeId = data.typeId;
                this.moveFee = data.moveFee;
                this.couponInfo = data.couponInfo;
                this.priceInfo = data.priceInfo;

                if(this.couponInfo){
                    let couponCash = data.priceInfo ? data.priceInfo.couponCash : 0;
                    this.couponTypeName = this.getCouponType(couponCash,data.couponInfo);
                }
                        
                var arr = utils.deepCopy(this.goodsList);
                if(!utils.isEmptyObject(this.goodsList)) {
                    for(var i = 0; i < arr.length; i++) {
                        if(arr[i].attr) {
                            for(var j = 0; j < arr[i].attr.length; j++) {
                                if(arr[i].attr[j].name) {
                                    for(var k = 0; k < arr[i].attr[j].name.length; k++) {
                                        arr[i].attr[j].attrPrice = [];
                                        arr[i].attr[j].attrPrice.push(arr[i].attr[j].name[k].split(':'));
                                        arr[i].attr[j].name[k] = String(arr[i].attr[j].name[k].replace(':', '￥'));
                                    }
                                }

                            }
                        }
                    }
                }
                
                this.getPointConfig();
                this.getSquareConfig();
                    
            },
            getCouponType: function (couponDiscount, couponDetail) {
                var param;
                if (couponDetail.type == '1' || couponDetail.type == '2') {
                    param = '-' + '￥' + couponDiscount;
                } else if (couponDetail.type == '3' && couponDetail.odid) {
                    param = this.getGoodsName(couponDetail.odid, '1') + (parseFloat(couponDetail.param) / 10) + '折';
                } else if (couponDetail.type == '4') {
                    param = (parseFloat(couponDetail.param) / 10) + '折';
                } else {
                    param = '赠' + '' + '';
                    if (couponDetail.gids) {
                        param = param + this.getGoodsName(couponDetail.gids);
                    } else {
                        param = param + this.getGoodsName(couponDetail.pids);
                    }
                }
                return param;
            },
            getGoodsName: function (id, type) {
                /*
                    * type为1则为优惠券单品折扣
                    */

                // 获取赠菜商品名
                var goods = this.goodsList.concat(this.packagesList);
                for (var i = 0; i < goods.length; i++) {
                    if (goods[i].gid == id) {
                        return goods[i].goodsName;
                    }
                    if (goods[i].packageId == id) {
                        return goods[i].packageName;
                    }

                    if (type == '1' && goods[i].odid == id) {
                        if (goods[i].goodsName) {
                            return goods[i].goodsName;
                        } else {
                            return goods[i].packageName;
                        }
                    }
                }
            },
            isPays: function() {
                this.isPayWin = true;
            },
            winHandle: function(type) {
                if(type == 'confirm') {
                    this.getInfo();
                    this.isPayWin = false;
                } else {
                    this.isPayWin = false;
                }
            },
            async getInfo() {
                payType = (this.paymentName == '会员支付') ? '5' : payType;
                
                let data = await http.wechatFastPay({
                    data:{
                        openId: this.openId,
                        oid: this.oid,
                        name: this.name,
                        tableName: this.tableName,
                        phone: this.phone,
                        remark: this.remark,
                        invoiceHeader: this.involicHeader,
                        address: this.address,
                        tableId: this.tableId,
                        data: JSON.stringify(this.goodsInfo),
                        shopId: this.shopId,
                        payType: payType,
                        point : this.usedPoInt,
                        getTime : this.getTime, // 自取时间
                        itin : this.itin, // 税号
                        paymentName :  this.paymentName, // 支付方式名称
                        id : this.typeId, // 模式类型
                        code : this.couponInfo ? this.couponInfo.code : '',
                        couponType : this.couponInfo ?  this.couponInfo.type : '',
                        couponId :this.couponInfo ?  this.couponInfo.id : '',
                        originalPrice : this.priceInfo ? this.priceInfo.originalPrice : this.price + (this.usedPoInt / this.integralConfig.point * this.integralConfig.pointCash)
                    }
                })

                if(data.pay && payType == '5'){
                    this.$store.commit("setWin",{content:"支付成功",callback:()=>{
                            WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
                    }})
                
                }else if(data.pay && typeof data.jsonData == 'object'){
                    this.data = data.jsonData;
                    this.oid = data.oid;
                    this.callpay();
                }else if(data.pay && data.jsonData == '' && payType == 'wx' || payType == 'zx'){
                    this.$store.commit("setWin",{content:"支付成功",callback:()=>{
                            WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
                    }})
                }
                
            },
            jsApiCall: function() {
                setTimeout(() => {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        this.data,
                        (res) => {
                            if(res.err_msg == "get_brand_wcpay_request:ok") {
                                //关闭微信游览器
                                WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
                            }
                        }
                    );
                }, 1000);
            },
            callpay: function() {
                if(typeof WeixinJSBridge == "undefined") {
                    if(document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
                    } else if(document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
                        document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
                    }
                } else {
                    this.jsApiCall();
                }
            },
            async getOpenId() {
                let data = await http.getOpenId({data:{
                    code: code,
                    shopId: this.shopId,
                    payType: payType,
                }});
                this.openId = data;
                storage.session('openIds',data);
                
            },
            isOpenColseWin : function(type){
                // 关闭 and 打开积分规则弹窗
                if(type == 'open'){
                    this.isIntegralWin = true;
                }else{
                    this.isIntegralWin = false;
                }
            },
            isUsingIntegral : function(){
                //是否使用积分
                if(!Boolean(Number(this.point)) || this.isIntegral){
                    return false;
                }
                this.isIntegral = !this.isIntegral;
                this.points = this.isIntegral ? this.points : '';
                if(this.integralConfig.useMode == '1'){
                    this.points = this.isIntegral ? this.maxPoint : '';
                }else{
                    this.points = this.isIntegral ? this.points : '';
                }
            },
            async getPointConfig(){
                // 获取积分规则配置
                let data = await http.getPointConfig({data:{
                    shopId : this.shopId,
                    fid : this.fid,
                    price : Number(this.realPrice) - Number(this.moveFee)
                }})
                if(!data){return false};
                this.integralConfig = data.pointConfig;
                this.consumeConfig = data.userData;
                this.point = data.userData.point;
                this.maxPoint = data.userData.pointLimit;
                this.isIntegral = Boolean(Number(this.integralConfig.useMode));
                this.isIntegral = true;
                if(this.isIntegral){
                    this.points = this.maxPoint;
                }
            },
            async getSquareConfig(){

                // 广场模式配置
                let data = await http.getSelfHelpConfig({data:{
                    shopId : this.shopId,
                    type : this.typeId
                }});
                storage.session('squareConfig',data);
                if(storage.session('squareConfig')){

                    this.SquareConfig = data;
                    // 分割字符串 获取配置
                    var arr = this.SquareConfig.fillContent.split('');
                        this.isName = arr.indexOf('1') >= 0 ? true : false;
                        this.isPhone = arr.indexOf('2') >= 0 ? true : false;
                        this.isInvolicHeader = arr.indexOf('3') >= 0 ? true : false;
                        this.isAddress = arr.indexOf('4') >= 0 ? true : false;
                        
                    //获取配置时间
                    if(this.SquareConfig.readyMealTime != ''){
                        //  var dateTime = this.SquareConfig.waitTime.split(',');
                        this.startTime = '0';
                        this.endTime = this.SquareConfig.readyMealTime;
                    }else{
                        this.startTime = '0';
                        this.endTime = '15';
                    }
                    
                    if(Boolean(this.SquareConfig.customContent)){
                        var customContent = this.SquareConfig.customContent.split('!#!');
                        for(var i=0;i<customContent.length;i++){
                            this.customContentList.push({
                                'content' : customContent[i]
                            });
                        }
                    }
                }

            },
            async getUserInfo(){
                // 获取会员信息
                let user = await http.getUserInfo({data:{
                    shopId : this.shopId,
                    type : 1,
                    from : 0
                }});

                storage.session("memberInfo",user);


                this.memberInfo = storage.session("select-shop") ? storage.session("memberInfo") : storage.session("wechatShop");
                this.discount = this.memberInfo.member.level ? this.memberInfo.member.level.discount : 1;
            }
        },
        mounted(){
            var payInfo = storage.session('payOrder');
            var userDate = storage.session('select-shop');
            this.shopId = utils.getQueryString('shopId')
            this.fid = userDate.mid;

            this.getUserInfo();

            if(payInfo) {
                this.oid = payInfo.oid;
                this.shopId = payInfo.shopId;
                this.isPay = payInfo.status == '4' || payInfo.status == '-2' ? true : false;
                this.orderStatus = payInfo.status;
                if(payInfo.status == '9' && storage.session('openIds') == null) {
                    this.getOpenId();
                }else{
                    this.openId = storage.session('openIds');
                }
            }
            
            if(storage.session('oids')){
                this.oid = storage.session('oids');
                if(this.openId == '' && !payInfo){
                    this.getOpenId();
                }
            }
            this.showWctDetail();
            utils.setTitle('订单详情');

        },
        beforeDestroy(){
            storage.session('payOrder', '');
        },
        components: {
            'goods-list': () => import (/* webpackChunkName: "goods_list"*/ 'src/module/bespeak_system/bes_detail/goods_list'),
            'package-list': () => import (/* webpackChunkName: "package_list"*/ 'src/module/bespeak_system/bes_detail/package_list'),
        }
    }

</script>

<style>

    .pay-details {
    width: 100%;
    height: auto;
    position: relative;
    padding-bottom: 1.25333rem;
    font-family: "微软雅黑"
}

.pay-details .pay-title {
    width: 100%;
    height: 1.25333rem;
    line-height: 1.25333rem;
    text-indent: -0.93333rem;
    text-align: center;
    font-size: 0.42667rem;
    color: #999999;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 5;
    background-color: #f7f7f7;
    border-bottom: 1px solid #dddddd
}

.pay-details .pay-title span {
    display: block;
    width: 0.93333rem;
    height: 1.25333rem;
    text-indent: 0
}

.pay-details .pay-concent {
    width: 100%;
    height: auto;
    background-color: #ffffff;
    margin-bottom: 0.2rem;
    overflow: hidden
}

.pay-details .pay-concent .pay-box {
    width: 100%;
    height: 1.25333rem;
    line-height: 1.25333rem;
    position: relative
}

.pay-details .pay-concent .pay-box .pay-shouBox {
    width: calc(100% - 15px);
    height: 1.25333rem;
    margin-left: 0.4rem;
    font-size: 0;
    border-bottom: 1px solid #dddddd;
    box-sizing: border-box
}

.pay-details .pay-concent .pay-box .pay-shouBox span {
    width: 30%;
    height: 1.25333rem;
    font-size: 0.34667rem;
    color: #333333
}

.pay-details .pay-concent .pay-box .pay-shouBox span.more-Tbale {
    position: absolute;
    right: 0.93333rem;
    top: 0.45333rem;
    width: 0.21333rem;
    height: 0.33333rem;
    background: url(../../res/images/moretable.png) no-repeat;
    background-size: 0.21333rem 0.33333rem
}

.pay-details .pay-concent .pay-box .pay-shouBox input {
    outline: none;
    border: none;
    padding: 0;
    width: 70%;
    height: 1.17333rem;
    font-size: 0.34667rem !important;
    color: #999999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box
}

.pay-details .pay-concent .pay-box .pay-shouBox .inputWidth {
    width: calc(100% - 3.26667rem);
    height: 1.17333rem
}

.pay-details .pay-concent .pay-box .pay-shouBox div {
    width: calc(50% - 30px);
    height: 1.13333rem;
    line-height: 1.13333rem;
    font-size: 0.32rem !important;
    color: #999999;
    float: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
}

.pay-details .pay-subhead {
    width: 100%;
    height: 1.25333rem;
    line-height: 1.25333rem;
    text-indent: 0.4rem;
    border-bottom: 1px solid #DDDDDD
}

.pay-details .pay-subhead .pay-sub {
    width: 60%;
    height: 1.25333rem;
    font-size: 0.42667rem;
    position: relative
}

.pay-details .pay-subhead .pay-sub:after {
    content: '';
    display: block;
    width: 0.08rem;
    height: 0.37333rem;
    background-color: #6ba9f1;
    position: absolute;
    left: 0.24rem;
    top: 0.42667rem
}

.pay-details .pay-subhead .pay-tit {
    width: 100%;
    height: 1.25333rem;
    font-size: 0.42667rem;
    background-color: #FFFFFF;
    position: relative
}

.pay-details .pay-subhead .pay-tit:after {
    content: '';
    display: block;
    width: 0.08rem;
    height: 0.37333rem;
    background-color: #f5a623;
    position: absolute;
    left: 0.24rem;
    top: 0.42667rem
}

.pay-details .pay-subhead .pay-sum {
    width: 40%;
    height: 1.25333rem;
    color: #d0021b;
    font-size: 0.37333rem;
    padding-right: 0.4rem;
    box-sizing: border-box;
    text-align: right
}

.pay-details .pay-list {
    width: calc(100%);
    height: 1.25333rem;
    line-height: 1.25333rem;
    color: #666
}

.pay-details .pay-list .pay-name {
    font-size: 0.37333rem;
    color: #333333;
    width: 65%;
    height: 1.25333rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden
}

.pay-details .pay-list .pay-num {
    font-size: 0.37333rem;
    color: #bbbbbb;
    width: 15%;
    height: 1.25333rem;
    text-align: center
}

.pay-details .pay-list .pay-sum {
    font-size: 0.37333rem;
    color: #333333;
    width: 20%;
    height: 1.25333rem;
    padding-right: 0.4rem;
    box-sizing: border-box;
    text-align: right
}

.pay-details .pay-list .pay-package {
    width: 100%;
    height: auto;
    line-height: 0.6rem;
    background-color: #efefef;
    text-indent: 0.4rem;
    overflow: hidden
}

.pay-details .pay-list .pay-package .package-goods {
    width: 100%;
    height: auto;
    background-color: #efefef
}

.pay-details .pay-list .pay-package .package-goods .pay-goodsName {
    color: #333333;
    font-size: 0.34667rem;
    width: 80%;
    height: 0.6rem
}

.pay-details .pay-list .pay-package .package-goods .pay-goodsNum {
    color: #333333;
    font-size: 0.34667rem;
    text-align: right;
    padding-right: 0.4rem;
    box-sizing: border-box;
    width: 20%;
    height: 0.6rem
}

.pay-details .pay-list .pay-integral {
    width: 85%;
    height: 1.25333rem;
    color: #333333;
    font-size: 0.37333rem;
    text-indent: 0.13333rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden
}

.pay-details .pay-list .integral-explain {
    display: block;
    width: auto;
    height: 100%;
    font-size: 0.32rem;
    color: #999999
}

.pay-details .pay-list .integral-tip {
    display: block;
    margin-left: 0.06667rem;
    width: 0.66667rem;
    height: 100%;
    background: url(../../res/images/integral-tip.png) center center no-repeat;
    background-size: 0.53333rem 0.53333rem
}

.pay-details .pay-list .integral-icon {
    display: block;
    width: 0.42667rem;
    height: 100%;
    background: url(../../res/images/integral-icon.png) center center no-repeat;
    background-size: 0.42667rem 0.42667rem
}

.pay-details .pay-list .integral-off {
    display: block;
    width: 1.02667rem;
    height: 0.52rem;
    cursor: pointer;
    margin-top: 0.36rem;
    margin-left: 0.13333rem;
    background: url(../../res/images/on-off.png) no-repeat;
    background-position: 0 0;
    background-size: 2.06667rem, 0.77333rem;
    -webkit-transition: background-position 0.25s ease-in;
    transition: background-position 0.25s ease-in;
    overflow: hidden
}

.pay-details .pay-list .integral-on {
    display: block;
    width: 1.02667rem;
    height: 0.52rem;
    cursor: pointer;
    margin-top: 0.36rem;
    margin-left: 0.13333rem;
    background: url(../../res/images/on-off.png) no-repeat;
    background-size: 2.06667rem, 0.77333rem;
    -webkit-transition: background-position 0.25s ease-in;
    transition: background-position 0.25s ease-in;
    background-position: -1.04rem 0;
    overflow: hidden
}

.pay-details .pay-list .using-integral {
    width: calc(100% - 0.93333rem);
    height: 1.25333rem;
    margin-left: 0.93333rem;
    color: #333333;
    font-size: 0.37333rem;
    overflow: hidden
}

.pay-details .pay-list .using-integral input {
    border: 1px solid #e5e5e5;
    width: 2rem;
    height: 0.93333rem;
    background-color: #f7f7f7;
    margin-top: 0.16rem;
    margin-left: 0.26667rem;
    margin-right: 0.26667rem;
    padding-left: 0.26667rem
}

.pay-goods {
    width: calc(100% - 0.4rem);
    height: 1.25333rem;
    margin-left: 0.4rem;
    border-bottom: 1px solid #DDDDDD
}

.pay-list:last-child .pay-goods {
    border-bottom: none
}


.pay-btn {
    width: 2.8rem;
    height: 1.33333rem;
    font-size: 0.42667rem;
    text-align: center;
    background-color: #FF5D42
}

.integralWin {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden
}

.integralWin .integral-box {
    width: 8rem;
    height: auto;
    background-color: #FFFFFF;
    position: absolute;
    left: 50%;
    top: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%)
}

.integralWin .integral-box .integral-header,
.integralWin .integral-box .integral-footer {
    width: 100%;
    height: 1.04rem;
    line-height: 1.04rem;
    font-size: 0.37333rem
}

.integralWin .integral-box .integral-header {
    background-color: #f7f8f8;
    color: #999999;
    text-indent: 0.4rem
}

.integralWin .integral-box .integral-footer {
    text-align: center;
    color: #FFFFFF;
    background-color: #b3b3b3
}

.integralWin .integral-box .integral-content {
    width: 100%;
    height: auto;
    line-height: 0.66667rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.34667rem;
    box-sizing: border-box;
    -webkit-box-sizing: border-box
}

.integralWin .integral-box .integral-content ul {
    list-style: disc
}


.payWin {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
    overflow: hidden
}

.payWin .payTip {
    width: 9.33333rem;
    height: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%)
}

.payWin .payTip .payConcent {
    width: 100%;
    height: auto;
    background-color: #ffffff;
    border-radius: 8px 8px 0 0;
    -webkit-border-radius: 8px 8px 0 0
}

.payWin .payTip .payConcent .payTit {
    width: calc(100% - 0.8rem);
    height: 1.33333rem;
    line-height: 1.33333rem;
    box-sizing: border-box;
    margin-left: 0.4rem;
    margin-right: 0.4rem;
    border-bottom: 2px dashed #C0C0C0;
    text-align: center;
    font-size: 0.42667rem;
    color: #333
}

.payWin .payTip .payConcent .payBox {
    width: 100%;
    height: auto;
    padding: 0.26667rem 0.4rem;
    box-sizing: border-box
}

.payWin .payTip .payConcent ul li {
    width: 100%;
    height: 0.93333rem;
    line-height: 0.93333rem;
    text-indent: 0.53333rem;
    font-size: 0.34667rem;
    position: relative
}

.payWin .payTip .payConcent ul li:after {
    position: absolute;
    left: 0.2rem;
    top: 0.4rem;
    content: '';
    width: 0.13333rem;
    height: 0.13333rem;
    background-color: #f4a522;
    border-radius: 50%;
    -webkit-border-radius: 50%
}

.payWin .payTip .payFooter {
    width: 100%;
    height: 1.33333rem;
    line-height: 1.33333rem;
    font-size: 0
}

.payWin .payTip .payFooter .cancel,
.payWin .payTip .payFooter .confirm {
    width: 50%;
    height: 1.33333rem;
    display: inline-block;
    font-size: 0.34667rem;
    color: #FFFFFF;
    text-align: center
}

.payWin .payTip .payFooter .cancel:hover,
.payWin .payTip .payFooter .confirm:hover {
    text-decoration: none
}

.payWin .payTip .payFooter .cancel {
    background-color: #999999;
    border-radius: 0 8px 0 0;
    -webkit-border-radius: 0 8px 0 0
}

.payWin .payTip .payFooter .confirm {
    background-color: #f5a623;
    border-radius: 0 0 8px 0;
    -webkit-border-radius: 0 0 8px 0
}

.pay-bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 1.33333rem;
    line-height: 1.33333rem;
    padding-left: 0.4rem;
    font-size: 0.42667rem;
    color: #FFFFFF;
    box-sizing: border-box;
    -webkit-box-sizing: border-box
}

.pay-bottom .preferential {
    color: #DFDFDF;
    margin-left: 0.13333rem;
    font-size: 0.34667rem
}




input:disabled {
    background-color: #FFFFFF
}

input::-webkit-input-placeholder {
    color: #999
}

.coupon{
    background: url(../../res/images/coupon.png) left center no-repeat;
    background-size: 0.4rem 0.4rem;
    text-indent : 0.5rem;
    font-size : 0.37333rem;
    color : #333;
}
</style>
