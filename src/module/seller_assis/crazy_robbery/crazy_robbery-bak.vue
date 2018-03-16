<template>
    <div class="container">
        <div class="header">距离疯抢开始还有1天18:30:06</div>
        <div class="content">
            <div class="box" v-for="(item, index) in crazyGoodslist" :key="index">
                <div class="img">
                    <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3641997082,269144396&fm=27&gp=0.jpg" alt="">
                </div>
                <div class="footer_operate">
                    <div class="fl">
                        <div class="fl top_box">
                            <span>{{item.name}}</span>
                            <span class="residual_quantity">仅剩20件</span>
                        </div>
                        <div class="fl">
                            <span>限时价</span>
                            <span class="discount_price">￥299.9</span>
                            <span class="original_cost">￥559.9</span>
                        </div>
                    </div>
                    <div class="fl">
                        <a href="javascript:void(0)" class="shopping_btn pending_payment fr" v-if="">待支付3：30h后 <br>
                            自动取消</a>
                        <!--orderList.status == 9-->
                        <a href="javascript:void(0)" class="shopping_btn" v-show="buyBtn">立即抢购</a>

                    </div>
                </div>
            </div>
<!--            <div class="box">
                <div class="img">
                    <img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3641997082,269144396&fm=27&gp=0.jpg" alt="">
                </div>
                <div class="footer_operate">
                    <div class="fl">
                        <div class="fl top_box">
                            <span>和风樱花马克杯</span>
                            <span class="residual_quantity">仅剩20件</span>
                        </div>
                        <div class="fl">
                            <span>限时价</span>
                            <span class="discount_price">￥299.9</span>
                            <span class="original_cost">￥559.9</span>
                        </div>
                    </div>
                    <div class="fl">
                        <a href="javascript:void(0)" class="shopping_btn pending_payment fr">
                            待支付3：30h后 <br>
                            自动取消
                            &lt;!&ndash; <span>待支付3：30h后</span>
                            <span>自动取消</span> &ndash;&gt;
                        </a>
                    </div>
                </div>
            </div>-->
        </div>
    </div>
</template>
<script>
    import utils from 'src/verdor/utils';
    import http from 'src/manager/http';
    import global from 'src/manager/global';
export default {
    data(){
        return{
            buyBtn:false,
            crazyGoodslist:{},
            goodsList:[]
        }
    },
    methods:{
        async getGoodsList(){
            this.crazyGoodslist = await http.getActivityShopGoodsList({
                data: {
                    shopId:global.getShopId()
                }
            })
            console.log(this.crazyGoodslist,'data');
            console.log(this.crazyGoodslist.buyConfig.activityId);
            console.log(this)
            console.log(this.crazyGoodslist.goodsList,'w2222')
        }

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
