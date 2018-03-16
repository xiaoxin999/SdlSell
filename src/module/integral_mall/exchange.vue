<template>
    <div class="container" id="exchange" v-cloak>
        <div class="fl content" v-if="!errors">
            <div class="comBanner comBannerH">
                <img :src="hostImg + goodsImage" alt="商品banner" />
                <div class="convertible-shade" v-if="status == '1'">
                    <img src="../../res/images/convertible.png" alt="已兑换" />
                </div>
            </div>
            <div class="explain">
                <span>产品名称：</span>
                <span class="fl">{{goodsName}}</span>
            </div>
            <div class="explain">
                <span>劵码：</span>
                <span class="fl">{{exchangeCode}}</span>
            </div>
            <a href="javascript:void(0)" class="comBnt" v-if="status == '0'" @click="goodsExchange">确认兑换</a>
            <a href="javascript:void(0)" class="ofIntegral" v-if="status == '1'">已兑换</a>
        </div>
        <div class="fl errors reject" v-if="errors">
            <div class="errors-box">
                <img src="../../res/images/error.png"/>
            </div>
            <p>您无兑换权限!</p>
        </div>
    </div>
</template>

<script>
    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';

    export default {
        name: 'exchange',
        data(){
            return {
                hostImg: '',
                exchangeCode: '',
                goodsName: '',
                goodsImage: '',
                status: '0',
                errors: false,
                openId: '',
                exchangeId: '',
                shopId: 0
            }
            
        },
        methods: {
            async getUser(){
                let loginInfo = storage.session('login');
                let res = await http.getUserInfo({
                data:{
                    shopId: this.shopId,
                    type: 3,
                    from: 0
                }})
                Object.assign(res,loginInfo)
                storage.session('wxInfo',res);
                this.getExchange();
            },
            getExchange(){
                http.getExchange({
                    data:{
                        shopId: this.shopId,
                        code: this.exchangeCode,
                        openId: this.openId
                    }
                },true,true).then(res=>{
                    this.goodsName = res.data.goodsName;
                    this.goodsImage = res.data.goodsImage;
                    this.status = res.data.status;
                    this.requestToGetStatus(res.data.exchangeId);
                }).catch(err=>{
                    if(err.error){
                        this.errors = true;
                    }
                    this.$store.commit('setWin',{content: err.error.message})
                })
            },
            async requestToGetStatus(id){
                let res = await http.saveStatusByScan({
                    data: {
                        shopId: this.shopId,
                        exchangeId: id
                    }
                })
            },
            async goodsExchange(){
                let res = await http.goodsExchange({
                    data: {
                        shopId: this.shopId,
                        code: this.exchangeCode
                    }
                })
                this.$store.commit('setWin',{
                    content:'兑换成功!',
                    callBack:(str)=>{
                        str == 'ok' && WeixinJSBridge.invoke('closeWindow', {}, function (res) {});
                    }
                })
            }
        },
        updated(){

        },
        mounted(){
            let userDate = storage.session("login");
            this.shopId = utils.getQueryString('shopId') || 61;
            let code = utils.getQueryString('code');
            this.exchangeCode = utils.getQueryString('exchangeCode');
            this.openId = userDate.openId;
            this.hostImg = global.getImgUrl();
            if(!userDate){
                this.getUser()
            }
            if(this.openId != undefined){
                this.getExchange();
                
            }
        }
    }
</script>

<style lang="less" scoped>
    #exchange{
        .content{
            width: 100%;
            .comBannerH{
                margin-bottom:10px;
                position: relative;
                .convertible-shade{
                    img{
                        height: 50px;
                        width: 100px;
                        position: absolute;
                        right: 15px;
                        bottom: 15px;
                    }
                }
            }
        }
        .reject{
            img{
                height:93px;
                width:93px;
            }
            p{
                width: 100%;
                text-align: center;
                height: 45px;
                line-height: 45px;
                color: #666;
                font-size: 14px;
            }
        }
    }
    .explain {
        width: 100%;
        height: 45px;
        line-height: 45px;
        padding-left: 20px;
        background-color: #fff;
        margin-bottom: 10px;
    }
    
    .explain span {
        display: block;
        float: left;
        width: auto;
        height: 45px;
        color: #ccc;
        margin-right: 5px;
    }
    
    .convertible-shade {
        background: rgba(0, 0, 0, 0.5);
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    
    .convertible-shade img {
        position: relative;
        bottom: 0;
        right: 0;
        background-size: 50% 50%;
    }
    
    .errors {
        position: absolute;
        left: 50%;
        top: 15%;
        transform: translate(-50%, 0%);
        -webkit-transform: translate(-50%, 0%);
        width: 50%;
        height: 300px;
    }
    
    .errors-box {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        width: 300px;
        height: 150px;
    }
</style>
