<template>
    <div class="pay-details" id="pay" v-cloak>
        <div class="pay-concent" style="position: relative;" v-if="payType == '2' || payType == '4'">
            <div class="address" v-if="!addressInfo">
                <a href="javascript:void(0)" class="add-address" @click="openAddress">添加地址</a>
            </div>
            <div class="address-info" v-if="addressInfo" @click="openAddress">
                <p class="address-name">{{addressInfo.area + addressInfo.address}}</p>
                <p>{{addressInfo.name}}&nbsp;&nbsp;&nbsp;{{addressInfo.mobile}}</p>
            </div>
            <div class="estimated" v-if="payType == '2'">预计送达&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{dayDefinite}}</div>
        </div>
        <div class="pay-concent">
            <div class="pay-box" v-if="payType == '1' || payType == '3'">
                <div class="pay-shouBox" style="margin-right: 0;">
                    <span class="fl arequired">称&nbsp;&nbsp;&nbsp;呼</span>
                    <input type="text" placeholder="请输入姓名" class="inputWidth" id="name" v-model="name" maxlength="20" v-if="isName" />
                    <template v-else>
                        <span class="sexList" :class="[sexType == '0' ? 'on' : '']" @click="setSexType('0')"> 先生</span>
                        <span class="sexList" :class="[sexType =='1' ? 'on' : '']" @click="setSexType('1')"> 女士</span>
                    </template>
                </div>
            </div>
            <div class="pay-box" v-if="isPhone && payType == '1' || payType == '3'">
                <div class="pay-shouBox">
                    <span class="fl arequired">手机号</span>
                    <input type="number" readonly="readonly" placeholder="请输入手机号" id="phone" v-model="phones" maxlength="11" />
                </div>
            </div>
            <div class="pay-box" v-if="payType == '1'">
                <div class="pay-shouBox" @click="changePickerType">
                    <span class="fl arequired">桌台号</span>
                    <input type="text" placeholder="请选择桌台号" :value="aresTableName" readonly="readonly"  v-if="isTable" />
                    <input type="text" placeholder="请选择桌台号" :value="aresTableName" id="multiPickerInput" readonly="readonly" v-else />
                    <span class="more-Tbale" v-if="!isTable"></span>
                </div>
            </div>
            <div class="pay-box" v-if="payType == '3'">
                <div class="pay-shouBox">
                    <span class="fl arequired">定时取</span>
                    <input type="text" placeholder="请选择取餐时间" id="presetInput" readonly="readonly"  v-model="presetTime" />
                    <span class="more-Tbale"></span>
                </div>
            </div>
            <div class="pay-box">
                <div class="pay-shouBox">
                    <span class="fl">备注</span>
                    <input type="text" placeholder="请输入备注信息" v-model="remark" id="remark" maxlength="50" />
                </div>
            </div>
            <div class="pay-box"   v-if="isInvolicHeader">
                <div @click="openBill" class="pay-shouBox">
                    <span class="fl">发票抬头</span>
                    <!-- <input type="text" placeholder="商家支持开发票(可不填)" v-model="involicHeader" id="involicHeader" maxlength="50" readonly="readonly"  /> -->
                    <span>{{involicHeader}}</span>
                    <span class="more-Tbale"></span>
                </div>
            </div>
            <div class="pay-box" v-if="payType == '1'">
                <div @click="changePersonType" class="pay-shouBox" >
                    <span class="fl arequired">用餐人数</span>
                    <input type="text" placeholder="请选择就餐人数" v-model="num" readonly="readonly" disabled="disabled" v-if="num == '1'"/>
                    <input type="text" placeholder="请选择就餐人数"  disabled="disabled" v-model="num" id="selectNumber" readonly="readonly" v-else/>
                    <span class="more-Tbale" v-if="num != '1'"></span>
                </div>
            </div>
            <div class="pay-box" v-if="!isInvolicHeader">
                <div class="pay-shouBox">
                    <span class="fl">发票抬头</span>
                    <input type="text" placeholder="商家不支持开具发票" v-model="involicHeader" id="involicHeader" maxlength="50" readonly="readonly" />
                </div>
            </div>
            <div class="pay-box" v-if="isAddress">
                <div class="pay-shouBox">
                    <span class="fl">地址</span>
                    <input type="text" placeholder="请输入地址信息" v-model ="address"  id="address" maxlength="50" />
                </div>
            </div>
        </div>
        <div id="targetContainer" class="multi"></div>
        <div id="payList" class="multi"></div>
        <div id="presetList" class="multi"></div>
        <div class="pay-concent">
            <div class="pay-subhead">
                <div class="pay-sub fl">支付方式</div>
            </div>
            <!--<div class="pay-list" style="border-bottom: 1px solid #DDDDDD;"></div>-->
            <div class="pay-list">
                <div class="pay-goods" v-for="(item,index) in PaymentList" :key="index" :class="item.value == '微信支付' ? 'wechat-icon' : 'member-icon'" style="border-bottom: 1px solid #DDDDDD;">
                    <span>{{item.value}}</span>
                    <span class="selectPay fr" :class="item.isOn ? 'payOn' : 'payOff'" @click="chosePay(item,index)"></span>
                </div>
            </div>
        </div>
        <div class="pay-concent">
            <div class="pay-subhead">
                <div class="pay-sub fl">商品详情</div>
                <div class="pay-sum fl">待支付 &nbsp;￥{{sumPrice}}</div>
            </div>
            <div class="pay-list" v-for="(goods,i) in goodsList" :key="i">
                <goods-list :goods="goods" :isMember="Boolean(memberInfo)" :memberDiscount="discount"></goods-list>
            </div>
            <package-list v-for="(packages,index) in packagesList" :packages="packages" :key="index" :isMember="Boolean(memberInfo)" :memberDiscount="discount"></package-list>
            <div class="pay-list" style="height: auto;" v-if="payType == '2' || payType == '4'">
                <div class="pay-goods">
                    <div class="pay-name fl">
                        <template v-if="payType == '2'">
                            配送费
                        </template>
                        <template v-if="payType == '4'">
                            运费
                        </template>
                    </div>
                    <div class="pay-num fl"></div>
                    <div class="pay-sum fl">￥{{moveFee}}</div>
                </div>
            </div>
        </div>
        <div class="pay-concent">
            <template v-if="integralConfig.status == '1' && (integralConfig.channel == '2' || integralConfig.channel == '12')">
                <div class="pay-subhead">
                    <div class="pay-sub fl">优惠方式</div>
                </div>
                <div class="pay-list">
                    <div class="pay-goods coupon">
                        <span class="fl">优惠券</span>
                        <div class="couponMore fr">
                            <div class="couponNum" v-if="couponNum > 0 && couponTypeName == ''" @click="openCouponPage">{{couponNum}}张可用</div>
                            <div class="fl" v-if="couponNum == 0">无可用优惠券</div>
                            <div  style="color: #ff5d42;" class="couponTypeName" v-if="couponTypeName" @click="openCouponPage">{{couponTypeName}}</div>
                        </div>
                    </div>
                    <div class="pay-goods">
                        <div class="pay-integral fl">
                        <span class="fl integral-icon"></span>
                        <span class="fl">积分抵扣</span>
                        <span class="fl integral-explain" v-if="integralConfig.useMode == '1' && point >= 1">(已使用{{maxPoint}}积分，抵扣{{maxPoint / integralConfig.point * integralConfig.pointCash}})元</span>
                        <span class="fl integral-explain" v-if="integralConfig.useMode == '0' && point >= 1 && noIntegral">(当前{{point}}积分，可使用积分{{maxPoint}})</span>
                        <span class="fl integral-explain" v-if="integralConfig.useMode == '0' && point >= 1 && noIntegral == false">(已使用{{points}}积分，抵扣{{points / integralConfig.point * integralConfig.pointCash}})元</span>
                        <span class="fl integral-explain" v-if="point <= 0">(无可用积分)</span>
                        <span class="fl integral-tip" @click="isOpenColseWin('open')"></span>
                        </div>
                        <div class="pay-integral fl" style="width: 15%;">
                            <span v-bind:class="[isIntegral ? 'integral-on' : 'integral-off']" @click="isUsingIntegral"></span>
                        </div>
                    </div>
                </div>
                <!-- {{isIntegral}}
                {{integralConfig.useMode}}
                {{noIntegral}}                                 -->
                <div class="pay-list" v-if="isIntegral && integralConfig.useMode == '0' && noIntegral" style="border-top:1px solid #DDDDDD">
                    <div class="using-integral">
                        <span class="fl">使用积分</span>
                        <input type="number" class="fl" v-model="pointss" />
                        <span class="fl">可抵扣{{points / integralConfig.point * integralConfig.pointCash}}元</span>
                    </div>
                </div>
            </template>
        </div>
        <!--<a href="javascript:void(0)" class="pay-btn" @click="isPay" v-else>立即支付￥{{sumPrice}}</a>-->
        <div class="pay-bottom">
            <span class="fl">待支付&nbsp;￥{{sumPrice}}</span>
            <!--<span class="fl preferential">|&nbsp;优惠&nbsp;￥34</span>-->
            <a href="javascript:void(0)" class="fr pay-btn" @click="isPay">去支付</a>
        </div>
        <transition name="fade">
            <win 
                @winEvent="winEvent"
                v-if="isPayWin"
                :height= '"auto"'
            >
                <div slot="content" class="pay-type">
                    <div class="pay-Box">
                        <ul>
                            <li v-for="(item,index) in customContentList" :key="index">{{item.content}}</li>
                            <li>等待时间约{{startTime}}~{{endTime}}分钟</li>
                        </ul>
                    </div>
                </div>
            </win>
        </transition>
        <transition name="fade">
            <win v-if="isIntegralWin" @winEvent="closeWin" :height="'auto'" :type="'alert'" :ok="{content: '关闭'}">
                <div slot="content" class="integral-box">
                    <div class="integral-header">积分使用规则</div>
                    <div class="integral-content">
                        <ul>
                            <li>积分抵扣比例为{{integralConfig.point}}:{{integralConfig.pointCash}}</li>
                            <li v-if="integralConfig.maxRule == '1' || integralConfig.maxRule == '2'">积分抵扣最多为订单金额{{integralConfig.pointCash}}%</li>
                            <li v-if="integralConfig.maxRule == '3' && point >= integralConfig.point ">积分抵扣最多为{{maxPoint / integralConfig.point * integralConfig.pointCash}}元</li>
                            <li v-if="point >= integralConfig.point ">最多可使用积分{{maxPoint}}</li>
                            <li v-if="integralConfig.pointUseRule != '2' && integralConfig.pointUseRule != '0'">人均消费满{{consumeConfig.averageConsum}}元可使用</li>
                            <li v-if="integralConfig.pointUseRule != '1' && integralConfig.pointUseRule != '0'">总消费满{{consumeConfig.totalConsum}}元可使用</li>
                            <!--<li>积分抵扣部分不计入积分累计</li>
                            <li>积分抵扣部分再次进入积分累计</li>-->
                        </ul>
                    </div>
                </div>
            </win>
        </transition>
        <transition name="fade">
            <component 
                :is="componentId"
                :type="type"
                @closePicker = "closePicker"
                :list="listData"
                :title="title"
            >
            </component>
        </transition>
        
    </div>
</template>

<script>
    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';
    import store from '../order_system/details_store';

    let orderData = null;

    let payType = utils.getQueryString('payType') || 'wx';
    
    //storage.session('paySend');
    // let goods = goodsInfo.goods;
    export default {
        data(){
            return {
                listData: '',
                componentId: '',
                data: '', //支付传递的信息
                token : '',//token
                openId : '',//getMid中的openId
                tableAreaList : '',//桌台区域数组
                tableNmae : '',//桌台名称    
                areaName : '',//区域名称
                tableId : '',//桌台id
                areaId : '',//区域id
                sumPrice : storage.session('sumPrice'),//总价
                goodsList : storage.session('goods'),//商品列表
                packagesList : storage.session('packages'), //套餐列表
                orderInfo : '',//点菜json数据
                name : '',//姓名
                phone : '',//手机号码
                remark : '',//备注信息
                involicHeader : storage.session('billDetail') ? storage.session('billDetail').invoiceHeader : '',//发票抬头
                address : '',//地址
                fid : '',
                isRemark : false,
                isPayWin : false,
                isTable : false,
                sexType : 0,
                aresTableName : '',
                status : '', //是否开启广场模式 默认为0 1为开启
                SquareConfig : {}, //广场模式配置
                isName : false, //是否可输入姓名 
                isPhone : false , //是否可输入手机号
                isInvolicHeader : false, //是否可输入发票抬头
                isAddress : false, //是否可输入地址
                startTime : '',//开始时间
                endTime : '', //结束时间
                customContentList : [], //支付规则数组
                isIntegralWin : false, //是否打开规则弹窗
                integralConfig : {}, //积分规则配置
                isIntegral : false, //是否使用积分
                point : '', //已有积分
                maxPoint : '', //最大可使用积分
                points : '', //使用积分
                consumeConfig : {}, //消费配置
                userExp : '', //可使用积分
                totalPrice : storage.session('sumPrice'), //订单总价
                noIntegral : true,  //是否能使用积分
                pointConfig : false, // 
                tipTime : 0, //提示时间段
                isMember : false, //是否为会员
                memberName : '', //会员名称
                payName : '', //支付方式名称
                presetTime : '', //取餐时间 
                addressInfo : storage.session('addressDetail'),
                dayDefinite : '',  //预计送达时间
                payType : storage.session('selectPayWay') ? storage.session('selectPayWay').type : '0', //结账方式类型
                moveFee : storage.session('selectPayWay') ? Number(storage.session('selectPayWay').moveFee) : 0, // 快递费 or 起送费
                PaymentList : [], //支付方式数组
                code: '',
                shopId: '',
                type: 'tablePicker',
                num: '',
                memberInfo : null, // 自助模式取memberInfo，微信点餐取wechatShop  
                discount : null, // 获取会员等级折扣 
                couponNum : 0, // 优惠券可用数量
                couponTypeName : '', // 使用优惠券类型
                showCoupon : storage.session('couponOn'), // 选中的优惠券
                couponPrice : '', // 优惠券优惠金额
                title: ''
            }
        },
        computed: {
            phones: {
                get: function() {
                    return this.phone;
                },
                set: function(newValue) {
                    this.phone = newValue.replace(/[^\d]/g, '');
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
                    this.points = newValue.replace(/[^\d]/g,'');
                    this.points = (this.points > this.maxPoint) ? this.maxPoint : this.points;
                }
            }
        },
        store,
        watch: {
            'points': function(){
                // 计算出可抵扣的金额
                this.points = String(this.points);
                this.points = (this.points.substring(0,1)) == 0 ? this.points.substring(1,this.points.length) : this.points;
                // 积分可使用时计算支付金额
                if(this.pointConfig){
                    // 判断结账模式 是否含有快递费 
                    this.sumPrice = (this.totalPrice  - (this.points / this.integralConfig.point * this.integralConfig.pointCash )) > 0 ? Number((this.totalPrice - (this.points / this.integralConfig.point * this.integralConfig.pointCash )).toFixed(2)) : 0;
                    this.sumPrice = (Number(this.sumPrice) <  Number(this.moveFee)) ? Number(this.moveFee) : Number(this.sumPrice);
                }
            },
            'couponPrice' : function(){
                // 优惠券金额
                this.totalPrice = this.totalPrice - this.couponPrice;
                this.points = Number(this.points);   
            },
            'name' : 'infoChange',
            'address' : 'infoChange',
            'payName' : 'infoChange',
            'phone' : 'infoChange',
            'aresTableName' : 'infoChange',
            'remark' : 'infoChange',
            'presetTime' : 'infoChange'
        },
        methods: {
            winEvent(str){
                this.isPayWin = false;
                if(str === 'ok'){
                    this.getInfo();
                }
            },
            closePicker(val){
                this.componentId = '';
                if(val.type === "sure" && this.type === 'tablePicker'){
                    // this.aresTableName = val.payload.join('_')
                    val = val.payload;
                    this.tableNmae = this.listData[val[0]].child[val[1]].tableName;
                    this.tableId = this.listData[val[0]].child[val[1]].id;
                    this.areaName = this.listData[val[0]].areaName;
                    this.aresTableName = this.areaName + '_' + this.tableNmae;
                    this.isTable = true;
                }else if(val.type === "sure" && this.type === 'personPicker'){
                    this.num = val.payload
                }
            },
            changePickerType(){
                if(!this.tableAreaList){
                    this.$store.commit('setWin',{content: '暂无桌台'})
                    return false;
                }
                this.componentId = 'multi-picker';
                this.type="tablePicker"
                this.listData = this.tableAreaList
                this.title="选择桌台"
            },
            changePersonType(){   // 选择就餐人数
                if(this.num == '1') return false;
                this.componentId = 'multi-picker';
                this.type="personPicker"
                this.title="选择人数"
                let selectPayWay = storage.session('selectPayWay');
                if(this.payType == 1){
                    if(selectPayWay && selectPayWay.personConfine){
                        this.listData = Number(selectPayWay.personConfine)
                    }else{
                        this.listData = 1
                    }
                }
            },
            async budgetPrice(){
                // 预计算价格
                
                let couponObj = storage.session('couponOn');

                let data = await http.budgetPrice({
                    data : {
                        // openId : 'test', // openId
                        // oid : this.oid || '', // 订单id
                        // name : '', // 用户名
                        // tableName : this.aresTableName , // 区域名 + 桌台名
                        // phone : this.phone, // 手机号
                        // remark : this.remark, //备注
                        // invoiceHeader : this.involicHeader, //发票抬头
                        // address : this.address, // 地址
                        // tableId : this.tableId, // 桌台Id
                        // data : this.orderInfo, // 菜品数据
                        // shopId : this.shopId, // 店铺id
                        // payType : '', // 支付方式:中信 or 微信
                        // point : this.points, // 积分
                        // getTime : this.presetTime, // 自取时间
                        // itin : storage.session('billDetail') ? storage.session('billDetail').itin : '', // 税号
                        // paymentName :  this.payName, // 支付方式名称
                        // id : storage.session('selectPayWay') ? storage.session('selectPayWay').id : '', // 模式类型
                        // person : this.num
                        shopId : this.shopId, // 店铺id
                        data : this.orderInfo,
                        point : this.points,
                        couponId : couponObj.couponId,
                        code : couponObj.code,
                        couponType : couponObj.type,
                        memberId : storage.session('memberInfo').member.id
                    }
                });

                // this.totalPrice = this.totalPrice - data.couponCash;
                this.couponPrice = data.couponCash;
                this.couponTypeName = this.getCouponType(data.couponCash,this.showCoupon);
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
            async getInfo(){
                let name;
                if(this.isName || this.payType == '2' || this.payType == '4'){
                    name = this.name;
                }else{
                    name = this.sexType == 0 ? '先生' : '女士';
                }
                let payTypes = (this.payName == '会员支付') ? '5' : payType;
                let couponObj = storage.session('couponOn');
                
                let res = await http.wechatFastPay({
                    data: {
                        openId : this.openId, // openId
                        oid : this.oid || '', // 订单id
                        name : name, // 用户名
                        tableName : this.aresTableName , // 区域名 + 桌台名
                        phone : this.phone, // 手机号
                        remark : this.remark, //备注
                        invoiceHeader : this.involicHeader, //发票抬头
                        address : this.address, // 地址
                        tableId : this.tableId, // 桌台Id
                        data : this.orderInfo, // 菜品数据
                        shopId : this.shopId, // 店铺id
                        payType : payTypes, // 支付方式:中信 or 微信
                        point : this.points, // 积分
                        getTime : this.presetTime, // 自取时间
                        itin : storage.session('billDetail') ? storage.session('billDetail').itin : '', // 税号
                        paymentName :  this.payName, // 支付方式名称
                        id : storage.session('selectPayWay') ? storage.session('selectPayWay').id : '', // 模式类型
                        person : this.num,
                        couponId : couponObj ? couponObj.couponId : '',
                        code : couponObj ? couponObj.code : '',
                        couponType : couponObj ? couponObj.type : '',
                        originalPrice : storage.session('sumPrice')
                    }
                })
                this.noIntegral = false; //提交订单后不允许修改积分
                this.isIntegral = true; //显示选中
                this.points = Number(this.points);
                
                if(res.pay && payType == '5'){
                    this.$store.commit('setWin',{
                        content: '支付成功'
                    })
                    WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
                    
                    return false;
                }else if(res.pay && typeof res.jsonData == 'object'){
                    this.data = res.jsonData;
                    this.oid = res.oid;
                    this.callpay();
                    return false;
                }else if(res.pay && res.jsonData == '' && payType == 'wx' || payType == 'zx'){
                    this.$store.commit('setWin',{
                        content: '支付成功'
                    })
                    WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
                    return false;
                }

            },
            callpay(){
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
            jsApiCall(){
                setTimeout(() => {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        this.data,
                        (res) => {
                            if(res.err_msg == "get_brand_wcpay_request:ok"){
                                //关闭微信游览器
                                WeixinJSBridge.invoke('closeWindow', {}, function(res) {});
                            }else{
                                sessionStorage.setItem('oids',this.oid);
                                this.$router.push('/memberCenterOrderCancel');
                            }
                        }
                    );
                },1000);
            },
            infoChange(){
                var objInfo = {
                    name : this.name,
                    aresTableName : this.aresTableName,
                    address : this.address,
                    payName : this.payName,
                    remark : this.remark,
                    phone : this.phone,
                    tableId : this.tableId,
                    presetTime : this.presetTime,
                    num : this.num
                };
                storage.session('objInfo',objInfo);
            },
            setSexType(type){
                this.sexType = type;
            },
            async openBill(){
                let res = await http.getInvoiceList({
                    data:{
                        shopId: this.shopId
                    }
                })
                storage.session('billList',res);
                if(utils.isEmptyObject(res)){
                    this.$router.push('/addBill'); //新增发票 
                }else{
                    this.$router.push('/choseBill'); // 跳转至发票列表
                }
            },
            chosePay(item,index){
                for(var i=0;i<this.PaymentList.length;i++){
                    this.PaymentList[i].isOn = false;
                }
                this.PaymentList[index].isOn = true;
                this.payName = item.value;
            },
            isOpenColseWin(type){
                this.isIntegralWin = true;
            },
            closeWin(){
                this.isIntegralWin = false;
            },
            isUsingIntegral(){
                if(!Boolean(Number(this.point)) || this.noIntegral == false){
                    return false;
                }
                this.isIntegral = !this.isIntegral;
                console.log(this.noIntegral);
                console.log(this.isIntegral);
                console.log(JSON.stringify(this.integralConfig));
                if(this.integralConfig.useMode == '1'){
                    this.points = this.isIntegral ? this.maxPoint : '';
                }else{
                    this.points = this.isIntegral ? this.points : '';
                }
            },
            validate(content){
                this.$store.commit('setWin',{
                    content: content
                })
            },
            isPay(){ 
                //    if(!global.checkData({
                //         phone:{cond:"!this.isPhone || ($$.trim() && this.isPhone && /^1\\d{10}$/.test($$))",pro: '请填写正确的手机号'},
                //         aresTableName: {cond: "this.payType != '1' || (this.payType == '1' && $$.trim())",pro: '请选择桌台'},
                //         payName: {cond: "$$.trim()",pro: '请选择支付方式..'},
                //         presetTime: {cond: "this.payType != '3' || (this.payType == '3'&& $$.trim())",pro: '请选择取餐时间..'},
                //         num: {cond: "this.payType != '1' || (this.payType == '1' && $$ != '')",pro: '请选择用餐人数..'},
                //         payType: {cond: "$$ == 1 || ($$ != 1 && this.address.trim())",pro: '请选择地址'},
                        
                //     },this)){
                //         return false;
                //     }
                    if(utils.trim(this.phone) == '' && this.isPhone){
                        this.validate('请填写手机号..')
                        return false;
                    }
                    if((!/^1\d{10}$/g.test(this.phone)) && this.isPhone){
                        this.validate('手机号格式错误..')
                        
                        return false;
                    }
                    
                    if(utils.trim(this.aresTableName) == '' && this.payType == '1'){
                        this.validate('请选择桌台..')
                        return false;
                    }
                    
                    if(utils.trim(this.payName) == ''){
                        this.validate('请选择支付方式..')
                        return false;
                    }
                    
                    if(this.payType == '3' && this.presetTime == ''){
                        this.validate('请选择取餐时间..')
                    	return false;
                    }
                    
                    if(this.payType == '1' && this.num == ''){
                        this.validate('请选择用餐人数..')
                    	return false;
                    }
                    if((this.payType == '2' || this.payType == '4')){
                        if(this.address == undefined){
                            this.validate('请选择地址')
                    		return false;
                        }
                    	if(utils.trim(this.address) == ''){
                            this.validate('请选择地址')        
                            return false;                    
                    	}
                    }
                    this.isPayWin = true;
            },
            openAddress(){
                if(utils.isEmptyObject(storage.session('addressList'))){
                    this.$router.push('/addAddress'); //新增地址
                }else{
                    this.$router.push('/choseAddress'); // 跳转至地址列表
                }
            },
            async areaAndTableList(){
                if(this.payType == '1'){
                    let res = await http.getAreaAndTableList({
                        data: {
                            shopId : this.shopId,
	                        type : storage.session('selectPayWay') ? storage.session('selectPayWay').type : '',
	                        id : storage.session('selectPayWay') ? storage.session('selectPayWay').id : ''
                        }
                    })
                    var areas = res.areas;
                    var table = res.tables;
                    
                    if(utils.isEmptyObject(areas)){
                        this.$store.commit('setWin',{
                            content: '暂无区域'
                        })
                        return false;
                    }
                    for(var i=0;i<areas.length;i++){
                        areas[i].value = areas[i].areaName;
                        areas[i].child = [];
                        for(var j=0;j<table.length;j++){
                            if(areas[i].id == table[j].areaId){
                                table[j].value = table[j].tableName;
                                areas[i].child.push(table[j]);
                            }
                        }
                    }
                    this.tableAreaList = utils.deepCopy(areas);
                    
                    for(var k=0;k<this.tableAreaList.length;k++){
                        if(utils.isEmptyObject(this.tableAreaList[k].child)){
                            this.tableAreaList.splice(k,1);
                            k--;
                        }
                    }
                    if(storage.session('select-shop').tableId){
                        var tableId = storage.session('select-shop').tableId;
                        var tableAreaList = this.tableAreaList;
                        for(var i=0;i<tableAreaList.length;i++){
                            for(var j=0;j<tableAreaList[i].child.length;j++){
                                if(tableAreaList[i].child[j].id == tableId){
                                    this.tableNmae = tableAreaList[i].child[j].tableName;
                                    this.tableId = tableAreaList[i].child[j].id;
                                    this.areaName = tableAreaList[i].areaName;
                                    this.aresTableName = this.areaName + '_' + this.tableNmae;
                                    this.isTable = true;
                                }
                            }
                        }
                    }else{
                        this.isTable = false;
                    }
                }
                let resData = this.getPresetTime()
            },
            getPresetTime(){
                var time = new Date();
                	var closeTime = storage.session('select-shop').closeTime;
                	closeTime = (Number(Math.floor(closeTime / 60)) == 24) ? 0 : Number(Math.floor(closeTime / 60));
				    var timeList = [];
                    timeList.push({
                        value : '立即取餐'
                    },{
                        value : '稍晚取餐(30分钟)'
                    });

		   		    for(var i=0;i<100;i++){
		   		    	var min,hours;
		   		    	min = time.getMinutes();
		   		    	hours = time.getHours();
						if(time.getHours() == closeTime){
							break;
						}
						
						if(closeTime >= 24 && hours == '0'){
							closeTime = closeTime - 24;
						}
						
		   		    	if(time.getMinutes() > 30){
		   		    		time.setMinutes(0);
							time.setHours(hours + 1);
		   		    	}else{
		   		    		time.setMinutes(min + 30);
		   		    		if(time.getMinutes() > 30){
		   		    			time.setMinutes(0);
								time.setHours(hours + 1);
		   		    		}
		   		    	}
				    	timeList.push({
				    		'value' : utils.format(new Date(time),'hh:mm') + '-' + utils.format(new Date(time.getTime() + 1000 * 60 * 30),'hh:mm')
				    	});
				    }
		   		    timeList[timeList.length - 1].value = timeList[timeList.length - 1].value.substring(0,6) + '暂停营业';
		   		    return timeList;
            },
            async getUserInfo(){
                let res = await http.getUserGoodsInfo({
                    data: {
                        shopId : this.shopId,
                        type : '1',
                        memberId : storage.session('login').memberId
                    }
                },false,true)
                this.tipTime = res.time;
                            
                if(res.data.userInfo){
                    if(res.data.userInfo.name == '女士'){
                        this.sexType = 1;
                    }else if(res.data.userInfo.name == '先生'){
                        this.sexType = 0;
                    }else{
                        this.name = res.data.userInfo.name;
                    }
                    this.phone = res.data.userInfo.phone;
                    // this.address = res.data.userInfo.address || '';
                }
                if(res.data.member){
                    this.sexType = res.data.member.gender == 1 ? 0 : 1;
                    this.phone = res.data.member.mobile;
                    this.name = res.data.member.name;
                    this.memberName = res.data.member.name;
                    this.isMember = true;
                }
                if(storage.session('billDetail')){
                    this.involicHeader = storage.session('billDetail').invoiceHeader;
                }
            },
            async getPointConfig(){
                let res = await http.getPointConfig({
                    data: {
                        shopId : this.shopId,
                        price : (Number(this.sumPrice) - Number(this.moveFee)).toFixed(2)
                    }
                })
                this.pointConfig = Boolean(res);
                if(res){
                    this.integralConfig = res.pointConfig;
                    this.consumeConfig = res.userData;
                    this.point = res.userData.point;
                    this.maxPoint = res.userData.pointLimit;
                    this.isIntegral = Boolean(Number(this.integralConfig.useMode));
                    if(this.isIntegral){
                        this.points = this.maxPoint;
                    }
                }
            },
            async getAddress(){
                let res = await http.getAddressList({
                    data: {
                        shopId : this.shopId
                    }
                })
                storage.session('addressList',res);
                let list = res;
                // 是否选择地址
                if(!utils.isEmptyObject(list) && this.payType == '2' || this.payType == '4'){
                    for(var i=0;i<list.length;i++){
                        if(list[i].status == '1'){
                            this.addressInfo = list[i];
                        }
                    }
                    this.phone = this.addressInfo.mobile;
                    this.address = this.addressInfo.area + this.addressInfo.address;
                    this.name = this.addressInfo.name;
                }
            },
            async getOpenId(){
                let res = await http.getOpenId({
                    data: {
                        code: this.code,
                        shopId : this.shopId,
                        payType : payType
                    }
                })
                this.openId = res;
                storage.session('openId',res);
            },
            async getCouponList(){
                // 获取优惠券列表
                if(!this.memberInfo.member) return false;
                let data = await http.getCouponList({
                    data : {
                        shopId : this.shopId,
                        type : 1,
                        code : {}
                    } 
                },false,true);

                
                let goods = storage.session('goods');
                let packages = storage.session('packages');
                    goods = goods.concat(packages);
                this.couponNum = this.filterCoupon(goods,data.data,this.totalPrice,data.time);
            },
            openCouponPage: function () {
                // 进入使用优惠券页面
                if (this.couponNum) {
                    this.$router.push("/chooseCoupon")
                }
            },
            filterCoupon : function(goods, coupon, totalPrice, time){
               /**
                 * 过滤可使用优惠券
                 * 
                 * @param {Object} goods 商品和套餐合并数据
                 * @param {Object} coupon 优惠券
                 * @param {String} totalPrice 订单支付金额
                 * @param {String} time 当前时间
                 */
                var num = 0;
                var goodsObj = {};
                var today; // 今天是周几

                coupon.filter(function(item, index) {
                    // 条件1：优惠券在可使用期限内
                    if(item.startTime < time && item.endTime > time) {
                        // 条件2：实际支付金额大于最低消费
                        if(totalPrice >= item.lowestConsume) {
                            if(item.pids || item.gids) {
                                goods.filter(function(item1) {
                                    // 是否存在可使用优惠券的商品
                                    if(item1.goodsName && item1.gid == item.gids){
                                        item.isUsed = true;
                                    }
                                    
                                    // 是否存在可使用优惠券的套餐
                                    if(item1.packageName && item1.packageId == item.pids){
                                        item.isUsed = true;
                                    }
                                });
                            } else {
                                item.isUsed = true;
                            }
                            
                            if(typeof item.useTime === 'object'){
                                // week为周，month为月
                                
                                today = utils.format(new Date(Number(Math.round(time*1000))),'yyyy-MM-dd');
                                today = new Date(today).getUTCDay(); // 今天周几
                                var isNextDay = item.useTime.list[0].isNextDay; // 是否隔天
                                var startslot,endslot;
                                    startslot = new Date(Math.round(time*1000)); //当前时间
                                    endslot = new Date(Math.round(time*1000));  //当前时间
                                var start = item.useTime.list[0].startslot.split(':'); // 周几什么时间可用
                                var end = item.useTime.list[0].endslot.split(':'); // 周几到什么时候不可用
                                    startslot = startslot.setHours(start[0],start[1]); 
                                    startslot = Math.round(startslot / 1000); // 转换为时间戳
                                    endslot = endslot.setHours(end[0],end[1]);
                                    endslot = new Date(endslot);
                                    endslot = isNextDay ? endslot.setDate(endslot.getDate()+1) : endslot; //如果隔天的话加上一天
                                    endslot = Math.round(endslot / 1000); // 转换为时间戳

                                if(item.useTime.type == 'week'){
                                    var weekList = item.useTime.list[0].week; // 周几可用
                                    for(var i=0;i<weekList.length;i++){
                                        if(weekList[i] == today && startslot < time && endslot > time){
                                            // 今天是否是可使用日期
                                            item.isUsed = true;
                                        }else{
                                            item.isUsed = false;
                                        }
                                    }
                                }else{
                                    var weekList = item.useTime.list[0].month; // 周几可用
                                    for(var i=0;i<weekList.length;i++){
                                        if(weekList[i] == today && startslot < time && endslot > time){
                                            // 今天是否是可使用日期
                                            item.isUsed = true;
                                        }else{
                                            item.isUsed = false;
                                        }
                                    }
                                }
                            }
                        } else {
                            item.isUsed = false;
                        }
                    } else {
                        item.isUsed = false;
                    }
                });
                
                for(var i=0;i<coupon.length;i++){
                    if(coupon[i].isUsed){
                        num++;
                    }else{
                        coupon[i].isUsed = false;
                        coupon[i].cause = '有效期外';
                    }
                }
                
                storage.session('couponList', coupon);
                return num;
            } 
        },
        beforeDestroy(){
            storage.session('billDetail','')
        },
        async mounted(){
            this.shopId = utils.getQueryString('shopId') || 61;
            this.code = utils.getQueryString('code') || 'test';
            let userDate = storage.session('select-shop'); // 用户数据
            let squareConfig = storage.session('SelfHelpConfig'); //自助数据
            let selectPayWay = storage.session('selectPayWay');
            orderData = await import(/* webpackChunkName:'order_data' */'src/module/order_system/order_data');
            orderData = orderData.default;

            // 获取会员信息
            this.memberInfo = storage.session("select-shop") ? storage.session("memberInfo") : storage.session("wechatShop");
            this.discount = this.memberInfo.member.level ? this.memberInfo.member.level.discount : 1;

            if(storage.session('couponOn')){
                setTimeout(() => {
                    this.budgetPrice();
                }, 500);
            }

            if(this.payType == '2' || this.payType == '4'){
                this.sumPrice = (Number(this.sumPrice) + Number(this.moveFee)).toFixed(2);
                this.totalPrice = this.sumPrice;
            }
            this.areaAndTableList();
            this.getUserInfo();
            this.getPointConfig();
            this.getCouponList(); // 获取优惠券列表
            let addressDetail = storage.session('addressDetail')
            
            if(!storage.session('addressList') && !addressDetail){
                this.getAddress();
            }else{
                this.addressInfo = addressDetail;
                if(this.addressInfo){
                    this.phone = this.addressInfo.mobile;
                this.address = this.addressInfo.area + this.addressInfo.address;
                this.name = this.addressInfo.name;
                }  
            }
            
            if(storage.session('openId')){
                this.openId = storage.session('openId');
            }else{
                this.getOpenId();
            }
            this.PaymentList = storage.session('SelfHelpConfig').fixedPayment.split('');
            var arr = [];
            for(var i = 0;i<this.PaymentList.length;i++){
                if(this.PaymentList[i].indexOf(3) >= 0){
                    arr.push({
                        value : '微信支付',
                        isOn : false
                    });
                }
                if(this.PaymentList[i].indexOf(5) >= 0){
                    arr.push({
                        value : '会员支付',
                        isOn : false
                    });
                }
            }
            //  设置默认就餐人数
            if(selectPayWay.type == '1'){
                var maxNum = (selectPayWay.type == '1' && selectPayWay.personConfine) ?  selectPayWay.personConfine : '1';
                this.num = (maxNum == '1') ? maxNum : '';
            }
            

            this.payName = arr[0].value;
            arr[0].isOn = true;
            
            this.PaymentList = arr;
            var objInfo = storage.session('objInfo');
            if(objInfo){
                this.name = objInfo.name;
                // this.address =  this.address;
                this.phone = objInfo.phone;
                this.aresTableName = objInfo.aresTableName;
                this.remark = objInfo.remark;
                this.payName = objInfo.payName;
                this.tableId = objInfo.tableId;
                this.presetTime = objInfo.presetTime;
                this.num = objInfo.num;
            }

            this.orderInfo = orderData.getCurrentTableUpdata(this.goodsList,this.packagesList);
            if(storage.session('squarePattern')){
                if(storage.session('SelfHelpConfig')){
                    this.status = storage.session('SelfHelpConfig').status;
                    this.SquareConfig = selectPayWay;
                    // 分割字符串 获取配置
                    var arr = this.SquareConfig.fillContent.split('');
                        this.isName = arr.indexOf('1') >= 0 ? true : false;
                        this.isPhone = arr.indexOf('2') >= 0 ? true : false;
                        this.isInvolicHeader = arr.indexOf('3') >= 0 ? true : false;
                        this.isAddress = arr.indexOf('4') >= 0 ? true : false;
                        
                    //获取配置时间
                    if(this.payType == '1'){
                        this.startTime = '5';
                        this.endTime = this.SquareConfig.readyMealTime;
                    }else{
                        this.startTime = '5';
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
            }
            var preArriveTime = selectPayWay ? selectPayWay.preArriveTime : '';
            if(preArriveTime){
                let times = new Date();
                times = new Date(times.getTime() + (1000 * 60 * Number(preArriveTime)));  //当前时间加上预计送达时间
                times = utils.format(new Date(times),'hh:mm');
                this.dayDefinite = times;
            }
            utils.setTitle('确认订单');
        },
        beforeDestroy(){
            storage.session('addressDetail',null)
        },
        components: {
            'package-list': () => import (/* webpackChunkName: "package_list" */ 'src/module/bespeak_system/bes_detail/package_list'),
            'goods-list': () => import (/* webpackChunkName: "goods_list" */ 'src/module/bespeak_system/bes_detail/goods_list'),
            'win': () => import (/* webpackChunkName: "win" */ 'src/components/phone/win'),
            'multi-picker': () => import (/* webpackChunkName: "multi_picker" */ 'src/components/multipicker/index')
        }
    }
</script>

<style lang="less" scoped>
    @import '../../res/css/base.less';
    .pay-type{
        width:100%;
        height:100%;
        padding: 20px 0;
        text-align:center;
        .pay-Tit{
            height: 1rem;
            margin-top:.3rem;
            border-bottom: 1px solid #999;
        }
    }
.pay-details {
  width: 100%;
  height: auto;
  position: relative;
  padding-bottom: 1.25333rem;
  font-family: "微软雅黑"; }
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
    border-bottom: 1px solid #dddddd; }
    .pay-details .pay-title span {
      display: block;
      width: 0.93333rem;
      height: 1.25333rem;
      text-indent: 0; }
  .pay-details .pay-concent {
    width: 100%;
    height: auto;
    background-color: #ffffff;
    margin-bottom: 0.2rem;
    overflow: hidden; }
    .pay-details .pay-concent .pay-box {
      width: 100%;
      height: 1.25333rem;
      line-height: 1.25333rem;
      position: relative; }
      .pay-details .pay-concent .pay-box .pay-shouBox {
        width: 100%;
        height: 1.25333rem;
        margin-left: 0.4rem;
        font-size: 0;
        border-bottom: 1px solid #dddddd;
        box-sizing: border-box; }
        .pay-details .pay-concent .pay-box .pay-shouBox span {
          width: 30%;
          height: 1.25333rem;
          font-size: 0.34667rem;
          color: #333333; }
          .pay-details .pay-concent .pay-box .pay-shouBox span.more-Tbale {
            position: absolute;
            right: 0.93333rem;
            top: 0.45333rem;
            width: 0.21333rem;
            height: 0.33333rem;
            background: url(../../res/images/moretable.png) no-repeat;
            background-size: 0.21333rem 0.33333rem; }
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
          box-sizing: border-box; }
        .pay-details .pay-concent .pay-box .pay-shouBox .inputWidth {
          width: 66%;
          height: 1.17333rem; }
        .pay-details .pay-concent .pay-box .pay-shouBox div {
          width: calc(50% - 30px);
          height: 1.13333rem;
          line-height: 1.13333rem;
          font-size: 0.32rem !important;
          color: #999999;
          float: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis; }
  .pay-details .pay-subhead {
    width: 100%;
    height: 1.25333rem;
    line-height: 1.25333rem;
    text-indent: 0.4rem;
    border-bottom: 1px solid #DDDDDD; }
    .pay-details .pay-subhead .pay-sub {
      width: 60%;
      height: 1.25333rem;
      font-size: 0.42667rem;
      position: relative; }
      .pay-details .pay-subhead .pay-sub:after {
        content: '';
        display: block;
        width: 0.08rem;
        height: 0.37333rem;
        background-color: #6ba9f1;
        position: absolute;
        left: 0.24rem;
        top: 0.42667rem; }
    .pay-details .pay-subhead .pay-tit {
      width: 100%;
      height: 1.25333rem;
      font-size: 0.42667rem;
      background-color: #FFFFFF;
      position: relative; }
      .pay-details .pay-subhead .pay-tit:after {
        content: '';
        display: block;
        width: 0.08rem;
        height: 0.37333rem;
        background-color: #f5a623;
        position: absolute;
        left: 0.24rem;
        top: 0.42667rem; }
    .pay-details .pay-subhead .pay-sum {
      width: 40%;
      height: 1.25333rem;
      color: #d0021b;
      font-size: 0.37333rem;
    //   padding-right: 0.4rem;
      box-sizing: border-box;
      text-align: right;
      .text-overflow;
      .px2rem(padding-right, 30);
       }
  .pay-details .pay-list {
    width: calc(100%);
    height: auto;
    line-height: 1.25333rem;
    color: #666; 
    }
    .pay-details .pay-list .pay-name {
      font-size: 0.37333rem;
      color: #333333;
      width: 65%;
      height: 1.25333rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden; }
    .pay-details .pay-list .pay-num {
      font-size: 0.37333rem;
      color: #bbbbbb;
      width: 15%;
      height: 1.25333rem;
      text-align: center; }
    .pay-details .pay-list .pay-sum {
      font-size: 0.37333rem;
      color: #333333;
      width: 20%;
      height: 1.25333rem;
      padding-right: 0.4rem;
      box-sizing: border-box;
      text-align: right; }
    .pay-details .pay-list .pay-package {
      width: 100%;
      height: auto;
      line-height: 0.6rem;
      background-color: #efefef;
      text-indent: 0.4rem;
      overflow: hidden; }

    .pay-details .pay-list .pay-integral {
      width: 85%;
      height: 1.25333rem;
      color: #333333;
      font-size: 0.37333rem;
      text-indent: 0.13333rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden; }
    .pay-details .pay-list .integral-explain {
      display: block;
      width: auto;
      height: 100%;
      font-size: 0.32rem;
      color: #999999; }
    .pay-details .pay-list .integral-tip {
      display: block;
      margin-left: 0.06667rem;
      width: 0.66667rem;
      height: 100%;
      background: url(../../res/images/integral-tip.png) center center no-repeat;
      background-size: 0.53333rem 0.53333rem; }
    .pay-details .pay-list .integral-icon {
      display: block;
      width: 0.42667rem;
      height: 100%;
      background: url(../../res/images/integral-icon.png) center center no-repeat;
      background-size: 0.42667rem 0.42667rem; }
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
      overflow: hidden; }
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
      overflow: hidden; }
    .pay-details .pay-list .using-integral {
      width: calc(100% - 0.93333rem);
      height: 1.25333rem;
      margin-left: 0.93333rem;
      color: #333333;
      font-size: 0.37333rem;
      overflow: hidden; }
      .pay-details .pay-list .using-integral input {
        border: 1px solid #e5e5e5;
        width: 2rem;
        height: 0.93333rem;
        background-color: #f7f7f7;
        margin-top: 0.16rem;
        margin-left: 0.26667rem;
        margin-right: 0.26667rem;
        padding-left: 0.26667rem; }

.pay-goods {
  width: calc(100% - 0.4rem);
  height: 1.25333rem;
  margin-left: 0.4rem;
  border-bottom: 1px solid #DDDDDD; }

.pay-goods:last-child{
    border-bottom: none;
}
.pay-goods:first-child{
    border-bottom: 1px solid #DDDDDD;
}



.pay-btn {
  width: 2.8rem;
  height: 1.33333rem;
  font-size: 0.42667rem;
  text-align: center;
  background-color: #FF5D42; }


   .integral-box {
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    position: relative;}
     .integral-box .integral-header{
      width: 100%;
      height: 1.04rem;
      line-height: 1.04rem;
      font-size: 0.37333rem; }
     .integral-box .integral-header {
      background-color: #f7f8f8;
      color: #999999;
      text-indent: 0.4rem; }
     .integral-box .integral-content {
      width: 100%;
      height: auto;
      line-height: 0.66667rem;
      padding: 0.4rem 0.8rem;
      font-size: 0.34667rem;
      box-sizing: border-box;
      -webkit-box-sizing: border-box; }
       .integral-box .integral-content ul {
        list-style: disc; }

.required {
  position: relative;
  left: 0; }
  .required:after {
    content: '*';
    color: #d0021c;
    font-size: 0.42667rem;
    display: block;
    position: absolute;
    left: 0.8rem;
    top: -0.13333rem; }

.arequired {
  position: relative;
  left: 0; }
  .arequired:after {
    content: '*';
    color: #d0021c;
    font-size: 0.42667rem;
    display: block;
    position: absolute;
    left: 1.46667rem;
    top: -0.13333rem; }

.sexList {
  display: inline-block;
  width: 2rem !important;
  height: 1.25333rem;
  line-height: 1.25333rem;
  font-size: 0.34667rem !important;
  text-indent: 0.53333rem;
  color: #999999 !important;
  background: url(../../res/images/name-default.png) left center no-repeat;
  background-size: 0.32rem 0.32rem !important; }

.on {
  background-size: 0.32rem 0.32rem !important;
  background: url(../../res/images/name-on.png) left center no-repeat; }

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
  -webkit-box-sizing: border-box; }
  .pay-bottom .preferential {
    color: #DFDFDF;
    margin-left: 0.13333rem;
    font-size: 0.34667rem; }



.address {
  position: relative;
  width: 100%;
  height: 2.4rem;
  padding-left: 0.4rem;
  box-sizing: border-box;
  border: 1px solid #E5E5E5; }
  .address .add-address {
    display: block;
    width: 4.38667rem;
    height: 1.18667rem;
    line-height: 1.18667rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    background-color: #F5BF4F;
    font-size: 0.42667rem;
    color: #FFFFFF;
    text-align: center;
    text-decoration: none; }

.estimated {
  width: 100%;
  height: 1.24rem;
  line-height: 1.24rem;
  padding-left: 0.4rem;
  box-sizing: border-box;
  text-indent: 0.68rem;
  font-size: 0.37333rem;
  color: #333333;
  background: url(../../res/images/estimated.png) 0.4rem center no-repeat;
  background-size: 0.44rem 0.44rem; }

.address-info {
  padding: 0.36rem 0.4rem;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  max-height: 2.8rem;
  background: url(../../res/images/address.png) 0.36rem 0.4rem no-repeat;
  background-size: 0.4rem 0.53333rem;
  text-indent: 0.85333rem;
  font-size: 0.37333rem;
  color: #333333;
  border: 1px solid #E5E5E5;
  position: relative; }
  .address-info .address-name {
    width: 100%;
    height: auto;
    max-height: 1.6rem;
    line-height: 0.66667rem;
    font-size: 0.42667rem;
    color: #333333;
    padding: 0 0.4rem;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; }
  .address-info p {
    width: 100%;
    height: 1.06667rem;
    line-height: 1.06667rem; }
  .address-info:after {
    content: '';
    position: absolute;
    right: 0.4rem;
    top: 50%;
    transform: translate(0, -50%);
    width: 0.21333rem;
    height: 0.34667rem;
    background: url(../../res/images/more.png) no-repeat;
    background-size: 0.21333rem 0.34667rem; }

input:disabled {
  background-color: #FFFFFF; }

input::-webkit-input-placeholder {
  color: #999; 
}

.member-icon, .wechat-icon {
  text-indent: 0.8rem;
  font-size: 0.37333rem;
  color: #333; }

.member-icon {
  background: url(../../res/images/member-icon.png) 0 center no-repeat;
  background-size: 0.54667rem 0.49333rem; }

.wechat-icon {
  background: url(../../res/images/wechat-icon.png) 0 center no-repeat;
  background-size: 0.56rem 0.49333rem; }

.selectPay {
  width: 1.06667rem;
  height: 100%;
  margin-right: 0.4rem; }

.payOn {
  background: url(../../res/images/pay-on.png) center center no-repeat;
  background-size: 0.45333rem 0.45333rem; }

.payOff {
  background: url(../../res/images/pay-off.png) center center no-repeat;
  background-size: 0.45333rem 0.45333rem; }
.coupon{
    background: url(../../res/images/coupon.png) left center no-repeat;
    background-size: 0.4rem 0.4rem;
    text-indent : 0.5rem;
    font-size : 0.37333rem;
    color : #333;
}
.couponNum{
    .px2rem(width, 120);
    .px2rem(height, 42);
    background-color: #FF5D42;
    .px2rem(line-height, 42);
    .px2rem(font-size, 22);
    color: #ffffff;
    text-align: center;
    text-indent : 0;
    .px2rem(border-radius, 8);
    position: relative;
    top: 50%;
    left : 40%;
    transform: translate(-40%, -50%);
}
.couponMore{
    background: url(../../res/images/moretable.png) right center no-repeat;
    background-size: 0.21333rem 0.33333rem;
    width:auto;
    height:100%;
    text-align : center;
    padding-right : 0.4rem;
    margin-right : 0.4rem;
}
.couponTypeName{
    width: 3.5rem;
    height: 100%;
    .text-overflow;
}
</style>

