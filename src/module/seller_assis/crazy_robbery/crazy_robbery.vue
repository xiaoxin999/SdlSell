<template>
    <div class="container">
        <div class="header">距离疯抢开始还有{{countdownTime}}</div>
        <div class="content">
            <div class="box" v-for="(item, index) in goodsList" :key="index">
                <div class="img">
                    <img :src="item.listImage" alt="" @click="toGoodsDetail(item)">
                </div>
                <div class="footer_operate">
                    <div class="fl">
                        <div class="fl top_box">
                            <span>{{item.name}}</span>
                            <span class="residual_quantity">仅剩{{item.spareStock}}件</span>
                        </div>
                        <div class="fl">
                            <span>限时价</span>
                            <span class="discount_price">￥{{item.price}}</span>
                            <span class="original_cost">￥{{item.originalPrice}}</span>
                        </div>
                    </div>
                    <div class="fl">
                        <a href="javascript:void(0)" class="shopping_btn fr" v-if="ss">{{paybtn}}</a>
                        <a href="javascript:void(0)" class="shopping_btn pending_payment fr" v-else>{{paybtn}}<br>取消支付</a>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import utils from 'src/verdor/utils';
    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import timer from 'src/verdor/timer';
    import storage from 'src/verdor/storage';

    export default {
        data(){
            return{
                buyBtn:false,
                currentTime:0,
                countdownTime:0,
                timeStr:"",
                goodsList:[],
                paybtn:"",
                ss:true,
            }
        },
        methods:{
            toGoodsDetail(item){
                storage.session("toGoodsDetail",item)
                this.$router.push("/goodsDetail"); //商品详情页
            },
            async getGoodsList(){
                let data = await http.getActivityShopGoodsList({
                        data:{
                            subShopId:global.getShopId(),
                            shopId:global.getShopId()
                        }
                    },false,true
                )
                this.currentTime = data.time;
                data = data.data;
                let {buyConfig,goodsList,stockList,imageList,orderList} = data;
                    this.goodsList = goodsList;
                    this.changeCountTime(buyConfig);
                    console.log(data,'data')
                    console.log(data.orderList[0].goodsId);
                let goodsId = data.orderList[0].goodsId;
                let id = data.goodsList[0].id;
                    console.log(id,"id");
                    console.log(goodsId,"goodsId");
                    if(!id == goodsId){
                        this.paybtn = "去支付";
                        this.ss=false;
                    }else{
                        this.paybtn = "立即购买";
                    }
            },
            changeCountTime(obj){
                let start = Number(obj.startTime);
                this.timeStr = timer.add(()=>{
                    let t = --start;
                    if(t<=0){
                        timer.clear(this.timeStr);
                    }
                    this.countdownTime = this.getTime(t - this.currentTime);
                },1000,0,true)
            },
            getTime( second_time ){
                var time = parseInt(second_time) + "秒";
                var second = parseInt(second_time) % 60;
                var min = parseInt(second_time / 60) % 60;
                var hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                time = ("00" + day).substr(-2) + "天" + ("00" + hour).substr(-2)  + "小时" + ("00" + min).substr(-2)  + "分" + ("00" + second).substr(-2)  + "秒";
                return time;
            }
        },
        beforDestory(){
            timer.clear(this.timeStr);
        },
        mounted(){
            utils.setTitle('我是一家餐厅');
            this.getGoodsList();
        }
    }
</script>
<style lang="less" scoped>
    @import '../../../res/css/base.less';
    .container{
        .setBox(100%,auto);
        min-height: 100%;
        padding-top: .6667rem;
        overflow: hidden;
        .header{
            .setBox(100%,.6667rem);
            line-height: .6667rem;
            background-image: linear-gradient(90deg, #5E5E63 2%, #1D1D1D 100%);
            text-align: center;
            font-family: PingFang-SC-Medium;
            font-size: .3467rem;
            color: #FFFFFF;
            position: fixed;
            left: 0;
            top: 0;
        }
        .content{
            .box{
                .setBox(100%,5.4667rem);
                padding: .36rem .4533rem;
                overflow: hidden;
                .img{
                    .setBox(9.0667rem,3.6rem);
                    img{
                        .setBox(100%,100%);
                    }
                }
                .footer_operate{
                    .setBox(100%,1.8667rem);
                    padding: .16rem 0;
                    box-sizing: border-box;
                    >div:first-child{
                        .setBox(6rem,100%);
                    }
                    >div:last-child{
                        .setBox(3.0667rem,100%);
                    }
                }
                .shopping_btn{
                    background: #EAC048;
                    border-radius: 1.3333rem;
                    .setBox(auto,.8rem);
                    min-width: 2.2rem;
                    padding: 0 .2rem;
                    line-height: .8rem;
                    text-align: center;
                    font-family: PingFang-SC-Medium;
                    font-size: .3467rem;
                    color: #FFFFFF;
                }
                .residual_quantity{
                    font-size: .32rem;
                    color: #EAC048;
                }
                .top_box{
                    .setBox(100%,.56rem);
                    font-family: PingFang-SC-Medium;
                    font-size: .4rem;
                    color: #303030;
                    margin-bottom: .0933rem;
                    span{
                        display: inline-block;
                    }
                }
                .bottom_box{
                    .setBox(100%,.6667rem);
                    font-family: PingFang-SC-Medium;
                    font-size: .32rem;
                    color: #303030;
                    span{
                        display: inline-block;
                    }
                }
                .discount_price{
                    font-size: .48rem;
                    color: #D0021B;
                    padding: 0 .1067rem;
                }
                .original_cost{
                    color: #999999;
                    text-decoration:line-through;
                }
                .pending_payment{
                    font-size:.2933rem;
                    line-height: .4rem;
                    .setBox(3.0667rem,.8rem);
                }
            }
        }
    }
</style>
