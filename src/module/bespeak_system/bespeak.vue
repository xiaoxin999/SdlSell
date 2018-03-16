<template>
    <div class="baspeak" id="baspeak" v-cloak>
        <div class="baspeak-head baspeak-icon">创建预约</div>
        <div class="baspeak-concent">
            <div @click="handleDateShow" class="baspeak-box content-height">
                <span class="fl required" >到店时间</span>
                <span type="text" class="fl" style="width: 60%;color: #999;" id="appDateTime">{{time}}</span>
                <span class="more"></span>
            </div>
            <div class="baspeak-box content-height">
                <span class="fl required">姓名</span>
                <input type="text" class="fl" placeholder="填写姓名" v-model="names" maxlength="20" />
            </div>
            <div class="baspeak-box content-height">
                <span class="fl required">人数</span>
                <input type="number" class="fl" placeholder="输入人数" maxlength="3" v-model="nums" />
            </div>
            <div class="baspeak-box content-height">
                <span class="fl required">电话</span>
                <input type="number" class="fl" placeholder="输入电话" maxlength="11" v-model="phones" />
            </div>
            <div class="baspeak-box content-height">
                <span class="fl">备注</span>
                <input type="text" class="fl" placeholder="输入备注信息" v-model="remark" maxlength="50" />
            </div>
        </div>
        <div class="baspeak-footer">
            <a href="javascript:void(0)" :class="[baspeakNext ? 'baspeak-btn' : 'baspeak-off']" @click="createOrderReserves" v-if="status == '0'">确认预约</a>
            <a href="javascript:void(0)" class="order-off" :class="[baspeakNext ? 'order-btn' : 'order-off']" v-else @click="createOrderReserves">预约点餐</a>
        </div>
        <div id="targetContainers"></div>
        <div class="shop-measking" id="shop-measking">
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        </div>
        <transition name="fade">
            <component
                :type="0"
                :recent_time = "recent_time"
                :param = "param"
                @closeData = "closeData"
                :fullDose = "fullDose"
                :is="showComponent"
            ></component>
        </transition>
    </div>
</template>

<script>
    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';

    export default {
        name: 'bespeak',
        data() {
            return {
                time: '选择到店时间', //到店时间
                name: '', //用户姓名
                num: '', //预约人数
                phone: '', //电话号码
                remark: '', //备注
                baspeakNext: false, // 是否满足条件确认预约 || 预约点餐
                status: '', //是否开启预约点餐
                preTime: '', //提前多少时间预约
                shopId: null,
                type: 0,
                recent_time: [],
                param: ['2018-2022','1-12','1-31','0-23','0-59'],
                fullDose: true,
                showComponent: ''
            }
        },
        methods: {
            createOrderReserves(){
                let res = global.checkData({
                    time: {cond: "$$ != ''&&$$ != '选择到店时间'",pro: '请选择到店时间..'},
                    name: '请填写姓名..',
                    num: {pro: '请输入人数且必须为数字..',reg:/\d+/},
                    phone:{reg:  /^1\d{10}$/,pro: '电话格式错误..'}                    
                },this)
                if(!res){
                    return false
                }
                let dates = Math.round(new Date() / 1000);
                let reserveTime = new Date(this.time)
                reserveTime = Math.round(new Date(reserveTime).getTime() / 1000);

                if(reserveTime < dates){
                    this.valideMsg('到店时间不能小于当前时间..')
                    return false
                }
                if(this.baspeakNext){
                    console.log(reserveTime,1231)
                    let obj = {
                        reserveTime: reserveTime,
                        name: this.name,
                        person: this.num,
                        phone: this.phone,
                        remark: this.remark
                    };
                    storage.session('reservationInfo', obj);
                    this.$router.push("/order");
                    
                }
            },
            valideMsg(content,type = 'alert'){
                this.$store.commit('setWin',{
                    content: content,
                    type: type
                })
            },
            infoChange(){
                if (utils.trim(this.time) != '' && utils.trim(this.name) != '' && utils.trim(this.num) != '' && utils.trim(this.phone) != '') {
                    this.baspeakNext = true;
                } else {
                    this.baspeakNext = false;
                }
            },
            handleDateShow(){
                // if(this.time){
                //     this.recent_time = this.time.split('/')
                // }
                this.showComponent = 'data-selector'
            },
            closeData(val){
                this.showComponent = ''
                if(val.type == 'makeSure'){
                    let reserveTime = val.data[0] + '/' + val.data[1] + '/' + val.data[2] + '\r' + val.data[3] + ':' + val.data[4];
                    this.time = utils.format(new Date(reserveTime),'yyyy/MM/dd hh:mm')
                }
            },
            async getReserveConf(){
                let res = await http.getReserveConf({
                    data: {
                        shopId: this.shopId
                    }
                })
                this.status = res.status;
                storage.session('preTime',res.preTime);

                let time = + new Date() + (parseInt(res.preTime) * 60 * 1000);
                let date = new Date(time);
                this.recent_time = [date.getFullYear(), date.getMonth() + 1, date.getDate(),date.getHours(), date.getMinutes()];
            },
            async getUserInfo(){
                const loginInfo = storage.session('login');
                let res = await http.getUserInfo({
                    data: {
                        shopId: this.shopId,
                        type: 1,
                        from: 0
                    }
                })
                Object.assign(res,loginInfo);
                storage.session('wechatShop',res);
                this.getReserveConf()
            }
        },
        computed:{
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
            nums: {
                get: function() {
                    return this.num;
                },
                set: function(newValue) {
                    this.num = newValue.replace(/[^\d]/g,'');
                    if(this.num.length > 3){
                        this.num = this.num.substring(0,3);
                    }
                }
            },
            names: {
                get: function() {
                    return this.name;
                },
                set: function(newValue) {
                    this.name = newValue.replace(/[^\w\d\u4e00-\u9fa5]/g,'');
                }
            }
        },
        watch:{
            'time': 'infoChange',
            'name': 'infoChange',
            'num': 'infoChange',
            'phone': 'infoChange'
        },
        async mounted(){

            this.shopId = utils.getQueryString('shopId') || 61;
            let wechatShop = storage.session('wechatShop');
            if(wechatShop){
                this.getReserveConf();
            }else{
                this.getUserInfo()
            }
            utils.setTitle('预约点单');
        },
        components: {
            DataSelector: () => import (/*webpackChunkName: "dateselector" */ 'src/components/dateselector'),
        }
    }
</script>

<style lang="less"  scoped>


.baspeak {
    width: 100%;
    height: 100%;
    background: #ffffff;
    overflow: hidden;
    .baspeak-head {
        width: 100%;
        height: 49px;
        line-height: 49px;
        padding: 0 10px;
        color: #705c5c;
        border-bottom: 1px solid #e5e5e5;
        overflow: hidden;
    }
    .baspeak-icon {
        background-image: url(../../res/images/bespeak-icon.png);
        background-position: 10px center;
        background-repeat: no-repeat;
        text-indent: 25px;
        font-size: 14px;
        background-size: 16px 16px; 
    }
    .baspeak-concent {
        background-color: #fff;
        padding-left: 15px;
        width: 100%;
        height: auto;
        margin-bottom: 70px;
        .baspeak-box {
            width: 100%;
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #e5e5e5;
            position: relative;
            .required:after {
                content: '*';
                width: 3px;
                height: 3px;
                line-break: 50px;
                display: block;
                position: absolute;
                left: -10px;
                top: -3px;
                color: red; 
            }
            span {
                width: 20%;
                height: 50px;
                font-size: 12px;
                display: inline-block;
            }
            input {
                width: calc(80% - 20px);
                height: 50px;
                outline: none;
                resize: none;
                border: none;
                font-size: 12px;
                color: #999999; 
            }
        }
        .baspeak-box:last-child {
            border-bottom: none; 
        }
    }
    .baspeak-footer {
        width: 100%;
        height: 125px;
        padding: 0 20px;
        box-sizing: border-box;
        a {
            display: block;
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 16px;
            border-radius: 8px;
            -webkit-border-radius: 8px; 
        }
        a:first-child {
            margin-bottom: 20px; 
        }
        a:hover {
            text-decoration: none; 
        }
        .baspeak-btn {
            background-color: #f5a623;
            color: #FFFFFF; 
        }
        .baspeak-off {
            background-color: #f3bc61;
            color: #FFFFFF; 
        }
        .order-btn {
            background-color: #f8f8f8;
            color: #000000;
            border: 1px solid #dfdfdf; 
        }
        .order-off {
            color: #999999;
            border: 1px solid #dfdfdf;
            background-color: #f4f3f8; 
        }
    }
    .baspeak-success-icon {
        background-image: url(../../res/images/bespeak-success.png);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 93px 93px;
        width: 100%;
        height: 150px; 
    }
    .success-tit {
        font-size: 18px;
        color: #000000;
        text-align: center;
        width: 100%;
        height: 50px;
        line-height: 50px;
        margin-bottom: 10px; 
    }
    .success-info {
        color: #999999;
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-align: center; 
    }
}

.more {
  background: url("../../res/images/more.png") center center no-repeat;
  background-size: 8px 16px; }

input[type="text"]:disabled, input[type="number"]:disabled {
  background-color: #FFFFFF !important; }




.content-height{
    height: 51px!important;
}
.shop-measking {
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    position: fixed;
    top: 0;
    left: 0;
    display: none;
}
.spinner {
    /*width: 150px;*/
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    >div {
        width: 30px;
        height: 30px;
        background-color: #F8931F;
        border-radius: 100%;
        display: inline-block;
        -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
        animation: bouncedelay 1.4s infinite ease-in-out;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    .bounce1 {
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
    }

    .bounce2 {
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
    }
}



@-webkit-keyframes bouncedelay {
    0%,
    80%,
    100% {
        -webkit-transform: scale(0.0)
    }
    40% {
        -webkit-transform: scale(1.0)
    }
}

@keyframes bouncedelay {
    0%,
    80%,
    100% {
        transform: scale(0.0);
        -webkit-transform: scale(0.0);
    }
    40% {
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
    }
}
</style>

